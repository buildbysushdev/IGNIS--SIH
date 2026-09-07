# IGNIS Deployment & Infrastructure Guide

Comprehensive guide for deploying the **IGNIS** platform to production environments (Railway backend + Vercel frontend) for **NTRO SIH26162**.

---

## 1. Architecture Overview

```
[ NASA FIRMS Satellites ]           [ OSM Overpass API ]
   (SNPP / NOAA20 / MODIS)            (Industrial Infrastructure)
             │                                   │
             ▼                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   IGNIS TELEMETRY NODE                      │
│                  (FastAPI on Railway)                       │
│                                                             │
│  - slowapi Rate Limiting (60/min global, 30/min fires)      │
│  - Multi-spectral Classifier Rules Engine                   │
│  - SQLite WAL Database (ignis.db) + Atomic Cache Store      │
│  - Strict Input Validation & Parameterized Queries          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 IGNIS MISSION CONTROL UI                    │
│                 (Next.js 14 on Vercel)                      │
│                                                             │
│  - Ground Station Terminal Layout (IBM Plex Mono)           │
│  - Leaflet Dynamic Basemap (Dark Canvas / Esri Satellite)   │
│  - Cross-Sensor Verification Workspace (VerifyPanel)        │
│  - Security Headers (CSP, X-Frame-Options: DENY)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables Checklist

### Backend Service (Railway)
Configure these in the **Railway Project Dashboard > Variables**:

| Variable | Required? | Sensitive? | Purpose | Default |
| :--- | :--- | :--- | :--- | :--- |
| `FIRMS_MAP_KEY` | **Yes** | **Yes** | NASA FIRMS 32-character authentication key | *(None)* |
| `PORT` | Auto | No | Service listening port (injected by Railway) | `8080` |
| `HOST` | No | No | Network bind interface | `0.0.0.0` |
| `DATABASE_PATH` | No | No | SQLite database file location | `ignis.db` |
| `CACHE_DIR` | No | No | Transient telemetry cache directory | `cache` |
| `OVERPASS_URL` | No | No | OSM Overpass API interpreter endpoint | `https://overpass-api.de/api/interpreter` |
| `CORS_ORIGINS` | No | No | Comma-separated allowed CORS origins | `https://frontend-nine-lime-27.vercel.app` |

### Frontend Service (Vercel)
Configure these in the **Vercel Project Settings > Environment Variables**:

| Variable | Required? | Sensitive? | Purpose | Value |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | **Yes** | No | Backend endpoint URL | `https://web-production-b1e6a.up.railway.app` |

---

## 3. Step-by-Step Deployment Instructions

### Backend Deployment (Railway)
1. Link your GitHub repository to Railway.
2. Select root directory or `/backend` depending on service configuration (both contain valid `requirements.txt` and `Procfile`).
3. Add `FIRMS_MAP_KEY` in **Variables**.
4. Railway will automatically build using Python 3.11/3.12 and start the service with `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Verify deployment:
   ```bash
   curl -I https://web-production-b1e6a.up.railway.app/api/health
   ```
   Should return `HTTP/2 200` with `status: "healthy"` or `status: "degraded"` (if cached).

### Frontend Deployment (Vercel)
1. Import repository into Vercel.
2. Set Root Directory to `frontend`.
3. Set Framework Preset to **Next.js**.
4. Add environment variable:
   `NEXT_PUBLIC_API_URL` = `https://web-production-b1e6a.up.railway.app`
5. Click **Deploy**.

---

## 4. Post-Deployment Verification Checklist

1. **Health Check**:
   Navigate to `https://web-production-b1e6a.up.railway.app/api/health` -> verify JSON status.
2. **Security Headers Verification**:
   Inspect response headers on `https://frontend-nine-lime-27.vercel.app`:
   - `x-frame-options: DENY`
   - `x-content-type-options: nosniff`
   - `referrer-policy: strict-origin-when-cross-origin`
3. **Rate Limiting Validation**:
   Send rapid burst requests to `/api/fires` -> verify HTTP 429 response after 30 requests.
4. **Input Validation**:
   Test `https://web-production-b1e6a.up.railway.app/api/fires?days=999` -> expect clean HTTP 400 JSON.
5. **Basemap & Verification Check**:
   Open UI, click fire hotspot, test `[ OPEN NASA WORLDVIEW ↗ ]` and `[ SWITCH MAP TO SATELLITE ▷ ]`.
