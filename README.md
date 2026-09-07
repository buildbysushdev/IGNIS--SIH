# 🔥 IGNIS — Intelligent Geospatial Network for Industrial Fire Screening

**Problem Statement:** SIH26162 — AI-Based Detection and Classification of Industrial Fires and Persistent Thermal Sources Using NASA FIRMS, OSM & Satellite Data.  
**Organization:** NTRO (National Technical Research Organisation)

---

## 🎯 Executive Overview

**IGNIS** is a real-time fire intelligence and surveillance platform that ingests thermal anomaly data from NASA's VIIRS/MODIS satellites via NASA FIRMS, cross-references geographic coordinates with OpenStreetMap (Overpass API) industrial and manufacturing footprints, and utilizes an operational Machine Learning classifier to categorize thermal anomalies into:

1. `PERSISTENT_INDUSTRIAL`: Known or continuous thermal sources from heavy manufacturing, refineries, flares, and industrial boilers.
2. `EMERGENCY_INDUSTRIAL`: High-severity sudden thermal spikes within industrial parks and facilities requiring urgent response.
3. `AGRICULTURAL_BURNING`: Post-harvest crop stubble burning across agrarian zones.
4. `FOREST_FIRE`: Wildfire and forest canopy combustion outside industrial zones.
5. `UNKNOWN`: Unclassified or low-confidence radiometric anomalies.

---

## 🏗️ Architecture & Tech Stack

- **Backend:** Python 3.11 + FastAPI (Async REST API)
- **Machine Learning:** `scikit-learn` (`RandomForestClassifier`) + `joblib`
- **Geospatial Processing:** `geopy` + `shapely` + OpenStreetMap Overpass API
- **Data Ingestion:** Real NASA FIRMS NRT active fire feed (South Asia / India)
- **Database:** SQLite (via native `sqlite3` without ORM overhead)
- **Frontend:** Next.js 14 (App Router) + React-Leaflet + Recharts + Tailwind CSS
- **Design System:** Dark Military Surveillance Theme (`#0f172a`, `#1e293b`, `#dc2626`, `#f97316`, `#fbbf24`)
- **Deployment:** Vercel (Frontend) + Railway (Backend)

---

## 📁 Repository Structure

```
ignis/
├── backend/
│   ├── main.py              # FastAPI server & route handlers
│   ├── config.py            # Environment configuration
│   ├── firms.py             # Live NASA FIRMS satellite data ingestion
│   ├── osm_data.py          # Overpass OSM API industrial proximity query
│   ├── classifier.py        # Integrated GIS + ML classification pipeline
│   ├── ml_model.py          # Scikit-learn RandomForestClassifier model
│   ├── alerts.py            # Operational threat and emergency alerting
│   ├── database.py          # SQLite schema, storage, and persistence tracking
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment template
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Surveillance dashboard interface
│   │   ├── layout.tsx       # Root layout & document metadata
│   │   └── globals.css      # Dark surveillance styling & Leaflet overrides
│   ├── components/
│   │   ├── FireMap.tsx      # Interactive React-Leaflet dark matter map
│   │   ├── StatsPanel.tsx   # Recharts charts & surveillance KPI telemetry
│   │   ├── AlertPanel.tsx   # Critical threat alert stream
│   │   └── FilterBar.tsx    # Anomaly filters & satellite scan trigger
│   ├── package.json         # Frontend dependencies & scripts
│   └── tailwind.config.js   # Dark surveillance color configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd ignis/backend

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Add your NASA FIRMS MAP_KEY to .env
cp .env.example .env

# Run FastAPI backend
python main.py
```
The backend will launch at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd ignis/frontend

# Install dependencies
npm install

# Run Next.js surveillance dashboard
npm run dev
```
Access the dashboard at `http://localhost:3000`.

---

## 📡 Live Real Satellite Data Ingestion

IGNIS connects directly to real APIs:
- **NASA FIRMS Live Feed:** Ingests VIIRS 375m active fire data across India in real-time.
- **OpenStreetMap Overpass API:** Queries real-world industrial land use, factories, and refinery perimeters.
- **SQLite Spatial Persistence:** Clusters historical thermal anomalies to detect recurring industrial sources.

---

## 🌐 Deployment

- **Backend (Railway):** Point Railway to `ignis/backend` using Python buildpack or Docker. Expose port 8000.
- **Frontend (Vercel):** Connect `ignis/frontend` to Vercel. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL.

---

## 🔒 Security & Privacy

- **Zero PII Collection**: IGNIS processes purely public geospatial and spaceborne radiometric observations. No personal user credentials, location tracking, or telemetry cookies are harvested.
- **Credential Hygiene**: API keys (such as `FIRMS_MAP_KEY`) are managed strictly via environment variables and never checked into source control. All `.env` files are gitignored.
- **Rate Limiting Protection**: The backend enforces IP-based rate limiting via `slowapi` (60 req/min global, 30 req/min for telemetry ingestion, 2 req/hour for model retraining).
- **Injection Defenses**: 100% of database queries are parameterized; search inputs are sanitized against SQL and XSS injection vectors.
- **Hardened HTTP Headers**: Next.js serves strict headers including `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **See [SECURITY.md](SECURITY.md) and [DEPLOYMENT.md](DEPLOYMENT.md) for full audit reports and setup policies.**

---

## ⚠️ Known Operational Limitations

1. **Spaceborne Optical Revisit Latency**: Multi-spectral optical imagery (e.g. Sentinel-2, Landsat-8/9) has an orbital revisit cadence of 5 to 16 days depending on latitude and cloud occlusion. IGNIS couples high-frequency thermal passes (VIIRS: ~3–6 hours) with optical verification links for forensic validation rather than claiming real-time second-by-second video.
2. **Thermal Sensor Latency**: Downlink and processing of NASA FIRMS NRT active fire telemetry carries an inherent orbital processing delay of approximately 1 to 3 hours from satellite overpass to API ingestion.
3. **OSM Cadastral Completeness**: OpenStreetMap industrial zoning coverage varies across non-metro rural areas; IGNIS mitigates this by maintaining a curated fallback registry of 248 major heavy industrial complexes across India.

