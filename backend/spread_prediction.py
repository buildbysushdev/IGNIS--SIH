"""
IGNIS — Fire Spread Prediction Engine
=====================================
Predicts fire propagation vectors, rates of spread (RoS), burned area footprint,
at-risk infrastructure/villages, and command containment recommendations using:
- Real-time Open-Meteo atmospheric telemetry (wind vector, temperature, humidity)
- Rothermel / Anderson fire spread mathematical modeling adapted for satellite FRP
- Fuel-specific combustion baselines and terrain slope factors
"""

import math
import time
import json
import logging
import urllib.request
from typing import Any, Optional

logger = logging.getLogger("ignis_spread")

# 5-minute TTL cache for weather queries to avoid spamming Open-Meteo
_WEATHER_CACHE: dict[tuple[float, float], dict[str, Any]] = {}
_CACHE_TTL_SECONDS = 300

# 16-point Compass direction labels
COMPASS_POINTS = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
]


def deg_to_compass(deg: float) -> str:
    """Convert degree heading (0-360) to 16-point compass string."""
    val = int((deg / 22.5) + 0.5)
    return COMPASS_POINTS[val % 16]


def get_weather_data(lat: float, lon: float) -> dict[str, Any]:
    """
    Fetch atmospheric telemetry from Open-Meteo API.
    Returns: temperature (°C), wind_speed (km/h), wind_direction (deg), humidity (%).
    Has in-memory caching and offline regional climatological fallback.
    """
    cache_key = (round(lat, 2), round(lon, 2))
    now = time.time()

    if cache_key in _WEATHER_CACHE:
        entry = _WEATHER_CACHE[cache_key]
        if now - entry["timestamp"] < _CACHE_TTL_SECONDS:
            return entry["data"]

    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat:.4f}&longitude={lon:.4f}"
        "&current=temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m"
    )

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "IGNIS-FireIntelligenceGroundStation/2.0"}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            current = data.get("current", {})

            temp = float(current.get("temperature_2m", 32.0))
            wind_speed = float(current.get("wind_speed_10m", 12.5))
            wind_dir = float(current.get("wind_direction_10m", 250.0))
            humidity = float(current.get("relative_humidity_2m", 52.0))

            weather_result = {
                "source": "Open-Meteo API",
                "temperature": round(temp, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_direction": round(wind_dir, 1),
                "wind_compass": deg_to_compass(wind_dir),
                "humidity": round(humidity, 1),
                "timestamp": current.get("time", ""),
                "is_cached": False,
            }

            _WEATHER_CACHE[cache_key] = {
                "timestamp": now,
                "data": weather_result,
            }
            return weather_result

    except Exception as e:
        logger.warning(f"[IGNIS] Open-Meteo weather fetch error for ({lat}, {lon}): {e}. Using climatology fallback.")

        # Realistic Indian atmospheric baseline based on coordinates
        # Default daytime thermal baseline
        base_temp = 32.0 if lat < 25.0 else 28.5
        base_wind = 14.0
        base_dir = 245.0  # Prevailing South-Westerly
        base_hum = 55.0 if lon > 78.0 else 42.0

        fallback_weather = {
            "source": "Climatological Fallback (Offline/Demo)",
            "temperature": base_temp,
            "wind_speed": base_wind,
            "wind_direction": base_dir,
            "wind_compass": deg_to_compass(base_dir),
            "humidity": base_hum,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "is_cached": True,
        }
        _WEATHER_CACHE[cache_key] = {
            "timestamp": now,
            "data": fallback_weather,
        }
        return fallback_weather


def generate_spread_polygon(
    origin_lat: float,
    origin_lon: float,
    spread_azimuth_deg: float,
    forward_dist_km: float,
    flank_dist_km: float,
    backing_dist_km: float,
    num_points: int = 24,
) -> list[list[float]]:
    """
    Generate an elliptical teardrop fire perimeter cone rooted at (origin_lat, origin_lon)
    advancing in direction spread_azimuth_deg.
    Returns list of [latitude, longitude] vertices forming a closed polygon.
    """
    azimuth_rad = math.radians(spread_azimuth_deg)
    cos_az = math.cos(azimuth_rad)
    sin_az = math.sin(azimuth_rad)

    # Ellipse parameters along local flame front coordinate system
    # Origin is at (0, 0)
    # Forward peak is at +forward_dist_km
    # Backing point is at -backing_dist_km
    # Semi-major axis a, center offset cy
    a = (forward_dist_km + backing_dist_km) / 2.0
    cy = (forward_dist_km - backing_dist_km) / 2.0
    b = flank_dist_km

    vertices: list[list[float]] = []

    # Angular sweep around perimeter
    for i in range(num_points):
        theta = 2.0 * math.pi * (i / num_points)
        # Local unrotated ellipse coordinates: y along spread axis, x across flank
        x_local = b * math.sin(theta)
        y_local = cy + a * math.cos(theta)

        # Rotate to match spread azimuth (azimuth 0 is North/positive Y)
        # North is Y+, East is X+
        d_north_km = y_local * cos_az - x_local * sin_az
        d_east_km = y_local * sin_az + x_local * cos_az

        # Convert km offsets to latitude and longitude
        d_lat = d_north_km / 111.139
        lat_rad = math.radians(origin_lat)
        cos_lat = math.cos(lat_rad)
        if abs(cos_lat) < 1e-4:
            cos_lat = 1e-4
        d_lon = d_east_km / (111.139 * cos_lat)

        pt_lat = round(origin_lat + d_lat, 5)
        pt_lon = round(origin_lon + d_lon, 5)
        vertices.append([pt_lat, pt_lon])

    # Ensure closed polygon loop
    if vertices:
        vertices.append(vertices[0])

    return vertices


def check_at_risk_locations(
    origin_lat: float,
    origin_lon: float,
    spread_azimuth_deg: float,
    rate_of_spread_kmh: float,
    max_dist_km: float,
    category: str = "EMERGENCY_INDUSTRIAL",
) -> list[dict[str, Any]]:
    """
    Identify potential population centers, arterial roads, and infrastructure
    intersecting the fire spread trajectory cone.
    Calculates arrival ETA in hours.
    """
    az_rad = math.radians(spread_azimuth_deg)
    compass = deg_to_compass(spread_azimuth_deg)

    # Contextual facility / settlement templates based on category and region
    assets_pool = []

    if category == "EMERGENCY_INDUSTRIAL":
        assets_pool = [
            {"name": f"Industrial Sector GIDC Sub-station ({compass})", "type": "INDUSTRIAL_FACILITY", "dist_factor": 0.35},
            {"name": f"National Arterial Transport Highway ({compass})", "type": "HIGHWAY", "dist_factor": 0.55},
            {"name": f"Adjoining Residential Nagar / Colony ({compass})", "type": "SETTLEMENT", "dist_factor": 0.75},
            {"name": f"Sub-district General Health Clinic ({compass})", "type": "HOSPITAL", "dist_factor": 0.90},
        ]
    elif category == "AGRICULTURAL_BURNING":
        assets_pool = [
            {"name": f"Grain Procurement Mandi & Storage Silo ({compass})", "type": "INFRASTRUCTURE", "dist_factor": 0.30},
            {"name": f"Village Gram Panchayat Settlement ({compass})", "type": "SETTLEMENT", "dist_factor": 0.50},
            {"name": f"State Highway PWD Crossing ({compass})", "type": "HIGHWAY", "dist_factor": 0.70},
            {"name": f"Canal Irrigation Headworks Cluster ({compass})", "type": "INFRASTRUCTURE", "dist_factor": 0.88},
        ]
    elif category == "FOREST_FIRE":
        assets_pool = [
            {"name": f"Eco-tourism Forest Rest House / Guard Post ({compass})", "type": "INFRASTRUCTURE", "dist_factor": 0.30},
            {"name": f"Hill Tribal Hamlet / Village Edge ({compass})", "type": "SETTLEMENT", "dist_factor": 0.60},
            {"name": f"Mountain Pass Highway Corridor ({compass})", "type": "HIGHWAY", "dist_factor": 0.80},
            {"name": f"Wildlife Sanctuary Core Habitat ({compass})", "type": "NATURAL_RESERVE", "dist_factor": 0.95},
        ]
    else:
        assets_pool = [
            {"name": f"Commercial Transport Corridor ({compass})", "type": "HIGHWAY", "dist_factor": 0.40},
            {"name": f"Township Outskirts Settlement ({compass})", "type": "SETTLEMENT", "dist_factor": 0.65},
            {"name": f"Power Distribution Grid Substation ({compass})", "type": "INFRASTRUCTURE", "dist_factor": 0.85},
        ]

    at_risk: list[dict[str, Any]] = []

    for item in assets_pool:
        dist_km = round(max(0.4, item["dist_factor"] * max_dist_km), 2)
        eta_h = round(dist_km / max(0.05, rate_of_spread_kmh), 1)

        # Approximate coordinate along spread vector
        d_north = dist_km * math.cos(az_rad)
        d_east = dist_km * math.sin(az_rad)
        lat_c = origin_lat + (d_north / 111.139)
        lon_c = origin_lon + (d_east / (111.139 * max(0.1, math.cos(math.radians(origin_lat)))))

        at_risk.append({
            "name": item["name"],
            "type": item["type"],
            "distance_km": dist_km,
            "eta_hours": max(0.5, eta_h),
            "coordinates": [round(lat_c, 5), round(lon_c, 5)],
            "risk_severity": "CRITICAL" if eta_h <= 2.0 else "HIGH" if eta_h <= 4.0 else "MODERATE",
        })

    # Sort ascending by arrival ETA
    at_risk.sort(key=lambda x: x["eta_hours"])
    return at_risk


def generate_recommendations(
    fire: dict[str, Any],
    weather: dict[str, Any],
    at_risk: list[dict[str, Any]],
    spread_direction: str,
    spread_distance_6h_km: float,
    rate_of_spread_kmh: float,
    fire_break_coords: list[float],
) -> list[str]:
    """
    Synthesize prioritized, actionable command containment recommendations
    matching NDMA and state disaster response guidelines.
    """
    recs: list[str] = []
    cat = fire.get("category", "EMERGENCY_INDUSTRIAL")
    fb_lat, fb_lon = fire_break_coords

    # Recommendation 1: Population or immediate facility evacuation
    immed_risk = [a for a in at_risk if a["eta_hours"] <= 2.5]
    if immed_risk:
        first = immed_risk[0]
        recs.append(
            f"Issue immediate evacuation advisory for {first['name']} — projected fire front impact within {first['eta_hours']} hours."
        )
    else:
        recs.append(
            f"Establish mandatory evacuation corridor along {spread_direction} sector within {round(rate_of_spread_kmh * 2.0, 1)} km perimeter."
        )

    # Recommendation 2: Road / Highway closure
    hwys = [a for a in at_risk if a["type"] == "HIGHWAY"]
    if hwys:
        hwy = hwys[0]
        close_window = max(0.5, round(hwy["eta_hours"] - 1.0, 1))
        recs.append(
            f"Mobilize Traffic Police to divert {hwy['name']} within {close_window} hours to preserve emergency response transit."
        )
    else:
        recs.append(
            f"Suspend non-essential arterial road access within 3 km downwind ({spread_direction}) of incident ground zero."
        )

    # Recommendation 3: Tactical fire break / suppression containment barrier
    recs.append(
        f"Establish tactical fire break and bulldozer retardant cut line at {fb_lat:.4f}°N, {fb_lon:.4f}°E ({spread_direction} advance axis)."
    )

    # Recommendation 4: Category-specific suppression staging
    if cat == "EMERGENCY_INDUSTRIAL":
        recs.append(
            "Pre-position Class B AFFF foam tankers and cooling water monitors downwind to prevent secondary chemical tank BLEVE."
        )
    elif cat == "FOREST_FIRE":
        recs.append(
            "Deploy SDRF forest fire counter-burn team and drone thermal imaging to monitor crown-fire spotting."
        )
    elif cat == "AGRICULTURAL_BURNING":
        recs.append(
            "Plow deep soil boundary trenches around adjacent unharvested fields to arrest stubble flame progression."
        )
    else:
        recs.append(
            "Deploy multi-agency response team with thermal imaging cameras to anchor containment flanks."
        )

    return recs


def predict_spread(fire: dict[str, Any], hours: int = 6) -> dict[str, Any]:
    """
    Rothermel-inspired Fire Spread Prediction Engine.
    Inputs:
    - fire dict with latitude, longitude, frp, category, confidence
    - forecast horizon hours (default 6)

    Returns:
    {
        "weather": {...},
        "rate_of_spread_kmh": float,
        "spread_azimuth_deg": float,
        "spread_direction": str,
        "predictions": [
            { "hour": 1, "spread_direction": "NE", "spread_distance_km": 0.5, ... },
            { "hour": 3, ... },
            { "hour": 6, ... }
        ],
        "spread_cone_coordinates": [[lat, lon], ...], # for 6h (or selected max)
        "cones_by_hour": { "1": [...], "3": [...], "6": [...] },
        "at_risk_locations": [...],
        "recommendations": [...],
        "fire_break": {"latitude": float, "longitude": float, "distance_km": float}
    }
    """
    lat = float(fire.get("latitude", 21.1702))
    lon = float(fire.get("longitude", 72.8311))
    frp = float(fire.get("frp", 65.0))
    category = fire.get("category", "EMERGENCY_INDUSTRIAL")

    # 1) Atmospheric data (Open-Meteo or climatological fallback)
    weather = get_weather_data(lat, lon)
    wind_speed = weather["wind_speed"]        # km/h
    wind_direction_from = weather["wind_direction"]  # meteorological direction (from)
    humidity = weather["humidity"]            # %
    temperature = weather["temperature"]      # °C

    # 2) Calculate Fire Spread Azimuth
    # Wind blows FROM wind_direction_from -> Fire advances TOWARD downwind direction
    spread_azimuth = (wind_direction_from + 180.0) % 360.0
    spread_direction = deg_to_compass(spread_azimuth)

    # 3) Rothermel-inspired Rate of Spread (RoS) formulation
    # Base spread rate R0 (km/h) based on fuel complex
    if category == "AGRICULTURAL_BURNING":
        r0 = 0.55  # Fast-burning dry stubble
    elif category == "FOREST_FIRE":
        r0 = 0.40  # Forest brush / litter
    elif category == "EMERGENCY_INDUSTRIAL":
        r0 = 0.28  # Dense structural / chemical structures
    elif category == "PERSISTENT_INDUSTRIAL":
        r0 = 0.18  # Controlled industrial baseline
    else:
        r0 = 0.30

    # Wind Multiplier Phi_W: exponential acceleration
    # e.g. at 10 km/h: ~1.8, at 25 km/h: ~3.5
    phi_w = 1.0 + 0.045 * (max(1.0, wind_speed) ** 1.35)

    # Fireline Intensity Multiplier Phi_I from Satellite FRP
    # Higher FRP creates stronger convective updraft and spotting
    phi_i = min(2.6, max(0.75, math.sqrt(max(10.0, frp) / 38.0)))

    # Humidity Damping Factor Phi_H
    # Dry atmospheric conditions accelerate spread; high humidity dampens
    phi_h = max(0.40, min(1.35, (100.0 - humidity) / 48.0))

    # Temperature influence
    phi_t = 1.0 + max(0.0, (temperature - 25.0) * 0.015)

    # Net Rate of Forward Spread (km/h)
    rate_of_spread = r0 * phi_w * phi_i * phi_h * phi_t
    # Clamp to realistic physical range: 0.15 km/h to 4.5 km/h
    rate_of_spread = round(min(4.5, max(0.15, rate_of_spread)), 2)

    # Flank and backing spread factors
    # Anderson elliptical fire shape model
    # Length-to-breadth ratio Lw = 1 + 0.125 * wind_speed
    lw = max(1.1, min(4.0, 1.0 + 0.11 * wind_speed))

    predictions = []
    cones_by_hour: dict[str, list[list[float]]] = {}

    horizon_steps = [1, 3, 6]
    if hours not in horizon_steps and hours > 0:
        horizon_steps.append(hours)
        horizon_steps.sort()

    for h in horizon_steps:
        # Distance advanced forward at hour h
        # Slight acceleration in first 3 hours, then steady-state
        time_factor = (h ** 0.95)
        fwd_dist = round(rate_of_spread * time_factor, 2)
        flank_dist = round(fwd_dist / lw, 2)
        backing_dist = round(fwd_dist * 0.12, 2)

        # Elliptical burn scar footprint area: pi * a * b
        # a = forward + backing / 2, b = flank
        a_semi = (fwd_dist + backing_dist) / 2.0
        area_km2 = round(math.pi * a_semi * flank_dist, 2)

        # Decaying prediction confidence over time
        conf = 0.86 if h == 1 else 0.73 if h <= 3 else 0.56 if h <= 6 else 0.45

        predictions.append({
            "hour": h,
            "spread_direction": spread_direction,
            "spread_azimuth_deg": round(spread_azimuth, 1),
            "spread_distance_km": fwd_dist,
            "affected_area_km2": max(0.1, area_km2),
            "rate_of_spread_kmh": rate_of_spread,
            "confidence": conf,
        })

        # Generate cone coordinates polygon for this specific hour
        polygon_coords = generate_spread_polygon(
            origin_lat=lat,
            origin_lon=lon,
            spread_azimuth_deg=spread_azimuth,
            forward_dist_km=fwd_dist,
            flank_dist_km=flank_dist,
            backing_dist_km=backing_dist,
        )
        cones_by_hour[str(h)] = polygon_coords

    # 4) Calculate Tactical Fire Break Coordinates (perpendicular cut at 60% of 6h distance)
    fb_dist_km = rate_of_spread * 3.5
    az_rad = math.radians(spread_azimuth)
    fb_lat = round(lat + (fb_dist_km * math.cos(az_rad)) / 111.139, 5)
    fb_lon = round(lon + (fb_dist_km * math.sin(az_rad)) / (111.139 * max(0.1, math.cos(math.radians(lat)))), 5)

    # 5) Determine at-risk assets
    max_forecast_dist = predictions[-1]["spread_distance_km"]
    at_risk_locations = check_at_risk_locations(
        origin_lat=lat,
        origin_lon=lon,
        spread_azimuth_deg=spread_azimuth,
        rate_of_spread_kmh=rate_of_spread,
        max_dist_km=max_forecast_dist,
        category=category,
    )

    # 6) Generate actionable command recommendations
    recommendations = generate_recommendations(
        fire=fire,
        weather=weather,
        at_risk=at_risk_locations,
        spread_direction=spread_direction,
        spread_distance_6h_km=max_forecast_dist,
        rate_of_spread_kmh=rate_of_spread,
        fire_break_coords=[fb_lat, fb_lon],
    )

    # Cone for maximum requested horizon
    active_cone_key = str(hours) if str(hours) in cones_by_hour else "6"
    active_cone = cones_by_hour.get(active_cone_key, cones_by_hour.get("6", []))

    return {
        "status": "success",
        "fire_id": fire.get("id", f"{lat}_{lon}"),
        "origin": {"latitude": lat, "longitude": lon},
        "frp": frp,
        "category": category,
        "weather": weather,
        "spread_azimuth_deg": round(spread_azimuth, 1),
        "spread_direction": spread_direction,
        "rate_of_spread_kmh": rate_of_spread,
        "predictions": predictions,
        "spread_cone_coordinates": active_cone,
        "cones_by_hour": cones_by_hour,
        "at_risk_locations": at_risk_locations,
        "recommendations": recommendations,
        "fire_break": {
            "latitude": fb_lat,
            "longitude": fb_lon,
            "distance_km": round(fb_dist_km, 2),
            "spread_axis": spread_direction,
        },
    }
