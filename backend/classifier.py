from typing import Any, Dict, List, Optional


class FireClassifier:
    """Core IGNIS Intelligence Engine: Hybrid Rule-Based, Spatial, Temporal, and ML Fire Classifier."""

    def __init__(
        self,
        industrial_zones: Optional[list[dict[str, Any]]] = None,
        persistence_cache: Optional[dict[Any, float]] = None,
        ml_model: Optional[Any] = None,
    ) -> None:
        if industrial_zones is not None:
            self.zones = industrial_zones
        else:
            from osm_data import load_or_cache_zones
            self.zones = load_or_cache_zones()

        self.persistence_cache = persistence_cache if persistence_cache is not None else {}
        
        if ml_model is not None:
            self.ml_model = ml_model
        else:
            try:
                from ml_model import load_model
                self.ml_model = load_model()
            except Exception:
                self.ml_model = None

    def _check_context(self, fire: dict[str, Any]) -> dict[str, Any]:
        """Extract contextual spatial, temporal, radiometric, and urban amenity features from a fire point."""
        lat = float(fire["latitude"])
        lon = float(fire["longitude"])

        # Nearest industrial zone & urban amenities
        from osm_data import find_nearest_industry, get_location_context

        nearest = find_nearest_industry(lat, lon, self.zones)
        urban_ctx = get_location_context(lat, lon)

        # Explicit overrides from incoming payload if provided
        explicit_loc_type = fire.get("location_type") or fire.get("urban_type")
        location_type = str(explicit_loc_type or urban_ctx.get("location_type", "GENERAL")).upper()
        location_name = str(
            fire.get("facility_name")
            or fire.get("nearest_facility")
            or fire.get("name")
            or urban_ctx.get("name")
            or nearest.get("name", "Unknown")
        )
        population_density = str(
            fire.get("population_density")
            or ("HIGH" if location_type in ["SLUM", "MARKET", "HOSPITAL"] else "NORMAL")
        ).upper()

        # Persistence percentage lookup
        explicit_persistence = fire.get("persistence") if fire.get("persistence") is not None else fire.get("persistence_pct")
        if explicit_persistence is not None:
            persistence = float(explicit_persistence)
        else:
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

        explicit_dist = fire.get("distance_km") if fire.get("distance_km") is not None else fire.get("facility_dist")
        if explicit_dist is not None:
            distance_km = float(explicit_dist)
        else:
            distance_km = float(nearest.get("distance_km", 999.0))

        return {
            "distance_km": distance_km,
            "nearest_name": location_name,
            "location_type": location_type,
            "population_density": population_density,
            "urban_ctx": urban_ctx,
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
        location_type = ctx["location_type"]
        nearest_name = ctx["nearest_name"]
        pop_density = ctx["population_density"]

        # =========================================================================
        # PRIORITY URBAN EMERGENCY & HIGH-RISK RULES (LIFE-CRITICAL)
        # =========================================================================

        # 1. HOSPITAL FIRE (CRITICAL):
        if location_type == "HOSPITAL" and frp >= 10.0:
            return {
                "category": "HOSPITAL_FIRE",
                "confidence": 96,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": f"CRITICAL: Active thermal anomaly inside/adjacent to Hospital facility ({nearest_name}). High patient casualty risk.",
                "action": "🚨 IMMEDIATE DISPATCH! Notify ICU Triage, Medical Evacuation, and District Collector.",
            }

        # 2. PETROL PUMP / FUEL DEPOT (CRITICAL):
        if (location_type == "PETROL_PUMP" or "refinery" in nearest_name.lower() or "fuel" in nearest_name.lower()) and frp >= 12.0:
            return {
                "category": "FUEL_STATION_FIRE",
                "confidence": 95,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": f"CRITICAL: Fire near fuel storage / petrol pump ({nearest_name}). BLEVE & Explosion hazard.",
                "action": "🚨 FOAM TENDERS ONLY! DO NOT USE WATER. Evacuate 500m perimeter immediately.",
            }

        # 3. SCHOOL / COLLEGE FIRE (CRITICAL):
        if location_type == "SCHOOL" and frp >= 10.0:
            return {
                "category": "SCHOOL_FIRE",
                "confidence": 93,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": f"CRITICAL: Thermal anomaly at educational institution ({nearest_name}) during operational/occupancy window.",
                "action": "🚨 DISPATCH FIRE TENDERS & AMBULANCES. Coordinate student assembly point evacuation.",
            }

        # 4. SLUM / DENSE URBAN FIRE (CRITICAL):
        if location_type == "SLUM" or (pop_density == "HIGH" and frp >= 15.0):
            return {
                "category": "SLUM_DENSE_URBAN_FIRE",
                "confidence": 94,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": f"CRITICAL: High-density urban settlement fire ({nearest_name}). Extreme risk of rapid lateral spread.",
                "action": "🚨 MASS DISPATCH! Narrow-lane access units required. Broadcast SMS evacuation alert.",
            }

        # 5. RESTAURANT / KITCHEN FIRE (HIGH):
        if location_type == "RESTAURANT" and frp >= 10.0:
            return {
                "category": "RESTAURANT_KITCHEN_FIRE",
                "confidence": 90,
                "risk_level": "HIGH",
                "color": "orange",
                "reason": f"HIGH RISK: Commercial kitchen fire ({nearest_name}). High probability of LPG cylinder involvement.",
                "action": "DISPATCH FOAM & CO2 UNITS. Isolate commercial LPG valves immediately.",
            }

        # 6. COMMERCIAL MARKET FIRE (HIGH):
        if location_type == "MARKET" and frp >= 12.0:
            return {
                "category": "COMMERCIAL_MARKET_FIRE",
                "confidence": 91,
                "risk_level": "HIGH",
                "color": "orange",
                "reason": f"HIGH RISK: Fire in commercial marketplace ({nearest_name}). High combustible fuel load (textiles/plastics).",
                "action": "DISPATCH WATER TENDERS & CROWD CONTROL. Isolate power grid sector.",
            }

        # 7. RESIDENTIAL STRUCTURE FIRE (HIGH):
        if location_type == "RESIDENTIAL" and frp >= 15.0:
            return {
                "category": "RESIDENTIAL_STRUCTURE_FIRE",
                "confidence": 89,
                "risk_level": "HIGH",
                "color": "orange",
                "reason": f"HIGH RISK: Expanding structure fire in residential building/apartments ({nearest_name}).",
                "action": "DISPATCH FIRE SERVICES. Search & rescue team for smoke inhalation.",
            }

        # 8. EMERGENCY INDUSTRIAL (UNSCHEDULED SURGE NEAR HIGH-RISK FACILITY):
        if dist <= 3.5 and persistence < 20.0 and frp >= 25.0:
            return {
                "category": "EMERGENCY_INDUSTRIAL",
                "confidence": 92,
                "risk_level": "CRITICAL",
                "color": "red",
                "reason": (
                    f"Unscheduled thermal surge ({frp:.1f}MW) within {dist:.1f}km of {nearest_name} "
                    f"with no historical baseline. High emergency risk."
                ),
                "action": "🚨 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
            }

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

        # 9. PERSISTENT INDUSTRIAL (RECURRING THERMAL FLARE / FURNACE):
        if (dist < 6.0 and persistence >= 25.0) or (dist < 8.0 and persistence >= 40.0):
            return {
                "category": "PERSISTENT_INDUSTRIAL",
                "confidence": 94,
                "risk_level": "LOW",
                "color": "yellow",
                "reason": f"Persistent plant heat signature ({nearest_name}); operational flare / furnace; not emergency",
                "action": "No emergency action needed. Normal industrial operational thermal source.",
            }

        # =========================================================================
        # WILDLAND FOREST & AGRICULTURAL CLASSIFICATION
        # =========================================================================

        # 10. FOREST WILDLAND (BIOSPHERE / CANOPY / FOREST RESERVES):
        if location_type == "FOREST" or (dist > 10.0 and not ctx["is_agri"] and location_type not in ["FARMLAND", "RESIDENTIAL"] and frp >= 5.0):
            return {
                "category": "FOREST_FIRE",
                "confidence": 88,
                "risk_level": "HIGH",
                "color": "green",
                "reason": f"Active wildland vegetation canopy detection ({frp:.1f}MW in forest/biosphere perimeter)",
                "action": "🚨 Notify Forest Department & NDRF regional wildland response unit.",
            }

        # 11. AGRICULTURAL BURNING (SEASONAL HARVEST STUBBLE & CROP RESIDUE):
        if (ctx["is_agri"] or ctx["is_burning_season"] or location_type == "FARMLAND") and dist > 3.0 and frp >= 6.0:
            return {
                "category": "AGRICULTURAL_BURNING",
                "confidence": 90,
                "risk_level": "MODERATE",
                "color": "orange",
                "reason": f"Seasonal agricultural crop residue/stubble burning ({frp:.1f}MW in agrarian corridor)",
                "action": "Log in state pollution registry. Monitor for potential spread.",
            }

        # =========================================================================
        # BONFIRE & DOMESTIC RESIDENTIAL BURNING SUPPRESSION
        # Filter low-intensity residential waste/bonfires without suppressing rural fires
        # =========================================================================
        if frp < 10.0 and (location_type in ["RESIDENTIAL"] or (location_type == "GENERAL" and dist < 10.0)):
            return {
                "category": "DOMESTIC_LOW_INTENSITY_BURN",
                "confidence": 88,
                "risk_level": "VERY_LOW",
                "color": "slate",
                "reason": "Low-intensity thermal signal (FRP < 10MW). Likely household bonfire, waste clearing, or domestic cooking burn.",
                "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
            }

        # ML Model Assist (if available)
        if self.ml_model is not None:
            try:
                from ml_model import predict_ml
                raw_conf = fire.get("confidence", "n")
                conf_num = 3.0 if raw_conf == "h" else (2.0 if raw_conf == "n" else 1.0)
                feat = {
                    "frp": frp,
                    "brightness": ctx["brightness"],
                    "confidence_num": conf_num,
                    "nearest_industry_km": dist,
                    "distance_to_industry": dist,
                    "persistence_pct": persistence,
                    "persistence_ratio": persistence,
                    "is_agri_region": 1.0 if ctx.get("is_agri") else 0.0,
                    "is_burning_season": 1.0 if ctx.get("is_burning_season") else 0.0,
                    "day_of_year": 180,
                    "hour_of_day": 12,
                }
                cat, ml_conf = predict_ml(self.ml_model, feat)
                if cat != "UNKNOWN" and ml_conf >= 65.0:
                    if cat == "EMERGENCY_INDUSTRIAL" and (frp < 25.0 or dist > 3.5):
                        cat = "UNKNOWN"
                    
                    risk_meta = {
                        "EMERGENCY_INDUSTRIAL": (
                            "CRITICAL",
                            "red",
                            "🚨 DISPATCH FIRE SERVICES IMMEDIATELY! Coordinate with facility safety officer.",
                        ),
                        "PERSISTENT_INDUSTRIAL": (
                            "LOW",
                            "yellow",
                            "Maintain monitoring. Normal plant operations.",
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
                            "explainability": {
                                "frp": frp,
                                "distance_to_industry_km": dist,
                                "nearest_facility": nearest_name,
                                "persistence_pct": persistence,
                                "location_type": location_type,
                                "rule_triggered": "ML_RANDOM_FOREST_FUSION",
                                "ml_category": cat,
                                "ml_confidence": ml_conf,
                            },
                        }
            except Exception:
                pass

        # Low-intensity fallback (< 15 MW)
        if frp < 15.0:
            return {
                "category": "DOMESTIC_LOW_INTENSITY_BURN",
                "confidence": 82,
                "risk_level": "VERY_LOW",
                "color": "slate",
                "reason": "Low-intensity localized burn likely domestic/garbage; monitoring only",
                "action": "ALERT SUPPRESSED. Automatic monitoring active. No emergency dispatch.",
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
            # Granular breakdown for urban engine
            "hospital": 0,
            "fuel_station": 0,
            "school": 0,
            "slum": 0,
            "restaurant": 0,
            "market": 0,
            "residential": 0,
            "domestic_suppressed": 0,
        }
        for f in classified_fires:
            cat = f.get("category", f.get("classification", "UNKNOWN"))
            if cat in [
                "EMERGENCY_INDUSTRIAL",
                "HOSPITAL_FIRE",
                "FUEL_STATION_FIRE",
                "SCHOOL_FIRE",
                "SLUM_DENSE_URBAN_FIRE",
            ]:
                summary["emergency"] += 1
                if cat == "HOSPITAL_FIRE":
                    summary["hospital"] += 1
                elif cat == "FUEL_STATION_FIRE":
                    summary["fuel_station"] += 1
                elif cat == "SCHOOL_FIRE":
                    summary["school"] += 1
                elif cat == "SLUM_DENSE_URBAN_FIRE":
                    summary["slum"] += 1
            elif cat == "PERSISTENT_INDUSTRIAL":
                summary["persistent"] += 1
            elif cat == "AGRICULTURAL_BURNING":
                summary["agricultural"] += 1
            elif cat == "FOREST_FIRE":
                summary["forest"] += 1
            elif cat == "DOMESTIC_LOW_INTENSITY_BURN":
                summary["unknown"] += 1
                summary["domestic_suppressed"] += 1
            else:
                summary["unknown"] += 1
                if cat == "RESTAURANT_KITCHEN_FIRE":
                    summary["restaurant"] += 1
                elif cat == "COMMERCIAL_MARKET_FIRE":
                    summary["market"] += 1
                elif cat == "RESIDENTIAL_STRUCTURE_FIRE":
                    summary["residential"] += 1
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
