# IGNIS Backend
AI-powered fire classification API using NASA FIRMS satellite data.
Built for NTRO SIH26162.

## Setup
pip install -r requirements.txt
Create .env with FIRMS_MAP_KEY=your_key
uvicorn main:app --reload

## Endpoints
- GET /api/fires?days=1&source=all
- GET /api/fires/emergency
- GET /api/stats?days=7
- GET /api/alerts
- GET /api/health
