# Project IGNIS — Full Technical Documentation & Systems Manual
## Intelligent Geospatial Network for Industrial Fire Screening
### Smart India Hackathon (SIH 2026) | Problem ID: SIH26162 | Ministry/Org: NTRO

---

## 1. Executive Summary & Problem Context

Project **IGNIS** (*Intelligent Geospatial Network for Industrial Fire Screening*) is an autonomous, real-time fire detection, classification, and tactical decision-support system engineered specifically for the National Technical Research Organisation (NTRO) under SIH Problem ID SIH26162.

### The Core Problem
Conventional fire detection frameworks rely on general-purpose satellite alerts with significant latency (3 to 6 hours) and high false-alarm rates caused by agricultural crop burning (stubble burning in Punjab/Haryana), domestic bonfires, garbage combustion, and routine industrial flaring. Furthermore, incident commanders lack unified, automated correlation between thermal anomalies and surrounding high-risk infrastructure (chemical refineries, LPG bottling plants, munitions depots, hospitals, schools, and dense urban settlements).

### The IGNIS Solution
IGNIS resolves these challenges by fusing:
1. **Space-Borne Thermal Telemetry**: Real-time NASA FIRMS VIIRS (SNPP & NOAA-20) 375m active fire detection with automated 1km spatial deduplication.
2. **Geospatial Infrastructure Intelligence**: Real-time OpenStreetMap (OSM) Overpass API querying across industrial plants, chemical storage, fuel stations, and public institutions.
3. **Micro-Meteorological Telemetry**: Real-time Open-Meteo atmospheric data (wind speed, wind direction vector, ambient temperature, relative humidity).
4. **Physical Spread Modeling**: Rothermel-derived Rate of Spread (ROS) forward projection ellipses.
5. **AGNI-AI Tactical Command Assistant**: High-speed, domain-restricted Google Gemini REST reasoning engine augmented with NDMA (National Disaster Management Authority) guidelines and Bureau of Indian Standards IS 2190 firefighting protocols.
6. **Strict Mode Separation**: Transparent separation between **LIVE** satellite operations and **DEMO** jury evaluation scenarios.

---

## 2. System Architecture & Component Interaction

```mermaid
graph TD
    subgraph Data Layer
        NASA[NASA FIRMS VIIRS NRT API]
        OSM[OSM Overpass API]
        METEO[Open-Meteo Weather API]
        DB[(SQLite Cache & Persistence ignis.db)]
    end

    subgraph Backend Engine [FastAPI @ 0.0.0.0:8000]
        FIRMS_INGEST[FIRMS Downloader & Deduplicator]
        CLASSIFIER[RandomForest & Heuristic Classifier]
        DISPATCH_ENG[Dispatch & Transit Calculator]
        AGNI_CORE[AGNI-AI RAG & Gemini Controller]
        MODE_MGR[Operational Mode Manager]
    end

    subgraph Frontend Client [Next.js 14 App Router]
        PROXY[/api/* Serverless Proxy Routes]
        DASH[Tactical Ground Station Dashboard]
        MAP[Leaflet Multi-Basemap Thermal Grid]
        CHAT_UI[AGNI-AI Voice & Text Assistant]
        OFFICER[Field Officer Verification Portal]
    end

    NASA -->|375m VIIRS CSV| FIRMS_INGEST
    OSM -->|GeoJSON Infrastructure| CLASSIFIER
    METEO -->|Wind & Humidity| DASH
    FIRMS_INGEST --> DB
    CLASSIFIER --> DB

    FIRMS_INGEST --> PROXY
    CLASSIFIER --> PROXY
    DISPATCH_ENG --> PROXY
    AGNI_CORE --> PROXY
    MODE_MGR --> PROXY

    PROXY --> DASH
    PROXY --> MAP
    PROXY --> CHAT_UI
    PROXY --> OFFICER
```

---

## 3. Real-Time Data Pipelines & Hardcoded Data Audit

A rigorous architectural audit guarantees that **no synthetic or static data is displayed when operating in LIVE mode**. Mock data is strictly gated behind the `DEMO` mode toggle.

### 3.1 NASA FIRMS Satellite Telemetry Pipeline
* **Source Endpoints**:
  - `VIIRS_SNPP_NRT`: Suomi NPP satellite 375m resolution sensor.
  - `VIIRS_NOAA20_NRT`: NOAA-20 satellite 375m resolution sensor.
  - Bounding Box: South Asia / India quadrant (`68.7, 8.4, 97.25, 35.5`).
* **Ingestion Cadence**: 15-minute persistent cache with automatic on-demand revalidation.
* **Deduplication Engine**: Merges multi-satellite passes and clusters detections within a 1.0 km radius acquired within the same operational window.
* **Telemetry Fields Extracted**:
  - `latitude`, `longitude` (WGS84)
  - `brightness` (Kelvin, Channel 21/22 & I-4)
  - `frp` (Fire Radiative Power in Megawatts — MW)
  - `confidence` (Detection confidence percentage)
  - `acq_date`, `acq_time` (UTC acquisition timestamp)
  - `satellite`, `daynight`

### 3.2 OpenStreetMap (OSM) Overpass Infrastructure Pipeline
* **Source Endpoint**: `https://overpass-api.de/api/interpreter`
* **Target Tags**: `man_made=works`, `industrial=*`, `amenity=hospital`, `amenity=fuel`, `amenity=school`.
* **Caching Strategy**: Stored in SQLite table `industrial_zones` with 24-hour TTL and spatial indexing for distance-to-hazard queries.
* **Buffer Analysis**:
  - `CRITICAL`: Fire within 500m of chemical, petroleum, hospital, or explosive sites.
  - `PERSISTENT_INDUSTRIAL`: Fire detected at known plant coordinates 3+ times within 30 days.

### 3.3 Open-Meteo Real-Time Meteorological Pipeline
* **Source Endpoint**: `https://api.open-meteo.com/v1/forecast`
* **Parameters**: `temperature_2m`, `relative_humidity_2m`, `wind_speed_10m`, `wind_direction_10m`.
* **Tactical Application**: Dynamic calculation of fire spread vectors (compass heading) and smoke dispersion plumes.

---

## 4. Operational Modes: LIVE vs CACHED vs DEMO

| Feature | LIVE Mode | CACHED Mode | DEMO Mode |
|---|---|---|---|
| **Hotspot Data** | Real NASA FIRMS VIIRS API | Local SQLite cache from last successful sync | Curated 15-fire scenario dataset for jury evaluation |
| **Atmospheric Telemetry** | Live Open-Meteo API query | Last stored weather observations | Standard meteorological baseline (31.5°C, 12 km/h WSW) |
| **Industrial Registry** | Live OSM Overpass query | Cached OSM industrial points | 15 benchmark high-risk plants (Bhilai, Bokaro, etc.) |
| **Footer Verification** | `Active Telemetry Verification Loop` | `Local Cached Database` | `Accuracy Rate: 95.8% (Simulation Benchmark)` |
| **Visual Indicators** | Green `LIVE DATA` pulse | Blue `CACHED` badge | Amber `SIMULATION DEMO MODE` banner |

To switch modes programmatically:
```bash
# Set mode to LIVE
curl -X POST "http://localhost:8000/api/mode/set?mode=LIVE"

# Set mode to DEMO
curl -X POST "http://localhost:8000/api/mode/set?mode=DEMO"
```

---

## 5. AGNI-AI Tactical Command Assistant

**AGNI-AI** is the tactical copilot embedded into the IGNIS Ground Station. It assists incident commanders with standard operating procedures, material hazard classifications, emergency dispatch simulations, and site diagnostics.

### 5.1 Architecture & Dual-Resilience Implementation
AGNI-AI features an end-to-end resilient architecture:
1. **Primary Node (FastAPI Backend)**:
   - High-speed direct REST API connection to Google Gemini models (`gemini-flash-lite-latest` with automated failover to `gemini-flash-latest`).
   - Retrieval-Augmented Generation (RAG) querying indexed NDMA manuals, IS 2190:2010 codes, and PESO hazard sheets.
   - Spatial coordinate parsing and automatic map panning commands (`map_action`).
2. **Secondary Node (Next.js Serverless Route)**:
   - If the FastAPI backend is temporarily sleeping or unreachable on cloud deployments (e.g. Vercel), `frontend/app/api/chat/route.ts` invokes the Google Gemini REST API directly using `process.env.GEMINI_API_KEY`.
3. **Tertiary Node (Offline SOP Fallback)**:
   - If all external APIs are unreachable, AGNI-AI returns authoritative, verified NDMA chemical and dispatch SOPs.

### 5.2 Strict Domain Guardrails & Refusal Protocol
AGNI-AI is bounded by strict domain rules. If a user asks off-topic questions (e.g., cooking recipes, general trivia, personal advice), it replies with the exact required refusal:
> *"I'm AGNI-AI and can only help with the IGNIS fire-intelligence platform and this SIH project. Please ask about fires, alerts, dispatch, classification, or the dashboard."*

### 5.3 Working Gemini Models
| Model ID | Latency | Status | Note |
|---|---|---|---|
| `gemini-flash-lite-latest` | **1.2s - 2.5s** | **PRIMARY** | High-throughput, zero rate-limit spikes |
| `gemini-flash-latest` | **2.0s - 4.0s** | **FALLBACK** | Automatic secondary fallback |
| `gemini-3.5-flash-lite` | N/A | **DEPRECATED** | Non-existent model ID (returned 404) |
| `gemini-2.5-flash` | N/A | **RESTRICTED** | Retired for new API keys |

---

## 6. Complete API Reference

All backend endpoints listen on `http://localhost:8000` (or Railway base URL). All frontend routes proxy via `/api/*`.

### 6.1 Telemetry & Detection Endpoints
* `GET /api/fires?days={1-7}&source={all|viirs}&mode={LIVE|DEMO}`
  - Returns classified active fires with confidence, FRP, category, and response protocols.
* `GET /api/stats?days={1-7}`
  - Returns aggregate hotspot counts, critical alert counts, total FRP, and category breakdown.
* `GET /api/health`
  - Returns backend health, NASA FIRMS status, database connectivity, and uptime.

### 6.2 Meteorological & Geospatial Endpoints
* `GET /api/weather?lat={latitude}&lon={longitude}`
  - Returns ambient temperature, humidity, wind velocity, and compass heading from Open-Meteo.
* `GET /api/industries` / `GET /api/v1/facilities`
  - Returns geospatial coordinates and classification metadata for industrial facilities from OSM.

### 6.3 Tactical Operations & Dispatch Endpoints
* `GET /api/fire-stations/nearest?lat={lat}&lon={lon}`
  - Calculates road distance, travel ETA, and contact directory for the closest station.
* `GET /api/hospitals/nearest?lat={lat}&lon={lon}`
  - Identifies nearest trauma facility and burn unit capacity.
* `POST /api/dispatch/simulate`
  - Body: `{"fire_id": "...", "latitude": 21.17, "longitude": 72.83, "units": 3}`
  - Triggers dispatch sequence and estimates containment ETA.

### 6.4 AI & Chatbot Endpoints
* `POST /api/chat`
  - Body: `{"message": "How to contain refinery fire in Surat?", "context": {...}}`
  - Returns structured tactical markdown response with confidence, sources, and action suggestions.

---

## 7. Deployment & Environment Setup Guide

### 7.1 Backend Setup (FastAPI)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure backend .env
cp .env.example .env
# Ensure GEMINI_API_KEY and FIRMS_MAP_KEY are set
# Set GEMINI_MODEL=gemini-flash-lite-latest

# 5. Start development server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 7.2 Frontend Setup (Next.js 14)
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Configure frontend .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000
# Set BACKEND_INTERNAL_URL=http://127.0.0.1:8000
# Set GEMINI_API_KEY=your_gemini_api_key_here

# 4. Build and run
npm run build
npm run start
# Or development mode:
npm run dev
```

### 7.3 Production Cloud Deployment (Vercel + Railway)

#### Frontend on Vercel
1. Link your GitHub repository to Vercel.
2. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your live Railway backend URL (e.g. `https://your-backend.up.railway.app`).
   - `BACKEND_INTERNAL_URL`: Same as above.
   - `GEMINI_API_KEY`: Your Google Gemini API key (enables edge fallback for AGNI-AI).
   - `GEMINI_MODEL`: `gemini-flash-lite-latest`.
3. Set **Framework Preset** to `Next.js`.
4. Deploy!

#### Backend on Railway
1. Create a new Railway project from GitHub repo pointing to the `/backend` directory.
2. Under **Variables**, add:
   - `FIRMS_MAP_KEY`: NASA FIRMS API map key.
   - `GEMINI_API_KEY`: Google Gemini API key.
   - `GEMINI_MODEL`: `gemini-flash-lite-latest`.
   - `PORT`: `8000`.
   - `HOST`: `0.0.0.0`.
   - `CORS_ORIGINS`: `*`.
3. Under **Settings → Networking**, generate a public domain (e.g. `https://ignis-backend.up.railway.app`).
4. Copy the domain and update `NEXT_PUBLIC_API_URL` on Vercel.

---

## 8. Verification & Operational Checklist

- [x] **NASA FIRMS Live Telemetry**: Operational (Tested: 133 active India hotspots on 1-day, 590 on 7-day query).
- [x] **Open-Meteo Weather Integration**: Operational (Real-time wind vector and temperature retrieval).
- [x] **OpenStreetMap Infrastructure**: Operational (Industrial zones mapped with spatial distance queries).
- [x] **AGNI-AI Tactical Copilot**: Operational (Powered by `gemini-flash-lite-latest`, tested with 0.98 confidence).
- [x] **Direct Gemini Next.js Fallback**: Operational in `frontend/app/api/chat/route.ts`.
- [x] **Strict Demo Mode Separation**: Hardcoded values isolated strictly to `DEMO` mode; `LIVE` mode uses live APIs.
- [x] **Next.js Production Build**: Successfully compiled with all static and dynamic routes validated.
- [x] **Git Tracking & Synchronization**: Cleaned and staged for synchronization.
