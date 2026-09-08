import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import database

logger = logging.getLogger("ignis_field_reports")
CACHE_DIR = Path(__file__).resolve().parent / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
DISCREPANCIES_FILE = CACHE_DIR / "discrepancies.json"


def update_fire_from_report(fire_id: int, report: dict[str, Any]) -> None:
    """If an officer confirms a different classification category, update fire in DB and log discrepancy."""
    actual_cat = report.get("classification_actual")
    if not actual_cat:
        return

    # Update database record
    success = database.update_detection_classification(fire_id=fire_id, new_category=actual_cat)
    logger.info(
        f"Updated fire {fire_id} classification to {actual_cat} (success={success}) based on officer {report.get('officer_id')}"
    )

    # Log discrepancy for active learning ML retraining loop
    try:
        discrepancies = []
        if DISCREPANCIES_FILE.exists():
            with open(DISCREPANCIES_FILE, "r", encoding="utf-8") as f:
                discrepancies = json.load(f)

        discrepancy_entry = {
            "fire_id": fire_id,
            "officer_id": report.get("officer_id"),
            "officer_name": report.get("officer_name"),
            "timestamp": report.get("timestamp") or datetime.utcnow().isoformat() + "Z",
            "ground_truth": actual_cat,
            "ground_observation": report.get("ground_observation", ""),
            "damage_assessment": report.get("damage_assessment", ""),
        }
        discrepancies.append(discrepancy_entry)

        with open(DISCREPANCIES_FILE, "w", encoding="utf-8") as f:
            json.dump(discrepancies, f, indent=2)
    except Exception as exc:
        logger.warning(f"Could not persist discrepancy file: {exc}")


def submit_field_report(report: dict[str, Any]) -> dict[str, Any]:
    """Validate, persist and process a field officer verification report."""
    if not report.get("timestamp"):
        report["timestamp"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    fire_id = report.get("fire_id")
    if fire_id is not None:
        try:
            fire_id = int(fire_id)
            report["fire_id"] = fire_id
        except (ValueError, TypeError):
            report["fire_id"] = None

    report_id = database.insert_field_report(report)
    report["id"] = report_id

    # Active learning feedback loop
    is_correct = report.get("classification_correct", True)
    if not is_correct and fire_id is not None:
        update_fire_from_report(fire_id, report)

    return {
        "status": "success",
        "message": "Field officer report logged successfully",
        "report_id": report_id,
        "classification_updated": not is_correct,
        "report": report,
    }


def get_reports_for_fire(fire_id: int) -> list[dict[str, Any]]:
    """Retrieve all officer reports and ground-truth verifications for a specific fire incident."""
    return database.get_field_reports(fire_id=fire_id)


def get_officer_history(officer_id: str) -> list[dict[str, Any]]:
    """Retrieve all reports submitted by a specific field officer."""
    return database.get_field_reports(officer_id=officer_id)


def get_accuracy_stats() -> dict[str, Any]:
    """Return live system accuracy metrics, verification totals, and category confusion breakdown."""
    return database.get_field_report_stats()
