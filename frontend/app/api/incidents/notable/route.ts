import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-b1e6a.up.railway.app";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "50";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/incidents/notable?limit=${limit}`, {
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
    console.warn("[IGNIS-PROXY] /api/incidents/notable proxy fallback:", err?.message);
  }

  // Fallback notable incidents
  return NextResponse.json([
    {
      id: "INC-2020-VIZAG",
      date: "2020-05-07",
      name: "Vizag LG Polymers Chemical Styrene Vapor Leak & Fire",
      location: { lat: 17.6868, lon: 83.2185, name: "Visakhapatnam, Andhra Pradesh" },
      type: "EMERGENCY_INDUSTRIAL",
      casualties: 12,
      response_time: 35,
      lessons_learned: [
        "Inadequate thermal refrigeration of monomer tanks caused runaway auto-polymerization.",
        "Evacuation sirens failed to broadcast immediate wind-direction warnings.",
      ],
      outcome: "CONTAINED",
    },
    {
      id: "INC-2019-SURAT",
      date: "2019-05-24",
      name: "Surat Takshashila Arcade Complex Fire",
      location: { lat: 21.2285, lon: 72.8890, name: "Surat, Gujarat" },
      type: "COMMERCIAL_FIRE",
      casualties: 22,
      response_time: 18,
      lessons_learned: [
        "Inflammable polyurethane foam roofing accelerated vertical fire spread.",
        "Hydraulic platform tenders lacked immediate clear access.",
      ],
      outcome: "EXTINGUISHED",
    },
    {
      id: "INC-2018-UK-FOREST",
      date: "2018-05-22",
      name: "Uttarakhand Garhwal & Kumaon Wildfire Wave",
      location: { lat: 30.3700, lon: 79.2500, name: "Chamoli / Nainital, Uttarakhand" },
      type: "FOREST_FIRE",
      casualties: 7,
      response_time: 90,
      lessons_learned: [
        "Dry chir pine resin needle accumulation created rapid crown fire propagation.",
        "Early satellite thermal anomaly detection reduced response lag.",
      ],
      outcome: "CONTAINED",
    },
  ]);
}
