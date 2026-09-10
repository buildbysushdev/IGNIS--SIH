"""
Reproducible Performance Benchmark for Project IGNIS.
Addresses Phase 15 & SIH Claims:
Benchmarks:
1. FIRMS CSV Ingestion & Parsing (2,000 hotspots)
2. 1km Spatial Deduplication & FRP summation (2,000 hotspots)
3. Industrial Facility Geospatial Matching (2,000 hotspots)
4. Classification Pipeline (Rule Engine + Random Forest inference for 2,000 hotspots)
"""

import time
import pytest
import sys
import random
from pathlib import Path

# Ensure backend root is in import path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from firms import _parse_firms_csv, _deduplicate_fires
from osm_data import find_nearest_industry, FALLBACK_ZONES
from classifier import FireClassifier


def generate_benchmark_csv(n_records: int = 2000) -> str:
    """Generate synthetic CSV with n_records within India bounding box."""
    lines = ["latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,version,bright_ti5,frp,daynight"]
    for i in range(n_records):
        lat = round(random.uniform(10.0, 32.0), 4)
        lon = round(random.uniform(70.0, 88.0), 4)
        bright = round(random.uniform(300.0, 370.0), 1)
        frp = round(random.uniform(5.0, 120.0), 1)
        conf = random.choice(["nominal", "high", "low"])
        lines.append(f"{lat},{lon},{bright},0.4,0.4,2026-09-10,0800,N,{conf},2.0NRT,300.0,{frp},D")
    return "\n".join(lines)


def test_performance_benchmark():
    """Execute end-to-end processing benchmark on 2,000 hotspots and print latency breakdown."""
    n_hotspots = 2000
    csv_data = generate_benchmark_csv(n_hotspots)

    # 1. Benchmark CSV Parsing
    t0 = time.perf_counter()
    parsed_fires = _parse_firms_csv(csv_data, "VIIRS_SNPP_NRT")
    t_parse = (time.perf_counter() - t0) * 1000.0

    assert len(parsed_fires) == n_hotspots, f"Expected {n_hotspots}, got {len(parsed_fires)}"

    # 2. Benchmark 1km Spatial Deduplication
    t0 = time.perf_counter()
    deduped_fires = _deduplicate_fires(parsed_fires, radius_km=1.0)
    t_dedup = (time.perf_counter() - t0) * 1000.0

    # 3. Benchmark Industrial Facility Geospatial Matching
    t0 = time.perf_counter()
    for f in deduped_fires:
        nearest = find_nearest_industry(f["latitude"], f["longitude"], FALLBACK_ZONES)
        f["nearest_industry"] = nearest
    t_geo = (time.perf_counter() - t0) * 1000.0

    # 4. Benchmark Rule + ML Classification
    clf = FireClassifier()
    t0 = time.perf_counter()
    classified = clf.classify_batch(deduped_fires)
    t_classify = (time.perf_counter() - t0) * 1000.0

    total_pipeline_ms = t_parse + t_dedup + t_geo + t_classify
    throughput = len(parsed_fires) / (total_pipeline_ms / 1000.0)

    print("\n" + "=" * 60)
    print("[IGNIS] PERFORMANCE BENCHMARK RESULTS (2,000 Hotspots)")
    print("=" * 60)
    print(f"1. CSV Ingestion & Parsing:         {t_parse:6.2f} ms")
    print(f"2. 1km Spatial Deduplication:       {t_dedup:6.2f} ms")
    print(f"3. Industrial Facility Matching:     {t_geo:6.2f} ms")
    print(f"4. Rule + ML Classification:         {t_classify:6.2f} ms")
    print("-" * 60)
    print(f"TOTAL PIPELINE LATENCY:             {total_pipeline_ms:6.2f} ms")
    print(f"PEAK HOTSPOT THROUGHPUT:            {throughput:6.1f} hotspots/sec")
    print("=" * 60 + "\n")

    # Assert reasonable execution bounds (entire pipeline completes within 1.5 seconds)
    assert total_pipeline_ms < 1500.0, f"Pipeline took {total_pipeline_ms:.2f} ms, expected < 1500 ms"
