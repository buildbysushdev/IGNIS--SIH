from datetime import datetime
from typing import Any, List
from database import insert_alert, get_recent_alerts


def generate_alerts(classified_fires: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Filter detections for CRITICAL risk level and generate structured alert records."""
    alerts: list[dict[str, Any]] = []
    for fire in classified_fires:
        if fire.get("risk_level") == "CRITICAL":
            lat = float(fire["latitude"])
            lon = float(fire["longitude"])
            frp = fire.get("frp", 0.0)
            category = fire.get("category", "EMERGENCY_INDUSTRIAL")
            alerts.append({
                "alert_type": "EMERGENCY_FIRE",
                "latitude": lat,
                "longitude": lon,
                "message": (
                    f"🚨 Emergency industrial fire detected at {lat:.2f}, {lon:.2f}. "
                    f"FRP: {frp}MW. Category: {category}"
                ),
                "severity": "CRITICAL",
                "timestamp": datetime.now().isoformat(),
                "detection_id": fire.get("id"),
            })
    return alerts


def store_alerts(alerts: list[dict[str, Any]]) -> int:
    """Insert alerts into SQLite database and return count stored."""
    stored = 0
    for alert in alerts:
        try:
            det_id = alert.get("detection_id")
            alert_type = alert.get("alert_type", "EMERGENCY_FIRE")
            severity = alert.get("severity", "CRITICAL")
            message = alert.get("message", "")
            insert_alert(det_id, alert_type, severity, message)
            stored += 1
        except Exception:
            continue
    return stored


def get_active_alerts(hours: int = 24) -> list[dict[str, Any]]:
    """Retrieve active surveillance alerts within timeframe, sorted by timestamp descending."""
    alerts = get_recent_alerts(hours=hours)
    for alert in alerts:
        if "timestamp" not in alert and "created_at" in alert:
            alert["timestamp"] = alert["created_at"]
    return sorted(
        alerts,
        key=lambda a: a.get("timestamp") or a.get("created_at") or "",
        reverse=True,
    )
