import json
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
import requests
from geopy.distance import geodesic

from config import OVERPASS_URL, CACHE_DIR

# Comprehensive fallback list of major Indian heavy industrial facilities & chemical hubs
FALLBACK_ZONES: list[dict[str, Any]] = [
    {"latitude": 21.20, "longitude": 81.38, "name": "Bhilai Steel Plant", "zone_type": "works"},
    {"latitude": 23.79, "longitude": 86.14, "name": "Bokaro Steel Plant", "zone_type": "works"},
    {"latitude": 22.80, "longitude": 86.20, "name": "Jamshedpur (Tata Steel)", "zone_type": "works"},
    {"latitude": 22.25, "longitude": 84.85, "name": "Rourkela Steel Plant", "zone_type": "works"},
    {"latitude": 23.55, "longitude": 87.29, "name": "Durgapur Steel Plant", "zone_type": "works"},
    {"latitude": 20.95, "longitude": 85.15, "name": "Angul (Jindal/NALCO)", "zone_type": "works"},
    {"latitude": 20.96, "longitude": 85.83, "name": "Kalinganagar Steel Hub", "zone_type": "works"},
    {"latitude": 21.90, "longitude": 83.40, "name": "Raigarh (JSPL Steel)", "zone_type": "works"},
    {"latitude": 22.35, "longitude": 82.68, "name": "Korba Power & Aluminium", "zone_type": "works"},
    {"latitude": 15.18, "longitude": 76.66, "name": "Bellary (JSW Vijayanagar)", "zone_type": "works"},
    {"latitude": 17.68, "longitude": 83.22, "name": "Visakhapatnam Steel Plant", "zone_type": "works"},
    {"latitude": 22.35, "longitude": 69.07, "name": "Reliance Jamnagar Refinery", "zone_type": "works"},
    {"latitude": 21.12, "longitude": 72.67, "name": "Hazira Industrial Complex", "zone_type": "industrial"},
    {"latitude": 21.71, "longitude": 72.98, "name": "Dahej Petroleum & Chemical Hub", "zone_type": "industrial"},
    {"latitude": 21.63, "longitude": 73.01, "name": "Ankleshwar GIDC Chemical Zone", "zone_type": "industrial"},
    {"latitude": 22.30, "longitude": 73.18, "name": "Vadodara Petrochemicals", "zone_type": "industrial"},
    {"latitude": 19.01, "longitude": 72.89, "name": "Trombay Refinery & Chemical", "zone_type": "works"},
    {"latitude": 19.80, "longitude": 72.70, "name": "Tarapur MIDC", "zone_type": "industrial"},
    {"latitude": 18.62, "longitude": 73.81, "name": "Pimpri-Chinchwad MIDC", "zone_type": "industrial"},
    {"latitude": 21.14, "longitude": 79.08, "name": "Nagpur Butibori MIDC", "zone_type": "industrial"},
    {"latitude": 20.30, "longitude": 86.60, "name": "Paradip Refinery & Port", "zone_type": "works"},
    {"latitude": 22.06, "longitude": 88.06, "name": "Haldia Petrochemicals", "zone_type": "works"},
    {"latitude": 29.40, "longitude": 76.96, "name": "Panipat IOCL Refinery", "zone_type": "works"},
    {"latitude": 27.50, "longitude": 77.68, "name": "Mathura IOCL Refinery", "zone_type": "works"},
    {"latitude": 24.21, "longitude": 83.03, "name": "Renukoot Hindalco & Singrauli", "zone_type": "works"},
    {"latitude": 13.17, "longitude": 80.32, "name": "Manali Petrochemical / CPCL", "zone_type": "works"},
    {"latitude": 13.25, "longitude": 80.33, "name": "Ennore Port & Thermal Power", "zone_type": "works"},
    {"latitude": 12.98, "longitude": 79.97, "name": "Sriperumbudur Industrial Corridor", "zone_type": "industrial"},
    {"latitude": 13.03, "longitude": 77.51, "name": "Peenya Industrial Estate", "zone_type": "industrial"},
    {"latitude": 28.61, "longitude": 77.23, "name": "Delhi NCR Industrial Zone", "zone_type": "industrial"},
    {"latitude": 28.40, "longitude": 77.31, "name": "Faridabad Industrial Cluster", "zone_type": "industrial"},
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
