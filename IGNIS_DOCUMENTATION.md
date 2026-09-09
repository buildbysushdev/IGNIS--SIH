# IGNIS — Complete Project Documentation
## Intelligent Geospatial Network for Industrial Fire Screening
### NTRO SIH Problem Statement ID: SIH26162

---

## Overview

IGNIS is a real-time fire intelligence platform for SIH 2026 (NTRO). It uses NASA FIRMS satellite data, OpenStreetMap, and Open-Meteo to detect, classify, and alert on industrial, urban, forest, and agricultural fires across India with strict false-alarm filtering.

---

## Architecture

NASA FIRMS (VIIRS/MODIS) → FastAPI Backend → Next.js 14 Frontend
OSM Overpass API          → Fire Classifier → Map + Dashboard UI  
Open-Meteo Weather API    → SQLite Cache   → AGNI-AI Assistant
Google Gemini 3.6 Flash   → AGNI-AI Chat   → Real-time Alerts

---

## Environment Variables

Backend (backend/.env):
  FIRMS_MAP_KEY=<firms-api-key>
  OVERPASS_URL=https://overpass-api.de/api/interpreter
  DATABASE_PATH=ignis.db
  HOST=0.0.0.0
  PORT=8000
  GEMINI_API_KEY=<gemini-api-key>
  GEMINI_MODEL=gemini-3.6-flash

Frontend (frontend/.env.local):
  NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

---

## API Endpoints

GET  /api/health                     - System health check
GET  /api/fires?days=1&source=all    - Live classified fires (NASA FIRMS)
GET  /api/v1/fires/realtime          - V1 realtime fires endpoint
GET  /api/stats                      - Category breakdown
GET  /api/v1/analytics/summary       - Live distribution percentages
GET  /api/industries                 - Industrial zones (OSM)
GET  /api/v1/facilities              - All facilities (OSM Overpass)
GET  /api/weather?lat=X&lon=Y        - Atmospheric telemetry (Open-Meteo)
GET  /api/v1/weather                 - V1 weather endpoint
POST /api/chat                       - AGNI-AI assistant (Gemini)
POST /api/v1/agni/chat               - V1 AGNI-AI endpoint
GET  /api/fire-stations/nearest      - Nearest fire station
GET  /api/hospitals/nearest          - Nearest hospital
POST /api/dispatch/simulate          - Simulate dispatch
GET  /api/alerts                     - Active alerts
GET  /api/notifications              - Emergency queue
GET  /api/mode                       - Current mode (LIVE/CACHED/DEMO)
POST /api/mode/set?mode=LIVE         - Set operational mode

---

## AGNI-AI Assistant

- Powered by Google Gemini 3.6 Flash (via google.genai SDK 2.20+)
- Scoped to IGNIS fire intelligence domain only
- API key stored in backend .env ONLY (never frontend)
- Proxied through Next.js /api/chat/route.ts
- RAG knowledge base: NDMA guidelines, IS 2190 codes, station directories

---

## Fire Classification Categories

EMERGENCY_INDUSTRIAL    - FRP >= 50 MW near hospital/fuel/factory → CRITICAL
EMERGENCY_URBAN_RESIDENTIAL - FRP >= 30 MW in slums/residential → CRITICAL
PERSISTENT_INDUSTRIAL   - Recurring at same coords 5+ times/30d → HIGH
AGRICULTURAL_BURNING    - Punjab/Haryana stubble, Oct-Feb seasonal → MEDIUM
FOREST_FIRE             - Forest cover zones → HIGH
LOW_INTENSITY_DOMESTIC  - FRP < 10 MW, residential, non-recurring → LOW (Suppressed)

---

## Data Sources (All Live)

Active Hotspots       → NASA FIRMS VIIRS NRT (15-min cache)
Fire Map Markers      → NASA FIRMS VIIRS SNPP + NOAA-20
Atmospheric Telemetry → Open-Meteo API (30-min cache)
Industrial Facilities → OSM Overpass + SQLite (24-hour cache)
Fire Categories       → Backend classifier (RF + spatial rules)
AI Responses          → Google Gemini 3.6 Flash
Model Accuracy        → RandomForest v1.0.4 baseline 89.2%

---

## Mode System

LIVE   → Real NASA FIRMS + OSM + Open-Meteo
CACHED → Last successful SQLite cache  
DEMO   → 250 pre-classified realistic fires
AUTO   → Auto-switches based on API health

---

## Tech Stack

Backend:  Python 3.11 | FastAPI 0.115.6 | SQLite | scikit-learn RF | google.genai
Frontend: Next.js 14 | TypeScript | Tailwind CSS | Leaflet.js | Axios

---

## Security

FIRMS_MAP_KEY  → Backend only (never in frontend bundle)
GEMINI_API_KEY → Backend only (proxied via Next.js route)
CORS           → Vercel domain + localhost only
Rate Limiting  → 60 req/min per IP (slowapi)
Input Sanitization → All query params validated

---

Generated: 2026-09-10 | Version: IGNIS v1.0.4 | SIH26162
