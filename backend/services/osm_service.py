"""
IGNIS :: OpenStreetMap Facility Service
Retrieves high-risk industrial facilities, refineries, steel plants, and life-critical amenities.
Backed by SQLite cache and direct Overpass API ingestion.
"""

from typing import Any, Optional
import database
from osm_data import load_or_cache_zones, fetch_industrial_zones_from_osm


def get_facilities(
    facility_type: str = "all",
    limit: int = 500,
    force_refresh: bool = False,
) -> dict[str, Any]:
    """
    Retrieve industrial zones and critical infrastructure facilities.
    Parameters:
        facility_type: 'all' | 'steel' | 'refinery' | 'chemical' | 'power' | 'hospital' | 'fuel'
        limit: Maximum number of facilities to return (1-1000)
        force_refresh: Force live query to Overpass API
    Returns:
        Structured response with facility items, counts, and metadata.
    """
    if force_refresh:
        fetch_industrial_zones_from_osm()

    zones = load_or_cache_zones()

    if facility_type and facility_type.lower() != "all":
        ft = facility_type.lower()
        filtered = [
            z for z in zones
            if ft in str(z.get("name", "")).lower() or ft in str(z.get("zone_type", z.get("type", ""))).lower()
        ]
    else:
        filtered = zones

    return {
        "facilities": filtered[:limit],
        "count": len(filtered[:limit]),
        "total_available": len(filtered),
        "source": "OpenStreetMap Overpass API (Cached in SQLite)",
    }
