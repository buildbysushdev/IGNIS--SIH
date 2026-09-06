import sys
from pathlib import Path

# Ensure backend directory is in sys.path regardless of execution working directory
_backend_dir = str(Path(__file__).resolve().parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from datetime import datetime
from typing import Any, Optional
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from classifier import FireClassifier
from osm_data import load_or_cache_zones
from ml_model import load_persistence_cache
from alerts import generate_alerts, store_alerts, get_active_alerts

from database import init_db, insert_fires, get_fires_by_date
from firms import fetch_fires, fetch_all_sources, get_data_status

app = FastAPI(title="IGNIS", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    import os
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


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "IGNIS",
        "full_form": "Intelligent Geospatial Network for Industrial fire Screening",
        "version": "1.0",
        "status": "active",
        "problem_id": "SIH26162",
        "organization": "NTRO",
    }


@app.get("/api/fires")
def get_fires(
    days: int = Query(default=1, ge=1, le=10),
    source: str = Query(default="all"),
    force: bool = Query(default=False),
) -> dict[str, Any]:
    classifier = get_classifier()
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
        mode = status_info.get("mode", "live")
        ignis_status = "live" if mode == "live" else "cached_fallback"

        return {
            "fires": classified_fires,
            "total": len(classified_fires),
            "summary": classifier.get_summary(classified_fires),
            "days": days,
            "source": source,
            "ignis_status": ignis_status,
            "message": status_info.get("message", "Operational"),
            "generated_at": datetime.now().isoformat(),
        }
    except Exception as exc:
        today = datetime.now().strftime("%Y-%m-%d")
        fallback = get_fires_by_date(today)
        if not fallback:
            fallback = get_fires_by_date(days)
        classified_fallback = classifier.classify_batch(fallback)
        alerts = generate_alerts(classified_fallback)
        store_alerts(alerts)
        return {
            "fires": classified_fallback,
            "total": len(classified_fallback),
            "summary": classifier.get_summary(classified_fallback),
            "days": days,
            "source": source,
            "ignis_status": "cached_fallback",
            "message": f"Operating on cached/database fallback: {exc}",
            "generated_at": datetime.now().isoformat(),
        }


@app.get("/api/fires/emergency")
def get_emergency_fires(days: int = Query(default=1, ge=1, le=10)) -> dict[str, Any]:
    classifier = get_classifier()
    try:
        raw_fires = fetch_all_sources(days=days)
    except Exception:
        raw_fires = get_fires_by_date(days)
    classified = classifier.classify_batch(raw_fires)
    emergencies = [f for f in classified if f.get("risk_level") == "CRITICAL"]
    return {"emergencies": emergencies, "count": len(emergencies)}


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
def get_stats(days: int = Query(default=7, ge=1, le=30)) -> dict[str, Any]:
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
def get_alerts(hours: int = Query(default=24, ge=1)) -> dict[str, Any]:
    active = get_active_alerts(hours=hours)
    return {"alerts": active, "count": len(active)}


@app.post("/api/train")
def train(days: int = Query(default=7, ge=1, le=30)) -> dict[str, Any]:
    global _persistence
    from ml_model import build_persistence_cache, train_ml_classifier

    cache = build_persistence_cache(days=days)
    _persistence = cache
    try:
        fires = fetch_all_sources(days=days)
        zones = load_or_cache_zones()
        train_ml_classifier(fires, zones, cache)
    except Exception as exc:
        print(f"[IGNIS] ML training notice: {exc}")
    return {"status": "trained", "locations": len(cache)}


@app.get("/api/health")
def health() -> dict[str, Any]:
    import os
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


if __name__ == "__main__":
    import os
    import uvicorn
    run_port = int(os.environ.get("PORT", "8080"))
    uvicorn.run("main:app", host="0.0.0.0", port=run_port)

