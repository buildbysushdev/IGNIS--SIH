"""
Test suite for IGNIS Fire Spread Prediction & Rothermel Simulation Engine.
Tests:
- Downwind fire spread azimuth calculation
- Rate of spread (RoS) bounds & numerical stability
- Ellipse polygon coordinate generation & closure
- Containment fire-break recommendations
"""

import pytest
import sys
from pathlib import Path

# Ensure backend root is in import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from spread_prediction import deg_to_compass, predict_spread


def test_deg_to_compass_headings():
    """Verify compass sector mapping."""
    assert deg_to_compass(0) == "N"
    assert deg_to_compass(90) == "E"
    assert deg_to_compass(180) == "S"
    assert deg_to_compass(270) == "W"
    assert deg_to_compass(45) == "NE"


def test_predict_spread_structure():
    """Verify spread prediction returns complete decision-support simulation payload."""
    fire = {
        "latitude": 21.1702,
        "longitude": 72.8311,
        "frp": 75.0,
        "category": "EMERGENCY_INDUSTRIAL",
    }
    result = predict_spread(fire, hours=6)

    assert "rate_of_spread_kmh" in result
    assert result["rate_of_spread_kmh"] > 0.0
    assert result["rate_of_spread_kmh"] < 15.0  # Physically realistic bound

    assert "spread_azimuth_deg" in result
    assert 0.0 <= result["spread_azimuth_deg"] <= 360.0

    assert "predictions" in result
    assert len(result["predictions"]) >= 3

    assert "spread_cone_coordinates" in result
    cone = result["spread_cone_coordinates"]
    assert len(cone) >= 4
    # Check that polygon coordinates are valid lat/lons
    for pt in cone:
        assert len(pt) == 2
        assert -90.0 <= pt[0] <= 90.0
        assert -180.0 <= pt[1] <= 180.0

    assert "recommendations" in result
    assert len(result["recommendations"]) > 0


def test_predict_spread_zero_frp_stability():
    """Verify model maintains numerical stability when FRP is zero or very small."""
    fire = {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "frp": 0.0,
        "category": "UNKNOWN",
    }
    result = predict_spread(fire, hours=3)
    assert result["rate_of_spread_kmh"] >= 0.0
    assert len(result["spread_cone_coordinates"]) >= 4
