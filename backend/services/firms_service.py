"""
IGNIS :: NASA FIRMS Service
Integrates directly with NASA FIRMS API for real-time orbital thermal anomalies.
Supports VIIRS_SNPP_NRT and VIIRS_NOAA20_NRT with 15-minute caching and deduplication.
"""

from typing import Any, Optional
from datetime import datetime
from firms import fetch_all_sources, fetch_fires, get_data_status, get_last_fetched_at


def get_realtime_fires(
    days: int = 1,
    source: str = "VIIRS",
    force: bool = False,
) -> dict[str, Any]:
    """
    Fetch live NASA FIRMS active fire hotspots for India.
    Parameters:
        days: Historical window (1 to 7 days)
        source: 'VIIRS' (both SNPP + NOAA20 merged) or specific instrument
        force: Bypass 15-min cache
    Returns:
        Structured response containing fires list, total count, fetched_at timestamp,
        and ingestion status.
    """
    if source.upper() in ["VIIRS", "ALL"]:
        fires = fetch_all_sources(days=days, force=force)
    elif "NOAA" in source.upper():
        fires = fetch_fires(days=days, source="VIIRS_NOAA20_NRT", force=force)
    elif "MODIS" in source.upper():
        fires = fetch_fires(days=days, source="MODIS_NRT", force=force)
    else:
        fires = fetch_fires(days=days, source="VIIRS_SNPP_NRT", force=force)

    status_info = get_data_status()
    fetched_at = status_info.get("fetched_at") or get_last_fetched_at()

    return {
        "fires": fires,
        "total": len(fires),
        "days": days,
        "source": source,
        "fetched_at": fetched_at,
        "ignis_status": status_info.get("mode", "live"),
        "message": status_info.get("message", "Connected to NASA FIRMS orbital pipeline"),
    }
