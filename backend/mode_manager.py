"""
IGNIS — ModeManager Singleton
Manages global operational modes (LIVE, CACHED, DEMO) with automatic failover,
manual override capability, and real-time health telemetry.
"""

import os
import requests
from datetime import datetime
from typing import Any, Optional

from config import FIRMS_MAP_KEY, FIRMS_BASE_URL, INDIA_BBOX
from database import get_cache_status, check_db_health
from demo_data import load_demo_fires


class ModeManager:
    _instance: Optional["ModeManager"] = None

    def __new__(cls) -> "ModeManager":
        if cls._instance is None:
            cls._instance = super(ModeManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if getattr(self, "_initialized", False):
            return

        self._current_mode: str = "LIVE"
        self._since: str = datetime.utcnow().isoformat() + "Z"
        self._reason: str = "System boot default"
        self._is_manual_override: bool = False
        self._initialized = True

        # Perform initial detection
        initial = self.detect_mode()
        self._current_mode = initial
        self._since = datetime.utcnow().isoformat() + "Z"
        self._reason = f"Auto-detected on startup: {initial}"

    @property
    def current_mode(self) -> str:
        return self._current_mode

    def check_firms_health(self) -> str:
        """Check NASA FIRMS API connectivity and rate limits."""
        key = (os.getenv("FIRMS_MAP_KEY", "") or FIRMS_MAP_KEY).strip()
        if not key or len(key) < 8:
            return "disconnected"

        test_url = f"{FIRMS_BASE_URL}/{key}/VIIRS_SNPP_NRT/{INDIA_BBOX}/1"
        try:
            # Short-circuit ping with 4 second timeout
            resp = requests.get(test_url, timeout=4)
            if resp.status_code == 200:
                if "invalid" in resp.text.lower() and "key" in resp.text.lower():
                    return "disconnected"
                return "connected"
            elif resp.status_code == 429:
                return "rate_limited"
            else:
                return "disconnected"
        except Exception:
            return "disconnected"

    def detect_mode(self) -> str:
        """
        Auto-detection logic:
        1. Try FIRMS API health check -> if connected: "LIVE"
        2. If fails but local SQLite cache exists (< 7 days / 168h old): "CACHED"
        3. Else fallback to scripted realistic demo data: "DEMO"
        """
        firms_status = self.check_firms_health()
        if firms_status == "connected":
            return "LIVE"

        cache = get_cache_status()
        if cache.get("exists") and cache.get("age_hours", 999.0) <= 168.0:
            return "CACHED"

        return "DEMO"

    def set_mode(self, mode: str, reason: str = "Manual override") -> bool:
        """Force switch to specific operational mode or trigger auto detection."""
        target = mode.strip().upper()
        if target == "AUTO":
            detected = self.detect_mode()
            self._current_mode = detected
            self._is_manual_override = False
            self._since = datetime.utcnow().isoformat() + "Z"
            self._reason = f"Auto-detected via health check: {detected}"
            return True

        if target not in {"LIVE", "CACHED", "DEMO"}:
            return False

        self._current_mode = target
        self._is_manual_override = True
        self._since = datetime.utcnow().isoformat() + "Z"
        self._reason = reason
        return True

    def get_data_source_description(self) -> str:
        """Human-readable data origin description."""
        if self._current_mode == "LIVE":
            return "NASA FIRMS Real-Time"
        elif self._current_mode == "CACHED":
            cache = get_cache_status()
            age = cache.get("age_hours", 0)
            if age < 1.0:
                return "Local Cache (last sync: <1 hour ago)"
            return f"Local Cache (last sync: {int(age)} hours ago)"
        else:
            return "Simulated Data for Demonstration"

    def get_current_mode(self) -> dict[str, Any]:
        """Return full operational mode dictionary."""
        return {
            "mode": self._current_mode,
            "since": self._since,
            "reason": self._reason,
            "data_source": self.get_data_source_description(),
            "is_manual": self._is_manual_override,
        }

    def get_health(self) -> dict[str, Any]:
        """Return comprehensive system health and recommended mode."""
        firms_status = self.check_firms_health()
        db_status = check_db_health()
        cache = get_cache_status()
        demo_fires = load_demo_fires()

        # Recommended mode calculation
        if firms_status == "connected":
            recommended = "LIVE"
        elif cache.get("exists") and cache.get("age_hours", 999.0) <= 168.0:
            recommended = "CACHED"
        else:
            recommended = "DEMO"

        return {
            "firms_api": firms_status,
            "database": db_status,
            "cache": {
                "exists": bool(cache.get("exists")),
                "age_hours": round(cache.get("age_hours", 0.0), 1),
                "count": cache.get("count", 0),
            },
            "demo_data": {
                "available": len(demo_fires) >= 200,
                "fires": len(demo_fires),
            },
            "recommended_mode": recommended,
            "current_mode": self._current_mode,
        }


# Global singleton instance
mode_manager = ModeManager()
