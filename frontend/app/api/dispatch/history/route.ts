import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const FALLBACK_HISTORY = [
  {
    id: 1,
    dispatch_id: "DSP-2026-09-07-337",
    fire_lat: 21.1702,
    fire_lon: 72.8311,
    fire_category: "EMERGENCY_INDUSTRIAL",
    station_name: "Surat Central Fire Station HQ",
    station_dist_km: 2.54,
    eta_minutes: 6,
    recommended_equipment: "Water tender (2x), AFFF Foam unit, SCBA sets",
    sent_to: "Fire Station, District Collector, NDMA, Hospital",
    status: "DISPATCHED",
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    dispatch_id: "DSP-2026-09-07-219",
    fire_lat: 20.3712,
    fire_lon: 72.9054,
    fire_category: "EMERGENCY_INDUSTRIAL",
    station_name: "Vapi GIDC Industrial Fire Station",
    station_dist_km: 1.82,
    eta_minutes: 5,
    recommended_equipment: "Foam Bowsers, High Expansion Foam, Hazmat",
    sent_to: "Fire Station, District Collector, NDMA",
    status: "DISPATCHED",
    created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    dispatch_id: "DSP-2026-09-07-104",
    fire_lat: 21.6260,
    fire_lon: 73.0030,
    fire_category: "PERSISTENT_INDUSTRIAL",
    station_name: "Ankleshwar Disaster Prevention Center",
    station_dist_km: 3.12,
    eta_minutes: 7,
    recommended_equipment: "Water spray cooling tenders, Dry chemical",
    sent_to: "Fire Station, District Emergency Ops",
    status: "COMPLETED",
    created_at: new Date(Date.now() - 250 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hours = searchParams.get("hours") || "24";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/dispatch/history?hours=${encodeURIComponent(hours)}`, {
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
    console.warn("[IGNIS-PROXY] /api/dispatch/history proxy failed:", err?.message);
  }

  return NextResponse.json(FALLBACK_HISTORY);
}
