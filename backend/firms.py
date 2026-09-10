import os
import json
import time
from datetime import datetime, timedelta
from io import StringIO
from pathlib import Path
from typing import Any
import pandas as pd
import requests
from geopy.distance import geodesic

from config import FIRMS_MAP_KEY, FIRMS_BASE_URL, CACHE_DIR, INDIA_BBOX
from database import insert_fires, get_fires_by_date

# Ensure cache directory exists on module load
Path(CACHE_DIR).mkdir(parents=True, exist_ok=True)

_data_status: dict[str, Any] = {
    "mode": "empty",
    "count": 0,
    "message": "Initializing NASA FIRMS ingestion...",
    "fetched_at": datetime.utcnow().isoformat() + "Z",
}


def _update_status(mode: str, count: int, message: str) -> None:
    _data_status["mode"] = mode
    _data_status["count"] = count
    _data_status["message"] = message
    _data_status["fetched_at"] = datetime.utcnow().isoformat() + "Z"


def get_last_fetched_at() -> str:
    return _data_status.get("fetched_at") or (datetime.utcnow().isoformat() + "Z")


def _get_map_key() -> str:
    key = (os.getenv("FIRMS_MAP_KEY", "") or FIRMS_MAP_KEY).strip()
    if not key:
        print("[IGNIS] WARNING: FIRMS_MAP_KEY missing from environment variables!")
        raise Exception("missing_api_key")
    return key


def _call_firms_api(days: int, source: str) -> list[dict[str, Any]]:
    """Fetch fire telemetry from NASA FIRMS API with retry logic and column normalization."""
    map_key = _get_map_key()
    url = f"{FIRMS_BASE_URL}/{map_key}/{source}/{INDIA_BBOX}/{days}"
    masked_key = f"{map_key[:4]}***{map_key[-4:]}" if len(map_key) > 8 else "***"

    last_err: Exception | None = None
    response = None
    for attempt in range(2):
        try:
            print(f"[IGNIS] Requesting NASA URL (attempt {attempt + 1}/2): {FIRMS_BASE_URL}/{masked_key}/{source}/{INDIA_BBOX}/{days}")
            response = requests.get(url, timeout=10)
            print(f"[IGNIS] NASA FIRMS response status: {response.status_code}")

            if response.status_code == 429:
                raise Exception("FIRMS rate limited (HTTP 429)")
            if response.status_code in (401, 403):
                raise Exception("Invalid or unauthorized FIRMS API key (HTTP 401/403)")

            text = response.text.strip()
            if "invalid" in text.lower() and "key" in text.lower():
                raise Exception("Invalid FIRMS API key returned by NASA")

            response.raise_for_status()
            break
        except Exception as exc:
            last_err = exc
            if attempt < 1:
                time.sleep(1.0)
            else:
                raise last_err

    if response is None:
        return []

    records = parse_firms_csv(response.text, source)
    print(f"[IGNIS] FIRMS API call SUCCESS | source={source} | days={days} | fires={len(records)}")
    return records


def parse_firms_csv(text: str, source: str = "VIIRS_SNPP_NRT") -> list[dict[str, Any]]:
    """Parse raw NASA FIRMS CSV text into normalized hotspot records inside India bounding box."""
    text = (text or "").strip()
    if not text or text.lower().startswith("no data") or "invalid" in text.lower():
        return []

    try:
        df = pd.read_csv(StringIO(text))
    except Exception as exc:
        print(f"[IGNIS] CSV Parse error: {exc}")
        return []

    if df.empty:
        return []

    # Column normalization: VIIRS bright_ti4 -> brightness; MODIS stays brightness
    if "bright_ti4" in df.columns and "brightness" not in df.columns:
        df.rename(columns={"bright_ti4": "brightness"}, inplace=True)
    elif "bright_ti4" in df.columns and "brightness" in df.columns:
        df["brightness"] = df["brightness"].fillna(df["bright_ti4"])

    records: list[dict[str, Any]] = []
    for row in df.to_dict(orient="records"):
        try:
            lat = float(row.get("latitude", 0.0))
            lon = float(row.get("longitude", 0.0))
            # India national bounding box coordinates filter
            if not (6.0 <= lat <= 38.0 and 65.0 <= lon <= 100.0):
                continue
            brightness = float(row.get("brightness", 0.0))
            frp = float(row.get("frp", 0.0))
            if frp < 0.0 or frp > 5000.0:
                frp = max(0.0, min(frp, 5000.0))
        except (ValueError, TypeError):
            continue

        raw_time = row.get("acq_time", "")
        if pd.isna(raw_time) or raw_time == "":
            acq_time = ""
        elif isinstance(raw_time, (int, float)):
            acq_time = f"{int(raw_time):04d}"
        else:
            acq_time = str(raw_time).strip()

        raw_date = row.get("acq_date", "")
        acq_date = "" if pd.isna(raw_date) else str(raw_date).strip()

        raw_conf = row.get("confidence", "")
        confidence = "" if pd.isna(raw_conf) else str(raw_conf).strip().lower()
        if confidence == "nominal":
            confidence = "n"
        elif confidence == "high":
            confidence = "h"
        elif confidence == "low":
            confidence = "l"

        raw_sat = row.get("satellite", "")
        satellite = "" if pd.isna(raw_sat) else str(raw_sat).strip()
        if not satellite or satellite == "N" or satellite == "1":
            satellite = "SNPP" if "SNPP" in source or satellite == "N" else "NOAA-20"

        raw_dn = row.get("daynight", "")
        daynight = "" if pd.isna(raw_dn) else str(raw_dn).strip()

        records.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": confidence,
            "satellite": satellite,
            "acq_date": acq_date,
            "acq_time": acq_time,
            "daynight": daynight,
        })

    return records


# Backward compatibility alias
_parse_firms_csv = parse_firms_csv


def _get_cache_path(days: int, source: str) -> str:
    """Return cache file path and ensure parent cache directory exists."""
    cache_dir = Path(CACHE_DIR)
    cache_dir.mkdir(parents=True, exist_ok=True)
    return str(cache_dir / f"firms_{source}_{days}d.json")


def _is_cache_valid(path: str, max_age_minutes: int = 15) -> bool:
    """Check if cache file exists and was modified within max_age_minutes (15 min default)."""
    if not os.path.exists(path):
        return False
    try:
        mtime = os.path.getmtime(path)
        file_time = datetime.fromtimestamp(mtime)
        age = datetime.now() - file_time
        return age < timedelta(minutes=max_age_minutes)
    except OSError:
        return False


def _load_cache(path: str) -> list[dict[str, Any]]:
    """Load and parse cached fire records from JSON."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception as exc:
        print(f"[IGNIS] Error loading cache {path}: {exc}")
        return []


def _save_cache(path: str, data: list[dict[str, Any]]) -> None:
    """Persist fire records to cache atomically as JSON to prevent file corruption."""
    tmp_path = f"{path}.tmp"
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp_path, path)
        print(f"[IGNIS] Cached {len(data)} fires -> {path}")
    except (OSError, PermissionError) as exc:
        print(f"[IGNIS] Error saving cache {path}: {exc}")
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass


def fetch_fires(
    days: int = 1, source: str = "VIIRS_SNPP_NRT", force: bool = False
) -> list[dict[str, Any]]:
    """Fetch active fire detections with 15-minute real-time cache, multi-tier window expansion, and SQLite fallback."""
    cache_path = _get_cache_path(days, source)

    if not force and _is_cache_valid(cache_path, max_age_minutes=15):
        data = _load_cache(cache_path)
        if data and len(data) > 0:
            print(f"[IGNIS] Cache HIT (active satellite cycle) | source={source} | fires={len(data)}")
            _update_status("live", len(data), f"Connected to NASA FIRMS ({len(data)} active hotspots, <15m cache)")
            return data

    try:
        fires = _call_firms_api(days, source)
        
        # If days=1 returned 0 passes (common when NASA orbit processing for today is pending), try days=3
        if not fires and days == 1:
            print(f"[IGNIS] 0 passes returned for 1-day window. Widening query to 3 days...")
            fires = _call_firms_api(3, source)

        if fires and len(fires) > 0:
            _save_cache(cache_path, fires)
            try:
                insert_fires(fires)
            except Exception as db_err:
                print(f"[IGNIS] SQLite cache insert notice: {db_err}")
            _update_status("live", len(fires), f"Live NASA FIRMS satellite ingestion ({len(fires)} active hotspots)")
            return fires

        # If FIRMS returned 0 fires even after widening, fail over to cached SQLite detections
        print(f"[IGNIS] Live FIRMS returned 0 detections. Engaging local SQLite repository...")
        db_fires = get_fires_by_date(3, limit=1000)
        if not db_fires:
            db_fires = get_fires_by_date(30, limit=1000)
        if db_fires and len(db_fires) > 0:
            _update_status("cached_fallback", len(db_fires), f"Operating on local repository ({len(db_fires)} verified detections)")
            return db_fires

        # If SQLite also has 0 detections, return empty list with clear operational status (strict LIVE/DEMO isolation)
        _update_status("cached_fallback", 0, "No active satellite detections in selected orbital window and local cache is empty")
        return []
    except Exception as e:
        print(f"[IGNIS] NASA FIRMS API Notice: {e}")
        _data_status["last_error"] = str(e)
        # 1. Fallback to existing cache even if slightly expired
        if os.path.exists(cache_path):
            cached = _load_cache(cache_path)
            if cached and len(cached) > 0:
                print(f"[IGNIS] Using cached satellite repository: {cache_path}")
                _update_status("cached_fallback", len(cached), f"Operating on satellite cache ({e})")
                return cached

        # 2. Fallback to SQLite historical database
        try:
            db_fires = get_fires_by_date(3, limit=1000)
            if not db_fires:
                db_fires = get_fires_by_date(30, limit=1000)
            if db_fires and len(db_fires) > 0:
                print(f"[IGNIS] Falling back to SQLite database ({len(db_fires)} fires found)")
                _update_status("cached_fallback", len(db_fires), f"Operating on database repository ({e})")
                return db_fires
        except Exception as db_err:
            print(f"[IGNIS] SQLite fallback notice: {db_err}")

        # 3. No fallback to synthetic demo data in LIVE query mode; return empty list with clear failure status
        _update_status("cached_fallback", 0, f"Satellite telemetry unavailable: {e}")
        return []


def deduplicate_fires(fires: list[dict[str, Any]], radius_km: float = 1.0) -> list[dict[str, Any]]:
    """Deduplicate overlapping fire detections within radius_km (default 1km). Sums FRP and keeps max brightness."""
    if not fires:
        return []

    sorted_fires = sorted(fires, key=lambda f: float(f.get("frp", 0.0)), reverse=True)
    deduped: list[dict[str, Any]] = []

    for fire in sorted_fires:
        lat1, lon1 = float(fire["latitude"]), float(fire["longitude"])
        is_dup = False
        for kept in deduped:
            lat2, lon2 = float(kept["latitude"]), float(kept["longitude"])
            if abs(lat1 - lat2) < 0.02 and abs(lon1 - lon2) < 0.02:
                if geodesic((lat1, lon1), (lat2, lon2)).km <= radius_km:
                    is_dup = True
                    kept["frp"] = round(float(kept.get("frp", 0.0)) + float(fire.get("frp", 0.0)), 1)
                    kept["brightness"] = round(max(float(kept.get("brightness", 0.0)), float(fire.get("brightness", 0.0))), 1)
                    kept["merged_count"] = kept.get("merged_count", 1) + 1
                    break
        if not is_dup:
            item = dict(fire)
            item["merged_count"] = 1
            deduped.append(item)

    return deduped


# Backward compatibility alias
_deduplicate_fires = deduplicate_fires


def fetch_all_sources(days: int = 1, force: bool = False) -> list[dict[str, Any]]:
    """Fetch from VIIRS_SNPP_NRT and VIIRS_NOAA20_NRT, merge, and deduplicate within 1km."""
    fires_snpp = fetch_fires(days, "VIIRS_SNPP_NRT", force=force)
    fires_noaa = fetch_fires(days, "VIIRS_NOAA20_NRT", force=force)
    combined = fires_snpp + fires_noaa

    if not combined:
        print(f"[IGNIS] fetch_all_sources | merged=0 | deduped=0, checking fallback...")
        db_fires = get_fires_by_date(3, limit=1000)
        if not db_fires:
            db_fires = get_fires_by_date(30, limit=1000)
        if db_fires:
            combined = db_fires
        else:
            return []

    deduped = deduplicate_fires(combined, radius_km=1.0)
    print(
        f"[IGNIS] Merged {len(combined)} fires from all sources -> "
        f"{len(deduped)} fires after 1km deduplication"
    )
    return deduped


def get_data_status() -> dict[str, Any]:
    """Return status summary of the last fire data retrieval."""
    return dict(_data_status)


# Compatibility aliases
get_cached_fires = fetch_all_sources
fetch_firms_data = fetch_all_sources
