"""
IGNIS :: Weather Service
Integrates directly with Open-Meteo Weather API for real-time atmospheric telemetry.
Includes 10-minute coordinate cache and transparent climatological fallback.
"""

import time
import json
import logging
import urllib.request
from typing import Any, Optional

logger = logging.getLogger("ignis_weather_service")

_WEATHER_CACHE: dict[tuple[float, float], dict[str, Any]] = {}
_CACHE_TTL_SECONDS = 600  # 10 minutes cache per coordinate grid


def deg_to_compass(num: float) -> str:
    """Convert meteorological azimuth degrees to 16-point compass heading."""
    val = int((num / 22.5) + 0.5)
    arr = [
        "N", "NNE", "NE", "ENE",
        "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"
    ]
    return arr[(val % 16)]


def get_current_weather(lat: float, lon: float) -> dict[str, Any]:
    """
    Fetch live atmospheric telemetry from Open-Meteo API.
    Parameters:
        lat: latitude (-90.0 to 90.0)
        lon: longitude (-180.0 to 180.0)
    Returns:
        dict containing temperature (°C), relative humidity (%), wind speed (km/h),
        wind direction (deg), compass string, timestamp, and source tag.
    """
    cache_key = (round(lat, 2), round(lon, 2))
    now = time.time()

    if cache_key in _WEATHER_CACHE:
        entry = _WEATHER_CACHE[cache_key]
        if now - entry["timestamp"] < _CACHE_TTL_SECONDS:
            cached_data = dict(entry["data"])
            cached_data["is_cached"] = True
            return cached_data

    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat:.4f}&longitude={lon:.4f}"
        "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m"
    )

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "IGNIS-FireIntelligenceGroundStation/2.0 (SIH26162 NTRO)"}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            current = data.get("current", {})

            temp = float(current.get("temperature_2m", 28.0))
            humidity = float(current.get("relative_humidity_2m", 60.0))
            wind_speed = float(current.get("wind_speed_10m", 12.0))
            wind_dir = float(current.get("wind_direction_10m", 250.0))

            weather_result = {
                "source": "Open-Meteo API",
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_direction": round(wind_dir, 1),
                "wind_compass": deg_to_compass(wind_dir),
                "timestamp": current.get("time", ""),
                "is_cached": False,
            }

            _WEATHER_CACHE[cache_key] = {
                "timestamp": now,
                "data": weather_result,
            }
            return weather_result

    except Exception as e:
        logger.warning(f"[IGNIS] Open-Meteo fetch failed for ({lat}, {lon}): {e}. Using cached or climatology baseline.")

        # If previous cache exists (even if older than 10m), serve it
        if cache_key in _WEATHER_CACHE:
            fallback = dict(_WEATHER_CACHE[cache_key]["data"])
            fallback["is_cached"] = True
            fallback["source"] = "Open-Meteo (Buffered Cache)"
            return fallback

        # Geographic climatology baseline for India
        base_temp = 32.0 if lat < 25.0 else 28.5
        base_wind = 12.0
        base_dir = 245.0
        base_hum = 55.0 if lon > 78.0 else 45.0

        return {
            "source": "Climatological Baseline (Offline)",
            "temperature": base_temp,
            "humidity": base_hum,
            "wind_speed": base_wind,
            "wind_direction": base_dir,
            "wind_compass": deg_to_compass(base_dir),
            "timestamp": "",
            "is_cached": True,
            "demo_mode": True,
        }
