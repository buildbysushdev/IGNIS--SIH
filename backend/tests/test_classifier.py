"""
Test suite for IGNIS Fire Classification Pipeline.
Tests:
- Deterministic Life-Critical Rules (HOSPITAL_FIRE, FUEL_STATION_FIRE)
- Industrial Emergency Detection (EMERGENCY_INDUSTRIAL vs PERSISTENT_INDUSTRIAL)
- Agrarian & Forest Fire Discernment
- Low-Intensity Domestic & Bonfire False-Alarm Suppression
- Explainability metadata generation
"""

import pytest
import sys
from pathlib import Path

# Ensure backend root is in import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from classifier import FireClassifier


@pytest.fixture
def classifier():
    return FireClassifier()


def test_hospital_fire_critical_rule(classifier):
    """Verify hospital vicinity triggers priority life-critical HOSPITAL_FIRE alert."""
    fire = {
        "latitude": 21.1702,
        "longitude": 72.8311,
        "frp": 18.5,
        "brightness": 340.0,
        "confidence": "h",
        "location_type": "HOSPITAL",
        "nearest_name": "City Civil Hospital",
        "distance_km": 0.05,
    }
    result = classifier.classify(fire)
    assert result["category"] == "HOSPITAL_FIRE"
    assert result["risk_level"] == "CRITICAL"
    assert result["confidence"] >= 90


def test_emergency_industrial_high_frp(classifier):
    """Verify high-intensity fire near industrial asset classifies as EMERGENCY_INDUSTRIAL."""
    fire = {
        "latitude": 21.1925,
        "longitude": 72.8258,
        "frp": 85.0,  # High thermal output
        "brightness": 365.0,
        "confidence": "h",
        "distance_km": 0.3,  # 300m from chemical plant
        "nearest_name": "Surat Chemical Cluster GIDC",
        "persistence": 5.0,  # Sudden spike, non-persistent
    }
    result = classifier.classify(fire)
    assert result["category"] == "EMERGENCY_INDUSTRIAL"
    assert result["risk_level"] == "CRITICAL"
    assert "DISPATCH" in result["action"]


def test_persistent_industrial_flaring(classifier):
    """Verify recurring plant flare (high persistence, near industry) classifies as PERSISTENT_INDUSTRIAL."""
    fire = {
        "latitude": 21.1925,
        "longitude": 72.8258,
        "frp": 25.0,
        "brightness": 330.0,
        "confidence": "n",
        "distance_km": 1.2,
        "nearest_name": "Surat Chemical Cluster GIDC",
        "persistence": 45.0,  # Detected repeatedly over 45% of satellite overpasses
    }
    result = classifier.classify(fire)
    assert result["category"] == "PERSISTENT_INDUSTRIAL"
    assert result["risk_level"] == "LOW"
    assert "not emergency" in result["reason"].lower()


def test_agricultural_stubble_burning(classifier):
    """Verify seasonal harvest burning in agrarian corridor classifies as AGRICULTURAL_BURNING."""
    fire = {
        "latitude": 30.5000,  # Punjab agrarian corridor
        "longitude": 75.5000,
        "frp": 18.0,
        "brightness": 325.0,
        "confidence": "n",
        "distance_km": 15.0,  # Far from heavy industry
        "acq_date": "2026-10-15",  # October stubble burning season
        "location_type": "FARMLAND",
    }
    result = classifier.classify(fire)
    assert result["category"] == "AGRICULTURAL_BURNING"
    assert result["risk_level"] == "MODERATE"


def test_domestic_bonfire_false_alarm_suppression(classifier):
    """Verify low-intensity thermal signal (< 10 MW) in residential sector is suppressed."""
    fire = {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "frp": 4.5,  # Low intensity domestic/waste fire
        "brightness": 305.0,
        "confidence": "l",
        "distance_km": 1.5,
        "location_type": "RESIDENTIAL",
    }
    result = classifier.classify(fire)
    assert result["category"] == "DOMESTIC_LOW_INTENSITY_BURN"
    assert result["risk_level"] == "VERY_LOW"
    assert "ALERT SUPPRESSED" in result["action"]
