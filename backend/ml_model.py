import json
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from geopy.distance import geodesic
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

from config import CACHE_DIR
from firms import fetch_all_sources
from osm_data import find_nearest_industry

# Ensure cache directory exists on module load
Path(CACHE_DIR).mkdir(parents=True, exist_ok=True)

CLASS_NAMES: list[str] = [
    "PERSISTENT_INDUSTRIAL",
    "EMERGENCY_INDUSTRIAL",
    "AGRICULTURAL_BURNING",
    "FOREST_FIRE",
    "UNKNOWN",
]


def _map_confidence(conf_val: Any) -> int:
    """Map string or numerical confidence into discrete 1 (low), 2 (nominal), 3 (high)."""
    if isinstance(conf_val, (int, float)):
        if conf_val >= 80:
            return 3
        if conf_val >= 50:
            return 2
        return 1
    conf_str = str(conf_val).strip().lower()
    if conf_str in ("high", "h"):
        return 3
    if conf_str in ("low", "l"):
        return 1
    return 2


def build_persistence_cache(days: int = 7) -> dict[tuple[float, float], float]:
    """Fetch fires across given days, calculate thermal persistence per ~1km grid cell, and cache."""
    fires = fetch_all_sources(days=days)
    cells: dict[tuple[float, float], set[str]] = {}

    for fire in fires:
        try:
            lat = round(float(fire["latitude"]), 2)
            lon = round(float(fire["longitude"]), 2)
            date_str = str(fire.get("acq_date", "")).strip()
            key = (lat, lon)
            if key not in cells:
                cells[key] = set()
            if date_str:
                cells[key].add(date_str)
        except (ValueError, KeyError, TypeError):
            continue

    persistence_cache: dict[tuple[float, float], float] = {}
    json_export: dict[str, float] = {}

    for cell, dates in cells.items():
        date_count = len(dates) if dates else 1
        pct = round((date_count / max(days, 1)) * 100.0, 2)
        persistence_cache[cell] = pct
        json_export[f"{cell[0]},{cell[1]}"] = pct

    cache_file = Path(CACHE_DIR) / "persistence.json"
    cache_file.write_text(json.dumps(json_export, indent=2), encoding="utf-8")
    print(f"[IGNIS] Persistence cache built: {len(persistence_cache)} locations tracked")
    return persistence_cache


def load_persistence_cache() -> dict[tuple[float, float], float]:
    """Load persistence data from cache/persistence.json and convert keys to (lat, lon) tuples."""
    cache_file = Path(CACHE_DIR) / "persistence.json"
    if not cache_file.exists():
        print("[IGNIS] Persistence cache file missing. Returning empty cache.")
        return {}

    try:
        raw_data = json.loads(cache_file.read_text(encoding="utf-8"))
        cache: dict[tuple[float, float], float] = {}
        for k, v in raw_data.items():
            try:
                parts = k.split(",")
                lat = round(float(parts[0].strip()), 2)
                lon = round(float(parts[1].strip()), 2)
                cache[(lat, lon)] = float(v)
            except (ValueError, IndexError):
                continue
        print(f"[IGNIS] Loaded {len(cache)} persistence records from cache")
        return cache
    except Exception as exc:
        print(f"[IGNIS] Error reading persistence cache: {exc}")
        return {}


def get_persistence(lat: float, lon: float, cache: dict) -> float:
    """Retrieve persistence percentage for a coordinate rounded to 2 decimals (~1km grid)."""
    key = (round(lat, 2), round(lon, 2))
    if key in cache:
        return float(cache[key])
    str_key = f"{key[0]},{key[1]}"
    if str_key in cache:
        return float(cache[str_key])
    return 0.0


def _extract_fire_features_and_label(
    fire: dict[str, Any], zones: list[dict[str, Any]], persistence_cache: dict
) -> tuple[list[float], int]:
    """Extract ordered 8-feature vector and ground truth label using rule thresholds."""
    lat = float(fire.get("latitude", 0.0))
    lon = float(fire.get("longitude", 0.0))
    frp = float(fire.get("frp", 0.0))
    brightness = float(fire.get("brightness", 0.0))
    conf_num = float(_map_confidence(fire.get("confidence", "nominal")))

    nearest = find_nearest_industry(lat, lon, zones)
    dist_km = float(nearest.get("distance_km", 999.0))
    pers_pct = float(get_persistence(lat, lon, persistence_cache))

    is_agri = 1.0 if (
        (28.0 <= lat <= 32.0 and 74.0 <= lon <= 80.0)
        or (24.0 <= lat <= 28.0 and 78.0 <= lon <= 84.0)
    ) else 0.0

    month = datetime.now().month
    acq_date = str(fire.get("acq_date", "")).strip()
    if acq_date:
        try:
            month = datetime.strptime(acq_date, "%Y-%m-%d").month
        except ValueError:
            pass
    is_burning = 1.0 if month in [4, 5, 10, 11] else 0.0

    hour = 12.0
    acq_time = str(fire.get("acq_time", "")).strip()
    if acq_time:
        try:
            hour = float(int(acq_time[:2])) if len(acq_time) >= 2 else float(int(acq_time))
        except (ValueError, TypeError):
            hour = 12.0

    if pers_pct > 60.0 and dist_km < 5.0:
        label = 0  # PERSISTENT_INDUSTRIAL
    elif pers_pct < 20.0 and dist_km < 10.0 and frp > 50.0:
        label = 1  # EMERGENCY_INDUSTRIAL
    elif is_agri == 1.0 and is_burning == 1.0:
        label = 2  # AGRICULTURAL_BURNING
    elif dist_km > 15.0 and frp > 10.0:
        label = 3  # FOREST_FIRE
    else:
        label = 4  # UNKNOWN

    feat_vector = [
        frp,
        brightness,
        conf_num,
        dist_km,
        pers_pct,
        is_agri,
        is_burning,
        hour,
    ]
    return feat_vector, label


def train_ml_classifier(
    fires: list[dict[str, Any]], zones: list[dict[str, Any]], persistence_cache: dict
) -> tuple[Optional[RandomForestClassifier], float]:
    """Train RandomForestClassifier on extracted features and rule-based labels."""
    if len(fires) < 20:
        print(f"[IGNIS] Insufficient training samples ({len(fires)} < 20). Skipping training.")
        return (None, 0.0)

    x_samples: list[list[float]] = []
    y_samples: list[int] = []

    for fire in fires:
        try:
            feats, label = _extract_fire_features_and_label(fire, zones, persistence_cache)
            x_samples.append(feats)
            y_samples.append(label)
        except Exception:
            continue

    if len(x_samples) < 20:
        print(f"[IGNIS] Valid parsed samples ({len(x_samples)} < 20). Skipping training.")
        return (None, 0.0)

    x_arr = np.array(x_samples)
    y_arr = np.array(y_samples)

    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)

    mean_acc = 0.0
    try:
        # Cross validation requires at least 3 samples per class for 3-fold stratified cv
        counts = np.bincount(y_arr)
        if len(counts) > 1 and np.min(counts[counts > 0]) >= 3:
            scores = cross_val_score(clf, x_arr, y_arr, cv=3)
            mean_acc = float(np.mean(scores))
        else:
            clf.fit(x_arr, y_arr)
            mean_acc = float(clf.score(x_arr, y_arr))
    except Exception:
        clf.fit(x_arr, y_arr)
        mean_acc = float(clf.score(x_arr, y_arr))

    clf.fit(x_arr, y_arr)

    model_path = Path(CACHE_DIR) / "ignis_classifier.pkl"
    joblib.dump(clf, model_path)
    print(f"[IGNIS] Model trained (accuracy: {round(mean_acc, 3)}) and saved to {model_path}")
    return (clf, round(mean_acc, 3))


def predict_ml(
    model: Optional[RandomForestClassifier], features: dict[str, Any]
) -> tuple[str, float]:
    """Predict fire classification and confidence percentage using the trained model."""
    if model is None:
        return ("UNKNOWN", 0.0)

    try:
        frp = float(features.get("frp", 0.0))
        brightness = float(features.get("brightness", 0.0))
        conf_num = float(features.get("confidence_num", _map_confidence(features.get("confidence", 2))))
        dist_km = float(features.get("nearest_industry_km", features.get("osm_dist_km", 999.0)))
        pers_pct = float(features.get("persistence_pct", 0.0))
        is_agri = float(features.get("is_agri_region", 0.0))
        is_burning = float(features.get("is_burning_season", 0.0))
        hour = float(features.get("hour_of_day", 12.0))

        feat_vector = np.array([[
            frp,
            brightness,
            conf_num,
            dist_km,
            pers_pct,
            is_agri,
            is_burning,
            hour,
        ]])

        pred_idx = int(model.predict(feat_vector)[0])
        probabilities = model.predict_proba(feat_vector)[0]
        if hasattr(model, "classes_") and pred_idx in model.classes_:
            class_pos = list(model.classes_).index(pred_idx)
            confidence_pct = round(float(probabilities[class_pos]) * 100.0, 2)
        else:
            confidence_pct = round(float(np.max(probabilities)) * 100.0, 2)
        category_name = CLASS_NAMES[pred_idx] if 0 <= pred_idx < len(CLASS_NAMES) else "UNKNOWN"
        return (category_name, confidence_pct)
    except Exception as exc:
        print(f"[IGNIS] Prediction error: {exc}")
        return ("UNKNOWN", 0.0)


# Backward compatibility helper for existing classifier.py
def predict_thermal_anomaly(features: list[float]) -> tuple[str, float]:
    """Compatibility adapter for classifier.py: maps 7-feature input to classification label and score."""
    model_path = Path(CACHE_DIR) / "ignis_classifier.pkl"
    fallback_model_file = Path(__file__).resolve().parent / "ignis_rf_model.joblib"
    try:
        if model_path.exists():
            clf = joblib.load(model_path)
            # Adapt 7-feature vector to 8-feature vector by appending nominal confidence
            adapted = [
                features[2],  # frp
                features[0],  # brightness
                2.0,          # confidence_num
                features[3] / 1000.0 if features[3] > 100 else features[3],  # dist_km
                features[5],  # persistence_pct
                0.0,          # is_agri
                0.0,          # is_burning
                12.0          # hour
            ]
            pred_idx = int(clf.predict([adapted])[0])
            probabilities = clf.predict_proba([adapted])[0]
            if hasattr(clf, "classes_") and pred_idx in clf.classes_:
                pos = list(clf.classes_).index(pred_idx)
                prob = float(probabilities[pos])
            else:
                prob = float(np.max(probabilities))
            return (CLASS_NAMES[pred_idx], round(prob, 3))
        elif fallback_model_file.exists():
            clf = joblib.load(fallback_model_file)
            pred_idx = int(clf.predict([features])[0])
            prob = float(clf.predict_proba([features])[0][pred_idx])
            return (CLASS_NAMES[pred_idx], round(prob, 3))
    except Exception:
        pass
    return ("UNKNOWN", 0.5)
