"""
IGNIS — ResponseEngine
Retrieves material-based firefighting response protocols and enriches
thermal detection records with specialized operational guidelines.
"""

import os
import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger("ignis_telemetry")

BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_FILE = BASE_DIR / "knowledge" / "fire_response.json"

_PROTOCOLS_CACHE: Optional[Dict[str, Any]] = None


def _load_protocols() -> Dict[str, Any]:
    """Load and cache fire response knowledge protocols from JSON file."""
    global _PROTOCOLS_CACHE
    if _PROTOCOLS_CACHE is not None:
        return _PROTOCOLS_CACHE

    target_path = KNOWLEDGE_FILE
    if not target_path.exists():
        # Fallback to root or cache directory search
        alt_path = BASE_DIR.parent / "knowledge" / "fire_response.json"
        if alt_path.exists():
            target_path = alt_path

    if target_path.exists():
        try:
            with open(target_path, "r", encoding="utf-8") as f:
                _PROTOCOLS_CACHE = json.load(f)
                return _PROTOCOLS_CACHE
        except Exception as e:
            logger.error("Failed to load fire_response.json: %s", e)

    # Hardcoded fallback in case file cannot be read
    return {
        "UNKNOWN": {
            "fire_class": "Unknown - requires verification",
            "typical_materials": ["Unknown"],
            "use_agents": {"primary": ["Verify before action"], "secondary": []},
            "avoid": ["Approach without verification"],
            "equipment_required": ["Reconnaissance drone", "Fire officer for assessment"],
            "safety_distance_m": 500,
            "response_time_target_min": 20,
            "personnel_required": 3,
            "coordination": ["Local authorities for ground truth"],
            "special_notes": "Send ground team for visual confirmation before dispatching resources. Use satellite imagery cross-reference.",
            "evacuation_radius_m": 500,
            "hospital_notification": False,
        }
    }


def get_response_protocol(category: str) -> dict[str, Any]:
    """
    Retrieve material-based fire response recommendations for a given fire category.
    Handles case variations, unknown categories, and missing data gracefully.
    """
    protocols = _load_protocols()
    cat_key = (category or "UNKNOWN").strip().upper()

    # Direct match
    if cat_key in protocols:
        return protocols[cat_key]

    # Category alias mapping
    alias_map = {
        "EMERGENCY": "EMERGENCY_INDUSTRIAL",
        "PERSISTENT": "PERSISTENT_INDUSTRIAL",
        "AGRICULTURAL": "AGRICULTURAL_BURNING",
        "AGRI": "AGRICULTURAL_BURNING",
        "STUBBLE": "AGRICULTURAL_BURNING",
        "FOREST": "FOREST_FIRE",
        "WILDFIRE": "FOREST_FIRE",
    }
    mapped_key = alias_map.get(cat_key)
    if mapped_key and mapped_key in protocols:
        return protocols[mapped_key]

    return protocols.get("UNKNOWN", {
        "fire_class": "Unknown - requires verification",
        "typical_materials": ["Unknown"],
        "use_agents": {"primary": ["Verify before action"], "secondary": []},
        "avoid": ["Approach without verification"],
        "equipment_required": ["Reconnaissance drone", "Fire officer for assessment"],
        "safety_distance_m": 500,
        "response_time_target_min": 20,
        "personnel_required": 3,
        "coordination": ["Local authorities for ground truth"],
        "special_notes": "Send ground team for visual confirmation before dispatching resources.",
        "evacuation_radius_m": 500,
        "hospital_notification": False,
    })


def enrich_fire_with_protocol(fire: dict[str, Any]) -> dict[str, Any]:
    """
    Adds 'response_protocol' field to a classified fire detection object.
    Preserves all existing fire fields and metadata.
    """
    if not isinstance(fire, dict):
        return fire

    cat = fire.get("category") or fire.get("classification") or "UNKNOWN"
    protocol = get_response_protocol(str(cat))

    enriched = dict(fire)
    enriched["response_protocol"] = protocol
    return enriched
