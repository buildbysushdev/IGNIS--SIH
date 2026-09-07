"""
IGNIS — ScenarioEngine
Loads scripted disaster simulation scenarios, executes timed events,
and emits real-time state telemetry for command center demonstration.
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional, Generator

BASE_DIR = Path(__file__).resolve().parent
SCENARIOS_DIR = BASE_DIR


class ScenarioEngine:
    _instance: Optional["ScenarioEngine"] = None

    def __new__(cls) -> "ScenarioEngine":
        if cls._instance is None:
            cls._instance = super(ScenarioEngine, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if getattr(self, "_initialized", False):
            return

        self._active_scenario_id: Optional[str] = None
        self._started_at_epoch: Optional[float] = None
        self._is_playing: bool = False
        self._initialized = True

    def _get_scenario_dir(self) -> Path:
        if SCENARIOS_DIR.exists():
            return SCENARIOS_DIR
        # Fallback search
        root_scen = BASE_DIR.parent.parent / "scenarios"
        if root_scen.exists():
            return root_scen
        return SCENARIOS_DIR

    def list_scenarios(self) -> list[dict[str, Any]]:
        """Return a list of all available simulation scenarios."""
        scen_dir = self._get_scenario_dir()
        scenarios = []

        if scen_dir.exists():
            for f in sorted(scen_dir.glob("*.json")):
                try:
                    with open(f, "r", encoding="utf-8") as fp:
                        data = json.load(fp)
                        scenarios.append({
                            "id": data.get("id", f.stem),
                            "name": data.get("name", f.stem.replace("_", " ").title()),
                            "duration_seconds": data.get("duration_seconds", 30),
                            "description": data.get("description", ""),
                            "location": data.get("location", {}),
                            "timeline_steps": len(data.get("timeline", [])),
                        })
                except Exception:
                    continue

        return scenarios

    def get_scenario(self, scenario_id: str) -> Optional[dict[str, Any]]:
        """Retrieve full scenario definition by ID."""
        scen_dir = self._get_scenario_dir()
        target_file = scen_dir / f"{scenario_id}.json"
        if not target_file.exists():
            # Try without .json or exact matching
            for f in scen_dir.glob("*.json"):
                if f.stem == scenario_id:
                    target_file = f
                    break

        if target_file.exists():
            try:
                with open(target_file, "r", encoding="utf-8") as fp:
                    return json.load(fp)
            except Exception:
                return None
        return None

    def start_scenario(self, scenario_id: str) -> dict[str, Any]:
        """Mark scenario as active and start playback timer."""
        scen = self.get_scenario(scenario_id)
        if not scen:
            return {"success": False, "error": f"Scenario '{scenario_id}' not found"}

        self._active_scenario_id = scenario_id
        self._started_at_epoch = time.time()
        self._is_playing = True

        return {
            "success": True,
            "scenario_id": scenario_id,
            "name": scen.get("name"),
            "duration_seconds": scen.get("duration_seconds", 30),
            "started_at": datetime.utcnow().isoformat() + "Z",
        }

    def stop_scenario(self) -> dict[str, Any]:
        """Halt active scenario playback and reset state."""
        prev_id = self._active_scenario_id
        self._active_scenario_id = None
        self._started_at_epoch = None
        self._is_playing = False
        return {"success": True, "stopped_scenario_id": prev_id, "is_playing": False}

    def get_state(self) -> dict[str, Any]:
        """Calculate current playback progress and active step."""
        if not self._is_playing or not self._active_scenario_id or not self._started_at_epoch:
            return {
                "is_playing": False,
                "scenario_id": None,
                "elapsed_seconds": 0,
                "progress_pct": 0.0,
                "current_step": None,
                "narration": None,
            }

        scen = self.get_scenario(self._active_scenario_id)
        if not scen:
            self.stop_scenario()
            return {"is_playing": False, "scenario_id": None, "elapsed_seconds": 0}

        duration = max(1, scen.get("duration_seconds", 30))
        elapsed = round(time.time() - self._started_at_epoch, 1)

        if elapsed > duration:
            # Playback completed
            self.stop_scenario()
            return {
                "is_playing": False,
                "scenario_id": scen.get("id"),
                "elapsed_seconds": duration,
                "progress_pct": 100.0,
                "completed": True,
                "narration": "Scenario playback completed.",
            }

        # Find latest active step at or before elapsed time
        timeline = scen.get("timeline", [])
        active_step = None
        for step in timeline:
            if step.get("time", 0) <= elapsed:
                active_step = step
            else:
                break

        progress_pct = round(min(100.0, (elapsed / duration) * 100.0), 1)

        return {
            "is_playing": True,
            "scenario_id": scen.get("id"),
            "name": scen.get("name"),
            "elapsed_seconds": elapsed,
            "total_duration": duration,
            "progress_pct": progress_pct,
            "current_step": active_step,
            "narration": active_step.get("narration") if active_step else None,
            "location": scen.get("location"),
        }

    def play_scenario(self, scenario_id: str) -> Generator[dict[str, Any], None, None]:
        """Yield events in real-time generator at scripted timestamps."""
        scen = self.get_scenario(scenario_id)
        if not scen:
            return

        timeline = scen.get("timeline", [])
        last_time = 0

        for step in timeline:
            t = step.get("time", 0)
            sleep_sec = max(0, t - last_time)
            if sleep_sec > 0:
                time.sleep(sleep_sec)
            last_time = t
            yield step


# Global singleton
scenario_engine = ScenarioEngine()
