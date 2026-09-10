"""
Integration test suite for IGNIS FastAPI Endpoints.
Tests:
- /api/health endpoint
- /api/mode state query & switching
- /api/fires telemetry contract
- /api/alerts alert log contract
- /api/field-reports/stats ground verification stats
- /api/fire-stations/nearest geospatial routing
"""

import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Ensure backend root is in import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app

client = TestClient(app)


def test_api_health():
    """Verify backend health probe returns 200 OK with operational diagnostics."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "healthy", "degraded"]
    assert "nasa_firms" in data or "ignis" in data


def test_api_mode_state():
    """Verify operational mode endpoint returns valid mode and status."""
    response = client.get("/api/mode")
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] in ["LIVE", "CACHED", "DEMO"]
    assert "since" in data


def test_api_fires_telemetry():
    """Verify fires query returns list, summary breakdown, and metadata headers."""
    response = client.get("/api/fires?days=1&source=all")
    assert response.status_code == 200
    data = response.json()
    assert "fires" in data
    assert "total" in data
    assert "summary" in data
    assert isinstance(data["fires"], list)
    assert data["mode"] in ["LIVE", "CACHED", "DEMO"]


def test_api_alerts():
    """Verify alerts endpoint returns array and count."""
    response = client.get("/api/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "alerts" in data
    assert "count" in data
    assert isinstance(data["alerts"], list)


def test_api_field_reports_stats():
    """Verify field reports stats returns honest accuracy breakdown."""
    response = client.get("/api/field-reports/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_classifications" in data
    assert "officer_verifications" in data
    assert "accuracy_percentage" in data
    assert isinstance(data["category_accuracy"], dict)


def test_api_nearest_fire_station():
    """Verify spatial query for nearest fire station returns station details with ETA."""
    response = client.get("/api/fire-stations/nearest?lat=21.1702&lon=72.8311")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data or "station" in data
