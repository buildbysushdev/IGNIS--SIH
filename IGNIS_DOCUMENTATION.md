# IGNIS — Complete Technical Documentation
## Intelligent Geospatial Network for Industrial Fire Screening
### NTRO SIH Problem Statement ID: SIH26162

> **Note**: A comprehensive, extended systems manual is available in [IGNIS_FULL_DOCUMENTATION.md](file:///c:/sreeram/Pictures/sree%20docs/sree%20projectworks/hacktons/SIH%202026/ignis/IGNIS_FULL_DOCUMENTATION.md).

---

## 1. Overview

IGNIS is a real-time fire intelligence and tactical decision support platform engineered for SIH 2026 (NTRO). It fuses NASA FIRMS space-borne thermal telemetry, OpenStreetMap industrial geospatial data, and Open-Meteo micro-meteorology to detect, classify, and dispatch emergency responses for industrial, urban, forest, and agricultural fires across India with false-alarm suppression.

---

## 2. Architecture & Data Flow

```
NASA FIRMS (VIIRS SNPP + NOAA-20) ──> FastAPI Backend (0.0.0.0:8000) ──> Next.js 14 Ground Station UI
OSM Overpass API (Industrial)     ──> Spatial Rules & Heuristics    ──> Tactical Leaflet Map
Open-Meteo Weather (Wind/Temp)     ──> SQLite Cache (ignis.db)       ──> AGNI-AI Voice/Text Copilot
Google Gemini REST API             ──> AGNI-AI RAG Knowledge Engine  ──> Field Officer Verification
```

---

## 3. Environment Variables Configuration

### Backend (`backend/.env`):
```env
FIRMS_MAP_KEY=f966b20f1e9b5cba7ee8226366a7f48d
OVERPASS_URL=https://overpass-api.de/api/interpreter
DATABASE_PATH=ignis.db
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=*

# Google Gemini API Configuration (AGNI-AI)
GEMINI_API_KEY=<your_gemini_api_key_here>
GEMINI_MODEL=gemini-flash-lite-latest
```

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_INTERNAL_URL=http://127.0.0.1:8000
GEMINI_API_KEY=<your_gemini_api_key_here>
GEMINI_MODEL=gemini-flash-lite-latest
```

---

## 4. AGNI-AI Tactical Copilot

- **Core Model**: Google Gemini (`gemini-flash-lite-latest` primary, `gemini-flash-latest` fallback).
- **Communication Protocol**: High-performance REST direct integration (no SDK conflicts or token overhead).
- **Dual-Resilience**: Backend RAG node (primary) + Next.js Serverless route direct invocation (secondary edge fallback for Vercel).
- **Knowledge Base (RAG)**: NDMA Guidelines on Chemical Disasters, Bureau of Indian Standards IS 2190:2010 codes, M.B. Lal Committee Oil Fire Reports, and PESO Material Safety Data Sheets.
- **Domain Guardrails**: Strict refusal of off-topic requests; dedicated IGNIS diagnostics assistance.

---

## 5. Operational Modes & Hardcoded Data Isolation

- **LIVE Mode**: Strictly streams real NASA FIRMS satellite data, real OSM Overpass industrial sites, and real Open-Meteo meteorological telemetry. No dummy data is displayed.
- **CACHED Mode**: Serves the last successfully synchronized SQLite database records when external connectivity is impaired.
- **DEMO Mode**: Engages 15 curated high-risk emergency fire scenarios with simulation benchmark badges for jury demonstrations.

---

## 6. Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check and telemetry status |
| `GET` | `/api/fires?days=1&source=all` | Live classified fire hotspots from NASA FIRMS |
| `GET` | `/api/stats` | Category breakdown, critical alert count, and total FRP |
| `GET` | `/api/weather?lat=X&lon=Y` | Live atmospheric parameters from Open-Meteo |
| `GET` | `/api/industries` | Industrial zones and high-risk facilities from OSM |
| `POST` | `/api/chat` | AGNI-AI tactical command assistant inquiry |
| `GET` | `/api/fire-stations/nearest` | Proximity routing to nearest fire station |
| `POST` | `/api/dispatch/simulate` | Emergency vehicle dispatch simulation |
| `GET` | `/api/mode` | Current operational mode (`LIVE`, `CACHED`, `DEMO`) |
| `POST` | `/api/mode/set?mode=LIVE` | Operational mode switch |

---

## 7. Deployment Instructions

### Local Execution:
```bash
# Terminal 1 - Backend:
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

### Production:
- **Vercel**: Deploy `/frontend`, configure `NEXT_PUBLIC_API_URL` to point to the backend, and add `GEMINI_API_KEY` for serverless AI failover.
- **Railway**: Deploy `/backend`, configure environment variables from `backend/.env.example`.
