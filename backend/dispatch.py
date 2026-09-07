import json
import math
import os
import uuid
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

from database import insert_dispatch_log, get_recent_dispatches, get_connection
from notification_channels import send_multi_channel_alert

BASE_DIR = Path(__file__).resolve().parent
STATIONS_FILE = BASE_DIR / "cache" / "fire_stations.json"
HOSPITALS_FILE = BASE_DIR / "cache" / "hospitals.json"
PROTOCOLS_FILE = BASE_DIR / "knowledge" / "fire_response.json"

_cached_stations: Optional[list[dict[str, Any]]] = None
_cached_hospitals: Optional[list[dict[str, Any]]] = None
_cached_protocols: Optional[dict[str, Any]] = None


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


def load_fire_stations() -> list[dict[str, Any]]:
    """
    Load fire station locations across India from pre-cached catalog.
    If missing, attempts Overpass OSM API fetch or loads embedded fallback list.
    """
    global _cached_stations
    if _cached_stations is not None and len(_cached_stations) > 0:
        return _cached_stations

    if STATIONS_FILE.exists():
        try:
            with open(STATIONS_FILE, "r", encoding="utf-8") as f:
                _cached_stations = json.load(f)
                if _cached_stations and len(_cached_stations) > 0:
                    return _cached_stations
        except Exception as e:
            print(f"[DISPATCH] Warning: Failed to load fire stations cache: {e}")

    # Attempt Overpass API fetch if online and file was empty
    try:
        overpass_url = "https://overpass-api.de/api/interpreter"
        query = """[out:json][timeout:25];
        area["name"="India"]->.a;
        node["amenity"="fire_station"](area.a);
        out 200;"""
        req = urllib.request.Request(
            overpass_url,
            data=query.encode("utf-8"),
            headers={"User-Agent": "IGNIS-Disaster-Response-Node/1.0"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            elements = data.get("elements", [])
            if elements:
                stations: list[dict[str, Any]] = []
                for el in elements:
                    tags = el.get("tags", {})
                    name = tags.get("name") or tags.get("name:en") or "Municipal Fire Station"
                    stations.append({
                        "name": name,
                        "lat": el.get("lat"),
                        "lon": el.get("lon"),
                        "city": tags.get("addr:city", "India"),
                        "state": tags.get("addr:state", ""),
                        "phone": tags.get("phone") or tags.get("contact:phone") or "+91-101",
                    })
                _cached_stations = stations
                STATIONS_FILE.parent.mkdir(parents=True, exist_ok=True)
                with open(STATIONS_FILE, "w", encoding="utf-8") as f:
                    json.dump(stations, f, indent=2)
                return _cached_stations
    except Exception:
        pass

    # Built-in fallback catalog
    _cached_stations = [
        {"name": "Surat Central Fire Station HQ", "lat": 21.1925, "lon": 72.8258, "city": "Surat", "state": "Gujarat", "phone": "+91-261-2422222"},
        {"name": "Surat Sachin GIDC Fire Station", "lat": 21.0820, "lon": 72.8710, "city": "Surat", "state": "Gujarat", "phone": "+91-261-2397101"},
        {"name": "Vapi GIDC Industrial Fire Station", "lat": 20.3720, "lon": 72.9100, "city": "Vapi", "state": "Gujarat", "phone": "+91-260-2430101"},
        {"name": "Ankleshwar GIDC Disaster Prevention Center", "lat": 21.6260, "lon": 73.0030, "city": "Ankleshwar", "state": "Gujarat", "phone": "+91-2646-221101"},
        {"name": "Bhilai Steel Plant Fire HQ", "lat": 21.1890, "lon": 81.3980, "city": "Bhilai", "state": "Chhattisgarh", "phone": "+91-788-2222101"},
        {"name": "Ludhiana Municipal Fire Headquarters", "lat": 30.9010, "lon": 75.8573, "city": "Ludhiana", "state": "Punjab", "phone": "+91-161-2740101"},
        {"name": "Dehradun Central Fire Station", "lat": 30.3165, "lon": 78.0322, "city": "Dehradun", "state": "Uttarakhand", "phone": "+91-135-2716101"},
        {"name": "Delhi Fire Service Connaught Place HQ", "lat": 28.6315, "lon": 77.2167, "city": "New Delhi", "state": "Delhi", "phone": "+91-11-23414000"},
        {"name": "Mumbai Fire Brigade Byculla HQ", "lat": 18.9750, "lon": 72.8330, "city": "Mumbai", "state": "Maharashtra", "phone": "+91-22-23076111"},
    ]
    return _cached_stations


def load_hospitals() -> list[dict[str, Any]]:
    """Load hospital and trauma center locations across India from pre-cached catalog."""
    global _cached_hospitals
    if _cached_hospitals is not None and len(_cached_hospitals) > 0:
        return _cached_hospitals

    if HOSPITALS_FILE.exists():
        try:
            with open(HOSPITALS_FILE, "r", encoding="utf-8") as f:
                _cached_hospitals = json.load(f)
                if _cached_hospitals and len(_cached_hospitals) > 0:
                    return _cached_hospitals
        except Exception as e:
            print(f"[DISPATCH] Warning: Failed to load hospitals cache: {e}")

    # Fallback hospitals
    _cached_hospitals = [
        {
            "id": "HOSP-01",
            "name": "New Civil Hospital & Trauma Center Surat",
            "lat": 21.1850,
            "lon": 72.8210,
            "city": "Surat",
            "state": "Gujarat",
            "phone": "+91-261-2244175",
            "emergency_hotline": "108",
            "trauma_center": True,
            "capacity": {"total_beds": 1250, "burn_unit_beds": 50, "icu_beds": 110},
            "readiness": "CRITICAL_STANDBY",
        },
        {
            "id": "HOSP-02",
            "name": "Vapi GIDC Industrial Trauma Center",
            "lat": 20.3755,
            "lon": 72.9142,
            "city": "Vapi",
            "state": "Gujarat",
            "phone": "+91-260-2432001",
            "emergency_hotline": "108",
            "trauma_center": True,
            "capacity": {"total_beds": 350, "burn_unit_beds": 25, "icu_beds": 40},
            "readiness": "CRITICAL_STANDBY",
        },
    ]
    return _cached_hospitals


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


def find_nearest_fire_station(lat: float, lon: float) -> dict[str, Any]:
    """
    Identify the geographically closest fire station and calculate travel ETA (at 40 km/h avg).
    Includes contact, simulated radio channel, and capabilities.
    """
    stations = load_fire_stations()
    if not stations:
        return {
            "name": "District Fire Station HQ",
            "distance_km": 4.5,
            "eta_minutes": 7,
            "coordinates": {"lat": lat + 0.03, "lon": lon + 0.03},
            "contact": {
                "phone": "+91-261-2422222 (simulated)",
                "email": "control@surat-fire.gov.in (simulated)",
                "radio": "CHANNEL-14",
            },
            "capabilities": ["Water tender", "Foam unit", "Rescue", "Thermal cameras"],
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
            "name": "Regional Fire Command Post",
            "distance_km": 5.0,
            "eta_minutes": 8,
            "coordinates": {"lat": lat, "lon": lon},
            "contact": {
                "phone": "+91-101 (simulated)",
                "email": "control@fire.gov.in (simulated)",
                "radio": "CHANNEL-14",
            },
            "capabilities": ["Water tender", "Foam unit", "Rescue"],
        }

    # ETA based on 40 km/h average speed in urban/industrial emergency lane + 2 min mobilization
    eta = round(2.0 + (min_dist / 40.0) * 60.0)
    eta = max(3, eta)

    st_lat = float(nearest.get("lat", lat))
    st_lon = float(nearest.get("lon", lon))
    city = nearest.get("city", "District").lower()
    clean_city = city.replace(" ", "-")

    return {
        "name": nearest.get("name", "District Fire Station"),
        "distance_km": round(min_dist, 2),
        "eta_minutes": eta,
        "coordinates": {"lat": st_lat, "lon": st_lon},
        "contact": {
            "phone": f"{nearest.get('phone', '+91-101')} (simulated)",
            "email": f"control@{clean_city}-fire.gov.in (simulated)",
            "radio": "CHANNEL-14",
        },
        "capabilities": ["Water tender (3x)", "AFFF Foam unit (2x)", "Hydraulic Rescue unit", "Thermal imaging camera"],
        "city": nearest.get("city", ""),
        "state": nearest.get("state", ""),
    }


def find_backup_fire_station(lat: float, lon: float, exclude_name: Optional[str] = None) -> dict[str, Any]:
    """Find secondary backup fire station for mutual-aid support."""
    stations = load_fire_stations()
    backup = None
    min_dist = float("inf")

    for st in stations:
        name = st.get("name", "")
        if exclude_name and name == exclude_name:
            continue
        st_lat = float(st.get("lat", 0.0))
        st_lon = float(st.get("lon", 0.0))
        dist = haversine_distance_km(lat, lon, st_lat, st_lon)
        if dist < min_dist:
            min_dist = dist
            backup = st

    if not backup:
        return find_nearest_fire_station(lat + 0.08, lon + 0.08)

    st_lat = float(backup.get("lat", lat))
    st_lon = float(backup.get("lon", lon))
    eta = round(3.0 + (min_dist / 40.0) * 60.0)

    return {
        "name": backup.get("name", "Regional Backup Unit"),
        "distance_km": round(min_dist, 2),
        "eta_minutes": max(6, eta),
        "coordinates": {"lat": st_lat, "lon": st_lon},
        "contact": {
            "phone": f"{backup.get('phone', '+91-101')} (simulated)",
            "email": "backup@fire.gov.in (simulated)",
            "radio": "CHANNEL-18 (TACTICAL RELAY)",
        },
        "capabilities": ["Heavy Foam Bowsers", "Emergency Hazmat Unit"],
    }


def find_nearest_hospital(lat: float, lon: float) -> dict[str, Any]:
    """Identify the nearest major hospital or trauma center with readiness status."""
    hospitals = load_hospitals()
    if not hospitals:
        return {
            "name": "District Civil Hospital & Trauma Centre",
            "distance_km": 5.2,
            "eta_minutes": 8,
            "coordinates": {"lat": lat + 0.04, "lon": lon + 0.04},
            "contact": {"phone": "+91-108", "email": "emergency@hosp.gov.in"},
            "trauma_center": True,
            "capacity": {"total_beds": 500, "burn_unit_beds": 20, "icu_beds": 40},
            "readiness": "ACTIVE_STANDBY",
        }

    nearest = None
    min_dist = float("inf")

    for h in hospitals:
        h_lat = float(h.get("lat", 0.0))
        h_lon = float(h.get("lon", 0.0))
        dist = haversine_distance_km(lat, lon, h_lat, h_lon)
        if dist < min_dist:
            min_dist = dist
            nearest = h

    if nearest is None:
        nearest = hospitals[0]
        min_dist = 5.0

    eta = max(4, round(2.0 + (min_dist / 45.0) * 60.0))

    return {
        "id": nearest.get("id", "HOSP-01"),
        "name": nearest.get("name", "District Civil Hospital"),
        "distance_km": round(min_dist, 2),
        "eta_minutes": eta,
        "coordinates": {"lat": nearest.get("lat"), "lon": nearest.get("lon")},
        "contact": {
            "phone": nearest.get("phone", "+91-108"),
            "emergency_hotline": nearest.get("emergency_hotline", "108"),
            "email": f"trauma-desk@{nearest.get('city', 'civil').lower()}-health.gov.in",
        },
        "trauma_center": nearest.get("trauma_center", True),
        "capacity": nearest.get("capacity", {"total_beds": 500, "burn_unit_beds": 20, "icu_beds": 40}),
        "readiness": nearest.get("readiness", "ACTIVE_STANDBY"),
    }


def simulate_dispatch(
    fire_id: Any = None,
    station_id: Optional[Any] = None,
    fire_data: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """
    Execute end-to-end automated emergency dispatch workflow.
    Simulates sending SMS, Email, Radio, WhatsApp, logs to database,
    and returns full dispatch confirmation record.
    """
    # 1. Resolve fire coordinates and metadata
    lat = 21.1702
    lon = 72.8311
    category = "EMERGENCY_INDUSTRIAL"
    frp = 145.0
    facility_name = "Surat GIDC Chemical Processing Cluster"
    detection_id = None

    if fire_data:
        lat = float(fire_data.get("latitude") or fire_data.get("lat") or lat)
        lon = float(fire_data.get("longitude") or fire_data.get("lon") or lon)
        category = fire_data.get("category") or category
        frp = float(fire_data.get("frp") or frp)
        facility_name = (
            fire_data.get("facility_name")
            or fire_data.get("nearest_facility")
            or facility_name
        )
        detection_id = fire_data.get("id") or fire_data.get("detection_id")
    elif fire_id is not None:
        try:
            with get_connection() as conn:
                row = conn.execute(
                    """SELECT d.id, d.latitude, d.longitude, d.classification, d.frp
                       FROM detections d WHERE d.id = ?
                       UNION
                       SELECT a.id, d.latitude, d.longitude, d.classification, d.frp
                       FROM alerts a JOIN detections d ON a.detection_id = d.id WHERE a.id = ?""",
                    (fire_id, fire_id),
                ).fetchone()
                if row:
                    lat = float(row["latitude"])
                    lon = float(row["longitude"])
                    category = row["classification"] or category
                    frp = float(row["frp"] or frp)
                    detection_id = row["id"]
        except Exception:
            pass

    # 2. Identify primary and backup fire stations
    primary_station = find_nearest_fire_station(lat, lon)
    backup_station = find_backup_fire_station(lat, lon, primary_station.get("name"))

    # 3. Identify nearest hospital
    nearest_hospital = find_nearest_hospital(lat, lon)

    # 4. Load knowledge base response protocol
    protocols = load_response_protocols()
    protocol = protocols.get(category, protocols.get("EMERGENCY_INDUSTRIAL", {}))

    recommended_equipment = protocol.get("equipment_required") or protocol.get(
        "equipment", ["Water tenders (2x)", "AFFF Foam unit", "Breathing apparatus", "Thermal cameras"]
    )
    safety_advisories = [
        f"Establish {protocol.get('safety_distance_m', 500)}m civilian evacuation perimeter.",
        f"Primary extinguishing agent: {', '.join(protocol.get('use_agents', {}).get('primary', ['AFFF Foam', 'Dry Chemical']))}.",
    ]
    if protocol.get("avoid"):
        safety_advisories.append(f"WARNING: Avoid {'; '.join(protocol.get('avoid', []))}")

    # 5. Broadcast simulated multi-channel notifications
    fire_dict = {
        "id": detection_id or fire_id or 101,
        "latitude": lat,
        "longitude": lon,
        "category": category,
        "frp": frp,
        "facility_name": facility_name,
    }
    channel_delivery = send_multi_channel_alert(fire_dict, primary_station, nearest_hospital)

    # 6. Generate official dispatch confirmation ID
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    unique_seq = f"{abs(hash(str(uuid.uuid4()))) % 900 + 100:03d}"
    dispatch_id = f"DSP-{today_str}-{unique_seq}"
    timestamp = datetime.utcnow().isoformat() + "Z"

    first_eta = primary_station.get("eta_minutes", 6)
    full_deployment_eta = first_eta + 7

    confirmation: dict[str, Any] = {
        "dispatch_id": dispatch_id,
        "timestamp": timestamp,
        "fire_location": {"lat": lat, "lon": lon},
        "fire_details": {
            "id": detection_id or fire_id or 101,
            "category": category,
            "frp": frp,
            "facility_name": facility_name,
        },
        "primary_station": primary_station,
        "backup_station": backup_station,
        "hospitals_notified": [nearest_hospital],
        "district_collector_notified": True,
        "ndma_notified": True,
        "recommended_equipment": recommended_equipment,
        "safety_advisories": safety_advisories,
        "estimated_response": {
            "first_responder_eta_min": first_eta,
            "full_deployment_eta_min": full_deployment_eta,
        },
        "status": "DISPATCHED",
        "channels_delivery": channel_delivery,
        "simulation_disclaimer": "⚠️ SIMULATION MODE - In production deployment, this would send real notifications via Twilio SMS, SendGrid Email, and government communication systems.",
    }

    # 7. Persist record to database
    try:
        db_record = {
            "dispatch_id": dispatch_id,
            "fire_lat": lat,
            "fire_lon": lon,
            "fire_category": category,
            "station_name": primary_station.get("name", "Surat Fire Station"),
            "station_dist_km": primary_station.get("distance_km", 3.2),
            "eta_minutes": first_eta,
            "recommended_equipment": ", ".join(recommended_equipment[:3]),
            "sent_to": "Fire Station, District Collector, NDMA, Hospital",
            "status": "DISPATCHED",
        }
        insert_dispatch_log(db_record)
    except Exception as exc:
        print(f"[DISPATCH] Database insert warning: {exc}")

    return confirmation


def get_dispatch_history(hours: int = 24, limit: int = 50) -> list[dict[str, Any]]:
    """Retrieve recent dispatch records sorted chronologically."""
    return get_recent_dispatches(limit=limit)
