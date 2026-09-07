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
    """Create 250 realistic pre-classified fires across India."""
    random.seed(42)  # Deterministic seed for reproducible evaluation
    today = datetime.utcnow().strftime("%Y-%m-%d")
    fires: list[dict[str, Any]] = []

    # 1. 5 EMERGENCY_INDUSTRIAL (color red)
    emergencies = [
        {"name": "Surat Chemical GIDC", "lat": 21.17, "lon": 72.83, "frp": 165.4},
        {"name": "Vapi Chemical Estate", "lat": 20.37, "lon": 72.90, "frp": 142.8},
        {"name": "Ankleshwar Petrochemical Complex", "lat": 21.63, "lon": 73.00, "frp": 188.2},
        {"name": "Vizag Industrial Corridor", "lat": 17.68, "lon": 83.22, "frp": 125.6},
        {"name": "Kolkata Industrial Estate", "lat": 22.57, "lon": 88.36, "frp": 98.5},
    ]
    for em in emergencies:
        lat = round(em["lat"] + random.uniform(-0.01, 0.01), 4)
        lon = round(em["lon"] + random.uniform(-0.01, 0.01), 4)
        brightness = round(random.uniform(365.0, 398.5), 1)
        frp = round(random.uniform(85.0, 195.0), 1)
        acq_time = _format_time(random.randint(6, 17), random.randint(0, 59))
        fires.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": "high",
            "confidence_score": round(random.uniform(92.0, 98.5), 1),
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": acq_time,
            "daynight": "D",
            "category": "EMERGENCY_INDUSTRIAL",
            "risk_level": "CRITICAL",
            "color": "#ff3b3b",
            "reason": f"Active thermal anomaly detected at major industrial site ({em['name']}). Sudden FRP spike > 80 MW with high optical flare signature.",
            "action": "Immediate hazmat dispatch protocol recommended. Mobilize chemical foam units and establish 500m safety perimeter.",
        })

    # 2. 50 PERSISTENT_INDUSTRIAL (color yellow)
    hubs = [
        {"name": "Bhilai Steel Plant", "lat": 21.20, "lon": 81.38},
        {"name": "Bokaro Steel City", "lat": 23.79, "lon": 86.14},
        {"name": "Rourkela Steel Plant", "lat": 22.25, "lon": 84.85},
        {"name": "Jamnagar Petrochemical Hub", "lat": 22.35, "lon": 69.07},
        {"name": "Jamshedpur Tata Steel Works", "lat": 22.80, "lon": 86.20},
    ]
    for _ in range(50):
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
            "risk_level": "HIGH",
            "color": "#ffb800",
            "reason": f"Recurring thermal hotspot within {hub['name']} perimeter. Spatial persistence matches scheduled manufacturing blast furnace / coke ovens.",
            "action": "Maintain routine industrial monitoring. Verify flaring activity with plant environmental control room.",
        })

    # 3. 100 AGRICULTURAL_BURNING (color orange)
    # Random across Punjab (30-32N, 74-76E) and Haryana (28-30N, 76-78E)
    for _ in range(100):
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
        frp = round(random.uniform(5.0, 30.0), 1)
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
            "risk_level": "MEDIUM",
            "color": "#ff9500",
            "reason": f"Open field thermal anomaly across {region} agricultural belt. Seasonal stubble burning signature with low FRP (< 30 MW).",
            "action": "Forward hotspot telemetry to State Pollution Control Board and district agriculture officers for field monitoring.",
        })

    # 4. 30 FOREST_FIRE (color green)
    forest_regions = [
        {"name": "Uttarakhand Garhwal Forest", "lat": 30.0, "lon": 79.0},
        {"name": "Himachal Pradesh Pine Reserve", "lat": 32.0, "lon": 77.0},
        {"name": "Odisha Similipal Forests", "lat": 20.5, "lon": 84.0},
    ]
    for _ in range(30):
        f_reg = random.choice(forest_regions)
        lat = round(f_reg["lat"] + random.uniform(-0.4, 0.4), 4)
        lon = round(f_reg["lon"] + random.uniform(-0.4, 0.4), 4)
        brightness = round(random.uniform(320.0, 355.0), 1)
        frp = round(random.uniform(15.0, 80.0), 1)
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
            "risk_level": "HIGH",
            "color": "#00ff9c",
            "reason": f"Wildfire thermal emission inside {f_reg['name']}. Biomass combustion signature surrounded by canopy cover.",
            "action": "Alert State Forest Department and deploy aerial surveillance or forest beat ranger crews.",
        })

    # 5. 65 UNKNOWN (color gray)
    # Scattered across India (8.5 - 34.0 N, 69.0 - 92.0 E)
    for _ in range(65):
        lat = round(random.uniform(11.0, 29.0), 4)
        lon = round(random.uniform(73.0, 86.0), 4)
        brightness = round(random.uniform(300.0, 328.0), 1)
        frp = round(random.uniform(5.0, 40.0), 1)
        acq_time = _format_time(random.randint(0, 23), random.randint(0, 59))
        fires.append({
            "latitude": lat,
            "longitude": lon,
            "brightness": brightness,
            "frp": frp,
            "confidence": "nominal",
            "confidence_score": round(random.uniform(55.0, 72.0), 1),
            "satellite": "VIIRS_SNPP_NRT",
            "acq_date": today,
            "acq_time": acq_time,
            "daynight": "D" if int(acq_time[:2]) in range(6, 18) else "N",
            "category": "UNKNOWN",
            "risk_level": "LOW",
            "color": "#6b7785",
            "reason": "Scattered low-intensity thermal anomaly. Insufficient spatial recurrence or industrial boundary proximity for conclusive classification.",
            "action": "Awaiting subsequent satellite overpass or high-resolution optical verification.",
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
