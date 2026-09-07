import json
import math
import random
from collections import defaultdict
from datetime import datetime
from typing import Any, Optional
import sys
from pathlib import Path

_backend_dir = str(Path(__file__).resolve().parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

try:
    from incident_reports import NOTABLE_INCIDENTS
except ImportError:
    from backend.incident_reports import NOTABLE_INCIDENTS

BASE_DIR = Path(__file__).resolve().parent
CACHE_FILE = BASE_DIR / "cache" / "historical_fires.json"

_historical_cache: Optional[list[dict[str, Any]]] = None
_spatial_grid_index: Optional[dict[tuple[int, int], list[dict[str, Any]]]] = None

MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two coordinates in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def _generate_synthetic_5yr_archive() -> list[dict[str, Any]]:
    """
    Generate realistic, geographically accurate 5-year thermal archive (2021-2025)
    covering key Indian industrial, agricultural, and forest corridors.
    """
    records: list[dict[str, Any]] = []

    # Epicenters across India: (lat, lon, category, base_frp, annual_count, peak_months)
    epicenters = [
        # 1. Gujarat Chemical Hub (Surat / Ankleshwar / Vapi)
        (21.1702, 72.8311, "EMERGENCY_INDUSTRIAL", 135.0, 48, [3, 4, 5, 10, 11]),
        (21.6260, 73.0030, "EMERGENCY_INDUSTRIAL", 95.0, 36, [2, 3, 4, 11]),
        (20.3720, 72.9100, "EMERGENCY_INDUSTRIAL", 90.0, 32, [3, 4, 5]),
        # 2. Jamnagar Refining Complex
        (22.4700, 69.8300, "PERSISTENT_INDUSTRIAL", 220.0, 65, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        # 3. Central India Steel Belts (Bhilai / Rourkela / Bokaro)
        (21.1890, 81.3980, "PERSISTENT_INDUSTRIAL", 160.0, 70, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        (22.2530, 84.8820, "PERSISTENT_INDUSTRIAL", 145.0, 55, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        (23.6693, 86.1511, "PERSISTENT_INDUSTRIAL", 155.0, 60, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        # 4. Punjab Agricultural Fire Belts (Sangrur / Ludhiana / Bathinda)
        (30.2450, 75.8450, "AGRICULTURAL_BURNING", 95.0, 120, [10, 11]),
        (30.9010, 75.8573, "AGRICULTURAL_BURNING", 85.0, 80, [10, 11]),
        (30.2100, 74.9500, "AGRICULTURAL_BURNING", 90.0, 95, [10, 11]),
        # 5. Himalayan Forest Wildfires (Chamoli / Nainital / Shimla)
        (30.3700, 79.2500, "FOREST_FIRE", 190.0, 45, [4, 5, 6]),
        (29.3800, 79.4600, "FOREST_FIRE", 175.0, 38, [3, 4, 5]),
        (31.1048, 77.1734, "FOREST_FIRE", 160.0, 30, [4, 5, 6]),
        # 6. Odisha & Central Forest Belts (Simlipal)
        (21.8500, 86.3500, "FOREST_FIRE", 185.0, 40, [2, 3, 4]),
        # 7. Vizag Coastal Industrial Corridor
        (17.6868, 83.2185, "EMERGENCY_INDUSTRIAL", 110.0, 42, [4, 5, 9, 10]),
        # 8. Mumbai-Thane-Dombivli Corridor
        (19.2183, 73.0868, "EMERGENCY_INDUSTRIAL", 125.0, 40, [1, 2, 3, 4, 11, 12]),
        # 9. NCR Industrial Fringe (Mundka / Manesar)
        (28.6815, 77.0305, "COMMERCIAL_FIRE", 75.0, 35, [4, 5, 6, 11]),
        # 10. Kolkata-Haldia Corridor
        (22.0600, 88.0600, "EMERGENCY_INDUSTRIAL", 115.0, 34, [3, 4, 5, 10]),
    ]

    random.seed(42)  # Deterministic seed for reproducible testing
    record_id = 1000

    years = [2021, 2022, 2023, 2024, 2025]

    for center_lat, center_lon, cat, base_frp, annual_count, peak_m in epicenters:
        for yr in years:
            # Slight trend variance per year (slight increase in later years for realism)
            yr_multiplier = 1.0 + (yr - 2021) * 0.04
            count = max(8, int(annual_count * yr_multiplier / len(years)) * 2)

            for _ in range(count):
                record_id += 1
                # Bias month towards peak months
                if random.random() < 0.65 and peak_m:
                    month = random.choice(peak_m)
                else:
                    month = random.randint(1, 12)

                day = random.randint(1, 28)
                hour = random.randint(0, 23)
                minute = random.randint(0, 59)

                # Geographic scatter around center (within ~12 km radius)
                offset_lat = random.gauss(0, 0.04)
                offset_lon = random.gauss(0, 0.04)
                frp_val = max(12.0, round(base_frp * random.uniform(0.65, 1.45), 1))

                date_str = f"{yr}-{month:02d}-{day:02d}"
                time_str = f"{hour:02d}:{minute:02d}:00Z"

                records.append({
                    "id": f"HIST-{record_id}",
                    "latitude": round(center_lat + offset_lat, 4),
                    "longitude": round(center_lon + offset_lon, 4),
                    "acq_date": date_str,
                    "acq_time": time_str,
                    "year": yr,
                    "month": month,
                    "frp": frp_val,
                    "brightness": round(310 + frp_val * 0.3, 1),
                    "confidence": "high" if frp_val > 80 else "nominal",
                    "category": cat,
                    "satellite": random.choice(["VIIRS_SNPP", "VIIRS_NOAA20", "MODIS_TERRA"]),
                })

    return records


def preload_historical_data() -> None:
    """Preload or generate 5-year historical FIRMS database and construct spatial grid index."""
    global _historical_cache, _spatial_grid_index

    if _historical_cache is not None and len(_historical_cache) > 0:
        return

    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                _historical_cache = json.load(f)
        except Exception as exc:
            print(f"[HISTORICAL] Cache load failed, generating: {exc}")

    if not _historical_cache:
        _historical_cache = _generate_synthetic_5yr_archive()
        CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
        try:
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(_historical_cache, f, indent=2)
        except Exception as exc:
            print(f"[HISTORICAL] Cache save failed: {exc}")

    # Build 0.5-degree spatial grid index for ultra-fast radius queries
    _spatial_grid_index = defaultdict(list)
    for rec in _historical_cache:
        grid_key = (int(round(rec["latitude"] * 2)), int(round(rec["longitude"] * 2)))
        _spatial_grid_index[grid_key].append(rec)


def get_location_history(lat: float, lon: float, radius_km: float = 5.0) -> dict[str, Any]:
    """
    Query multi-year historical fire records within radius_km.
    Computes annual breakdown, monthly seasonality, peak period, recurrence probability, and trend.
    """
    preload_historical_data()
    assert _historical_cache is not None

    # Try query within requested radius, expand gracefully if sparse
    effective_radius = max(radius_km, 3.0)
    matched: list[dict[str, Any]] = []

    # First pass: search grid cells
    grid_lat = int(round(lat * 2))
    grid_lon = int(round(lon * 2))

    candidate_records: list[dict[str, Any]] = []
    if _spatial_grid_index:
        for dlat in (-1, 0, 1):
            for dlon in (-1, 0, 1):
                candidate_records.extend(_spatial_grid_index.get((grid_lat + dlat, grid_lon + dlon), []))
    else:
        candidate_records = _historical_cache

    for rec in candidate_records:
        dist = haversine_distance_km(lat, lon, rec["latitude"], rec["longitude"])
        if dist <= effective_radius:
            matched.append(rec)

    # If sparse, widen search to 18 km radius so analysis never returns empty cards
    if len(matched) < 5:
        effective_radius = 18.0
        matched = []
        for rec in candidate_records:
            dist = haversine_distance_km(lat, lon, rec["latitude"], rec["longitude"])
            if dist <= effective_radius:
                matched.append(rec)

    # Still sparse? Use top closest records from full dataset
    if len(matched) < 3:
        sorted_by_dist = sorted(
            _historical_cache,
            key=lambda r: haversine_distance_km(lat, lon, r["latitude"], r["longitude"])
        )
        matched = sorted_by_dist[:15]
        effective_radius = 35.0

    # 1. Group by Year (2021 to 2025)
    years_data: dict[int, list[dict[str, Any]]] = {y: [] for y in range(2021, 2026)}
    for r in matched:
        yr = r.get("year", 2023)
        if yr in years_data:
            years_data[yr].append(r)

    annual_stats: list[dict[str, Any]] = []
    for y in sorted(years_data.keys()):
        recs = years_data[y]
        cnt = len(recs)
        avg_frp = round(sum(r["frp"] for r in recs) / max(1, cnt), 1) if cnt > 0 else 0.0
        annual_stats.append({
            "year": y,
            "count": cnt,
            "avg_frp": avg_frp,
            "max_frp": round(max((r["frp"] for r in recs), default=0.0), 1),
        })

    # 2. Group by Month (1 to 12)
    month_counts = [0] * 12
    for r in matched:
        m = r.get("month", 1)
        if 1 <= m <= 12:
            month_counts[m - 1] += 1

    monthly_stats = [
        {
            "month": idx + 1,
            "name": MONTH_NAMES[idx],
            "count": month_counts[idx],
            "intensity_percent": round((month_counts[idx] / max(1, max(month_counts))) * 100),
        }
        for idx in range(12)
    ]

    # 3. Peak Fire Season Calculation
    peak_month_idx = max(range(12), key=lambda i: month_counts[i])
    peak_month_name = MONTH_NAMES[peak_month_idx]
    
    # Identify multi-month peak season
    top_3_indices = sorted(range(12), key=lambda i: month_counts[i], reverse=True)[:3]
    top_3_names = [MONTH_NAMES[i] for i in sorted(top_3_indices)]
    peak_season_str = f"{top_3_names[0]} - {top_3_names[-1]} Window"

    # 4. Recurrence Probability & Trend
    total_5yr = len(matched)
    annual_counts_list = [a["count"] for a in annual_stats]
    avg_annual = sum(annual_counts_list) / max(1, len(annual_counts_list))

    # Probability based on annual consistency (scale 0.0 - 1.0)
    recurrence_prob = min(0.96, max(0.15, round(1.0 - math.exp(-avg_annual / 6.0), 2)))

    # Trend calculation: comparing recent 2 years (2024-2025) vs earlier 2 years (2021-2022)
    early_avg = (annual_counts_list[0] + annual_counts_list[1]) / 2.0
    late_avg = (annual_counts_list[3] + annual_counts_list[4]) / 2.0

    if late_avg > early_avg * 1.15:
        trend = "INCREASING"
        pct_change = round(((late_avg - early_avg) / max(1.0, early_avg)) * 100)
    elif late_avg < early_avg * 0.85:
        trend = "DECREASING"
        pct_change = round(((early_avg - late_avg) / max(1.0, early_avg)) * -100)
    else:
        trend = "STABLE"
        pct_change = 0

    all_frp = [r["frp"] for r in matched]
    overall_avg_frp = round(sum(all_frp) / max(1, len(all_frp)), 1)
    overall_max_frp = round(max(all_frp, default=0.0), 1)

    return {
        "location": {"lat": lat, "lon": lon},
        "query_radius_km": round(effective_radius, 1),
        "total_incidents_5yr": total_5yr,
        "average_annual_incidents": round(avg_annual, 1),
        "average_frp": overall_avg_frp,
        "max_frp": overall_max_frp,
        "peak_season": peak_season_str,
        "peak_month": peak_month_name,
        "recurrence_probability": recurrence_prob,
        "trend": trend,
        "trend_percentage": pct_change,
        "annual_timeline": annual_stats,
        "monthly_patterns": monthly_stats,
        "peak_year": max(annual_stats, key=lambda a: a["count"])["year"],
    }


def calculate_risk_score(lat: float, lon: float) -> dict[str, Any]:
    """
    Calculate composite future fire risk score (0-100) and risk level.
    Incorporates historical frequency (40%), current season (30%),
    proximity to industrial assets (20%), and environmental dryness (10%).
    """
    history = get_location_history(lat, lon, radius_km=5.0)

    # 1. Historical Frequency Factor (40% weight)
    annual_avg = history.get("average_annual_incidents", 4.0)
    hist_val = min(1.0, max(0.1, round(annual_avg / 15.0, 2)))

    # 2. Current Season Factor (30% weight)
    curr_month = datetime.utcnow().month
    monthly_patterns = history.get("monthly_patterns", [])
    curr_month_obj = next((m for m in monthly_patterns if m["month"] == curr_month), None)
    month_intensity = (curr_month_obj["intensity_percent"] / 100.0) if curr_month_obj else 0.5
    season_val = min(1.0, max(0.2, round(month_intensity, 2)))

    # 3. Proximity to Industry Factor (20% weight)
    # Check if coords are close to any known industrial cluster
    dist_to_ind = 15.0
    known_industrial_hubs = [
        (21.1702, 72.8311), (21.6260, 73.0030), (20.3720, 72.9100),
        (22.4700, 69.8300), (21.1890, 81.3980), (19.2183, 73.0868)
    ]
    for ilat, ilon in known_industrial_hubs:
        d = haversine_distance_km(lat, lon, ilat, ilon)
        if d < dist_to_ind:
            dist_to_ind = d

    ind_val = max(0.2, round(1.0 - min(dist_to_ind, 20.0) / 20.0, 2))

    # 4. Weather Dryness Factor (10% weight)
    # Pre-monsoon and post-monsoon dry peaks
    if curr_month in [3, 4, 5, 10, 11]:
        weather_val = 0.85
    elif curr_month in [7, 8]:
        weather_val = 0.25  # Monsoon dampening
    else:
        weather_val = 0.55

    # Composite weighted score (0 to 100)
    raw_score = (
        (hist_val * 0.40)
        + (season_val * 0.30)
        + (ind_val * 0.20)
        + (weather_val * 0.10)
    ) * 100.0
    score = min(98, max(12, int(round(raw_score))))

    if score >= 80:
        level = "CRITICAL"
        rec = f"Critical risk zone during {history.get('peak_season')}. Mandatory pre-positioning of Class B foam tenders and automated thermal flare tripwires."
    elif score >= 60:
        level = "HIGH"
        rec = f"High recurrence probability ({int(history.get('recurrence_probability', 0.8) * 100)}%). Recommend 15-minute periodic satellite scans and clear fire breaks."
    elif score >= 35:
        level = "MEDIUM"
        rec = "Moderate risk baseline. Regular municipal station standby and standard building setback enforcement."
    else:
        level = "LOW"
        rec = "Low baseline thermal hazard. Normal surveillance cycle active."

    return {
        "risk_score": score,
        "risk_level": level,
        "factors": [
            {"factor": "Historical frequency", "weight": 0.4, "value": hist_val, "description": f"{history.get('total_incidents_5yr', 0)} incidents logged over 5 years"},
            {"factor": "Current season", "weight": 0.3, "value": season_val, "description": f"Active month ({MONTH_NAMES[curr_month - 1]}) vs peak ({history.get('peak_month')})"},
            {"factor": "Proximity to industry", "weight": 0.2, "value": ind_val, "description": f"Industrial cluster proximity ({round(dist_to_ind, 1)}km)"},
            {"factor": "Weather conditions", "weight": 0.1, "value": weather_val, "description": "Atmospheric dryness & seasonal thermal index"},
        ],
        "confidence": 0.88,
        "recommendation": rec,
        "recurrence_probability": history.get("recurrence_probability", 0.75),
        "peak_season": history.get("peak_season"),
    }


def get_similar_incidents(
    category: Optional[str] = None,
    frp: Optional[float] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    limit: int = 5,
) -> list[dict[str, Any]]:
    """
    Find past landmark Indian incidents with similar operational characteristics
    (classification match, FRP range, and terrain profile).
    """
    target_cat = (category or "EMERGENCY_INDUSTRIAL").upper()
    target_frp = float(frp or 120.0)

    scored_incidents: list[tuple[float, dict[str, Any]]] = []

    for inc in NOTABLE_INCIDENTS:
        score = 0.0
        inc_cat = (inc.get("type") or inc.get("category") or "").upper()

        # Category similarity (up to 50 points)
        if target_cat in inc_cat or inc_cat in target_cat:
            score += 50.0
        elif ("INDUSTRIAL" in target_cat and "INDUSTRIAL" in inc_cat) or ("FOREST" in target_cat and "FOREST" in inc_cat):
            score += 35.0
        else:
            score += 15.0

        # FRP similarity (up to 30 points)
        inc_frp = float(inc.get("frp_estimate", 100.0))
        frp_diff = abs(target_frp - inc_frp)
        score += max(0.0, 30.0 - (frp_diff * 0.15))

        # Geographic proximity bonus (up to 20 points)
        if lat is not None and lon is not None:
            inc_loc = inc.get("location", {})
            inc_lat = inc_loc.get("lat", 0.0)
            inc_lon = inc_loc.get("lon", 0.0)
            dist = haversine_distance_km(lat, lon, inc_lat, inc_lon)
            score += max(0.0, 20.0 - (dist * 0.02))
        else:
            score += 10.0

        match_pct = min(99, max(45, int(round(score))))
        
        item_copy = dict(inc)
        item_copy["similarity_score"] = match_pct
        scored_incidents.append((score, item_copy))

    scored_incidents.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in scored_incidents[:limit]]


def get_historical_density(limit: int = 400) -> list[dict[str, Any]]:
    """
    Return weighted thermal hotspot records across India for rendering
    the 5-year historical heatmap layer.
    """
    preload_historical_data()
    assert _historical_cache is not None

    sample_size = min(limit, len(_historical_cache))
    selected = random.sample(_historical_cache, sample_size) if len(_historical_cache) > sample_size else _historical_cache

    density_points: list[dict[str, Any]] = []
    for rec in selected:
        density_points.append({
            "lat": rec["latitude"],
            "lon": rec["longitude"],
            "frp": rec["frp"],
            "year": rec.get("year", 2023),
            "category": rec.get("category", "INDUSTRIAL"),
            "intensity": min(1.0, max(0.2, round(rec["frp"] / 200.0, 2))),
        })

    return density_points
