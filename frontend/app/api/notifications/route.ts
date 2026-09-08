import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const FALLBACK_QUEUE = [
  {
    id: 101,
    detection_id: 1,
    alert_type: "EMERGENCY_FIRE",
    severity: "CRITICAL",
    status: "NEW",
    message: "🚨 CRITICAL EVENT: Thermal spike (145.0MW) detected at Surat GIDC Chemical Processing Cluster.",
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    latitude: 21.1702,
    longitude: 72.8311,
    frp: 145.0,
    category: "EMERGENCY_INDUSTRIAL",
    protocol_summary: {
      fire_class: "Class B/C (Chemical/Solvent)",
      primary_agents: ["AFFF Foam", "Dry Chemical Powder (Purple-K)"],
      avoid: ["Water jet on open liquid solvent", "Direct contact without SCBA"],
      evacuation_radius_m: 800,
      personnel_required: 18,
    },
    nearest_station: {
      name: "Surat Central Fire Station",
      distance_km: 2.3,
      eta_minutes: 6,
      phone: "+91-261-2422222",
    },
    recommended_actions: ["ACKNOWLEDGE", "DISPATCH", "ESCALATE", "FALSE_ALARM"],
  },
  {
    id: 102,
    detection_id: 2,
    alert_type: "EMERGENCY_FIRE",
    severity: "CRITICAL",
    status: "NEW",
    message: "🚨 CRITICAL EVENT: Major volatile solvent thermal signature (92.4MW) at Vapi GIDC Chemical Estate.",
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    latitude: 20.3712,
    longitude: 72.9054,
    frp: 92.4,
    category: "EMERGENCY_INDUSTRIAL",
    protocol_summary: {
      fire_class: "Class B/C (Chemical)",
      primary_agents: ["AFFF Foam", "Dry Powder"],
      avoid: ["Inhalation of dense toxic plumes", "Water deluge into closed tanks"],
      evacuation_radius_m: 600,
      personnel_required: 14,
    },
    nearest_station: {
      name: "Vapi GIDC Fire Station",
      distance_km: 1.8,
      eta_minutes: 5,
      phone: "+91-260-2430101",
    },
    recommended_actions: ["ACKNOWLEDGE", "DISPATCH", "ESCALATE", "FALSE_ALARM"],
  },
];

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/notifications`, {
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
    console.warn("[IGNIS-PROXY] /api/notifications proxy failed:", err?.message);
  }

  return NextResponse.json(FALLBACK_QUEUE);
}
