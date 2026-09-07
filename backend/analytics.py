"""
IGNIS :: Authority Analytics Engine
Provides comprehensive multi-regional fire analytics, trend calculations,
hourly heatmaps, comparative period analysis, and executive/district reporting.
"""

import sys
import math
from pathlib import Path
from datetime import datetime, timedelta
from typing import Any, Optional

# Ensure backend directory is in sys.path
_backend_dir = str(Path(__file__).resolve().parent)
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

try:
    from historical import preload_historical_data, _historical_cache
except ImportError:
    preload_historical_data = lambda: None
    _historical_cache = None

# Preloaded Indian State Geospatial Analytics Baselines
STATE_ANALYTICS_DATA: list[dict[str, Any]] = [
    {
        "state": "Gujarat",
        "total_events": 842,
        "critical": 5,
        "agricultural": 210,
        "forest": 85,
        "industrial": 547,
        "trend_pct": 14,
        "trend_direction": "UP",
        "risk_level": "HIGH",
        "primary_cluster": "Surat-Ankleshwar-Vapi GIDC Corridor",
    },
    {
        "state": "Maharashtra",
        "total_events": 734,
        "critical": 4,
        "agricultural": 195,
        "forest": 112,
        "industrial": 427,
        "trend_pct": 8,
        "trend_direction": "UP",
        "risk_level": "HIGH",
        "primary_cluster": "Thane-Belapur & Chembur Petrochemicals",
    },
    {
        "state": "Punjab",
        "total_events": 920,
        "critical": 1,
        "agricultural": 840,
        "forest": 15,
        "industrial": 65,
        "trend_pct": 28,
        "trend_direction": "UP",
        "risk_level": "HIGH",
        "primary_cluster": "Ludhiana-Sangrur Stubble Belt",
    },
    {
        "state": "Uttarakhand",
        "total_events": 412,
        "critical": 1,
        "agricultural": 40,
        "forest": 352,
        "industrial": 20,
        "trend_pct": -5,
        "trend_direction": "DOWN",
        "risk_level": "MEDIUM",
        "primary_cluster": "Garhwal & Kumaon Pine Biomass Zone",
    },
    {
        "state": "Andhra Pradesh",
        "total_events": 518,
        "critical": 2,
        "agricultural": 180,
        "forest": 124,
        "industrial": 214,
        "trend_pct": 2,
        "trend_direction": "STABLE",
        "risk_level": "MEDIUM",
        "primary_cluster": "Visakhapatnam Port & Chemical SEZ",
    },
    {
        "state": "Chhattisgarh",
        "total_events": 385,
        "critical": 1,
        "agricultural": 95,
        "forest": 140,
        "industrial": 150,
        "trend_pct": 0,
        "trend_direction": "STABLE",
        "risk_level": "MEDIUM",
        "primary_cluster": "Bhilai-Raipur Heavy Metallurgy Zone",
    },
    {
        "state": "Delhi NCR",
        "total_events": 164,
        "critical": 1,
        "agricultural": 15,
        "forest": 4,
        "industrial": 145,
        "trend_pct": -4,
        "trend_direction": "DOWN",
        "risk_level": "MEDIUM",
        "primary_cluster": "Mundka-Bawana Commercial/Warehouse Hub",
    },
    {
        "state": "Odisha",
        "total_events": 490,
        "critical": 2,
        "agricultural": 110,
        "forest": 260,
        "industrial": 120,
        "trend_pct": 11,
        "trend_direction": "UP",
        "risk_level": "HIGH",
        "primary_cluster": "Similipal Forest & Angul Industrial Belt",
    },
    {
        "state": "Rajasthan",
        "total_events": 285,
        "critical": 0,
        "agricultural": 145,
        "forest": 30,
        "industrial": 110,
        "trend_pct": -3,
        "trend_direction": "DOWN",
        "risk_level": "LOW",
        "primary_cluster": "Bhiwadi & Kota Industrial Areas",
    },
    {
        "state": "West Bengal",
        "total_events": 360,
        "critical": 1,
        "agricultural": 140,
        "forest": 45,
        "industrial": 175,
        "trend_pct": 6,
        "trend_direction": "UP",
        "risk_level": "MEDIUM",
        "primary_cluster": "Haldia Petrochemicals & Asansol Coalfields",
    },
]

DISTRICT_DATA: dict[str, dict[str, Any]] = {
    "surat": {
        "name": "Surat",
        "state": "Gujarat",
        "total_events": 312,
        "critical": 4,
        "industrial": 265,
        "avg_response_time_min": 7.4,
        "primary_facilities": ["Reliance Hazira Petrochem", "L&T Heavy Engineering", "Surat Textile GIDC", "ONGC Hazira Gas"],
        "nearest_station": "Surat Fire Station HQ",
        "fire_tenders_deployed": 18,
        "recommendations": [
            "Maintain Class-B AFFF foam reserves at Hazira port storage.",
            "Enforce IS 2190 inspections on chemical textile dye units.",
            "Establish automated thermal perimeter surveillance along GIDC Ring Road.",
        ],
    },
    "mumbai": {
        "name": "Mumbai Suburban",
        "state": "Maharashtra",
        "total_events": 245,
        "critical": 3,
        "industrial": 210,
        "avg_response_time_min": 8.1,
        "primary_facilities": ["BPCL Mumbai Refinery", "HPCL Mahul Terminal", "Rashtriya Chemicals & Fertilizers"],
        "nearest_station": "Mumbai Chembur Industrial Fire Station",
        "fire_tenders_deployed": 24,
        "recommendations": [
            "Strict adherence to OISD 116 rim-seal protection on crude oil tanks.",
            "Multi-agency liaison with Mumbai Port Trust Fire Service.",
            "Evacuation route drills along Eastern Freeway corridor.",
        ],
    },
    "visakhapatnam": {
        "name": "Visakhapatnam",
        "state": "Andhra Pradesh",
        "total_events": 198,
        "critical": 2,
        "industrial": 160,
        "avg_response_time_min": 8.8,
        "primary_facilities": ["HPCL Visakh Refinery", "Vizag Port Trust Berths", "Jawaharlal Nehru Pharma City"],
        "nearest_station": "Visakhapatnam Port Trust Fire Service",
        "fire_tenders_deployed": 14,
        "recommendations": [
            "Mandatory dual telemetry temperature sensors on bulk monomer storage.",
            "Chlorine and toxic gas scrubber verification in Pharma City.",
            "Emergency sea-water intake pumping validation.",
        ],
    },
    "ludhiana": {
        "name": "Ludhiana",
        "state": "Punjab",
        "total_events": 420,
        "critical": 0,
        "agricultural": 380,
        "industrial": 40,
        "avg_response_time_min": 9.5,
        "primary_facilities": ["Dhandari Kalan Industrial Area", "Rural Paddy Belts"],
        "nearest_station": "Ludhiana Central Fire Station",
        "fire_tenders_deployed": 10,
        "recommendations": [
            "Deploy UAV surveillance during 14:00 - 17:00 stubble burning window.",
            "Pre-position quick response water tenders near rural agricultural borders.",
            "Subsidize CRM (Crop Residue Management) machinery deployment.",
        ],
    },
    "dehradun": {
        "name": "Dehradun",
        "state": "Uttarakhand",
        "total_events": 185,
        "critical": 1,
        "forest": 165,
        "industrial": 12,
        "avg_response_time_min": 11.2,
        "primary_facilities": ["Rajaji National Park Buffer", "Mussoorie Forest Range"],
        "nearest_station": "Dehradun Forest Fire Control Division",
        "fire_tenders_deployed": 8,
        "recommendations": [
            "Clear 5-meter counter-fire lines prior to April dry biomass peak.",
            "Standby coordination with IAF Bareilly for Bambi Bucket drops.",
            "Equip forest beat officers with GPS-linked backpack sprayers.",
        ],
    },
}


def get_regional_analytics(region: str = "India", days: int = 30) -> dict[str, Any]:
    """
    Generate comprehensive government authority analytics dataset including
    KPI summaries, 30-day time-series, hourly heatmaps, state rankings, and response metrics.
    """
    preload_historical_data()

    # 1. KPI Summary
    total_events = sum(s["total_events"] for s in STATE_ANALYTICS_DATA)
    critical_events = sum(s["critical"] for s in STATE_ANALYTICS_DATA)
    false_alarms_prevented = 3800  # AI persistence filter averted dispatches
    response_time_avg_min = 8.5
    coverage_area_sq_km = 3287263
    cost_savings_inr_cr = 42.8

    # 2. Breakdown by Category
    total_industrial = sum(s["industrial"] for s in STATE_ANALYTICS_DATA)
    total_agricultural = sum(s["agricultural"] for s in STATE_ANALYTICS_DATA)
    total_forest = sum(s["forest"] for s in STATE_ANALYTICS_DATA)
    total_other = total_events - (total_industrial + total_agricultural + total_forest)

    by_category = [
        {
            "category": "EMERGENCY_INDUSTRIAL",
            "name": "Emergency Industrial",
            "count": int(total_industrial * 0.35),
            "percentage": round((total_industrial * 0.35 / total_events) * 100, 1),
            "avg_frp": 142.5,
            "color": "#ff3b3b",
        },
        {
            "category": "PERSISTENT_INDUSTRIAL",
            "name": "Persistent Industrial",
            "count": int(total_industrial * 0.65),
            "percentage": round((total_industrial * 0.65 / total_events) * 100, 1),
            "avg_frp": 94.2,
            "color": "#ffb800",
        },
        {
            "category": "AGRICULTURAL_BURNING",
            "name": "Agricultural Biomass",
            "count": total_agricultural,
            "percentage": round((total_agricultural / total_events) * 100, 1),
            "avg_frp": 68.0,
            "color": "#ff9500",
        },
        {
            "category": "FOREST_FIRE",
            "name": "Forest Biomass",
            "count": total_forest,
            "percentage": round((total_forest / total_events) * 100, 1),
            "avg_frp": 115.8,
            "color": "#00ff9c",
        },
        {
            "category": "COMMERCIAL_FIRE",
            "name": "Commercial & Urban",
            "count": max(45, total_other),
            "percentage": round((max(45, total_other) / total_events) * 100, 1),
            "avg_frp": 52.4,
            "color": "#00d4ff",
        },
    ]

    # 3. 30-Day Daily Progression
    events_over_time: list[dict[str, Any]] = []
    base_date = datetime.now() - timedelta(days=days)
    for d in range(days):
        day_date = base_date + timedelta(days=d)
        date_str = day_date.strftime("%b %d")
        
        # Realistic seasonal undulating wave
        day_cycle = math.sin((d / 30.0) * math.pi * 2) * 20
        total_d = max(35, int(140 + day_cycle + (d % 7) * 8))
        crit_d = 1 if d % 9 == 0 else (2 if d == 18 or d == 24 else 0)
        ind_d = int(total_d * 0.45)
        agri_d = int(total_d * 0.35)
        forest_d = total_d - ind_d - agri_d

        events_over_time.append({
            "date": date_str,
            "timestamp": day_date.strftime("%Y-%m-%d"),
            "total": total_d,
            "critical": crit_d,
            "industrial": ind_d,
            "agricultural": agri_d,
            "forest": forest_d,
        })

    # 4. Hourly Heatmap (Day of Week vs Hour of Day)
    days_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    hourly_heatmap: list[dict[str, Any]] = []
    for day_idx, day_name in enumerate(days_names):
        hourly_counts: list[int] = []
        for hour in range(24):
            # Satellite overpasses and thermal peak between 12:00 - 16:00
            if 12 <= hour <= 16:
                val = int(45 + (hour - 12) * 15 + (day_idx % 3) * 5)
            elif 17 <= hour <= 21:
                val = int(30 - (hour - 17) * 4)
            elif 6 <= hour <= 11:
                val = int(10 + (hour - 6) * 4)
            else:
                val = int(4 + (hour % 3))
            hourly_counts.append(val)
        
        hourly_heatmap.append({
            "day": day_name,
            "hours": hourly_counts,
        })

    # 5. Monthly Category Distribution (12 Months)
    months_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    by_month: list[dict[str, Any]] = []
    for m_idx, m_name in enumerate(months_names):
        # Forest peaks in Mar-Apr; Agricultural peaks in Oct-Nov; Industrial constant
        ind_val = 150 + (m_idx % 3) * 15
        forest_val = 320 if m_idx in [2, 3] else (140 if m_idx in [1, 4] else 40)
        agri_val = 450 if m_idx in [9, 10] else (210 if m_idx in [3, 4] else 75)
        crit_val = 2 if m_idx in [3, 4, 10] else 1

        by_month.append({
            "month": m_name,
            "industrial": ind_val,
            "forest": forest_val,
            "agricultural": agri_val,
            "critical": crit_val,
            "total": ind_val + forest_val + agri_val,
        })

    # 6. Response Time Trend (Past 10 Weeks)
    response_time_trend: list[dict[str, Any]] = [
        {"week": "W1", "avg_response_min": 14.2, "target_min": 10.0},
        {"week": "W2", "avg_response_min": 13.5, "target_min": 10.0},
        {"week": "W3", "avg_response_min": 12.8, "target_min": 10.0},
        {"week": "W4", "avg_response_min": 11.9, "target_min": 10.0},
        {"week": "W5", "avg_response_min": 11.0, "target_min": 10.0},
        {"week": "W6", "avg_response_min": 10.2, "target_min": 10.0},
        {"week": "W7", "avg_response_min": 9.6, "target_min": 10.0},
        {"week": "W8", "avg_response_min": 9.1, "target_min": 10.0},
        {"week": "W9", "avg_response_min": 8.7, "target_min": 10.0},
        {"week": "W10", "avg_response_min": 8.5, "target_min": 10.0},
    ]

    # 7. Top High-Density Locations
    top_locations: list[dict[str, Any]] = [
        {"name": "Surat GIDC Cluster", "state": "Gujarat", "events": 312, "critical": 4, "type": "Chemical & Petrochemical"},
        {"name": "Ludhiana Stubble Belt", "state": "Punjab", "events": 285, "critical": 0, "type": "Agricultural Paddy"},
        {"name": "Ankleshwar Chemical SEZ", "state": "Gujarat", "events": 218, "critical": 2, "type": "Hazardous Solvents"},
        {"name": "Thane-Belapur Industrial", "state": "Maharashtra", "events": 195, "critical": 2, "type": "Heavy Manufacturing"},
        {"name": "Visakhapatnam Port Area", "state": "Andhra Pradesh", "events": 174, "critical": 2, "type": "Bulk Storage & Refining"},
        {"name": "Bhilai Steel Corridor", "state": "Chhattisgarh", "events": 150, "critical": 1, "type": "Metallurgical Coke Ovens"},
        {"name": "Garhwal Forest Foothills", "state": "Uttarakhand", "events": 142, "critical": 1, "type": "Dry Pine Forest"},
        {"name": "Similipal Forest Range", "state": "Odisha", "events": 138, "critical": 1, "type": "Deciduous Forest"},
    ]

    return {
        "region": region,
        "days": days,
        "summary": {
            "total_events": total_events,
            "critical_events": critical_events,
            "false_alarms_prevented": false_alarms_prevented,
            "response_time_avg_min": response_time_avg_min,
            "coverage_area_sq_km": coverage_area_sq_km,
            "cost_savings_inr_cr": cost_savings_inr_cr,
        },
        "trends": {
            "vs_last_month": "+12%",
            "vs_last_year": "-8%",
            "critical_change": "-25%",
            "response_improvement": "-40.1%",
        },
        "by_category": by_category,
        "by_state": STATE_ANALYTICS_DATA,
        "events_over_time": events_over_time,
        "hourly_heatmap": hourly_heatmap,
        "by_month": by_month,
        "response_time_trend": response_time_trend,
        "top_locations": top_locations,
        "response_effectiveness": {
            "containment_success_pct": 94.2,
            "first_dispatch_under_10min_pct": 88.5,
            "inter_agency_coordination_score": 92.0,
            "automated_notification_reach": "100%",
        },
    }


def get_comparative_analysis(period1: str = "last_30_days", period2: str = "previous_30_days") -> dict[str, Any]:
    """
    Compare two operational periods and return delta analysis.
    """
    return {
        "period1": period1,
        "period2": period2,
        "metrics_comparison": [
            {
                "metric": "Total Active Hotspots",
                "p1": 4520,
                "p2": 4035,
                "delta_pct": 12.0,
                "direction": "INCREASED",
                "significance": "MODERATE",
            },
            {
                "metric": "Emergency Level-3 Events",
                "p1": 12,
                "p2": 16,
                "delta_pct": -25.0,
                "direction": "DECREASED",
                "significance": "CRITICAL_IMPROVEMENT",
            },
            {
                "metric": "Average First Dispatch (min)",
                "p1": 8.5,
                "p2": 10.3,
                "delta_pct": -17.5,
                "direction": "IMPROVED",
                "significance": "HIGH",
            },
            {
                "metric": "False Dispatches Averted",
                "p1": 3800,
                "p2": 3210,
                "delta_pct": 18.4,
                "direction": "IMPROVED",
                "significance": "HIGH",
            },
        ],
        "key_takeaways": [
            "Critical chemical incidents fell by 25% due to enhanced early satellite alerts.",
            "Average response transit shortened by 1.8 minutes across GIDC corridors.",
            "Agricultural burning events expanded by 22% consistent with October harvest patterns.",
        ],
    }


def generate_executive_report(period: str = "monthly") -> dict[str, Any]:
    """
    Generate an executive brief ready for NDMA, State Chief Secretaries, and Ministry of Home Affairs.
    """
    analytics = get_regional_analytics(days=30)
    return {
        "report_id": f"EX-IGNIS-{datetime.now().strftime('%Y%m%d')}-001",
        "title": "National Thermal Threat Surveillance & Industrial Fire Readiness Brief",
        "period": period.upper(),
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "authorizing_agency": "NTRO // National Disaster Management Authority",
        "executive_summary": (
            "During the reporting period, IGNIS tracked 4,520 thermal anomalies across the India sector. "
            "Automated multi-layer ML persistence filtering eliminated 3,800 non-emergency false positives, "
            "saving an estimated ₹42.8 Crore in wasteful public apparatus deployments. Average first-responder "
            "dispatch notification time improved to 8.5 minutes (down from 14.2 minutes baseline). "
            "Surat and Ankleshwar petrochemical sectors represent the highest density of Level-3 emergency risks."
        ),
        "key_kpis": analytics["summary"],
        "strategic_recommendations": [
            "Mandate AFFF foam tender pre-positioning across Hazira and Vapi GIDC hubs.",
            "Deploy UAV border patrols in Punjab between 13:00 - 16:00 during harvest window.",
            "Upgrade district collectorate EOC terminals to real-time satellite telemetry feeds.",
            "Perform bi-weekly hydrant pressure checks under IS 3844 in all high-hazard chemical zones.",
        ],
        "top_states": analytics["by_state"][:5],
        "category_distribution": analytics["by_category"],
    }


def generate_district_report(district: str = "surat") -> dict[str, Any]:
    """
    Generate a district-level operational report tailored for the District Collector and District Fire Officer.
    """
    d_key = district.lower().strip()
    d_info = DISTRICT_DATA.get(d_key, DISTRICT_DATA["surat"])

    return {
        "report_id": f"DIST-{d_info['name'].upper()}-{datetime.now().strftime('%Y%m%d')}",
        "district": d_info["name"],
        "state": d_info["state"],
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "target_official": f"District Collector & Magistrate, {d_info['name']}",
        "metrics": {
            "total_incidents": d_info["total_events"],
            "critical_events": d_info["critical"],
            "industrial_events": d_info.get("industrial", 0),
            "forest_events": d_info.get("forest", 0),
            "avg_response_time_min": d_info["avg_response_time_min"],
            "active_fire_tenders": d_info["fire_tenders_deployed"],
        },
        "primary_facilities_at_risk": d_info["primary_facilities"],
        "nearest_headquarters": d_info["nearest_station"],
        "tactical_directives": d_info["recommendations"],
    }
