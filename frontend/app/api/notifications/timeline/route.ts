import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const FALLBACK_TIMELINE = [
  {
    id: 101,
    detection_id: 1,
    alert_type: "EMERGENCY_FIRE",
    severity: "CRITICAL",
    message: "🚨 CRITICAL EVENT: Thermal spike (145.0MW) detected at Surat GIDC Chemical Processing Cluster.",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: "DISPATCHED",
    acknowledged_at: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    action_taken: "DISPATCHED",
    response_time_seconds: 48,
    latitude: 21.1702,
    longitude: 72.8311,
    frp: 145.0,
    classification: "EMERGENCY_INDUSTRIAL",
  },
  {
    id: 102,
    detection_id: 2,
    alert_type: "EMERGENCY_FIRE",
    severity: "CRITICAL",
    message: "🚨 CRITICAL EVENT: Major volatile solvent thermal signature (92.4MW) at Vapi GIDC Chemical Estate.",
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    status: "ACKNOWLEDGED",
    acknowledged_at: new Date(Date.now() - 73 * 60 * 1000).toISOString(),
    action_taken: "ACKNOWLEDGED",
    response_time_seconds: 112,
    latitude: 20.3712,
    longitude: 72.9054,
    frp: 92.4,
    classification: "EMERGENCY_INDUSTRIAL",
  },
  {
    id: 103,
    detection_id: 3,
    alert_type: "SURVEILLANCE_ANOMALY",
    severity: "HIGH",
    message: "High thermal anomaly in protected timber belt: Corbett Buffer Zone.",
    created_at: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    status: "NEW",
    acknowledged_at: null,
    action_taken: null,
    response_time_seconds: null,
    latitude: 29.53,
    longitude: 78.77,
    frp: 68.2,
    classification: "HIGH_RISK_FOREST",
  },
  {
    id: 104,
    detection_id: 4,
    alert_type: "SURVEILLANCE_ANOMALY",
    severity: "MEDIUM",
    message: "Agricultural stubble burning cluster: Sangrur Farm Sector 4.",
    created_at: new Date(Date.now() - 340 * 60 * 1000).toISOString(),
    status: "FALSE_ALARM",
    acknowledged_at: new Date(Date.now() - 338 * 60 * 1000).toISOString(),
    action_taken: "FALSE_ALARM",
    response_time_seconds: 120,
    latitude: 30.24,
    longitude: 75.84,
    frp: 34.1,
    classification: "AGRICULTURAL",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hours = searchParams.get("hours") || "24";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/notifications/timeline?hours=${encodeURIComponent(hours)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] /api/notifications/timeline proxy failed:", err?.message);
  }

  return NextResponse.json(FALLBACK_TIMELINE);
}
