# PROJECT IGNIS — DATA SOURCES ARCHITECTURE MAPPING
**Document:** `DATA_SOURCES.md`  
**System:** Project IGNIS Tactical Satellite Fire Intelligence Platform (SIH 2026)  
**Standard:** Zero-Mock Production Pipeline & Real-Time Geospatial Verification

---

## 1. Overview of Live Data Pipelines

Project IGNIS connects real-time orbital downlinks, geospatial infrastructure registries, atmospheric numerical models, and machine learning models to deliver actionable tactical intelligence without dummy or synthetic numbers.

```
+-----------------------------------------------------------------------------------+
|                              EXTERNAL REAL-TIME APIS                              |
+-----------------------------------------------------------------------------------+
       |                                      |                               |
       v                                      v                               v
[ NASA FIRMS API ]                  [ OSM Overpass API ]             [ Open-Meteo API ]
(VIIRS SNPP + NOAA-20)            (Industrial & Amenities)        (Temperature, Wind, RH)
       |                                      |                               |
       v                                      v                               v
[ backend/firms.py ]               [ backend/osm_data.py ]         [ backend/spread_pred.py ]
(15-min Cache / DB)                (24-hr Cache / SQLite)          (10-min Geohash Cache)
       |                                      |                               |
       +-------------------+------------------+-------------------------------+
                           |
                           v
              [ backend/classifier.py ] <--- [ ignis_rf_model.joblib ]
              (Spatial, Temporal & ML)       (RandomForest v1.0.4 Baseline)
                           |
                           v
                 [ FastAPI REST API ]
        /api/v1/fires/realtime  |  /api/v1/facilities
        /api/v1/weather         |  /api/v1/analytics/summary
        /api/v1/analytics/model-accuracy
                           |
                           v
              [ Next.js 14 Web UI (SWR) ]
        Total Hotspots  | Atmospheric Telemetry
        Distribution    | High-Risk Facilities
```

---

## 2. Complete UI Element to Live API Mapping

| UI Component | Displayed Metric / Element | Live Source Pipeline | External API Provider | Update Frequency & Caching |
|---|---|---|---|---|
| **Header** (`Header.tsx`) | Active Hotspots Count Badge | `GET /api/v1/fires/realtime?days=1` | NASA FIRMS VIIRS SNPP & NOAA-20 NRT | Refreshed every 5 min (15-min backend cache) |
| **Header** (`Header.tsx`) | Last Sync Timestamp | `response.fetched_at` | NASA FIRMS Downlink Metadata | Updates on each satellite ingest cycle |
| **Left Panel** (`LeftPanel.tsx`) | High-Risk Facilities Count (`X sites`) | `GET /api/v1/facilities?type=all` | OpenStreetMap Overpass API | Refreshed every 24 hours (cached in SQLite) |
| **Left Panel** (`LeftPanel.tsx`) | Industrial Plant Cards & Badges | `facilities[i].name`, `type`, `lat`, `lon` | OSM `industrial=*`, `landuse=industrial`, `amenity=*` tags | Real OSM tag mapping: `steel`, `refinery`, `chemical`, `power` |
| **Atmospheric Telemetry** (`WeatherWidget.tsx`) | Ambient Temperature (°C) | `GET /api/v1/weather?lat=X&lng=Y` | Open-Meteo API (`temperature_2m`) | 10-minute coordinate cache; triggers on map pan & fire click |
| **Atmospheric Telemetry** (`WeatherWidget.tsx`) | Relative Humidity (% RH) | `GET /api/v1/weather?lat=X&lng=Y` | Open-Meteo API (`relative_humidity_2m`) | 10-minute coordinate cache |
| **Atmospheric Telemetry** (`WeatherWidget.tsx`) | Wind Vector (Speed & Direction) | `GET /api/v1/weather?lat=X&lng=Y` | Open-Meteo API (`wind_speed_10m`, `wind_direction_10m`) | Live compass heading calculated via trigonometric vector |
| **Stats Panel** (`StatsPanel.tsx`) | Total Active Hotspots | `fires.length` | NASA FIRMS NRT CSV Stream | Synchronized with active map markers |
| **Stats Panel** (`StatsPanel.tsx`) | Emergency Fires Count | `summary.emergency` | IGNIS Urban Proximity Engine (Hospitals, Fuel, Slums < 500m) | Real-time classification per fire point |
| **Stats Panel** (`StatsPanel.tsx`) | Persistent Sources Count | `summary.persistent` | Multi-day Thermal Persistence Engine (30-day recurring coordinates) | Spatial grid cell recurrence tracker |
| **Stats Panel** (`StatsPanel.tsx`) | Agricultural Burning Count | `summary.agricultural` | Agro-corridor bounding polygon & harvest season temporal filter | Dynamic coordinate boundary filter |
| **Stats Panel** (`StatsPanel.tsx`) | Forest Wildland Count | `summary.forest` | Forest cover spatial polygons & OSM `landuse=forest` | Wildland reserve spatial intersection |
| **Stats Panel** (`StatsPanel.tsx`) | Low-Intensity Burns Count | `summary.unknown` | Sub-threshold thermal filter (FRP < 10 MW in residential zones) | Suppresses bonfires & domestic waste burning |
| **Distribution Breakdown** (`StatsPanel.tsx`) | Proportional Segmented Bar & Percentages | Proportional ratio `(category_count / total) * 100` | Real-time aggregated array from active FIRMS dataset | Computes dynamic percentages summing to 100% |
| **Footer** (`page.tsx`) | Accuracy Rate Metric | `GET /api/v1/analytics/model-accuracy` | Scikit-Learn `RandomForestClassifier` (100 estimators, 5-fold CV) | Validated ML model baseline: `89.2% (RandomForest v1.0.4)` |
| **Tactical Map** (`FireMap.tsx`) | Active Thermal Hotspots | `fires` coordinates, `brightness`, `frp`, `acq_time` | NASA VIIRS SNPP/NOAA-20 Satellite NRT Data | Rendered dynamically via Leaflet/Mapbox canvas |
| **Fire Detail Drawer** (`FireDetailDrawer.tsx`) | Satellite Name, Pass Time, FRP, Brightness | `fire.satellite`, `fire.acq_time`, `fire.frp`, `fire.brightness` | Raw NASA FIRMS VIIRS telemetry record | Exact sensor radiometric readings |
| **Fire Detail Drawer** (`FireDetailDrawer.tsx`) | Tactical Response Protocol | IS 2190 & HAZMAT Code Matcher | Indian Standard Fire Code (IS 2190) & Chemical SOP Registry | Matched against nearest facility hazards |

---

## 3. Transparency & Fallback Protocol (Offline / Rate-Limit Resilience)

To guarantee 100% demo safety during the SIH mentorship presentation while maintaining strict data integrity:
1. If **NASA FIRMS API** is rate-limited or unavailable:
   - Backend automatically serves the **last verified satellite pass** from the local SQLite cache (`ignis.db`).
   - Response contains `"ignis_status": "cached_fallback"` and `"is_cached": true`.
   - UI displays amber `CACHED` badge with the timestamp of the last successful downlink.
2. If **OpenStreetMap Overpass API** times out:
   - Backend serves pre-indexed Indian industrial zones and hospitals from SQLite table `industrial_zones`.
   - Facility count accurately reflects the cached OSM registry.
3. If **Open-Meteo API** is temporarily unreachable:
   - Weather endpoint calculates local regional climatological norms with explicit `source: "Climatology Fallback"` and `is_cached: true`.
4. If **DEMO mode** is explicitly selected by the user:
   - UI clearly displays `SIMULATION DEMO MODE (250 PRE-CLASSIFIED FIRES)`.
   - Data is never disguised as live NASA telemetry.
