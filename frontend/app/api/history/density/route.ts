import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-b1e6a.up.railway.app";

const FALLBACK_DENSITY = [
  { lat: 21.1702, lon: 72.8311, frp: 145.0, year: 2024, category: "EMERGENCY_INDUSTRIAL", intensity: 0.95 },
  { lat: 21.6260, lon: 73.0030, frp: 95.0, year: 2023, category: "EMERGENCY_INDUSTRIAL", intensity: 0.75 },
  { lat: 20.3720, lon: 72.9100, frp: 90.0, year: 2024, category: "EMERGENCY_INDUSTRIAL", intensity: 0.70 },
  { lat: 22.4700, lon: 69.8300, frp: 220.0, year: 2024, category: "PERSISTENT_INDUSTRIAL", intensity: 1.0 },
  { lat: 21.1890, lon: 81.3980, frp: 160.0, year: 2023, category: "PERSISTENT_INDUSTRIAL", intensity: 0.85 },
  { lat: 22.2530, lon: 84.8820, frp: 145.0, year: 2022, category: "PERSISTENT_INDUSTRIAL", intensity: 0.80 },
  { lat: 30.2450, lon: 75.8450, frp: 120.0, year: 2024, category: "AGRICULTURAL_BURNING", intensity: 0.70 },
  { lat: 30.9010, lon: 75.8573, frp: 85.0, year: 2023, category: "AGRICULTURAL_BURNING", intensity: 0.65 },
  { lat: 30.3700, lon: 79.2500, frp: 190.0, year: 2023, category: "FOREST_FIRE", intensity: 0.90 },
  { lat: 29.3800, lon: 79.4600, frp: 175.0, year: 2024, category: "FOREST_FIRE", intensity: 0.85 },
  { lat: 17.6868, lon: 83.2185, frp: 110.0, year: 2024, category: "EMERGENCY_INDUSTRIAL", intensity: 0.75 },
  { lat: 19.2183, lon: 73.0868, frp: 125.0, year: 2024, category: "EMERGENCY_INDUSTRIAL", intensity: 0.80 },
  { lat: 28.6815, lon: 77.0305, frp: 75.0, year: 2023, category: "COMMERCIAL_FIRE", intensity: 0.60 },
  { lat: 22.0600, lon: 88.0600, frp: 115.0, year: 2024, category: "EMERGENCY_INDUSTRIAL", intensity: 0.75 },
  { lat: 21.8500, lon: 86.3500, frp: 185.0, year: 2022, category: "FOREST_FIRE", intensity: 0.90 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "400";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/history/density?limit=${limit}`, {
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
    console.warn("[IGNIS-PROXY] /api/history/density proxy fallback:", err?.message);
  }

  return NextResponse.json(FALLBACK_DENSITY);
}
