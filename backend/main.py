import sys
import os
import re
import logging
from pathlib import Path
from datetime import datetime
from typing import Any, Optional

# Ensure backend directory is in sys.path regardless of execution working directory
_backend_dir = str(Path(__file__).resolve().parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from fastapi import FastAPI, Query, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel
try:
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
except ImportError:
    class Limiter:
        def __init__(self, *args, **kwargs): pass
        def limit(self, *args, **kwargs):
            return lambda f: f
    def get_remote_address(r): return "127.0.0.1"
    class RateLimitExceeded(Exception): pass

import json
import dispatch
from classifier import FireClassifier
from osm_data import load_or_cache_zones
from ml_model import load_persistence_cache
from alerts import generate_alerts, store_alerts, get_active_alerts
from database import init_db, insert_fires, get_fires_by_date, get_cache_status
from firms import fetch_fires, fetch_all_sources, get_data_status
from mode_manager import mode_manager
from demo_data import load_demo_fires
from scenarios.scenario_engine import scenario_engine

# ==============================================================================
# 1) STRUCTURED JSON LOGGING SETUP
# ==============================================================================
logger = logging.getLogger("ignis_telemetry")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)

try:
    from pythonjsonlogger import jsonlogger

    formatter = jsonlogger.JsonFormatter(
        fmt="%(asctime)s %(levelname)s %(name)s %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%SZ",
    )
    handler.setFormatter(formatter)
except Exception:
    handler.setFormatter(
        logging.Formatter("[%(asctime)s] [%(levelname)s] %(name)s: %(message)s")
    )

if not logger.handlers:
    logger.addHandler(handler)

# ==============================================================================
# 2) RATE LIMITER INITIALIZATION (slowapi)
# ==============================================================================
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(
    title="IGNIS Telemetry Node",
    description="Intelligent Geospatial Network for Industrial Fire Screening (NTRO SIH26162)",
    version="1.0.4",
)
app.state.limiter = limiter

# ==============================================================================
# 3) RATE LIMIT & VALIDATION EXCEPTION HANDLERS
# ==============================================================================
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded):
    client_ip = get_remote_address(request)
    logger.warning(
        f"Rate limit exceeded on {request.url.path}",
        extra={"event": "rate_limit_exceeded", "ip": client_ip, "path": request.url.path},
    )
    return JSONResponse(
        status_code=429,
        content={
            "error": "rate_limited",
            "message": "Too many requests. Please slow down.",
            "retry_after_seconds": 60,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_err = errors[0] if errors else {}
    first_msg = first_err.get("msg", "Invalid parameter value")
    loc = ".".join(str(l) for l in first_err.get("loc", [])) if errors else "query"
    return JSONResponse(
        status_code=400,
        content={
            "error": "invalid_input",
            "message": f"Input validation error at '{loc}': {first_msg}",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "http_error",
            "message": str(exc.detail),
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(
        f"Unhandled system error on {request.url.path}: {exc}",
        exc_info=True,
        extra={"event": "internal_error", "path": request.url.path},
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "System encountered an error. Please retry.",
            "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        },
    )


# ==============================================================================
# 4) CORS HARDENING (RESTRICT TO KNOWN VERCEL & DEV DOMAINS)
# ==============================================================================
ALLOWED_ORIGINS = [
    "https://frontend-nine-lime-27.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)

# Allowed Satellite Sources Whitelist
ALLOWED_SOURCES = {
    "all",
    "VIIRS_SNPP_NRT",
    "VIIRS_NOAA20_NRT",
    "MODIS_NRT",
}

_zones: Optional[list[dict[str, Any]]] = None
_persistence: Optional[dict[Any, float]] = None


def get_classifier() -> FireClassifier:
    global _zones, _persistence
    if _zones is None:
        _zones = load_or_cache_zones()
    if _persistence is None:
        _persistence = load_persistence_cache()
    return FireClassifier(_zones, _persistence)


def _start_port_bridge():
    """Ensure both 8080 and 8000 respond regardless of Railway port routing configuration."""
    import socket
    import threading

    current_port = int(os.environ.get("PORT", "8080"))
    alt_port = 8000 if current_port == 8080 else 8080

    def bridge():
        try:
            server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind(("0.0.0.0", alt_port))
            server.listen(100)
            while True:
                client, _ = server.accept()

                def forward(src):
                    try:
                        dest = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        dest.connect(("127.0.0.1", current_port))

                        def pipe(a, b):
                            try:
                                while chunk := a.recv(4096):
                                    b.sendall(chunk)
                            except Exception:
                                pass
                            finally:
                                b.close()

                        threading.Thread(target=pipe, args=(src, dest), daemon=True).start()
                        threading.Thread(target=pipe, args=(dest, src), daemon=True).start()
                    except Exception:
                        src.close()

                threading.Thread(target=forward, args=(client,), daemon=True).start()
        except Exception:
            pass

    threading.Thread(target=bridge, daemon=True).start()


@app.on_event("startup")
def startup():
    _start_port_bridge()
    init_db()
    get_classifier()
    logger.info("IGNIS Telemetry Node initialized successfully", extra={"event": "node_startup"})


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "IGNIS",
        "full_form": "Intelligent Geospatial Network for Industrial Fire Screening",
        "version": "1.0.4",
        "status": "active",
        "problem_id": "SIH26162",
        "organization": "NTRO",
    }


class ModeSetRequest(BaseModel):
    mode: Optional[str] = None


@app.get("/api/mode")
def get_mode() -> dict[str, Any]:
    """Query current operational mode of IGNIS node."""
    return mode_manager.get_current_mode()


@app.post("/api/mode/set")
def set_mode(
    payload: Optional[ModeSetRequest] = None,
    mode: Optional[str] = Query(default=None),
) -> dict[str, Any]:
    """Change global operational mode to 'LIVE', 'CACHED', 'DEMO', or 'AUTO'."""
    target_mode = (mode or (payload.mode if payload else None) or "").strip().upper()
    if not target_mode:
        raise HTTPException(
            status_code=400,
            detail="Missing 'mode' parameter. Must be one of: ['LIVE', 'CACHED', 'DEMO', 'AUTO']",
        )
    success = mode_manager.set_mode(target_mode, reason=f"API switch: {target_mode}")
    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mode '{target_mode}'. Must be one of: ['LIVE', 'CACHED', 'DEMO', 'AUTO']",
        )
    logger.info(f"IGNIS mode set to {mode_manager.current_mode}", extra={"event": "mode_switch", "mode": mode_manager.current_mode})
    return {"success": True, "new_mode": mode_manager.current_mode}


@app.get("/api/mode/health")
def get_mode_health() -> dict[str, Any]:
    """Return detailed health check and recommended operational mode."""
    return mode_manager.get_health()


# ==============================================================================
# SCENARIO SIMULATION ENGINE ENDPOINTS
# ==============================================================================

@app.get("/api/scenarios")
def list_scenarios() -> list[dict[str, Any]]:
    """Returns list of available simulation scenarios."""
    return scenario_engine.list_scenarios()


@app.get("/api/scenarios/state")
def get_scenario_state() -> dict[str, Any]:
    """Returns current scenario playback state."""
    return scenario_engine.get_state()


@app.get("/api/scenarios/{scenario_id}")
def get_scenario(scenario_id: str) -> dict[str, Any]:
    """Returns full scenario data by ID."""
    scen = scenario_engine.get_scenario(scenario_id)
    if not scen:
        raise HTTPException(
            status_code=404,
            detail=f"Scenario '{scenario_id}' not found",
        )
    return scen


@app.post("/api/scenarios/{scenario_id}/play")
def play_scenario(scenario_id: str) -> dict[str, Any]:
    """Marks scenario as active and starts playback timer."""
    res = scenario_engine.start_scenario(scenario_id)
    if not res.get("success"):
        raise HTTPException(
            status_code=404,
            detail=res.get("error", "Failed to start scenario"),
        )
    return res


@app.post("/api/scenarios/stop")
def stop_scenario() -> dict[str, Any]:
    """Halts active scenario playback."""
    return scenario_engine.stop_scenario()


@app.get("/api/fire-stations/nearest")
@limiter.limit("60/minute")
def get_nearest_station(
    request: Request,
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
) -> dict[str, Any]:
    """Identify nearest fire station with Haversine distance, ETA, and emergency contact."""
    station = dispatch.find_nearest_fire_station(lat, lon)
    return {"station": station}


@app.post("/api/dispatch")
@limiter.limit("30/minute")
def execute_dispatch(
    request: Request,
    payload: dict[str, Any],
) -> dict[str, Any]:
    """Execute simulated emergency dispatch to nearest station and store in database dispatch_log."""
    lat = float(payload.get("latitude") or payload.get("fire_location", {}).get("lat", 0.0))
    lon = float(payload.get("longitude") or payload.get("fire_location", {}).get("lon", 0.0))
    category = payload.get("category") or payload.get("fire_category", "UNKNOWN")
    fire_data = {"latitude": lat, "longitude": lon, "category": category}
    station_data = payload.get("fire_station")

    record = dispatch.simulate_dispatch(fire_data, station_data)
    return record


@app.get("/api/dispatches")
@limiter.limit("60/minute")
def get_dispatch_logs(
    request: Request,
    limit: int = Query(default=50, ge=1, le=200),
) -> dict[str, Any]:
    """Query recent emergency dispatch records."""
    from database import get_recent_dispatches
    logs = get_recent_dispatches(limit)
    return {"dispatches": logs, "count": len(logs)}


# ==============================================================================
# 5) SECURE API ENDPOINTS WITH RATE LIMITING & QUERY VALIDATION
# ==============================================================================

@app.get("/api/fires")
@limiter.limit("30/minute")
def get_fires(
    request: Request,
    days: int = Query(default=1, ge=1, le=10),
    source: str = Query(default="all"),
    force: bool = Query(default=False),
    mode: Optional[str] = Query(default=None),
) -> dict[str, Any]:
    if source not in ALLOWED_SOURCES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid source '{source}'. Must be one of: {sorted(list(ALLOWED_SOURCES))}",
        )

    classifier = get_classifier()
    active_mode = (mode or mode_manager.current_mode).upper().strip()

    # 1) DEMO MODE: load 250 realistic pre-classified fires instantly
    if active_mode == "DEMO":
        demo_fires = load_demo_fires()
        return {
            "fires": demo_fires,
            "total": len(demo_fires),
            "summary": classifier.get_summary(demo_fires),
            "days": days,
            "source": source,
            "mode": "DEMO",
            "ignis_status": "demo",
            "data_source": "Simulated Data for Demonstration",
            "message": "Serving 250 realistic pre-classified demo anomalies",
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }

    # 2) CACHED MODE: load explicitly from local SQLite cache
    if active_mode == "CACHED":
        today = datetime.utcnow().strftime("%Y-%m-%d")
        fallback = get_fires_by_date(today)
        if not fallback:
            fallback = get_fires_by_date(days)
        classified_cached = classifier.classify_batch(fallback)[:5000]
        alerts = generate_alerts(classified_cached)
        store_alerts(alerts)
        c_status = get_cache_status()
        age = c_status.get("age_hours", 0)
        ds = f"Local Cache (last sync: {int(age)} hours ago)" if age >= 1.0 else "Local Cache (last sync: <1 hour ago)"
        return {
            "fires": classified_cached,
            "total": len(classified_cached),
            "summary": classifier.get_summary(classified_cached),
            "days": days,
            "source": source,
            "mode": "CACHED",
            "ignis_status": "cached_fallback",
            "data_source": ds,
            "message": "Serving local SQLite cache",
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }

    # 3) LIVE MODE: try NASA FIRMS API with automatic failover to SQLite
    try:
        if source == "all":
            raw_fires = fetch_all_sources(days=days, force=force)
        else:
            raw_fires = fetch_fires(days=days, source=source, force=force)

        try:
            insert_fires(raw_fires)
        except Exception:
            pass

        classified_fires = classifier.classify_batch(raw_fires)
        alerts = generate_alerts(classified_fires)
        store_alerts(alerts)

        status_info = get_data_status()
        mode_str = status_info.get("mode", "live")
        ignis_status = "live" if mode_str == "live" else "cached_fallback"

        # DoS Prevention: cap response records to 5000 and truncate text
        capped_fires = classified_fires[:5000]
        for f in capped_fires:
            if "reason" in f and isinstance(f["reason"], str) and len(f["reason"]) > 500:
                f["reason"] = f["reason"][:500]
            if "action" in f and isinstance(f["action"], str) and len(f["action"]) > 500:
                f["action"] = f["action"][:500]

        logger.info(
            f"Fires telemetry fetched: {len(capped_fires)} hotspots (days={days}, source={source})",
            extra={"event": "fires_query", "count": len(capped_fires), "mode": ignis_status},
        )

        return {
            "fires": capped_fires,
            "total": len(capped_fires),
            "summary": classifier.get_summary(classified_fires),
            "days": days,
            "source": source,
            "mode": "LIVE" if ignis_status == "live" else "CACHED",
            "ignis_status": ignis_status,
            "data_source": "NASA FIRMS Real-Time" if ignis_status == "live" else "Local Cache (fallback)",
            "message": status_info.get("message", "Operational"),
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }
    except Exception as exc:
        logger.warning(f"Serving fallback detections due to upstream notice: {exc}")
        today = datetime.utcnow().strftime("%Y-%m-%d")
        fallback = get_fires_by_date(today)
        if not fallback:
            fallback = get_fires_by_date(days)
        classified_fallback = classifier.classify_batch(fallback)[:5000]
        alerts = generate_alerts(classified_fallback)
        store_alerts(alerts)
        c_status = get_cache_status()
        age = c_status.get("age_hours", 0)
        ds = f"Local Cache (last sync: {int(age)} hours ago)" if age >= 1.0 else "Local Cache (last sync: <1 hour ago)"
        return {
            "fires": classified_fallback,
            "total": len(classified_fallback),
            "summary": classifier.get_summary(classified_fallback),
            "days": days,
            "source": source,
            "mode": "CACHED",
            "ignis_status": "cached_fallback",
            "data_source": ds,
            "message": "FIRMS unavailable, auto-failed over to cached telemetry",
            "generated_at": datetime.utcnow().isoformat() + "Z",
        }


@app.get("/api/fires/emergency")
@limiter.limit("30/minute")
def get_emergency_fires(
    request: Request,
    days: int = Query(default=1, ge=1, le=10),
) -> dict[str, Any]:
    classifier = get_classifier()
    try:
        raw_fires = fetch_all_sources(days=days)
    except Exception:
        raw_fires = get_fires_by_date(days)
    classified = classifier.classify_batch(raw_fires)
    emergencies = [f for f in classified if f.get("risk_level") == "CRITICAL"][:500]
    return {"emergencies": emergencies, "count": len(emergencies)}


@app.get("/api/industries")
@limiter.limit("60/minute")
def get_industries(
    request: Request,
    q: str = Query(default="", max_length=100),
    limit: int = Query(default=500, ge=1, le=1000),
) -> dict[str, Any]:
    classifier = get_classifier()
    zones = classifier.zones or []

    # Sanitize search input to prevent injection
    sanitized_q = re.sub(r"[<>'\"/;]", "", q).strip().lower()
    if sanitized_q:
        filtered = [
            z for z in zones
            if sanitized_q in str(z.get("name", "")).lower() or sanitized_q in str(z.get("zone_type", "")).lower()
        ]
    else:
        filtered = zones

    return {
        "industries": filtered[:limit],
        "count": len(filtered[:limit]),
        "total_available": len(filtered),
    }


def _detect_state(lat: float, lon: float) -> str:
    if 28.0 <= lat <= 32.0 and 74.0 <= lon <= 80.0:
        return "Punjab/Haryana"
    if 18.0 <= lat <= 22.0 and 72.0 <= lon <= 80.0:
        return "Maharashtra"
    if 20.0 <= lat <= 24.0 and 84.0 <= lon <= 88.0:
        return "Odisha"
    if 22.0 <= lat <= 26.0 and 78.0 <= lon <= 84.0:
        return "Madhya Pradesh"
    if 20.0 <= lat <= 25.0 and 68.0 <= lon <= 75.0:
        return "Gujarat"
    if 12.0 <= lat <= 18.0 and 74.0 <= lon <= 78.0:
        return "Karnataka"
    if 8.0 <= lat <= 13.0 and 76.0 <= lon <= 80.0:
        return "Tamil Nadu"
    return "Other"


@app.get("/api/stats")
@limiter.limit("60/minute")
def get_stats(
    request: Request,
    days: int = Query(default=7, ge=1, le=30),
) -> dict[str, Any]:
    classifier = get_classifier()
    try:
        raw_fires = fetch_all_sources(days=days)
    except Exception:
        raw_fires = get_fires_by_date(days)

    classified = classifier.classify_batch(raw_fires)
    by_category: dict[str, int] = {}
    by_state: dict[str, int] = {}

    for f in classified:
        cat = f.get("category", "UNKNOWN")
        by_category[cat] = by_category.get(cat, 0) + 1

        lat = float(f.get("latitude", 0.0))
        lon = float(f.get("longitude", 0.0))
        st = _detect_state(lat, lon)
        by_state[st] = by_state.get(st, 0) + 1

    return {
        "total": len(classified),
        "by_category": by_category,
        "by_state": by_state,
        "days_analyzed": days,
    }


@app.get("/api/alerts")
@limiter.limit("60/minute")
def get_alerts(
    request: Request,
    hours: int = Query(default=24, ge=1, le=168),
) -> dict[str, Any]:
    active = get_active_alerts(hours=hours)[:200]
    return {"alerts": active, "count": len(active)}


@app.post("/api/train")
@limiter.limit("2/hour")
def train(
    request: Request,
    days: int = Query(default=7, ge=1, le=30),
) -> dict[str, Any]:
    global _persistence
    from ml_model import build_persistence_cache, train_ml_classifier

    logger.info(f"ML Model training triggered for days={days}", extra={"event": "ml_training_start"})
    cache = build_persistence_cache(days=days)
    _persistence = cache
    try:
        fires = fetch_all_sources(days=days)
        zones = load_or_cache_zones()
        train_ml_classifier(fires, zones, cache)
    except Exception as exc:
        logger.warning(f"ML training note: {exc}")
    return {"status": "trained", "locations": len(cache)}


@app.get("/api/health")
@limiter.limit("60/minute")
def health(request: Request) -> dict[str, Any]:
    from config import FIRMS_MAP_KEY

    key = (os.getenv("FIRMS_MAP_KEY", "") or FIRMS_MAP_KEY).strip()
    if not key:
        return {
            "status": "degraded",
            "nasa_firms": "missing_api_key",
            "error": "FIRMS_MAP_KEY environment variable is not configured",
            "active_fires_24h": 0,
        }
    try:
        fires = fetch_fires(days=1, source="VIIRS_SNPP_NRT")
        status_info = get_data_status()
        is_live = status_info.get("mode") == "live"
        return {
            "status": "healthy" if is_live else "degraded",
            "nasa_firms": "connected" if is_live else "cached_fallback",
            "active_fires_24h": len(fires),
            "mode": status_info.get("mode", "live"),
            "message": status_info.get("message", "Operational"),
        }
    except Exception as e:
        return {
            "status": "degraded",
            "nasa_firms": "disconnected",
            "error": str(e),
            "active_fires_24h": 0,
        }


@app.get("/api/verify")
@limiter.limit("60/minute")
def verify_scene(
    request: Request,
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    date: Optional[str] = Query(default=None, regex=r"^\d{4}-\d{2}-\d{2}$"),
) -> dict[str, Any]:
    from osm_data import find_nearest_industry

    classifier = get_classifier()
    nearest = find_nearest_industry(lat, lon, classifier.zones)
    acq_date = date or datetime.utcnow().strftime("%Y-%m-%d")

    worldview_url = (
        f"https://worldview.earthdata.nasa.gov/?v={lon-1.5:.4f},{lat-1.5:.4f},{lon+1.5:.4f},{lat+1.5:.4f}&t={acq_date}"
    )
    gmaps_url = f"https://www.google.com/maps/@{lat:.4f},{lon:.4f},15z/data=!3m1!1e3"
    osm_url = f"https://www.openstreetmap.org/#map=16/{lat:.4f}/{lon:.4f}"
    copernicus_url = f"https://browser.dataspace.copernicus.eu/?zoom=14&lat={lat:.4f}&lng={lon:.4f}"

    dist_km = float(nearest.get("distance_km", 999.0)) if nearest else 999.0
    within_5km = dist_km <= 5.0

    return {
        "location": {"lat": lat, "lon": lon, "acq_date": acq_date},
        "nearest_industry": nearest,
        "within_5km_industry": within_5km,
        "links": {
            "worldview": worldview_url,
            "google_maps": gmaps_url,
            "osm": osm_url,
            "copernicus": copernicus_url,
        },
        "notes": [
            "FIRMS provides near-real-time thermal detection from VIIRS 375m sensor suite",
            "Optical imagery revisit may range from hours to days depending on orbital swath and cloud cover",
            "Cross-sensor verification workspace: combine thermal FRP with optical texture and access routes",
        ],
    }


# ==============================================================================
# 9) SIMULATION SCENARIOS TELEMETRY API
# ==============================================================================

@app.get("/api/scenarios")
@limiter.limit("60/minute")
def list_scenarios(request: Request) -> list[dict[str, Any]]:
    """Returns list of available simulation scenarios."""
    return scenario_engine.list_scenarios()


@app.get("/api/scenarios/state")
@limiter.limit("60/minute")
def get_scenario_state(request: Request) -> dict[str, Any]:
    """Returns current scenario playback progress and active step."""
    return scenario_engine.get_state()


@app.get("/api/scenarios/{scenario_id}")
@limiter.limit("60/minute")
def get_scenario(request: Request, scenario_id: str) -> dict[str, Any]:
    """Returns full scenario definition by ID."""
    scen = scenario_engine.get_scenario(scenario_id)
    if not scen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario '{scenario_id}' not found",
        )
    return scen


@app.post("/api/scenarios/{scenario_id}/play")
@limiter.limit("30/minute")
def play_scenario(request: Request, scenario_id: str) -> dict[str, Any]:
    """Marks scenario as active and begins playback."""
    result = scenario_engine.start_scenario(scenario_id)
    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("error", f"Scenario '{scenario_id}' not found"),
        )
    return result


@app.post("/api/scenarios/stop")
@limiter.limit("30/minute")
def stop_scenario_endpoint(request: Request) -> dict[str, Any]:
    """Halts active scenario playback."""
    return scenario_engine.stop_scenario()


# ==============================================================================
# 10) MATERIAL-BASED FIRE RESPONSE PROTOCOL API
# ==============================================================================

@app.get("/api/protocol/{category}")
@limiter.limit("60/minute")
def get_fire_protocol(request: Request, category: str) -> dict[str, Any]:
    """Returns material-based firefighting response protocol for a given category."""
    from response_engine import get_response_protocol

    protocol = get_response_protocol(category)
    return {
        "category": category.upper(),
        **protocol,
    }


# ==============================================================================
# 11) EMERGENCY NOTIFICATION QUEUE & TIMELINE API
# ==============================================================================

class AlertAcknowledgeRequest(BaseModel):
    action: str = "ACKNOWLEDGED"


class AlertEscalateRequest(BaseModel):
    level: str = "DISTRICT"


@app.get("/api/notifications")
@limiter.limit("60/minute")
def get_notifications_endpoint(request: Request) -> list[dict[str, Any]]:
    """Returns unacknowledged CRITICAL alerts for the emergency panel queue."""
    from alerts import get_notification_queue

    return get_notification_queue()


@app.post("/api/notifications/{alert_id}/acknowledge")
@limiter.limit("60/minute")
def acknowledge_notification_endpoint(
    request: Request,
    alert_id: int,
    payload: Optional[AlertAcknowledgeRequest] = None,
) -> dict[str, Any]:
    """Acknowledge or dispatch an active alert."""
    from alerts import acknowledge_alert

    action = payload.action if payload else "ACKNOWLEDGED"
    return acknowledge_alert(alert_id, action)


@app.post("/api/notifications/{alert_id}/escalate")
@limiter.limit("60/minute")
def escalate_notification_endpoint(
    request: Request,
    alert_id: int,
    payload: Optional[AlertEscalateRequest] = None,
) -> dict[str, Any]:
    """Escalate an active alert to higher disaster authority."""
    from alerts import escalate_alert

    level = payload.level if payload else "DISTRICT"
    return escalate_alert(alert_id, level)


@app.get("/api/notifications/timeline")
@limiter.limit("60/minute")
def get_notifications_timeline_endpoint(
    request: Request,
    hours: int = Query(default=24, ge=1, le=168),
) -> list[dict[str, Any]]:
    """Returns historical alerts in chronological timeline format."""
    from database import get_alerts_timeline

    return get_alerts_timeline(hours=hours)


# ==============================================================================
# 9) AUTOMATED FIRE STATION DISPATCH & MULTI-CHANNEL TELEMETRY ENDPOINTS
# ==============================================================================
class DispatchSimulateRequest(BaseModel):
    fire_id: Optional[Any] = None
    fire_data: Optional[dict[str, Any]] = None


@app.post("/api/dispatch/simulate")
@limiter.limit("30/minute")
def simulate_dispatch_endpoint(
    request: Request,
    fire_id: Optional[str] = Query(default=None),
    payload: Optional[DispatchSimulateRequest] = None,
) -> dict[str, Any]:
    """Execute end-to-end automated emergency dispatch workflow and multi-channel telemetry."""
    from dispatch import simulate_dispatch

    target_id = (payload.fire_id if payload and payload.fire_id is not None else None) or fire_id
    target_data = payload.fire_data if payload else None

    return simulate_dispatch(fire_id=target_id, fire_data=target_data)


@app.get("/api/dispatch/history")
@limiter.limit("60/minute")
def get_dispatch_history_endpoint(
    request: Request,
    hours: int = Query(default=24, ge=1, le=168),
) -> list[dict[str, Any]]:
    """Query chronological emergency dispatch logs."""
    from dispatch import get_dispatch_history

    return get_dispatch_history(hours=hours)


@app.get("/api/fire-stations/nearest")
@limiter.limit("60/minute")
def get_nearest_fire_station_endpoint(
    request: Request,
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
) -> dict[str, Any]:
    """Identify nearest fire station with travel ETA, capabilities, and contact lines."""
    from dispatch import find_nearest_fire_station

    return find_nearest_fire_station(lat=lat, lon=lon)


@app.get("/api/hospitals/nearest")
@limiter.limit("60/minute")
def get_nearest_hospital_endpoint(
    request: Request,
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
) -> dict[str, Any]:
    """Identify nearest hospital / trauma center with capacity and burn unit readiness."""
    from dispatch import find_nearest_hospital

    return find_nearest_hospital(lat=lat, lon=lon)


# ==============================================================================
# 10) HISTORICAL FIRE INCIDENT ANALYSIS & RISK PREDICTION ENDPOINTS
# ==============================================================================
@app.get("/api/history")
@limiter.limit("60/minute")
def get_location_history_endpoint(
    request: Request,
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    radius: float = Query(default=5.0, ge=0.5, le=100.0),
) -> dict[str, Any]:
    """Return 5-year spatial fire history, seasonal breakdown, and recurrence probability."""
    from historical import get_location_history

    return get_location_history(lat=lat, lon=lon, radius_km=radius)


@app.get("/api/history/risk")
@limiter.limit("60/minute")
def get_location_risk_endpoint(
    request: Request,
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
) -> dict[str, Any]:
    """Calculate composite future fire recurrence risk score (0-100) and tactical factors."""
    from historical import calculate_risk_score

    return calculate_risk_score(lat=lat, lon=lon)


@app.get("/api/history/similar")
@limiter.limit("60/minute")
def get_similar_incidents_endpoint(
    request: Request,
    category: Optional[str] = Query(default="EMERGENCY_INDUSTRIAL"),
    frp: Optional[float] = Query(default=120.0),
    lat: Optional[float] = Query(default=None),
    lon: Optional[float] = Query(default=None),
    limit: int = Query(default=5, ge=1, le=20),
) -> list[dict[str, Any]]:
    """Retrieve top matched historical Indian emergencies with casualties and outcomes."""
    from historical import get_similar_incidents

    return get_similar_incidents(category=category, frp=frp, lat=lat, lon=lon, limit=limit)


@app.get("/api/history/density")
@limiter.limit("60/minute")
def get_historical_density_endpoint(
    request: Request,
    limit: int = Query(default=400, ge=50, le=2000),
) -> list[dict[str, Any]]:
    """Return weighted multi-year thermal points for historical heatmap visualization."""
    from historical import get_historical_density

    return get_historical_density(limit=limit)


@app.get("/api/incidents/notable")
@limiter.limit("60/minute")
def get_notable_incidents_endpoint(
    request: Request,
    limit: int = Query(default=50, ge=1, le=100),
) -> list[dict[str, Any]]:
    """Retrieve curated database of landmark Indian fire and chemical disaster case studies."""
    from incident_reports import get_notable_incidents

    return get_notable_incidents(limit=limit)


# ==============================================================================
# 11) AGNI-AI (TACTICAL FIRE ASSISTANT) ENDPOINTS
# ==============================================================================
class ChatRequest(BaseModel):
    message: str
    context: Optional[dict[str, Any]] = None


@app.post("/api/chat")
@limiter.limit("60/minute")
def chat_endpoint(request: Request, body: ChatRequest) -> dict[str, Any]:
    """AGNI-AI context-aware fire response chat endpoint with RAG and tools."""
    from chatbot.agni_ai import agni_ai

    return agni_ai.query(user_message=body.message, context=body.context)


@app.post("/api/chat/stream")
@limiter.limit("60/minute")
def chat_stream_endpoint(request: Request, body: ChatRequest) -> StreamingResponse:
    """Streaming response for long answers using server-sent events (SSE)."""
    from chatbot.agni_ai import agni_ai

    return StreamingResponse(
        agni_ai.query_stream(user_message=body.message, context=body.context),
        media_type="text/event-stream",
    )


# ==============================================================================
# 12) AUTHORITY ANALYTICS & EXECUTIVE REPORTING ENDPOINTS
# ==============================================================================
@app.get("/api/analytics/regional")
@limiter.limit("60/minute")
def get_regional_analytics_endpoint(
    request: Request,
    region: str = Query(default="India"),
    days: int = Query(default=30, ge=1, le=365),
) -> dict[str, Any]:
    """Return comprehensive multi-state regional analytics, charts data, and hourly heatmaps."""
    from analytics import get_regional_analytics

    return get_regional_analytics(region=region, days=days)


@app.get("/api/analytics/comparative")
@limiter.limit("60/minute")
def get_comparative_analytics_endpoint(
    request: Request,
    p1: str = Query(default="last_30_days"),
    p2: str = Query(default="previous_30_days"),
) -> dict[str, Any]:
    """Return period-over-period comparative delta metrics."""
    from analytics import get_comparative_analysis

    return get_comparative_analysis(period1=p1, period2=p2)


@app.get("/api/analytics/report/executive")
@limiter.limit("60/minute")
def get_executive_report_endpoint(
    request: Request,
    period: str = Query(default="monthly"),
) -> dict[str, Any]:
    """Generate high-level executive strategic report for NDMA and State Authorities."""
    from analytics import generate_executive_report

    return generate_executive_report(period=period)


@app.get("/api/analytics/report/district")
@limiter.limit("60/minute")
def get_district_report_endpoint(
    request: Request,
    district: str = Query(default="surat"),
) -> dict[str, Any]:
    """Generate localized district briefing for District Collector and Fire Chief."""
    from analytics import generate_district_report

    return generate_district_report(district=district)


@app.get("/api/weather")
@limiter.limit("60/minute")
def get_weather_endpoint(
    request: Request,
    lat: float = Query(default=21.1702, ge=-90.0, le=90.0),
    lon: float = Query(default=72.8311, ge=-180.0, le=180.0),
) -> dict[str, Any]:
    """Return real-time atmospheric telemetry from Open-Meteo for coordinates."""
    from spread_prediction import get_weather_data

    return get_weather_data(lat=lat, lon=lon)


@app.get("/api/predict-spread")
@limiter.limit("60/minute")
def get_predict_spread_endpoint(
    request: Request,
    lat: float = Query(default=21.1702, ge=-90.0, le=90.0),
    lon: float = Query(default=72.8311, ge=-180.0, le=180.0),
    frp: float = Query(default=65.0, ge=0.0, le=5000.0),
    category: str = Query(default="EMERGENCY_INDUSTRIAL"),
    hours: int = Query(default=6, ge=1, le=24),
) -> dict[str, Any]:
    """Return Rothermel-inspired fire spread prediction, multi-hour cones, at-risk assets, and recommendations."""
    from spread_prediction import predict_spread

    fire_payload = {
        "latitude": lat,
        "longitude": lon,
        "frp": frp,
        "category": category,
    }
    return predict_spread(fire=fire_payload, hours=hours)


# ==============================================================================
# FIELD OFFICER REPORT SYSTEM & ACTIVE LEARNING ENDPOINTS
# ==============================================================================
@app.post("/api/field-report")
@limiter.limit("60/minute")
async def post_field_report_endpoint(request: Request) -> dict[str, Any]:
    """Submit a field officer verification report, update fire ground truth, and trigger active learning."""
    from field_reports import submit_field_report

    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    return submit_field_report(payload)


@app.get("/api/field-report/fire/{fire_id}")
@limiter.limit("60/minute")
def get_fire_reports_endpoint(request: Request, fire_id: int) -> dict[str, Any]:
    """Retrieve ground observation reports for a specific thermal detection ID."""
    from field_reports import get_reports_for_fire

    reports = get_reports_for_fire(fire_id=fire_id)
    return {"fire_id": fire_id, "reports": reports, "count": len(reports)}


@app.get("/api/field-report/officer/{officer_id}")
@limiter.limit("60/minute")
def get_officer_reports_endpoint(request: Request, officer_id: str) -> dict[str, Any]:
    """Retrieve all reports submitted by a specific field officer."""
    from field_reports import get_officer_history

    reports = get_officer_history(officer_id=officer_id)
    return {"officer_id": officer_id, "reports": reports, "count": len(reports)}


@app.get("/api/field-report/stats")
@limiter.limit("60/minute")
def get_field_stats_endpoint(request: Request) -> dict[str, Any]:
    """Retrieve system classification accuracy metrics and discrepancy improvements."""
    from field_reports import get_accuracy_stats

    return get_accuracy_stats()


if __name__ == "__main__":
    import uvicorn

    run_port = int(os.environ.get("PORT", "8080"))
    uvicorn.run("main:app", host="0.0.0.0", port=run_port)

