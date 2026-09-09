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

        # Check explicit distance or find nearest from zones
        explicit_dist = fire.get("distance_km") if fire.get("distance_km") is not None else fire.get("facility_dist")
        if explicit_dist is not None:
            distance_km = float(explicit_dist)
            nearest_name = str(fire.get("facility_name") or fire.get("nearest_facility") or nearest.get("name", "Industrial Facility"))
        else:
            distance_km = float(nearest.get("distance_km", 999.0))
            nearest_name = str(nearest.get("name", "Unknown"))

        return {
            "distance_km": distance_km,
            "nearest_name": nearest_name,
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
        if ctx["is_cremation"] and (persistence > 30.0 or frp < 20.0):
            return {
                "category": "PERSISTENT_INDUSTRIAL",
                "confidence": 88,
                "risk_level": "LOW",
                "color": "yellow",
                "reason": "Persistent cultural/religious thermal signature; not emergency",
                "action": "No emergency action needed. Cultural/religious thermal source.",
            }

        # RULE 1: Persistent Industrial (known facility with regular thermal baseline)
        if (dist < 6.0 and persistence >= 25.0) or (dist < 8.0 and persistence >= 40.0):
            return {
                "category": "PERSISTENT_INDUSTRIAL",
                "confidence": 94,
                "risk_level": "LOW",
                "color": "yellow",
                "reason": f"Persistent plant heat signature ({ctx['nearest_name']}); operational flare / furnace; not emergency",
                "action": "No emergency action needed. Normal industrial operational thermal source.",
            }

        # RULE 2: Emergency Industrial Fire (requires high FRP, close proximity, AND low historical persistence)
        # Emergency only if all conditions match:
        # - FRP >= 25.0 MW
        # - Distance <= 3.5 km to facility
        # - Historical persistence < 20.0% (unscheduled/sudden flare)
        if dist <= 3.5 and persistence < 20.0 and frp >= 25.0:
            return {
                "category": "EMERGENCY_INDUSTRIAL",
                "confidence": 92,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": (
                    f"Unscheduled thermal surge ({frp:.1f}MW) within {dist:.1f}km of {ctx['nearest_name']} "
                    f"with no historical baseline. High emergency risk."
                ),
                "action": "🚨 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
            }

        # RULE 3: Low-Intensity Domestic / Garbage / Bonfire Suppression (Prevents false alarms)
        if frp < 18.0 and dist > 2.0:
            # Check if it is seasonal agricultural burning
            if ctx["is_agri"] and ctx["is_burning_season"] and frp >= 12.0:
                return {
                    "category": "AGRICULTURAL_BURNING",
                    "confidence": 84,
                    "risk_level": "MODERATE",
                    "color": "orange",
                    "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
                    "action": "Log in state pollution registry. Monitor for potential spread.",
                }
            # Otherwise, classify as low-intensity localized burn
            return {
                "category": "UNKNOWN",
                "confidence": 85,
                "risk_level": "LOW",
                "color": "gray",
                "reason": "Low-intensity localized burn likely domestic/garbage; monitoring only",
                "action": "No emergency action required. Routine municipal monitoring.",
            }

        # RULE 4: Agricultural Burning (seasonal crop residue / open biomass)
        if (ctx["is_agri"] or ctx["is_burning_season"]) and frp < 60.0 and dist > 4.0:
            return {
                "category": "AGRICULTURAL_BURNING",
                "confidence": 88,
                "risk_level": "MODERATE",
                "color": "orange",
                "reason": "Seasonal agricultural burning pattern (stubble/crop residue)",
                "action": "Log in state pollution registry. Monitor for potential spread.",
            }

        # RULE 5: Forest Fire (remote wilderness canopy / non-agricultural)
        if dist > 12.0 and frp >= 15.0 and not ctx["is_agri"]:
            return {
                "category": "FOREST_FIRE",
                "confidence": 86,
                "risk_level": "HIGH",
                "color": "green",
                "reason": "Forest reserve perimeter thermal anomaly detected",
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
                if cat != "UNKNOWN" and ml_conf >= 65.0:
                    # Prevent ML from declaring emergency if FRP is low or far from industry
                    if cat == "EMERGENCY_INDUSTRIAL" and (frp < 25.0 or dist > 3.5):
                        cat = "UNKNOWN"
                    
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
                    if cat in risk_meta:
                        r_level, r_color, r_act = risk_meta[cat]
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

        # RULE 6: Unknown Fallback (Low risk if low FRP)
        if frp < 25.0:
            return {
                "category": "UNKNOWN",
                "confidence": 80,
                "risk_level": "LOW",
                "color": "gray",
                "reason": "Low-intensity localized burn likely domestic/garbage; monitoring only",
                "action": "No emergency action required. Routine municipal monitoring.",
            }

        return {
            "category": "UNKNOWN",
            "confidence": 55,
            "risk_level": "MODERATE",
            "color": "gray",
            "reason": (
                f"Uncorrelated thermal anomaly ({frp:.1f}MW). Proximity to industry: {dist:.1f}km. "
                f"Persistence: {persistence:.0f}%."
            ),
            "action": "Manual verification recommended. Cross-check with local authorities.",
        }

    def classify_batch(self, fires: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Classify multiple fires and return enriched detection list with material response protocols."""
        from response_engine import enrich_fire_with_protocol

        results = []
        for fire in fires:
            res = self.classify(fire)
            classified_item = {
                **fire,
                **res,
                "classification": res["category"],
                "confidence_score": round(float(res["confidence"]) / 100.0, 2),
            }
            results.append(enrich_fire_with_protocol(classified_item))
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
    from response_engine import enrich_fire_with_protocol

    zones = load_or_cache_zones()
    cache = load_persistence_cache()
    classifier = FireClassifier(zones, cache)
    res = classifier.classify(record)
    classified_item = {
        **record,
        **res,
        "classification": res["category"],
        "confidence_score": round(float(res["confidence"]) / 100.0, 2),
    }
    return enrich_fire_with_protocol(classified_item)


def classify_batch(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Module-level helper to classify a batch of fire records with cached context."""
    from ml_model import load_persistence_cache
    from osm_data import load_or_cache_zones

    zones = load_or_cache_zones()
    cache = load_persistence_cache()
    classifier = FireClassifier(zones, cache)
    return classifier.classify_batch(records)
