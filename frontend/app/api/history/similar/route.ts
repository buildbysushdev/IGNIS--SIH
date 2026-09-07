import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-b1e6a.up.railway.app";

const FALLBACK_SIMILAR = [
  {
    id: "INC-2020-VIZAG",
    date: "2020-05-07",
    name: "Vizag LG Polymers Chemical Styrene Vapor Leak & Fire",
    location: { lat: 17.6868, lon: 83.2185, name: "Visakhapatnam, Andhra Pradesh" },
    type: "EMERGENCY_INDUSTRIAL",
    category: "CHEMICAL_GAS_FIRE",
    casualties: 12,
    injured: 585,
    response_time: 35,
    frp_estimate: 110.0,
    similarity_score: 94,
    lessons_learned: [
      "Inadequate thermal refrigeration of monomer tanks caused runaway auto-polymerization.",
      "Evacuation sirens failed to broadcast immediate wind-direction warnings.",
      "Tert-butylcatechol (TBC) inhibitor levels must be monitored continuously via remote telemetry.",
    ],
    outcome: "CONTAINED",
  },
  {
    id: "INC-2024-DOMBIVLI",
    date: "2024-05-23",
    name: "Dombivli MIDC Chemical Factory Reactor Explosion",
    location: { lat: 19.2183, lon: 73.0868, name: "Thane, Maharashtra" },
    type: "EMERGENCY_INDUSTRIAL",
    category: "CHEMICAL_BOILER_EXPLOSION",
    casualties: 10,
    injured: 64,
    response_time: 28,
    frp_estimate: 160.0,
    similarity_score: 91,
    lessons_learned: [
      "Boiler overpressure led to secondary explosions across 3 adjoining chemical units.",
      "Chemical zoning violations: dense residential populations within 200m of hazardous boilers.",
    ],
    outcome: "CONTAINED",
  },
  {
    id: "INC-2023-DAHANU",
    date: "2023-08-17",
    name: "Dahanu Tarapur MIDC Chemical Reactor Blast",
    location: { lat: 19.8250, lon: 72.6950, name: "Palghar, Maharashtra" },
    type: "EMERGENCY_INDUSTRIAL",
    category: "CHEMICAL_SOLVENT_FIRE",
    casualties: 4,
    injured: 28,
    response_time: 30,
    frp_estimate: 125.0,
    similarity_score: 88,
    lessons_learned: [
      "Solvent distillation column failure under sudden power fluctuations.",
      "Neighboring units mobilized private mutual-aid fire tenders within 10 minutes.",
    ],
    outcome: "CONTAINED",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "EMERGENCY_INDUSTRIAL";
  const frp = searchParams.get("frp") || "120";
  const lat = searchParams.get("lat") || "";
  const lon = searchParams.get("lon") || "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const query = `category=${encodeURIComponent(category)}&frp=${encodeURIComponent(frp)}${lat ? `&lat=${lat}&lon=${lon}` : ""}`;
    const res = await fetch(`${BACKEND_URL}/api/history/similar?${query}`, {
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
    console.warn("[IGNIS-PROXY] /api/history/similar proxy fallback:", err?.message);
  }

  return NextResponse.json(FALLBACK_SIMILAR);
}
