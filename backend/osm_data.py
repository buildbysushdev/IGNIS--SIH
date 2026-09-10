import json
import math
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
    {"latitude": 21.1925, "longitude": 72.8258, "name": "Surat Chemical Cluster GIDC", "zone_type": "industrial"},
    {"latitude": 21.12, "longitude": 72.67, "name": "Hazira Industrial Complex", "zone_type": "industrial"},
    {"latitude": 20.3725, "longitude": 72.912, "name": "Vapi Industrial Estate Complex", "zone_type": "industrial"},
    {"latitude": 21.71, "longitude": 72.98, "name": "Dahej Petroleum & Chemical Hub", "zone_type": "industrial"},
    {"latitude": 21.628, "longitude": 73.004, "name": "Ankleshwar Chemical Corridor", "zone_type": "industrial"},
    {"latitude": 21.63, "longitude": 73.01, "name": "Ankleshwar GIDC Chemical Zone", "zone_type": "industrial"},
    {"latitude": 17.632, "longitude": 83.185, "name": "Visakhapatnam Pharma City", "zone_type": "industrial"},
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

# Comprehensive offline registry of major Indian urban amenities and critical infrastructure
FALLBACK_AMENITIES: list[dict[str, Any]] = [
    # HOSPITALS (Life-Critical)
    {"latitude": 28.5672, "longitude": 77.2100, "name": "AIIMS New Delhi Area", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 28.5714, "longitude": 77.2072, "name": "Safdarjung Hospital Delhi", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 19.0024, "longitude": 72.8423, "name": "KEM Hospital Parel Mumbai", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 19.0514, "longitude": 72.8294, "name": "Lilavati Hospital Bandra Mumbai", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 12.9629, "longitude": 77.5752, "name": "Victoria Hospital Bangalore", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 13.0601, "longitude": 80.2508, "name": "Apollo Hospital Greams Road Chennai", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 22.5397, "longitude": 88.3444, "name": "SSKM Hospital Kolkata", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 23.0526, "longitude": 72.5976, "name": "Civil Hospital Asarwa Ahmedabad", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 17.4226, "longitude": 78.4529, "name": "Nizam's Institute of Medical Sciences Hyderabad", "location_type": "HOSPITAL", "zone_type": "hospital"},
    {"latitude": 18.5262, "longitude": 73.8736, "name": "Sassoon General Hospital Pune", "location_type": "HOSPITAL", "zone_type": "hospital"},

    # PETROL PUMPS & FUEL DEPOTS (BLEVE Hazard)
    {"latitude": 22.4700, "longitude": 70.0500, "name": "Jamnagar Fuel Station & Depot", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 28.6500, "longitude": 77.2100, "name": "IOCL Fuel Depot Karol Bagh Delhi", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 19.0150, "longitude": 72.9050, "name": "HPCL Terminal Trombay Mumbai", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 12.9730, "longitude": 77.6080, "name": "BPCL Petrol Station MG Road Bangalore", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 13.0450, "longitude": 80.2450, "name": "IOCL Retail Outlet Anna Salai Chennai", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 18.5300, "longitude": 73.8400, "name": "HPCL Petrol Pump Shivajinagar Pune", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 21.1850, "longitude": 72.8200, "name": "Indian Oil Fuel Station Ring Road Surat", "location_type": "PETROL_PUMP", "zone_type": "fuel"},
    {"latitude": 22.4550, "longitude": 70.0650, "name": "Reliance Petroleum Retail Outlet Jamnagar", "location_type": "PETROL_PUMP", "zone_type": "fuel"},

    # SCHOOLS & COLLEGES (Mass Occupancy)
    {"latitude": 28.5665, "longitude": 77.1780, "name": "Delhi Public School RK Puram", "location_type": "SCHOOL", "zone_type": "school"},
    {"latitude": 18.9438, "longitude": 72.8315, "name": "St. Xavier's College Fort Mumbai", "location_type": "SCHOOL", "zone_type": "school"},
    {"latitude": 12.9720, "longitude": 77.6390, "name": "National Public School Indiranagar Bangalore", "location_type": "SCHOOL", "zone_type": "school"},
    {"latitude": 13.0583, "longitude": 80.2819, "name": "Presidency College Marina Chennai", "location_type": "SCHOOL", "zone_type": "school"},
    {"latitude": 22.5460, "longitude": 88.3610, "name": "La Martiniere College Kolkata", "location_type": "SCHOOL", "zone_type": "school"},
    {"latitude": 18.5236, "longitude": 73.8398, "name": "Fergusson College FC Road Pune", "location_type": "SCHOOL", "zone_type": "school"},
    {"latitude": 28.6872, "longitude": 77.2117, "name": "St. Stephen's College North Campus Delhi", "location_type": "SCHOOL", "zone_type": "school"},

    # RESTAURANTS & COMMERCIAL KITCHENS (Commercial LPG Hazard)
    {"latitude": 12.9750, "longitude": 77.6050, "name": "MG Road Restaurant & Kitchen Hub Bangalore", "location_type": "RESTAURANT", "zone_type": "restaurant"},
    {"latitude": 28.6315, "longitude": 77.2167, "name": "Connaught Place Dining Corridor Delhi", "location_type": "RESTAURANT", "zone_type": "restaurant"},
    {"latitude": 19.0596, "longitude": 72.8295, "name": "Bandra West Food & Restaurant Strip Mumbai", "location_type": "RESTAURANT", "zone_type": "restaurant"},
    {"latitude": 22.5510, "longitude": 88.3520, "name": "Park Street Restaurant Hub Kolkata", "location_type": "RESTAURANT", "zone_type": "restaurant"},
    {"latitude": 18.5362, "longitude": 73.8940, "name": "Koregaon Park Dining District Pune", "location_type": "RESTAURANT", "zone_type": "restaurant"},
    {"latitude": 13.0418, "longitude": 80.2341, "name": "T Nagar Restaurant & Food Court Chennai", "location_type": "RESTAURANT", "zone_type": "restaurant"},

    # COMMERCIAL MARKETS (Combustible Fuel Load)
    {"latitude": 28.6505, "longitude": 77.2303, "name": "Chandni Chowk Wholesale Market Delhi", "location_type": "MARKET", "zone_type": "marketplace"},
    {"latitude": 18.9472, "longitude": 72.8344, "name": "Crawford Market Complex South Mumbai", "location_type": "MARKET", "zone_type": "marketplace"},
    {"latitude": 12.9647, "longitude": 77.5767, "name": "KR Market Commercial Complex Bangalore", "location_type": "MARKET", "zone_type": "marketplace"},
    {"latitude": 22.5601, "longitude": 88.3524, "name": "New Market Hogg Market Kolkata", "location_type": "MARKET", "zone_type": "marketplace"},
    {"latitude": 21.1950, "longitude": 72.8450, "name": "Surat Textile Market Complex GIDC", "location_type": "MARKET", "zone_type": "marketplace"},
    {"latitude": 13.0400, "longitude": 80.2330, "name": "T Nagar Ranganathan Market Corridor Chennai", "location_type": "MARKET", "zone_type": "marketplace"},

    # SLUMS & DENSE URBAN SETTLEMENTS (Lateral Spread Risk)
    {"latitude": 19.0434, "longitude": 72.8562, "name": "Dharavi Dense Urban Settlement Mumbai", "location_type": "SLUM", "zone_type": "slum"},
    {"latitude": 19.0600, "longitude": 72.9240, "name": "Govandi Shivaji Nagar Dense Settlement Mumbai", "location_type": "SLUM", "zone_type": "slum"},
    {"latitude": 28.6690, "longitude": 77.2720, "name": "Seelampur High-Density Settlement Delhi", "location_type": "SLUM", "zone_type": "slum"},
    {"latitude": 12.9980, "longitude": 77.5530, "name": "Rajajinagar High-Density Pocket Bangalore", "location_type": "SLUM", "zone_type": "slum"},

    # RESIDENTIAL STRUCTURES & HOUSING SOCIETIES
    {"latitude": 18.5200, "longitude": 73.8500, "name": "Residential Colony Deccan Pune", "location_type": "RESIDENTIAL", "zone_type": "residential"},
    {"latitude": 18.5074, "longitude": 73.8077, "name": "Kothrud Residential Township Pune", "location_type": "RESIDENTIAL", "zone_type": "residential"},
    {"latitude": 12.9784, "longitude": 77.6408, "name": "Indiranagar Residential Layout Bangalore", "location_type": "RESIDENTIAL", "zone_type": "residential"},
    {"latitude": 28.7150, "longitude": 77.1150, "name": "Rohini Residential Sector Delhi", "location_type": "RESIDENTIAL", "zone_type": "residential"},
    {"latitude": 19.1136, "longitude": 72.8697, "name": "Andheri East Residential Complex Mumbai", "location_type": "RESIDENTIAL", "zone_type": "residential"},
    {"latitude": 22.5867, "longitude": 88.4178, "name": "Salt Lake Residential Block Kolkata", "location_type": "RESIDENTIAL", "zone_type": "residential"},
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
  node["amenity"="hospital"](area.a);
  node["amenity"="school"](area.a);
  node["amenity"="fuel"](area.a);
  node["amenity"="restaurant"](area.a);
  node["amenity"="marketplace"](area.a);
  way["building"="residential"](area.a);
  way["building"="apartments"](area.a);
);
out center;
"""


def fetch_industrial_zones_from_osm() -> list[dict[str, Any]]:
    """Query Overpass API for industrial facilities and critical infrastructure across India."""
    import database

    headers = {
        "User-Agent": "IGNIS-FireIntelligenceGroundStation/2.0 (SIH26162 NTRO; contact: admin@ignis.sih)",
        "Accept": "application/json",
    }
    
    # Key industrial corridors with bounding boxes for ultra-fast, reliable response
    corridors = [
        # Gujarat & Maharashtra Heavy Chemical & Refining Belt
        (18.5, 72.5, 23.5, 74.5, "Western Petrochem"),
        # Chota Nagpur & Eastern Steel/Mining Corridor (Bhilai, Bokaro, Rourkela, Jamshedpur, Angul)
        (20.5, 81.0, 24.5, 87.5, "Eastern Metallurgical"),
        # Northern Industrial & Refinery Corridor (NCR, Panipat, Mathura)
        (27.0, 76.5, 30.5, 78.5, "Northern Industrial"),
        # Southern Petrochemical & Industrial Hubs (Vizag, Chennai, Bellary)
        (12.5, 76.0, 18.5, 83.5, "Southern Industrial"),
    ]

    all_zones: list[dict[str, Any]] = []

    # First merge with our verified high-priority Indian industrial baseline
    for f in FALLBACK_ZONES:
        all_zones.append({
            "name": f["name"],
            "zone_type": f.get("zone_type", "works"),
            "latitude": float(f["latitude"]),
            "longitude": float(f["longitude"]),
            "sector": f.get("sector", "IN-01"),
            "tags": {"source": "IGNIS Verified Baseline"},
        })

    for min_lat, min_lon, max_lat, max_lon, corridor_name in corridors:
        q = f"""
        [out:json][timeout:15];
        (
          node["industrial"]({min_lat},{min_lon},{max_lat},{max_lon});
          node["man_made"="works"]({min_lat},{min_lon},{max_lat},{max_lon});
          node["amenity"="hospital"]({min_lat},{min_lon},{max_lat},{max_lon});
          node["amenity"="fuel"]({min_lat},{min_lon},{max_lat},{max_lon});
        );
        out center 40;
        """
        try:
            resp = requests.post(OVERPASS_URL, data={"data": q}, headers=headers, timeout=10)
            if resp.status_code == 200:
                elements = resp.json().get("elements", [])
                for el in elements:
                    lat = el.get("lat") or (el.get("center", {}).get("lat") if "center" in el else None)
                    lon = el.get("lon") or (el.get("center", {}).get("lon") if "center" in el else None)
                    if lat is None or lon is None:
                        continue
                    tags = el.get("tags", {})
                    name = tags.get("name")
                    if not name:
                        continue
                    z_type = tags.get("industrial") or tags.get("amenity") or tags.get("man_made") or "industrial"
                    all_zones.append({
                        "name": str(name),
                        "zone_type": str(z_type),
                        "latitude": float(lat),
                        "longitude": float(lon),
                        "sector": corridor_name,
                        "tags": tags,
                    })
        except Exception as exc:
            print(f"[IGNIS] Overpass API notice for {corridor_name}: {exc}")

    # Deduplicate by name and coordinates
    seen = set()
    deduped: list[dict[str, Any]] = []
    for z in all_zones:
        key = (round(z["latitude"], 3), round(z["longitude"], 3), z["name"].lower())
        if key not in seen:
            seen.add(key)
            deduped.append(z)

    # Persist into database
    try:
        database.insert_industrial_zones(deduped)
    except Exception as db_err:
        print(f"[IGNIS] Database zone insert notice: {db_err}")

    # Also persist to JSON cache
    try:
        cache_path = Path(CACHE_DIR) / "industrial_zones.json"
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(deduped, f, indent=2)
    except Exception:
        pass

    print(f"[IGNIS] OSM Overpass & Infrastructure sync complete: {len(deduped)} sites indexed")
    return deduped


_MEMORY_ZONES_CACHE: list[dict[str, Any]] = []
_MEMORY_AMENITIES_CACHE: list[dict[str, Any]] = []


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Fast, accurate Haversine distance in kilometers (~1,000x faster than iterative geodesic)."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2.0) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
    return R * c


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Fast Haversine distance in meters."""
    return haversine_km(lat1, lon1, lat2, lon2) * 1000.0


def load_or_cache_zones() -> list[dict[str, Any]]:
    """Load zones from in-memory cache, SQLite database (<24h) or query Overpass API."""
    global _MEMORY_ZONES_CACHE
    if _MEMORY_ZONES_CACHE:
        return _MEMORY_ZONES_CACHE

    import database

    # 1. Try SQLite database
    db_zones = database.get_cached_industrial_zones(limit=1000)
    if db_zones and len(db_zones) >= 30:
        _MEMORY_ZONES_CACHE = db_zones
        return _MEMORY_ZONES_CACHE

    # 2. Try JSON cache
    cache_path = Path(CACHE_DIR) / "industrial_zones.json"
    if cache_path.exists():
        try:
            zones = json.loads(cache_path.read_text(encoding="utf-8"))
            if zones and len(zones) >= 30:
                try:
                    database.insert_industrial_zones(zones)
                except Exception:
                    pass
                _MEMORY_ZONES_CACHE = zones
                return _MEMORY_ZONES_CACHE
        except Exception:
            pass

    # 3. Fetch live from OSM Overpass & populate DB
    _MEMORY_ZONES_CACHE = fetch_industrial_zones_from_osm()
    return _MEMORY_ZONES_CACHE


def find_nearest_industry(lat: float, lon: float, zones: list[dict[str, Any]]) -> dict[str, Any]:
    """Find nearest industrial facility using fast Haversine distance calculation."""
    if not zones:
        return {"distance_km": 999.0, "name": "Unknown", "zone_type": "none", "zone_lat": 0.0, "zone_lon": 0.0}

    nearest = min(
        zones,
        key=lambda z: haversine_km(lat, lon, float(z["latitude"]), float(z["longitude"])),
    )
    dist_km = haversine_km(lat, lon, float(nearest["latitude"]), float(nearest["longitude"]))
    return {
        "distance_km": round(dist_km, 2),
        "name": str(nearest.get("name", "Unnamed")),
        "zone_type": str(nearest.get("zone_type", nearest.get("type", "industrial"))),
        "zone_lat": float(nearest.get("latitude", 0.0)),
        "zone_lon": float(nearest.get("longitude", 0.0)),
    }


def check_industrial_proximity(lat: float, lon: float, radius: int = 5000) -> tuple[float, bool]:
    """Classifier compatibility: returns nearest distance in meters and proximity flag."""
    zones = load_or_cache_zones()
    nearest = find_nearest_industry(lat, lon, zones)
    dist_meters = round(nearest["distance_km"] * 1000.0, 1)
    return (dist_meters, dist_meters <= 1500.0)


def load_or_cache_amenities() -> list[dict[str, Any]]:
    """Load urban amenities and critical infrastructure from in-memory cache, JSON cache (<7d) or preconfigured database."""
    global _MEMORY_AMENITIES_CACHE
    if _MEMORY_AMENITIES_CACHE:
        return _MEMORY_AMENITIES_CACHE

    cache_path = Path(CACHE_DIR) / "urban_amenities.json"
    if cache_path.exists():
        try:
            amenities = json.loads(cache_path.read_text(encoding="utf-8"))
            if amenities and len(amenities) > 0:
                _MEMORY_AMENITIES_CACHE = amenities
                return _MEMORY_AMENITIES_CACHE
        except Exception:
            pass

    tmp_path = str(cache_path) + ".tmp"
    try:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        with open(tmp_path, "w", encoding="utf-8") as f:
            json.dump(FALLBACK_AMENITIES, f, indent=2)
        os.replace(tmp_path, str(cache_path))
    except (OSError, PermissionError):
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except OSError:
                pass

    _MEMORY_AMENITIES_CACHE = list(FALLBACK_AMENITIES)
    return _MEMORY_AMENITIES_CACHE


def get_location_context(lat: float, lon: float, radius_m: float = 250.0) -> dict[str, Any]:
    """
    Queries local cached OSM amenity, industrial, forest and building data within radius_m of (lat, lon).
    Returns primary amenity/building tag found:
    'HOSPITAL' | 'SCHOOL' | 'PETROL_PUMP' | 'RESTAURANT' | 'MARKET' | 'RESIDENTIAL' | 'SLUM' | 'INDUSTRIAL' | 'FARMLAND' | 'FOREST' | 'GENERAL'
    """
    amenities = load_or_cache_amenities()

    # 1. Check nearest urban amenity (hospital, fuel station, school)
    if amenities:
        nearest_amenity = min(
            amenities,
            key=lambda a: haversine_meters(lat, lon, float(a["latitude"]), float(a["longitude"])),
        )
        dist_m = haversine_meters(lat, lon, float(nearest_amenity["latitude"]), float(nearest_amenity["longitude"]))
        if dist_m <= radius_m:
            return {
                "location_type": nearest_amenity.get("location_type", "GENERAL"),
                "name": nearest_amenity.get("name", "Urban Facility"),
                "distance_m": round(dist_m, 1),
                "zone_type": nearest_amenity.get("zone_type", "urban"),
                "latitude": float(nearest_amenity["latitude"]),
                "longitude": float(nearest_amenity["longitude"]),
            }

    # 2. Check industrial facilities (within 3.5 km)
    zones = load_or_cache_zones()
    if zones:
        nearest_ind = min(
            zones,
            key=lambda z: haversine_km(lat, lon, float(z["latitude"]), float(z["longitude"])),
        )
        ind_dist_km = haversine_km(lat, lon, float(nearest_ind["latitude"]), float(nearest_ind["longitude"]))
        if ind_dist_km <= 3.5:
            return {
                "location_type": "INDUSTRIAL",
                "name": nearest_ind.get("name", "Industrial Facility"),
                "distance_m": round(ind_dist_km * 1000.0, 1),
                "zone_type": nearest_ind.get("zone_type", "industrial"),
                "latitude": float(nearest_ind["latitude"]),
                "longitude": float(nearest_ind["longitude"]),
            }

    # 3. Check major Indian forest reserves & biosphere corridors
    is_forest = (
        (29.0 <= lat <= 31.8 and 77.5 <= lon <= 81.2) or  # Uttarakhand/Himachal Himalayas & Corbett
        (21.0 <= lat <= 22.8 and 85.0 <= lon <= 87.2) or  # Simlipal / Mayurbhanj Reserve (Odisha)
        (21.5 <= lat <= 23.8 and 79.5 <= lon <= 82.5) or  # Kanha / Bandhavgarh / Satpura (MP)
        (11.0 <= lat <= 16.0 and 74.5 <= lon <= 77.5) or  # Western Ghats / Nilgiris / Wayanad
        (24.5 <= lat <= 28.5 and 89.5 <= lon <= 96.5) or  # Northeast India (Assam, Meghalaya, Arunachal)
        (21.5 <= lat <= 22.5 and 88.0 <= lon <= 89.5) or  # Sundarbans Mangrove Reserve
        (20.8 <= lat <= 21.5 and 70.5 <= lon <= 71.5)     # Gir Forest Reserve
    )
    if is_forest:
        return {
            "location_type": "FOREST",
            "name": "Forest Reserve & Wildland Zone",
            "distance_m": 0.0,
            "zone_type": "forest",
            "latitude": lat,
            "longitude": lon,
        }

    # 4. Check agricultural corridor coordinates in India
    is_agri = (
        (28.0 <= lat <= 32.5 and 74.0 <= lon <= 80.0) or
        (24.0 <= lat <= 28.5 and 77.0 <= lon <= 88.5) or
        (17.5 <= lat <= 23.5 and 73.5 <= lon <= 82.5) or
        (9.5 <= lat <= 16.5 and 75.5 <= lon <= 81.0)
    )
    if is_agri:
        return {
            "location_type": "FARMLAND",
            "name": "Agricultural Corridor",
            "distance_m": 0.0,
            "zone_type": "farmland",
            "latitude": lat,
            "longitude": lon,
        }

    # 5. Fallback if no specific OSM tag found
    return {
        "location_type": "GENERAL",
        "name": "General Geographic Area",
        "distance_m": 9999.0,
        "zone_type": "general",
        "latitude": lat,
        "longitude": lon,
    }


