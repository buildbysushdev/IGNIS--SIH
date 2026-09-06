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
