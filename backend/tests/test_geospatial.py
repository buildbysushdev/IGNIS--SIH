"""
Test suite for IGNIS Geospatial Calculations & Industrial Facility Correlation.
Tests:
- Haversine distance accuracy
- Nearest industrial facility matching
- Coordinate validity & boundary handling
"""

import pytest
import sys
from pathlib import Path

# Ensure backend root is in import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from osm_data import haversine_km, find_nearest_industry, FALLBACK_ZONES


def test_haversine_known_distances():
    """Verify Haversine formula against known geographical coordinates."""
    # Delhi (28.6139, 77.2090) to Mumbai (19.0760, 72.8777) ~ 1148 km (+/- 15 km)
    dist_delhi_mumbai = haversine_km(28.6139, 77.2090, 19.0760, 72.8777)
    assert 1130.0 < dist_delhi_mumbai < 1170.0

    # Same coordinate should be exactly 0 km
    assert haversine_km(21.1702, 72.8311, 21.1702, 72.8311) == 0.0


def test_find_nearest_industry_matching():
    """Verify nearest industry accurately identifies Surat Chemical Cluster when within 1km."""
    # Test point right next to Surat Chemical Cluster (21.1925, 72.8258)
    test_lat, test_lon = 21.1930, 72.8260
    result = find_nearest_industry(test_lat, test_lon, FALLBACK_ZONES)
    
    assert result["name"] == "Surat Chemical Cluster GIDC"
    assert result["distance_km"] < 0.2  # Under 200 meters
    assert result["zone_type"] in ["industrial", "works"]


def test_find_nearest_industry_empty():
    """Verify graceful handling when zones list is empty."""
    res = find_nearest_industry(20.0, 75.0, [])
    assert res["distance_km"] == 999.0
    assert res["name"] == "Unknown"
