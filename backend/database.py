import sqlite3
from typing import Any
from config import get_db_path

INIT_SQL = """
CREATE TABLE IF NOT EXISTS detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL, longitude REAL NOT NULL,
    brightness REAL, scan REAL, track REAL,
    acq_date TEXT, acq_time TEXT, satellite TEXT,
    confidence TEXT, version TEXT, bright_ti5 REAL,
    frp REAL, daynight TEXT, classification TEXT NOT NULL,
    confidence_score REAL NOT NULL, osm_dist_meters REAL,
    is_industrial INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(latitude, longitude, acq_date, acq_time)
);
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, detection_id INTEGER,
    alert_type TEXT NOT NULL, severity TEXT NOT NULL,
    message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'NEW',
    acknowledged_at TEXT,
    action_taken TEXT,
    response_time_seconds INTEGER,
    FOREIGN KEY(detection_id) REFERENCES detections(id)
);
CREATE TABLE IF NOT EXISTS dispatch_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispatch_id TEXT UNIQUE NOT NULL,
    fire_lat REAL, fire_lon REAL,
    fire_category TEXT,
    station_name TEXT,
    station_dist_km REAL,
    eta_minutes REAL,
    recommended_equipment TEXT,
    sent_to TEXT,
    status TEXT DEFAULT 'DISPATCHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

INSERT_SQL = """
INSERT OR IGNORE INTO detections (
    latitude, longitude, brightness, scan, track,
    acq_date, acq_time, satellite, confidence, version,
    bright_ti5, frp, daynight, classification, confidence_score,
    osm_dist_meters, is_industrial
) VALUES (
    :latitude, :longitude, :brightness, :scan, :track,
    :acq_date, :acq_time, :satellite, :confidence, :version,
    :bright_ti5, :frp, :daynight, :classification, :confidence_score,
    :osm_dist_meters, :is_industrial
)
"""


def get_connection() -> sqlite3.Connection:
    """Create and return a configured SQLite connection with row factory and safety pragmas."""
    try:
        conn: sqlite3.Connection = sqlite3.connect(get_db_path(), timeout=10.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("PRAGMA busy_timeout=5000")
        conn.execute("PRAGMA synchronous=NORMAL")
        return conn
    except sqlite3.Error as exc:
        raise RuntimeError(f"Database connection failed: {exc}") from exc


def init_db() -> None:
    """Initialize SQLite tables for detections and alerts using precompiled schema and migrations."""
    try:
        with get_connection() as conn:
            conn.executescript(INIT_SQL)
            # Safe schema migrations for existing database files
            cols = {row["name"] for row in conn.execute("PRAGMA table_info(alerts)").fetchall()}
            if "status" not in cols:
                conn.execute("ALTER TABLE alerts ADD COLUMN status TEXT DEFAULT 'NEW'")
            if "acknowledged_at" not in cols:
                conn.execute("ALTER TABLE alerts ADD COLUMN acknowledged_at TEXT")
            if "action_taken" not in cols:
                conn.execute("ALTER TABLE alerts ADD COLUMN action_taken TEXT")
            if "response_time_seconds" not in cols:
                conn.execute("ALTER TABLE alerts ADD COLUMN response_time_seconds INTEGER")
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to initialize database: {exc}") from exc


def insert_detections(records: list[dict[str, Any]]) -> int:
    """Insert classified detections into the database, ignoring duplicate entries."""
    try:
        with get_connection() as conn:
            cursor = conn.executemany(INSERT_SQL, records)
            return cursor.rowcount
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to insert detections: {exc}") from exc


def insert_fires(records: list[dict[str, Any]]) -> int:
    """Insert or ignore raw fire detections into the database with default metadata."""
    if not records:
        return 0
    prepared = []
    for r in records:
        item = {
            "latitude": float(r.get("latitude", 0.0)),
            "longitude": float(r.get("longitude", 0.0)),
            "brightness": float(r.get("brightness", 0.0)),
            "scan": float(r.get("scan", 1.0)),
            "track": float(r.get("track", 1.0)),
            "acq_date": str(r.get("acq_date", "")),
            "acq_time": str(r.get("acq_time", "")),
            "satellite": str(r.get("satellite", "VIIRS")),
            "confidence": str(r.get("confidence", "nominal")),
            "version": str(r.get("version", "2.0NRT")),
            "bright_ti5": float(r.get("bright_ti5", 0.0)),
            "frp": float(r.get("frp", 0.0)),
            "daynight": str(r.get("daynight", "D")),
            "classification": str(r.get("classification", "UNKNOWN")),
            "confidence_score": float(r.get("confidence_score", 0.5)),
            "osm_dist_meters": float(r.get("osm_dist_meters", 99999.0)),
            "is_industrial": int(r.get("is_industrial", 0)),
        }
        prepared.append(item)
    return insert_detections(prepared)


def get_detections(
    classification: str | None = None, min_frp: float | None = None, limit: int = 500
) -> list[dict[str, Any]]:
    """Retrieve filtered thermal detections sorted by acquisition time descending."""
    try:
        with get_connection() as conn:
            q = "SELECT * FROM detections WHERE 1=1"
            p: list[Any] = []
            if classification and classification != "ALL":
                q += " AND classification = ?"
                p.append(classification)
            if min_frp is not None:
                q += " AND frp >= ?"
                p.append(min_frp)
            q += " ORDER BY acq_date DESC, acq_time DESC, id DESC LIMIT ?"
            p.append(limit)
            return [dict(r) for r in conn.execute(q, p).fetchall()]
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to fetch detections: {exc}") from exc


def get_fires_by_date(days_or_date: int | str = 1, limit: int = 500) -> list[dict[str, Any]]:
    """Retrieve fire detections from SQLite by date, timeframe, or latest available."""
    try:
        with get_connection() as conn:
            if isinstance(days_or_date, int):
                q = (
                    "SELECT * FROM detections "
                    "WHERE date(acq_date) >= date('now', ?) "
                    "ORDER BY acq_date DESC, acq_time DESC, id DESC LIMIT ?"
                )
                rows = conn.execute(q, (f"-{days_or_date} days", limit)).fetchall()
            else:
                q = (
                    "SELECT * FROM detections "
                    "WHERE date(acq_date) = date(?) "
                    "ORDER BY acq_date DESC, acq_time DESC, id DESC LIMIT ?"
                )
                rows = conn.execute(q, (str(days_or_date), limit)).fetchall()
                if not rows:
                    q = (
                        "SELECT * FROM detections "
                        "WHERE date(acq_date) <= date(?) "
                        "ORDER BY acq_date DESC, acq_time DESC, id DESC LIMIT ?"
                    )
                    rows = conn.execute(q, (str(days_or_date), limit)).fetchall()
            if not rows:
                q = "SELECT * FROM detections ORDER BY acq_date DESC, acq_time DESC, id DESC LIMIT ?"
                rows = conn.execute(q, (limit,)).fetchall()
            return [dict(r) for r in rows]
    except sqlite3.Error:
        return []


def insert_alert(
    detection_id: int | None,
    alert_type: str,
    severity: str,
    message: str,
    status: str = "NEW",
    acknowledged_at: str | None = None,
    action_taken: str | None = None,
    response_time_seconds: int | None = None,
) -> int:
    """Insert a surveillance intelligence alert record into the database."""
    try:
        with get_connection() as conn:
            cursor = conn.execute(
                """INSERT INTO alerts (
                    detection_id, alert_type, severity, message,
                    status, acknowledged_at, action_taken, response_time_seconds
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    detection_id,
                    alert_type,
                    severity,
                    message,
                    status,
                    acknowledged_at,
                    action_taken,
                    response_time_seconds,
                ),
            )
            return cursor.lastrowid or 0
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to insert alert: {exc}") from exc


def update_alert_status(
    alert_id: int,
    status: str,
    action_taken: str,
    response_time_seconds: int | None = None,
    acknowledged_at: str | None = None,
) -> bool:
    """Update alert status, action taken, and response timing in SQLite."""
    from datetime import datetime

    ack_time = acknowledged_at or (datetime.utcnow().isoformat() + "Z")
    try:
        with get_connection() as conn:
            cur = conn.execute(
                """UPDATE alerts
                   SET status = ?, action_taken = ?, acknowledged_at = ?, response_time_seconds = ?
                   WHERE id = ?""",
                (status, action_taken, ack_time, response_time_seconds, alert_id),
            )
            return cur.rowcount > 0
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to update alert: {exc}") from exc


def get_alert_by_id(alert_id: int) -> dict[str, Any] | None:
    """Fetch single alert record joined with coordinate and classification data."""
    try:
        with get_connection() as conn:
            q = """
                SELECT a.id, a.detection_id, a.alert_type, a.severity, a.message, a.created_at,
                       COALESCE(a.status, 'NEW') as status, a.acknowledged_at, a.action_taken, a.response_time_seconds,
                       d.latitude, d.longitude, d.frp, d.classification
                FROM alerts a LEFT JOIN detections d ON a.detection_id = d.id
                WHERE a.id = ?
            """
            row = conn.execute(q, (alert_id,)).fetchone()
            return dict(row) if row else None
    except sqlite3.Error:
        return None


def get_unacknowledged_alerts(limit: int = 50) -> list[dict[str, Any]]:
    """Retrieve unacknowledged CRITICAL and active alerts for the emergency panel queue."""
    try:
        with get_connection() as conn:
            q = """
                SELECT a.id, a.detection_id, a.alert_type, a.severity, a.message, a.created_at,
                       COALESCE(a.status, 'NEW') as status, a.acknowledged_at, a.action_taken, a.response_time_seconds,
                       d.latitude, d.longitude, d.frp, d.classification
                FROM alerts a LEFT JOIN detections d ON a.detection_id = d.id
                WHERE COALESCE(a.status, 'NEW') IN ('NEW', 'ACTIVE')
                ORDER BY
                    CASE WHEN a.severity = 'CRITICAL' THEN 0
                         WHEN a.severity = 'HIGH' THEN 1
                         WHEN a.severity = 'MODERATE' THEN 2
                         ELSE 3 END ASC,
                    a.created_at DESC, a.id DESC
                LIMIT ?
            """
            rows = conn.execute(q, (limit,)).fetchall()
            return [dict(r) for r in rows]
    except sqlite3.Error:
        return []


def get_alerts(limit: int = 50) -> list[dict[str, Any]]:
    """Retrieve recent surveillance threat alerts joined with coordinate metadata."""
    try:
        with get_connection() as conn:
            q = """
                SELECT a.id, a.detection_id, a.alert_type, a.severity, a.message, a.created_at,
                       COALESCE(a.status, 'NEW') as status, a.acknowledged_at, a.action_taken, a.response_time_seconds,
                       d.latitude, d.longitude, d.frp, d.classification
                FROM alerts a LEFT JOIN detections d ON a.detection_id = d.id
                ORDER BY a.id DESC LIMIT ?
            """
            return [dict(r) for r in conn.execute(q, (limit,)).fetchall()]
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to fetch alerts: {exc}") from exc


def get_recent_alerts(hours: int = 24, limit: int = 100) -> list[dict[str, Any]]:
    """Retrieve recent alerts within the last N hours or latest available."""
    try:
        with get_connection() as conn:
            q = """
                SELECT a.id, a.detection_id, a.alert_type, a.severity, a.message, a.created_at,
                       COALESCE(a.status, 'NEW') as status, a.acknowledged_at, a.action_taken, a.response_time_seconds,
                       d.latitude, d.longitude, d.frp, d.classification
                FROM alerts a LEFT JOIN detections d ON a.detection_id = d.id
                WHERE datetime(a.created_at) >= datetime('now', ?)
                ORDER BY a.created_at DESC, a.id DESC LIMIT ?
            """
            rows = conn.execute(q, (f"-{hours} hours", limit)).fetchall()
            if not rows:
                q = """
                    SELECT a.id, a.detection_id, a.alert_type, a.severity, a.message, a.created_at,
                           COALESCE(a.status, 'NEW') as status, a.acknowledged_at, a.action_taken, a.response_time_seconds,
                           d.latitude, d.longitude, d.frp, d.classification
                    FROM alerts a LEFT JOIN detections d ON a.detection_id = d.id
                    ORDER BY a.created_at DESC, a.id DESC LIMIT ?
                """
                rows = conn.execute(q, (limit,)).fetchall()
            return [dict(r) for r in rows]
    except sqlite3.Error:
        return []


def get_alerts_timeline(hours: int = 24, limit: int = 150) -> list[dict[str, Any]]:
    """Retrieve all alerts in chronological timeline format for historical logging."""
    return get_recent_alerts(hours=hours, limit=limit)


def get_stats() -> dict[str, Any]:
    """Calculate aggregated surveillance statistics across all logged detections."""
    try:
        with get_connection() as conn:
            counts = conn.execute(
                "SELECT classification, COUNT(*) as cnt FROM detections GROUP BY classification"
            ).fetchall()
            agg = conn.execute(
                "SELECT COUNT(*) as total, AVG(frp) as avg_frp, MAX(frp) as max_frp FROM detections"
            ).fetchone()
            return {
                "total": agg["total"] if agg else 0,
                "avg_frp": round(agg["avg_frp"] or 0.0, 2) if agg else 0.0,
                "max_frp": round(agg["max_frp"] or 0.0, 2) if agg else 0.0,
                "by_class": {r["classification"]: r["cnt"] for r in counts},
            }
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to compute stats: {exc}") from exc


def get_persistence_count(lat: float, lon: float, tolerance: float = 0.05) -> int:
    """Query the count of past detections within a spatial bounding box tolerance."""
    try:
        with get_connection() as conn:
            row = conn.execute(
                "SELECT COUNT(*) as cnt FROM detections WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?",
                (lat - tolerance, lat + tolerance, lon - tolerance, lon + tolerance),
            ).fetchone()
            return int(row["cnt"]) if row else 0
    except sqlite3.Error:
        return 0


def insert_dispatch_log(record: dict[str, Any]) -> int:
    """Insert a simulated emergency dispatch record into dispatch_log."""
    try:
        with get_connection() as conn:
            cursor = conn.execute(
                """INSERT OR REPLACE INTO dispatch_log
                   (dispatch_id, fire_lat, fire_lon, fire_category, station_name,
                    station_dist_km, eta_minutes, recommended_equipment, sent_to, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    str(record.get("dispatch_id", "")),
                    float(record.get("fire_lat", 0.0)),
                    float(record.get("fire_lon", 0.0)),
                    str(record.get("fire_category", "UNKNOWN")),
                    str(record.get("station_name", "")),
                    float(record.get("station_dist_km", 0.0)),
                    float(record.get("eta_minutes", 0.0)),
                    str(record.get("recommended_equipment", "")),
                    str(record.get("sent_to", "")),
                    str(record.get("status", "DISPATCHED")),
                ),
            )
            return cursor.lastrowid or 0
    except sqlite3.Error as exc:
        raise RuntimeError(f"Failed to log dispatch: {exc}") from exc


def get_recent_dispatches(limit: int = 50) -> list[dict[str, Any]]:
    """Retrieve recent dispatch records sorted descending by creation time."""
    try:
        with get_connection() as conn:
            q = "SELECT * FROM dispatch_log ORDER BY id DESC LIMIT ?"
            return [dict(r) for r in conn.execute(q, (limit,)).fetchall()]
    except sqlite3.Error:
        return []


def check_db_health() -> str:
    """Check if SQLite database is responsive and accessible."""
    try:
        with get_connection() as conn:
            conn.execute("SELECT 1").fetchone()
            return "healthy"
    except Exception:
        return "error"


def get_cache_status() -> dict[str, Any]:
    """Inspect SQLite detection cache existence, record count, and age in hours."""
    from datetime import datetime

    try:
        with get_connection() as conn:
            row = conn.execute(
                "SELECT COUNT(*) as cnt, MAX(created_at) as latest_created, MAX(acq_date) as latest_acq FROM detections"
            ).fetchone()
            cnt = int(row["cnt"]) if row and row["cnt"] else 0
            if cnt == 0:
                return {"exists": False, "count": 0, "age_hours": 999.0}

            latest_str = row["latest_created"] or row["latest_acq"]
            age_hours = 0.5
            if latest_str:
                try:
                    cleaned = str(latest_str).replace("Z", "").split(".")[0]
                    if "T" in cleaned:
                        dt = datetime.fromisoformat(cleaned)
                    elif " " in cleaned:
                        dt = datetime.strptime(cleaned, "%Y-%m-%d %H:%M:%S")
                    else:
                        dt = datetime.strptime(cleaned, "%Y-%m-%d")
                    age_hours = max(0.1, round((datetime.utcnow() - dt).total_seconds() / 3600.0, 1))
                except Exception:
                    age_hours = 1.0

            return {
                "exists": True,
                "count": cnt,
                "age_hours": age_hours,
                "latest_date": str(row["latest_acq"] or ""),
            }
    except Exception:
        return {"exists": False, "count": 0, "age_hours": 999.0}


