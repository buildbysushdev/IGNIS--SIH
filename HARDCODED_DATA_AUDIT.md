# PROJECT IGNIS — COMPLETE HARDCODED DATA AUDIT REPORT
**Date:** September 9, 2026  
**Auditor:** Senior Principal Full-Stack Auditor (Real-Time Pipelines, NASA FIRMS, OSM Overpass, Next.js 14 + FastAPI)  
**System:** Project IGNIS — Tactical Satellite Fire Intelligence & False-Alarm Suppression Engine (SIH Problem Statement 26162)

---

## 1. Executive Summary

A comprehensive architectural and source code audit was conducted across the Project IGNIS frontend (`frontend/`) and backend (`backend/`). The audit investigated confirmed anomaly signals:
1. **Total Active Hotspots (`133 / 133 ACTIVE`)**: Identified as the real deduplicated count from NASA FIRMS VIIRS satellite passes over India, but frontend and proxy routes maintained separate fallback arrays (`fallbackFires.ts`, `demoFires.ts`).
2. **Accuracy Rate (`95.8%`)**: Identified as a static hardcoded marketing metric in the footer (`page.tsx:857`) and API route fallback (`field-report/stats/route.ts:24`), without dynamically reflecting the trained Random Forest model (`ignis_rf_model.joblib`) baseline.
3. **Atmospheric Telemetry Panel (`31.5°C`, `54% RH`, `12 km/h WSW 255°`)**: Discovered hardcoded in `frontend/app/api/weather/route.ts` and `frontend/components/WeatherWidget.tsx` fallback handlers.
4. **Distribution Breakdown (`Emergency 0% / Persistent 0% / Agricultural 10% / Forest 0%`)**: A calculation and slicing bug in `frontend/components/StatsPanel.tsx:227` sliced out the 5th category (`DOMESTIC_LOW_INTENSITY_BURN` / `UNKNOWN`), hiding 117 of 133 fires (88% of detections) and leading to 0% and non-summing percentages.
5. **High-Risk Facilities & Industrial Zones (`40 sites`, static `WORKS` badge)**: Discovered hardcoded in `frontend/components/IndustrialRegistry.tsx` (38 static steel/refinery plants and 210 procedurally generated offset units) and sliced to `40` in `LeftPanel.tsx:33`.
6. **Last Sync Timestamp (`16:39:47 UTC`)**: Derived from client local clock tick (`getUtcTimestamp()`) rather than backend NASA FIRMS API acquisition timestamp (`fetched_at`).

---

## 2. Hardcoded / Mock / Dummy Data Itemized Inventory

| # | File Path | Line # | Variable / Key | Current Hardcoded Value | Should Come From (Real Source) | Severity |
|---|---|---|---|---|---|---|
| 1 | `frontend/components/IndustrialRegistry.tsx` | 16-55 | `RAW_FACILITIES` | Array of 38 static steel, refinery, and power plants with hardcoded `WORKS` types and coordinates | **OpenStreetMap Overpass API** query (`node["industrial"~"steel\|refinery\|chemical\|power\|cement"]`) cached in backend DB | **CRITICAL** |
| 2 | `frontend/components/IndustrialRegistry.tsx` | 58-93 | `ALL_FACILITIES` | Procedural modulo loop generating 248 facilities with mathematical lat/lon offsets (`((i * 13) % 40 - 20) * 0.04`) | **Live Backend Facility Registry** (`GET /api/v1/facilities?type=all`) populated from OSM Overpass | **CRITICAL** |
| 3 | `frontend/components/LeftPanel.tsx` | 33 | `filteredFacilities` | `ALL_FACILITIES.slice(0, 40)` | **Dynamic Facilities List** from backend endpoint without arbitrary slice | **HIGH** |
| 4 | `frontend/components/LeftPanel.tsx` | 140 | Facility Count Badge | `<span className="font-mono">{filteredFacilities.length} sites</span>` (evaluated to constant `40 sites`) | Real count of fetched facilities (`facilities.length`) | **HIGH** |
| 5 | `frontend/app/api/weather/route.ts` | 39-44 | Climatology Fallback | `temperature: 31.5`, `wind_speed: 12.0`, `wind_direction: 255.0`, `wind_compass: "WSW"`, `humidity: 54.0` | **Open-Meteo API** (`https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=...`) | **CRITICAL** |
| 6 | `frontend/components/WeatherWidget.tsx` | 50-55 | Fallback Weather State | `temperature: 32.0`, `wind_speed: 12.0`, `wind_direction: 255.0`, `wind_compass: "WSW"`, `humidity: 54.0` | **Live Weather Endpoint** (`/api/v1/weather?lat=X&lng=Y`), displaying transparent cached state on failure | **HIGH** |
| 7 | `frontend/app/page.tsx` | 857 | Footer Accuracy String | `Accuracy Rate: 95.8% (Active Learning Loop)` | **Trained Random Forest Model Baseline** (`/api/v1/analytics/model-accuracy`) or dynamic validation score | **HIGH** |
| 8 | `frontend/app/api/field-report/stats/route.ts` | 22-26 | Default Fallback Stats | `accuracy_percentage: 95.8`, `total_classifications: 1420`, `officer_verifications: 24` | **Backend Field Reports Database** (`/api/field-report/stats`) | **MEDIUM** |
| 9 | `backend/database.py` | 543-547 | Empty DB Verification Fallback | `accuracy_percentage: 94.4`, `officer_verifications: 18`, `total_classifications: 1420` | Dynamic aggregation of `field_reports` table + ML cross-validation score | **MEDIUM** |
| 10 | `frontend/components/StatsPanel.tsx` | 227-240 | Category Percentages | `items.slice(0, 4).map(...)` (omits `DOMESTIC_LOW_INTENSITY_BURN` / `UNKNOWN`, resulting in `0% / 0% / 10% / 0%`) | Complete 5-category proportional breakdown computed from live `fires` list | **CRITICAL** |
| 11 | `backend/classifier.py` | 105-113 | Bonfire Suppression Rule | `frp < 10.0 and location_type in ["RESIDENTIAL", "GENERAL", "FARMLAND"]` executed prior to forest/agri detection, capturing all low FRP rural fires | Prioritize Forest and Agricultural region checks before applying domestic burn suppression | **HIGH** |
| 12 | `backend/osm_data.py` | 253-323 | `get_location_context` | Lacked geospatial forest reserve check; marked all wildland areas as `"GENERAL"` | Add Forest cover detection (major reserves, Western Ghats, Northeast India, Central India) | **HIGH** |
| 13 | `frontend/app/page.tsx` | 248, 353, 702 | `lastRefreshedUtc` / `Last Sync` | `new Date().toISOString().replace(/\.\d{3}/, "")` generated from client browser clock | Backend NASA FIRMS `fetched_at` timestamp from satellite downlink response | **MEDIUM** |
| 14 | `backend/main.py` | 500-510 | Response payload | Missing explicit `fetched_at` field in JSON response of `/api/fires` | Add `"fetched_at": datetime.utcnow().isoformat() + "Z"` and ISO ingestion timestamps | **MEDIUM** |
| 15 | `frontend/components/AccuracyDashboard.tsx` | 52-54 | Accuracy Fallback | `stats?.accuracy_percentage ?? 95.2; stats?.officer_verifications ?? 24` | Dynamic fetch from `/api/field-report/stats` with loading skeleton | **MEDIUM** |
| 16 | `frontend/app/api/analytics/comparative/route.ts` | 38-42 | Proxy Fallback Metrics | Hardcoded `p1: 4520, p2: 4035, delta_pct: 12.0` | Live Backend endpoint `/api/analytics/comparative` | **LOW** |
| 17 | `frontend/app/api/analytics/regional/route.ts` | 40-47 | Proxy Fallback Summary | Hardcoded `total_events: 4520, critical_events: 12, cost_savings_inr_cr: 42.8` | Live Backend endpoint `/api/analytics/regional` | **LOW** |
| 18 | `frontend/app/api/history/route.ts` | 10-44 | `FALLBACK_LOCATION_HISTORY` | Hardcoded 5-year timeline with 48 incidents for Surat coordinates | Live Backend endpoint `/api/history` querying historical database | **LOW** |

---

## 3. Immediate Remediation Action Plan

1. **NASA FIRMS Pipeline Integration (`/api/v1/fires/realtime`)**:
   - Deliver real satellite detections via NASA VIIRS SNPP & NOAA-20 NRT APIs using `FIRMS_MAP_KEY` from environment variables.
   - Cache results for 15 minutes to preserve rate limits.
   - Return real counts, real timestamps (`fetched_at`), and deduplicated thermal anomalies.

2. **OpenStreetMap Overpass Integration (`/api/v1/facilities`)**:
   - Query Overpass API for steel plants, refineries, chemical plants, power stations, hospitals, and fuel stations across India.
   - Cache in SQLite database table `industrial_zones` with 24-hour TTL.
   - Connect frontend `LeftPanel.tsx` and `IndustrialRegistry.tsx` to fetch `/api/v1/facilities?type=all` dynamically, displaying the real count of sites (no hardcoded 40).

3. **Open-Meteo Weather Integration (`/api/v1/weather`)**:
   - Connect frontend `WeatherWidget.tsx` and Next.js route directly to backend `/api/v1/weather?lat=X&lng=Y` and Open-Meteo API.
   - Implement 10-minute coordinate cache.
   - Automatically trigger updates on map center change or clicked fire coordinates.
   - Eliminate hardcoded `31.5°C`, `54% RH`, and `12 km/h`.

4. **Classifier & Distribution Breakdown Correction**:
   - Enhance `backend/classifier.py` and `osm_data.py` to identify forest cover zones and seasonal agricultural corridors.
   - Ensure `DOMESTIC_LOW_INTENSITY_BURN` only suppresses true residential/garbage fires without masking wildland/forest fires.
   - Refactor `StatsPanel.tsx` to show all 5 categories proportionally, showing "Classifier initializing..." if empty.

5. **Model Accuracy Metric**:
   - Remove hardcoded `95.8%`.
   - Implement `/api/v1/analytics/model-accuracy` exposing the validated Random Forest baseline (`89.2% (RandomForest v1.0.4)`).
   - Display real active learning verification stats from the database.

6. **Full Transparency & Fallback Protocol**:
   - Never fake data silently.
   - If an upstream API fails, return cached real data with transparent `is_cached: true` / `demo_mode: true` badges.
