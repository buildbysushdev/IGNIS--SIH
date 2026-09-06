from typing import Any, Dict, List, Optional


class FireClassifier:
    """Core IGNIS Intelligence Engine: Hybrid Rule-Based, Spatial, Temporal, and ML Fire Classifier."""

    def __init__(
        self,
        industrial_zones: list[dict[str, Any]],
        persistence_cache: dict[Any, float],
        ml_model: Optional[Any] = None,
    ) -> None:
        self.zones = industrial_zones
        self.persistence_cache = persistence_cache
        self.ml_model = ml_model

    def _check_context(self, fire: dict[str, Any]) -> dict[str, Any]:
        """Extract contextual spatial, temporal, and radiometric features from a fire point."""
        lat = float(fire["latitude"])
        lon = float(fire["longitude"])

        # Nearest industrial zone
        from osm_data import find_nearest_industry

        nearest = find_nearest_industry(lat, lon, self.zones)

        # Persistence percentage lookup
        from ml_model import get_persistence

        persistence = get_persistence(lat, lon, self.persistence_cache)

        # Agricultural belt check (Punjab, Haryana, Indo-Gangetic, Deccan & Kaveri delta plains)
        is_agri = (
            (28.0 <= lat <= 32.5 and 74.0 <= lon <= 80.0) or
            (24.0 <= lat <= 28.5 and 77.0 <= lon <= 88.5) or
            (17.5 <= lat <= 23.5 and 73.5 <= lon <= 82.5) or
            (9.5 <= lat <= 16.5 and 75.5 <= lon <= 81.0)
        )

        # Post-harvest burning season check
        try:
            date_val = str(fire.get("acq_date", "2026-01-01"))
            month = int(date_val.split("-")[1])
        except Exception:
            month = 1
        is_burning_season = month in [3, 4, 5, 9, 10, 11, 12]

        # Cremation ground proximity (e.g. Varanasi Manikarnika & Haridwar approximate corridors)
        is_cremation = (25.20 < lat < 25.40 and 82.90 < lon < 83.10) or (
            29.90 < lat < 30.05 and 78.10 < lon < 78.25
        )

        return {
            "distance_km": float(nearest.get("distance_km", 999.0)),
            "nearest_name": str(nearest.get("name", "Unknown")),
            "persistence": persistence,
            "is_agri": is_agri,
            "is_burning_season": is_burning_season,
            "is_cremation": is_cremation,
            "frp": float(fire.get("frp", 0.0)),
            "brightness": float(fire.get("brightness", 0.0)),
        }

    def classify(self, fire: dict[str, Any]) -> dict[str, Any]:
        """Classify a single thermal detection returning category, confidence, risk_level, color, reason, action."""
        ctx = self._check_context(fire)
        dist = ctx["distance_km"]
        persistence = ctx["persistence"]
        frp = ctx["frp"]
        lat = float(fire["latitude"])
        lon = float(fire["longitude"])

        # EDGE CASE 1: Cremation grounds with persistent thermal signatures
        if ctx["is_cremation"] and persistence > 40.0:
            return {
                "category": "PERSISTENT_INDUSTRIAL",
                "confidence": 88,
                "risk_level": "LOW",
                "color": "yellow",
                "reason": (
                    f"Cremation ground thermal source at {lat:.2f},{lon:.2f}. "
                    f"Persistent {persistence:.0f}% of days."
                ),
                "action": "No emergency action needed. Cultural/religious thermal source.",
            }

        # RULE 1: Persistent Industrial (steel plant, refinery, flare, or kiln)
        if (dist < 6.0 and persistence > 35.0) or (dist < 3.0 and frp > 30.0):
            return {
                "category": "PERSISTENT_INDUSTRIAL",
                "confidence": 92,
                "risk_level": "LOW",
                "color": "yellow",
                "reason": (
                    f"Within {dist:.1f}km of {ctx['nearest_name']}. Hot {persistence:.0f}% of past days. "
                    "Likely furnace/flare/kiln."
                ),
                "action": "No emergency action needed. Normal industrial operational thermal source.",
            }

        # RULE 2: Emergency Industrial Fire (sudden intense spike in/near industrial zone)
        if dist < 12.0 and persistence < 25.0 and frp > 45.0:
            return {
                "category": "EMERGENCY_INDUSTRIAL",
                "confidence": 89,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": (
                    f"Near {ctx['nearest_name']} ({dist:.1f}km) with NO recurring baseline. "
                    f"High FRP ({frp:.1f}MW). Unexpected industrial fire spike!"
                ),
                "action": "🚨 DISPATCH FIRE SERVICES IMMEDIATELY! Notify district disaster cell.",
            }

        # RULE 3: Agricultural Burning (crop stubble burning in agrarian regions)
        if ctx["is_agri"] and frp < 55.0 and dist > 5.0:
            return {
                "category": "AGRICULTURAL_BURNING",
                "confidence": 86,
                "risk_level": "MODERATE",
                "color": "orange",
                "reason": (
                    f"Agrarian corridor at {lat:.2f},{lon:.2f}. "
                    f"FRP {frp:.1f}MW consistent with open biomass / crop residue burning."
                ),
                "action": "Log in state pollution registry. Monitor for potential spread.",
            }

        # RULE 4: Forest Fire (remote non-industrial wilderness / vegetation canopy)
        if dist > 15.0 and frp >= 5.0 and not ctx["is_agri"]:
            return {
                "category": "FOREST_FIRE",
                "confidence": 81,
                "risk_level": "HIGH",
                "color": "green",
                "reason": (
                    f"Remote wildland zone ({dist:.1f}km from nearest facility). "
                    f"FRP {frp:.1f}MW indicating forest/brush combustion."
                ),
                "action": "🚨 Notify Forest Department & NDRF regional response unit.",
            }

        # Optional ML Fallback Enhancement
        if self.ml_model is not None:
            try:
                from ml_model import predict_ml

                feat = {
                    "frp": frp,
                    "brightness": ctx["brightness"],
                    "confidence": fire.get("confidence", "nominal"),
                    "nearest_industry_km": dist,
                    "persistence_pct": persistence,
                    "is_agri_region": 1 if ctx["is_agri"] else 0,
                    "is_burning_season": 1 if ctx["is_burning_season"] else 0,
                    "hour_of_day": 12,
                }
                cat, ml_conf = predict_ml(self.ml_model, feat)
                if cat != "UNKNOWN" and ml_conf >= 60.0:
                    risk_meta = {
                        "EMERGENCY_INDUSTRIAL": (
                            "CRITICAL",
                            "red",
                            "🚨 DISPATCH FIRE SERVICES! ML anomaly detected near facility.",
                        ),
                        "PERSISTENT_INDUSTRIAL": (
                            "LOW",
                            "yellow",
                            "No emergency action needed. ML detected persistent source.",
                        ),
                        "AGRICULTURAL_BURNING": (
                            "MODERATE",
                            "orange",
                            "Monitor air quality. ML classified agrarian burning.",
                        ),
                        "FOREST_FIRE": (
                            "HIGH",
                            "green",
                            "🚨 Notify Forest Department. ML classified remote wildland fire.",
                        ),
                    }
                    r_level, r_color, r_act = risk_meta.get(
                        cat, ("MODERATE", "gray", "Verify with local authorities.")
                    )
                    return {
                        "category": cat,
                        "confidence": int(round(ml_conf)),
                        "risk_level": r_level,
                        "color": r_color,
                        "reason": f"ML model classified as {cat} with {ml_conf:.1f}% probability based on feature signature.",
                        "action": r_act,
                    }
            except Exception:
                pass

        # RULE 5: Unknown
        return {
            "category": "UNKNOWN",
            "confidence": 45,
            "risk_level": "MODERATE",
            "color": "gray",
            "reason": (
                f"Low confidence classification. Industry: {dist}km. "
                f"FRP: {frp:.1f}MW. Persistence: {persistence:.0f}%."
            ),
            "action": "Manual verification recommended. Cross-check with local authorities.",
        }

    def classify_batch(self, fires: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Classify multiple fires and return enriched detection list."""
        results = []
        for fire in fires:
            res = self.classify(fire)
            results.append({
                **fire,
                **res,
                "classification": res["category"],
                "confidence_score": round(float(res["confidence"]) / 100.0, 2),
            })
        return results

    def get_summary(self, classified_fires: list[dict[str, Any]]) -> dict[str, int]:
        """Return category counts across classified detections."""
        summary = {
            "total": len(classified_fires),
            "emergency": 0,
            "persistent": 0,
            "agricultural": 0,
            "forest": 0,
            "unknown": 0,
        }
        for f in classified_fires:
            cat = f.get("category", f.get("classification", "UNKNOWN"))
            if cat == "EMERGENCY_INDUSTRIAL":
                summary["emergency"] += 1
            elif cat == "PERSISTENT_INDUSTRIAL":
                summary["persistent"] += 1
            elif cat == "AGRICULTURAL_BURNING":
                summary["agricultural"] += 1
            elif cat == "FOREST_FIRE":
                summary["forest"] += 1
            else:
                summary["unknown"] += 1
        return summary


# Module-level convenience functions
def classify_single_detection(record: dict[str, Any]) -> dict[str, Any]:
    """Module-level helper to classify a single fire record with cached context."""
    from ml_model import load_persistence_cache
    from osm_data import load_or_cache_zones

    zones = load_or_cache_zones()
    cache = load_persistence_cache()
    classifier = FireClassifier(zones, cache)
    res = classifier.classify(record)
    return {
        **record,
        **res,
        "classification": res["category"],
        "confidence_score": round(float(res["confidence"]) / 100.0, 2),
    }


def classify_batch(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Module-level helper to classify a batch of fire records with cached context."""
    from ml_model import load_persistence_cache
    from osm_data import load_or_cache_zones

    zones = load_or_cache_zones()
    cache = load_persistence_cache()
    classifier = FireClassifier(zones, cache)
    return classifier.classify_batch(records)
