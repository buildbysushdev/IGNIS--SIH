import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-b1e6a.up.railway.app";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const fireId = searchParams.get("fire_id");

  let payloadData: any = null;
  try {
    payloadData = await request.json();
  } catch {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const targetUrl = `${BACKEND_URL}/api/dispatch/simulate${fireId ? `?fire_id=${encodeURIComponent(fireId)}` : ""}`;
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payloadData || {}),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] /api/dispatch/simulate proxy fallback engaged:", err?.message);
  }

  // Fallback response for offline or waking backend
  const lat = payloadData?.latitude || payloadData?.fire_data?.latitude || 21.1702;
  const lon = payloadData?.longitude || payloadData?.fire_data?.longitude || 72.8311;
  const category = payloadData?.category || payloadData?.fire_data?.category || "EMERGENCY_INDUSTRIAL";
  const todayStr = new Date().toISOString().slice(0, 10);
  const dispatchId = `DSP-${todayStr}-${Math.floor(100 + Math.random() * 900)}`;

  return NextResponse.json({
    dispatch_id: dispatchId,
    timestamp: new Date().toISOString(),
    fire_location: { lat, lon },
    fire_details: {
      id: fireId || "101",
      category,
      frp: 145.0,
      facility_name: "Surat GIDC Chemical Processing Cluster",
    },
    primary_station: {
      name: "Surat Central Fire Station HQ",
      distance_km: 2.54,
      eta_minutes: 6,
      coordinates: { lat: 21.1925, lon: 72.8258 },
      contact: {
        phone: "+91-261-2422222 (simulated)",
        email: "control@surat-fire.gov.in (simulated)",
        radio: "CHANNEL-14",
      },
      capabilities: ["Water tender", "Foam unit", "Rescue", "Thermal imaging camera"],
    },
    backup_station: {
      name: "Surat Sachin GIDC Fire Station",
      distance_km: 10.4,
      eta_minutes: 16,
      coordinates: { lat: 21.0820, lon: 72.8710 },
      contact: {
        phone: "+91-261-2397101 (simulated)",
        email: "backup@surat-fire.gov.in (simulated)",
        radio: "CHANNEL-18",
      },
      capabilities: ["Heavy Foam Bowsers", "Emergency Hazmat Unit"],
    },
    hospitals_notified: [
      {
        id: "HOSP-01",
        name: "New Civil Hospital & Trauma Center Surat",
        distance_km: 1.91,
        eta_minutes: 5,
        coordinates: { lat: 21.1850, lon: 72.8210 },
        contact: { phone: "+91-261-2244175", emergency_hotline: "108" },
        trauma_center: true,
        capacity: { total_beds: 1250, burn_unit_beds: 50, icu_beds: 110 },
        readiness: "CRITICAL_STANDBY",
      },
    ],
    district_collector_notified: true,
    ndma_notified: true,
    recommended_equipment: ["Water tender (2x)", "AFFF Foam unit", "Breathing apparatus", "Thermal cameras"],
    safety_advisories: [
      "Establish 500m civilian evacuation perimeter.",
      "Deploy Class B foam blanket over volatile chemical spill.",
      "WARNING: Avoid direct water jet on chemical tanks",
    ],
    estimated_response: {
      first_responder_eta_min: 6,
      full_deployment_eta_min: 13,
    },
    status: "DISPATCHED",
    channels_delivery: {
      status: "ALL_CHANNELS_DELIVERED",
      channels_count: 5,
      timestamp: new Date().toISOString(),
    },
    simulation_disclaimer:
      "⚠️ SIMULATION MODE - In production deployment, this would send real notifications via Twilio SMS, SendGrid Email, and government communication systems.",
  });
}
