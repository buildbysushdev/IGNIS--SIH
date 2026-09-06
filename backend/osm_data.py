import json
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
import requests
from geopy.distance import geodesic

from config import OVERPASS_URL, CACHE_DIR

# Hardcoded fallback list of major Indian heavy industrial facilities
FALLBACK_ZONES: list[dict[str, Any]] = [
    {"latitude": 21.20, "longitude": 81.38, "name": "Bhilai Steel Plant", "zone_type": "works"},
    {"latitude": 23.79, "longitude": 86.14, "name": "Bokaro Steel Plant", "zone_type": "works"},
    {"latitude": 22.80, "longitude": 86.20, "name": "Jamshedpur (Tata Steel)", "zone_type": "works"},
    {"latitude": 22.25, "longitude": 84.85, "name": "Rourkela Steel Plant", "zone_type": "works"},
    {"latitude": 17.68, "longitude": 83.22, "name": "Visakhapatnam Steel Plant", "zone_type": "works"},
    {"latitude": 22.35, "longitude": 69.07, "name": "Reliance Jamnagar Refinery", "zone_type": "works"},
    {"latitude": 21.14, "longitude": 79.08, "name": "Nagpur Industrial Area", "zone_type": "industrial"},
    {"latitude": 28.61, "longitude": 77.23, "name": "Delhi Industrial Zone", "zone_type": "industrial"},
    {"latitude": 19.07, "longitude": 72.87, "name": "Mumbai MIDC", "zone_type": "industrial"},
    {"latitude": 12.97, "longitude": 77.59, "name": "Bangalore Industrial Area", "zone_type": "industrial"},
]

OVERPASS_QUERY = """
[out:json][timeout:120];
area["name"="India"]->.a;
(
  node["landuse"="industrial"](area.a);
  way["landuse"="industrial"](area.a);
  node["man_made"="works"](area.a);
  node["power"="plant"](area.a);
  node["man_made"="kiln"](area.a);
);
out center;
"""


def fetch_industrial_zones_from_osm() -> list[dict[str, Any]]:
    """Query Overpass API for industrial facilities and zones across India."""
    resp = requests.post(OVERPASS_URL, data={"data": OVERPASS_QUERY}, timeout=120)
    resp.raise_for_status()
    zones: list[dict[str, Any]] = []
    for el in resp.json().get("elements", []):
        lat = el.get("lat") or (el.get("center", {}).get("lat") if "center" in el else None)
        lon = el.get("lon") or (el.get("center", {}).get("lon") if "center" in el else None)
        if lat is None or lon is None:
            continue
        tags = el.get("tags", {})
        z_type = tags.get("landuse") or tags.get("man_made") or tags.get("power") or "industrial"
        zones.append({
            "latitude": float(lat),
            "longitude": float(lon),
            "name": tags.get("name", "Unnamed"),
            "zone_type": str(z_type),
        })
    return zones


def load_or_cache_zones() -> list[dict[str, Any]]:
    """Load zones from cache (<7d), fetch fresh from OSM, or fall back to preset facilities."""
    cache_path = Path(CACHE_DIR) / "industrial_zones.json"
    if cache_path.exists():
        age = datetime.now() - datetime.fromtimestamp(cache_path.stat().st_mtime)
        if age < timedelta(days=7):
            try:
                zones = json.loads(cache_path.read_text(encoding="utf-8"))
                print(f"[IGNIS] [mode=cache] Loaded {len(zones)} industrial zones from local cache")
                return zones
            except Exception:
                pass
    try:
        zones = fetch_industrial_zones_from_osm()
        if zones:
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(json.dumps(zones, indent=2), encoding="utf-8")
            print(f"[IGNIS] [mode=fresh] Fetched {len(zones)} industrial zones from OSM and cached")
            return zones
    except Exception as err:
        print(f"[IGNIS] Overpass fetch error: {err}")
    if cache_path.exists():
        try:
            zones = json.loads(cache_path.read_text(encoding="utf-8"))
            print(f"[IGNIS] [mode=cache-expired] Loaded {len(zones)} zones from expired cache")
            return zones
        except Exception:
            pass
    print(f"[IGNIS] [mode=fallback] Using {len(FALLBACK_ZONES)} hardcoded industrial facilities")
    return list(FALLBACK_ZONES)


def find_nearest_industry(lat: float, lon: float, zones: list[dict[str, Any]]) -> dict[str, Any]:
    """Find nearest industrial facility using geodesic GPS distance calculation."""
    if not zones:
        return {"distance_km": 999.0, "name": "Unknown", "zone_type": "none", "zone_lat": 0.0, "zone_lon": 0.0}
    origin = (lat, lon)
    nearest = min(
        zones,
        key=lambda z: geodesic(origin, (float(z["latitude"]), float(z["longitude"]))).km,
    )
    dist_km = geodesic(origin, (float(nearest["latitude"]), float(nearest["longitude"]))).km
    return {
        "distance_km": round(dist_km, 2),
        "name": str(nearest.get("name", "Unnamed")),
        "zone_type": str(nearest.get("zone_type", "industrial")),
        "zone_lat": float(nearest.get("latitude", 0.0)),
        "zone_lon": float(nearest.get("longitude", 0.0)),
    }


def check_industrial_proximity(lat: float, lon: float, radius: int = 5000) -> tuple[float, bool]:
    """Classifier compatibility: returns nearest distance in meters and proximity flag."""
    zones = load_or_cache_zones()
    nearest = find_nearest_industry(lat, lon, zones)
    dist_meters = round(nearest["distance_km"] * 1000.0, 1)
    return (dist_meters, dist_meters <= 1500.0)
