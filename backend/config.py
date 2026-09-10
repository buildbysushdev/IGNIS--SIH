import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR: Path = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# NASA FIRMS API Credentials & Endpoints
FIRMS_MAP_KEY: str = os.getenv("FIRMS_MAP_KEY", "").strip()
if not FIRMS_MAP_KEY:
    print("[IGNIS] WARNING: FIRMS_MAP_KEY is not set in environment or .env file!")

FIRMS_BASE_URL: str = os.getenv(
    "FIRMS_BASE_URL", "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
).rstrip("/")
INDIA_BBOX: str = os.getenv("INDIA_BBOX", "68.7,8.4,97.25,35.5").strip()

# Environment-aware paths for local development and cloud platforms (Railway, Render, etc.)
CACHE_DIR: str = os.environ.get("CACHE_DIR", str((BASE_DIR / "cache").resolve()))
os.makedirs(CACHE_DIR, exist_ok=True)

DB_PATH: str = os.environ.get("DB_PATH", os.environ.get("DATABASE_PATH", "./ignis.db")).strip()
DATABASE_PATH: str = DB_PATH

OVERPASS_URL: str = os.getenv("OVERPASS_URL", "https://overpass-api.de/api/interpreter").strip()
HOST: str = os.getenv("HOST", "0.0.0.0").strip()
PORT: int = int(os.getenv("PORT", "8000"))
CORS_ORIGINS: list[str] = [
    origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()
]

# Gemini AI Assistant (AGNI-AI) Configuration
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest").strip()


def get_db_path() -> str:
    """Return the absolute file path to the SQLite database."""
    p = Path(DB_PATH)
    if not p.is_absolute():
        return str((BASE_DIR / p).resolve())
    return str(p.resolve())
