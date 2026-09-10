"""
Test suite for NASA FIRMS Data Ingestion & Deduplication Pipeline.
Tests:
- CSV response parsing & field normalization
- Coordinate bounding box filtering
- 1km spatial deduplication with FRP summation & max brightness preservation
- Resilient error handling on corrupt/empty data
"""

import pytest
import sys
from pathlib import Path

# Ensure backend root is in import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from firms import _parse_firms_csv, _deduplicate_fires


SAMPLE_FIRMS_CSV = """latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_ti5,frp,daynight
21.1702,72.8311,345.2,0.4,0.4,2026-09-10,0730,N,nominal,2.0NRT,310.5,42.5,D
21.1730,72.8330,355.8,0.4,0.4,2026-09-10,0735,1,high,2.0NRT,312.0,38.2,D
28.6139,77.2090,320.1,0.5,0.5,2026-09-10,0800,N,nominal,2.0NRT,300.2,12.0,D
-10.5000,50.0000,310.0,0.5,0.5,2026-09-10,0810,N,low,2.0NRT,295.0,8.0,D
"""


def test_parse_firms_csv_valid():
    """Verify CSV parser correctly extracts valid hotspots inside India bounding box."""
    fires = _parse_firms_csv(SAMPLE_FIRMS_CSV, source="VIIRS_SNPP_NRT")
    # Hotspot at -10.5, 50.0 is outside India and should be rejected
    assert len(fires) == 3
    
    f1 = fires[0]
    assert pytest.approx(f1["latitude"], 0.0001) == 21.1702
    assert pytest.approx(f1["longitude"], 0.0001) == 72.8311
    assert pytest.approx(f1["frp"], 0.01) == 42.5
    assert pytest.approx(f1["brightness"], 0.01) == 345.2
    assert f1["satellite"] == "SNPP"
    assert f1["confidence"] == "n"


def test_parse_firms_csv_empty_or_corrupt():
    """Verify CSV parser handles empty or corrupt headers gracefully."""
    assert _parse_firms_csv("", "VIIRS") == []
    assert _parse_firms_csv("invalid,header,only\n1,2,3", "VIIRS") == []
    assert _parse_firms_csv("Invalid API Key Error", "VIIRS") == []


def test_deduplicate_fires_spatial_clustering():
    """
    Verify 1km spatial deduplication clusters nearby detections (e.g. Surat industrial points ~350m apart)
    and sums FRP while preserving maximum brightness.
    """
    fires = _parse_firms_csv(SAMPLE_FIRMS_CSV, source="VIIRS_SNPP_NRT")
    # Initially 3 valid detections: two close in Surat (~350m apart), one in Delhi
    assert len(fires) == 3
    
    deduped = _deduplicate_fires(fires, radius_km=1.0)
    # The two close Surat hotspots should merge into 1 hotspot
    assert len(deduped) == 2
    
    surat_fire = next(f for f in deduped if abs(f["latitude"] - 21.1702) < 0.01)
    # Merged FRP should be sum of 42.5 + 38.2 = 80.7 MW
    assert pytest.approx(surat_fire["frp"], 0.01) == 80.7
    # Merged brightness should be max(345.2, 355.8) = 355.8 K
    assert pytest.approx(surat_fire["brightness"], 0.01) == 355.8
    # Merged fire count metadata should be 2
    assert surat_fire["merged_count"] == 2
