"""
IGNIS — Demonstration Telemetry Generator & Loader
Generates 250 realistic pre-classified fires for offline demonstration:
- 5 EMERGENCY_INDUSTRIAL (red)
- 50 PERSISTENT_INDUSTRIAL (yellow)
- 100 AGRICULTURAL_BURNING (orange)
- 30 FOREST_FIRE (green)
- 65 UNKNOWN (gray)
"""

import os
import json
import random
from datetime import datetime
from pathlib import Path
from typing import Any

from config import CACHE_DIR, BASE_DIR

DEMO_FILE_PRIMARY = Path(CACHE_DIR) / "demo_fires.json"
DEMO_FILE_ROOT = BASE_DIR.parent / "cache" / "demo_fires.json"


def _format_time(hh: int, mm: int) -> str:
    return f"{hh:02d}{mm:02d}"


def generate_demo_fires() -> list[dict[str, Any]]:
    """Create 250 realistic pre-classified fires across India including urban all-hazard risks."""
    random.seed(42)  # Deterministic seed for reproducible evaluation
    today = datetime.utcnow().strftime("%Y-%m-%d")
    fires: list[dict[str, Any]] = []

    # 1. CRITICAL EMERGENCIES (Urban Life-Critical + Factory Explosions)
    critical_anchors = [
        # AIIMS Delhi Hospital Fire
        {
            "id": "IGNIS-EM-0002",
            "name": "AIIMS New Delhi Area",
            "lat": 28.5672,
            "lon": 77.2100,
            "frp": 18.5,
            "brightness": 345.2,
            "category": "HOSPITAL_FIRE",
            "location_type": "HOSPITAL",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "CRITICAL: Active thermal anomaly inside/adjacent to Hospital facility (AIIMS New Delhi Area). High patient casualty risk.",
            "action": "🚨 IMMEDIATE DISPATCH! Notify ICU Triage, Medical Evacuation, and District Collector.",
        },
        # Jamnagar Fuel Station / Depot Fire
        {
            "id": "IGNIS-EM-0003",
            "name": "Jamnagar Fuel Station & Depot",
            "lat": 22.4700,
            "lon": 70.0500,
            "frp": 24.2,
            "brightness": 365.8,
            "category": "FUEL_STATION_FIRE",
            "location_type": "PETROL_PUMP",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "CRITICAL: Fire near fuel storage / petrol pump (Jamnagar Fuel Station & Depot). BLEVE & Explosion hazard.",
            "action": "🚨 FOAM TENDERS ONLY! DO NOT USE WATER. Evacuate 500m perimeter immediately.",
        },
        # Delhi Public School Fire
        {
            "id": "IGNIS-EM-0004",
            "name": "Delhi Public School RK Puram",
            "lat": 28.5665,
            "lon": 77.1780,
            "frp": 16.4,
            "brightness": 338.4,
            "category": "SCHOOL_FIRE",
            "location_type": "SCHOOL",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "CRITICAL: Thermal anomaly at educational institution (Delhi Public School RK Puram) during operational/occupancy window.",
            "action": "🚨 DISPATCH FIRE TENDERS & AMBULANCES. Coordinate student assembly point evacuation.",
        },
        # Dharavi Dense Urban Settlement Fire
        {
            "id": "IGNIS-EM-0005",
            "name": "Dharavi Dense Urban Settlement Mumbai",
            "lat": 19.0434,
            "lon": 72.8562,
            "frp": 28.5,
            "brightness": 352.0,
            "category": "SLUM_DENSE_URBAN_FIRE",
            "location_type": "SLUM",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "CRITICAL: High-density urban settlement fire (Dharavi Dense Urban Settlement Mumbai). Extreme risk of rapid lateral spread.",
            "action": "🚨 MASS DISPATCH! Narrow-lane access units required. Broadcast SMS evacuation alert.",
        },
        # Surat Chemical Cluster GIDC (Primary Presentation Anchor)
        {
            "id": "IGNIS-EM-0001",
            "name": "Surat Chemical Cluster GIDC",
            "lat": 21.1700,
            "lon": 72.8300,
            "frp": 48.6,
            "brightness": 384.5,
            "category": "EMERGENCY_INDUSTRIAL",
            "location_type": "INDUSTRIAL",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "Unscheduled thermal surge (48.6MW) within 1.2km of Surat Chemical Cluster GIDC with no historical baseline. High emergency risk.",
            "action": "🚨 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
        },
        # Vapi Chemical Estate
        {
            "id": "IGNIS-EM-0006",
            "name": "Vapi Chemical Estate Complex",
            "lat": 20.3700,
            "lon": 72.9000,
            "frp": 142.8,
            "brightness": 388.0,
            "category": "EMERGENCY_INDUSTRIAL",
            "location_type": "INDUSTRIAL",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "Active chemical explosion and flare-up at Vapi Chemical Estate Complex.",
            "action": "🚨 DISPATCH HAZMAT & FOAM TENDERS. Contact plant safety officer.",
        },
        # Ankleshwar Petrochemical Complex
        {
            "id": "IGNIS-EM-0007",
            "name": "Ankleshwar Petrochemical Complex",
            "lat": 21.6300,
            "lon": 73.0000,
            "frp": 188.2,
            "brightness": 395.2,
            "category": "EMERGENCY_INDUSTRIAL",
            "location_type": "INDUSTRIAL",
            "risk_level": "CRITICAL",
            "color": "#EF4444",
            "reason": "Sudden high-intensity industrial fire at factory complex (Ankleshwar Petrochemical Complex).",
            "action": "🚨 DISPATCH HAZMAT & FOAM TENDERS. Contact plant safety officer.",
        },
    ]

    for em in critical_anchors:
        fires.append({
            "id": em.get("id"),
            "latitude": em["lat"],
            "longitude": em["lon"],
            "brightness": em["brightness"],
            "frp": em["frp"],
            "confidence": "high",
            "confidence_score": 96.0,
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": "1230",
            "daynight": "D",
            "category": em["category"],
            "location_type": em.get("location_type", "GENERAL"),
            "risk_level": em["risk_level"],
            "color": em["color"],
            "facility_name": em["name"],
            "reason": em["reason"],
            "action": em["action"],
        })

    # 2. HIGH-RISK URBAN STRUCTURE & COMMERCIAL FIRES (Orange)
    high_risk_anchors = [
        # MG Road Bangalore Restaurant
        {
            "id": "IGNIS-HR-0001",
            "name": "MG Road Restaurant & Kitchen Hub Bangalore",
            "lat": 12.9750,
            "lon": 77.6050,
            "frp": 14.8,
            "brightness": 335.4,
            "category": "RESTAURANT_KITCHEN_FIRE",
            "location_type": "RESTAURANT",
            "risk_level": "HIGH",
            "color": "#F97316",
            "reason": "HIGH RISK: Commercial kitchen fire (MG Road Restaurant Hub). High probability of LPG cylinder involvement.",
            "action": "DISPATCH FOAM & CO2 UNITS. Isolate commercial LPG valves immediately.",
        },
        # Chandni Chowk Wholesale Market Delhi
        {
            "id": "IGNIS-HR-0002",
            "name": "Chandni Chowk Wholesale Market Delhi",
            "lat": 28.6505,
            "lon": 77.2303,
            "frp": 21.4,
            "brightness": 348.0,
            "category": "COMMERCIAL_MARKET_FIRE",
            "location_type": "MARKET",
            "risk_level": "HIGH",
            "color": "#F97316",
            "reason": "HIGH RISK: Fire in commercial marketplace (Chandni Chowk Wholesale Market). High combustible fuel load (textiles/plastics).",
            "action": "DISPATCH WATER TENDERS & CROWD CONTROL. Isolate power grid sector.",
        },
        # Kothrud Residential Structure Pune
        {
            "id": "IGNIS-HR-0003",
            "name": "Kothrud Residential Township Pune",
            "lat": 18.5074,
            "lon": 73.8077,
            "frp": 19.2,
            "brightness": 342.1,
            "category": "RESIDENTIAL_STRUCTURE_FIRE",
            "location_type": "RESIDENTIAL",
            "risk_level": "HIGH",
            "color": "#F97316",
            "reason": "HIGH RISK: Expanding structure fire in residential building/apartments (Kothrud Residential Township Pune).",
            "action": "DISPATCH FIRE SERVICES. Search & rescue team for smoke inhalation.",
        },
    ]

    for hr in high_risk_anchors:
        fires.append({
            "id": hr.get("id"),
            "latitude": hr["lat"],
            "longitude": hr["lon"],
            "brightness": hr["brightness"],
            "frp": hr["frp"],
            "confidence": "high",
            "confidence_score": 91.0,
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": "1345",
            "daynight": "D",
            "category": hr["category"],
            "location_type": hr["location_type"],
            "risk_level": hr["risk_level"],
            "color": hr["color"],
            "facility_name": hr["name"],
            "reason": hr["reason"],
            "action": hr["action"],
        })

    # 3. 40 PERSISTENT_INDUSTRIAL (color yellow / gold)
    # Presentation Anchor: Bhilai Steel Plant
    fires.append({
        "id": "IGNIS-PI-0001",
        "latitude": 21.2000,
        "longitude": 81.3800,
        "brightness": 358.4,
        "frp": 110.0,
        "confidence": "high",
        "confidence_score": 94.0,
        "satellite": "VIIRS_SNPP_NRT",
        "acq_date": today,
        "acq_time": "0915",
        "daynight": "D",
        "category": "PERSISTENT_INDUSTRIAL",
        "location_type": "INDUSTRIAL",
        "risk_level": "LOW",
        "color": "#F59E0B",
        "facility_name": "Bhilai Steel Plant",
        "reason": "Known factory thermal source (persistent 88% of past 30 days). Normal manufacturing operations.",
        "action": "Routine monitoring. Normal manufacturing operations.",
    })

    hubs = [
        {"name": "Bhilai Steel Plant", "lat": 21.20, "lon": 81.38},
        {"name": "Bokaro Steel City", "lat": 23.79, "lon": 86.14},
        {"name": "Rourkela Steel Plant", "lat": 22.25, "lon": 84.85},
        {"name": "Jamnagar Petrochemical Hub", "lat": 22.35, "lon": 69.07},
        {"name": "Jamshedpur Tata Steel Works", "lat": 22.80, "lon": 86.20},
    ]
    for _ in range(39):
        hub = random.choice(hubs)
        offset_lat = random.uniform(-0.05, 0.05)
        offset_lon = random.uniform(-0.05, 0.05)
        lat = round(hub["lat"] + offset_lat, 4)
        lon = round(hub["lon"] + offset_lon, 4)
        brightness = round(random.uniform(330.0, 375.0), 1)
        frp = round(random.uniform(100.0, 295.0), 1)
        acq_time = _format_time(random.randint(0, 23), random.randint(0, 59))
        fires.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": random.choice(["high", "nominal"]),
            "confidence_score": round(random.uniform(84.0, 94.0), 1),
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": acq_time,
            "daynight": "D" if int(acq_time[:2]) in range(6, 18) else "N",
            "category": "PERSISTENT_INDUSTRIAL",
            "location_type": "INDUSTRIAL",
            "risk_level": "LOW",
            "color": "#F59E0B",
            "reason": f"Recurring thermal hotspot within {hub['name']} perimeter. Spatial persistence matches scheduled manufacturing blast furnace / coke ovens.",
            "action": "Maintain routine industrial monitoring. Verify flaring activity with plant environmental control room.",
        })

    # 4. 85 AGRICULTURAL_BURNING (color orange / blue)
    # Distributed across Punjab and Haryana agricultural belts
    for _ in range(85):
        in_punjab = random.random() < 0.65
        if in_punjab:
            lat = round(random.uniform(30.0, 32.0), 4)
            lon = round(random.uniform(74.0, 76.0), 4)
            region = "Punjab"
        else:
            lat = round(random.uniform(28.0, 30.0), 4)
            lon = round(random.uniform(76.0, 78.0), 4)
            region = "Haryana"

        brightness = round(random.uniform(305.0, 335.0), 1)
        frp = round(random.uniform(8.0, 32.0), 1)
        acq_time = _format_time(random.randint(10, 16), random.randint(0, 59))
        fires.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": random.choice(["nominal", "high"]),
            "confidence_score": round(random.uniform(75.0, 89.0), 1),
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": acq_time,
            "daynight": "D",
            "category": "AGRICULTURAL_BURNING",
            "location_type": "FARMLAND",
            "risk_level": "MODERATE",
            "color": "#3B82F6",
            "reason": f"Open field thermal anomaly across {region} agricultural belt. Seasonal stubble burning signature with low FRP (< 35 MW).",
            "action": "Forward hotspot telemetry to State Pollution Control Board and district agriculture officers for field monitoring.",
        })

    # 5. 25 FOREST_FIRE (color green)
    forest_regions = [
        {"name": "Uttarakhand Garhwal Forest", "lat": 30.0, "lon": 79.0},
        {"name": "Himachal Pradesh Pine Reserve", "lat": 32.0, "lon": 77.0},
        {"name": "Odisha Similipal Forests", "lat": 20.5, "lon": 84.0},
    ]
    for _ in range(25):
        f_reg = random.choice(forest_regions)
        lat = round(f_reg["lat"] + random.uniform(-0.4, 0.4), 4)
        lon = round(f_reg["lon"] + random.uniform(-0.4, 0.4), 4)
        brightness = round(random.uniform(320.0, 355.0), 1)
        frp = round(random.uniform(16.0, 80.0), 1)
        acq_time = _format_time(random.randint(8, 18), random.randint(0, 59))
        fires.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": "high",
            "confidence_score": round(random.uniform(82.0, 93.0), 1),
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": acq_time,
            "daynight": "D",
            "category": "FOREST_FIRE",
            "location_type": "FOREST",
            "risk_level": "HIGH",
            "color": "#22C55E",
            "reason": f"Wildfire thermal emission inside {f_reg['name']}. Biomass combustion signature surrounded by canopy cover.",
            "action": "Alert State Forest Department and deploy aerial surveillance or forest beat ranger crews.",
        })

    # 6. 90 DOMESTIC_LOW_INTENSITY_BURN & UNCLASSIFIED (color slate / gray - Suppressed)
    # Presentation Anchor: Bonfire / Garbage Clearing Pune
    fires.append({
        "id": "IGNIS-DM-0001",
        "latitude": 18.5200,
        "longitude": 73.8500,
        "brightness": 308.2,
        "frp": 6.5,
        "confidence": "nominal",
        "confidence_score": 88.0,
        "satellite": "VIIRS_SNPP_NRT",
        "acq_date": today,
        "acq_time": "2030",
        "daynight": "N",
        "category": "DOMESTIC_LOW_INTENSITY_BURN",
        "location_type": "RESIDENTIAL",
        "risk_level": "VERY_LOW",
        "color": "#94A3B8",
        "facility_name": "Residential Colony Deccan Pune",
        "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
        "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
    })

    for _ in range(89):
        lat = round(random.uniform(11.0, 29.0), 4)
        lon = round(random.uniform(73.0, 86.0), 4)
        brightness = round(random.uniform(300.0, 318.0), 1)
        frp = round(random.uniform(4.0, 9.5), 1)
        acq_time = _format_time(random.randint(0, 23), random.randint(0, 59))
        fires.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": "nominal",
            "confidence_score": round(random.uniform(70.0, 85.0), 1),
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": acq_time,
            "daynight": "D" if int(acq_time[:2]) in range(6, 18) else "N",
            "category": "DOMESTIC_LOW_INTENSITY_BURN",
            "location_type": "RESIDENTIAL",
            "risk_level": "VERY_LOW",
            "color": "#94A3B8",
            "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or cooking burn.",
            "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
        })

    # Save to primary and root cache files
    try:
        DEMO_FILE_PRIMARY.parent.mkdir(parents=True, exist_ok=True)
        with open(DEMO_FILE_PRIMARY, "w", encoding="utf-8") as f:
            json.dump(fires, f, indent=2)
    except Exception as e:
        print(f"[DEMO_DATA] Note: Could not write primary demo file: {e}")

    try:
        if DEMO_FILE_ROOT.parent.exists():
            with open(DEMO_FILE_ROOT, "w", encoding="utf-8") as f:
                json.dump(fires, f, indent=2)
    except Exception:
        pass

    return fires


def load_demo_fires() -> list[dict[str, Any]]:
    """Load preloaded demo fires from cache, or generate if missing."""
    for path in [DEMO_FILE_PRIMARY, DEMO_FILE_ROOT]:
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list) and len(data) >= 200:
                        return data
            except Exception:
                continue

    return generate_demo_fires()
