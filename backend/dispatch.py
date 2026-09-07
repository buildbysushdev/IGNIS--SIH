import json
import math
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from database import insert_dispatch_log, get_recent_dispatches

BASE_DIR = Path(__file__).resolve().parent
STATIONS_FILE = BASE_DIR / "cache" / "fire_stations.json"
PROTOCOLS_FILE = BASE_DIR / "knowledge" / "fire_response.json"

_cached_stations: Optional[list[dict[str, Any]]] = None
_cached_protocols: Optional[dict[str, Any]] = None


def load_fire_stations() -> list[dict[str, Any]]:
    """Load fire station locations across India from pre-cached catalog."""
    global _cached_stations
    if _cached_stations is not None:
        return _cached_stations

    if STATIONS_FILE.exists():
        try:
            with open(STATIONS_FILE, "r", encoding="utf-8") as f:
                _cached_stations = json.load(f)
                return _cached_stations
        except Exception as e:
            print(f"[DISPATCH] Warning: Failed to load fire stations cache: {e}")

    # Minimal emergency fallback stations
    _cached_stations = [
        {
            "name": "Surat Central Fire Station",
            "lat": 21.1925,
            "lon": 72.8258,
            "city": "Surat",
            "state": "Gujarat",
            "phone": "+91-261-2422222",
        },
        {
            "name": "Bhilai Steel Plant Fire Station",
            "lat": 21.1890,
            "lon": 81.3980,
            "city": "Bhilai",
            "state": "Chhattisgarh",
            "phone": "+91-788-2222101",
        },
        {
            "name": "Ludhiana Fire Headquarters",
            "lat": 30.9010,
            "lon": 75.8573,
            "city": "Ludhiana",
            "state": "Punjab",
            "phone": "+91-161-2740101",
        },
        {
            "name": "Dehradun Fire Headquarters",
            "lat": 30.3165,
            "lon": 78.0322,
            "city": "Dehradun",
            "state": "Uttarakhand",
            "phone": "+91-135-2716101",
        },
    ]
    return _cached_stations


def load_response_protocols() -> dict[str, Any]:
    """Load knowledge base extinguishing protocols by classification."""
    global _cached_protocols
    if _cached_protocols is not None:
        return _cached_protocols

    if PROTOCOLS_FILE.exists():
        try:
            with open(PROTOCOLS_FILE, "r", encoding="utf-8") as f:
                _cached_protocols = json.load(f)
                return _cached_protocols
        except Exception:
            pass

    return {}


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two geographic coordinates in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def find_nearest_fire_station(lat: float, lon: float) -> dict[str, Any]:
    """Identify the geographically closest fire station and calculate travel ETA."""
    stations = load_fire_stations()
    if not stations:
        return {
            "name": "Regional Fire Command Post",
            "distance_km": 15.0,
            "eta_minutes": 25,
            "phone": "+91-101",
            "city": "Unknown",
            "state": "Unknown",
        }

    nearest = None
    min_dist = float("inf")

    for st in stations:
        st_lat = float(st.get("lat", 0.0))
        st_lon = float(st.get("lon", 0.0))
        dist = haversine_distance_km(lat, lon, st_lat, st_lon)
        if dist < min_dist:
            min_dist = dist
            nearest = st

    if nearest is None:
        return {
            "name": "Regional Emergency Service",
            "distance_km": 10.0,
            "eta_minutes": 18,
            "phone": "+91-101",
        }

    # Realistic ETA calculation: 45 km/h average speed in response vehicle + 2 min dispatch mobilization
    eta = round(2.0 + (min_dist / 45.0) * 60.0)
    eta = max(3, eta)

    return {
        "name": nearest.get("name", "District Fire Station"),
        "distance_km": round(min_dist, 2),
        "eta_minutes": eta,
        "phone": nearest.get("phone", "+91-101"),
        "city": nearest.get("city", ""),
        "state": nearest.get("state", ""),
        "lat": nearest.get("lat"),
        "lon": nearest.get("lon"),
    }


def simulate_dispatch(fire_data: dict[str, Any], station_data: Optional[dict[str, Any]] = None) -> dict[str, Any]:
    """Generate simulated emergency dispatch record and log to SQLite database."""
    lat = float(fire_data.get("latitude", 0.0))
    lon = float(fire_data.get("longitude", 0.0))
    category = fire_data.get("category", "UNKNOWN")

    if not station_data:
        station_data = find_nearest_fire_station(lat, lon)

    protocols = load_response_protocols()
    protocol = protocols.get(category, protocols.get("UNKNOWN", {}))

    recommended_equipment = protocol.get(
        "equipment", ["fire tenders", "water bowsers", "foam units"]
    )
    safety_distance = protocol.get("safety_distance_m", 300)

    dispatch_id = f"DISPATCH-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.utcnow().isoformat() + "Z"

    record = {
        "dispatch_id": dispatch_id,
        "fire_location": {"lat": lat, "lon": lon},
        "fire_category": category,
        "fire_station": {
            "name": station_data.get("name"),
            "distance_km": station_data.get("distance_km"),
            "eta_minutes": station_data.get("eta_minutes"),
            "phone": station_data.get("phone"),
        },
        "recommended_equipment": recommended_equipment,
        "safety_distance": safety_distance,
        "sent_to": ["fire_station", "district_collector", "ndma"],
        "timestamp": timestamp,
        "status": "DISPATCHED",
        "simulation_disclaimer": "⚠️ SIMULATION MODE: In production, this would send SMS via Twilio to fire station and email to district collector.",
    }

    # Store in database
    db_record = {
        "dispatch_id": dispatch_id,
        "fire_lat": lat,
        "fire_lon": lon,
        "fire_category": category,
        "station_name": station_data.get("name", "District Station"),
        "station_dist_km": station_data.get("distance_km", 0.0),
        "eta_minutes": station_data.get("eta_minutes", 0.0),
        "recommended_equipment": ", ".join(recommended_equipment),
        "sent_to": "fire_station, district_collector, ndma",
        "status": "DISPATCHED",
    }
    insert_dispatch_log(db_record)

    return record
