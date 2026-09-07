import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-b1e6a.up.railway.app";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "21.1702";
  const lon = searchParams.get("lon") || "72.8311";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/fire-stations/nearest?lat=${lat}&lon=${lon}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] /api/fire-stations/nearest proxy fallback:", err?.message);
  }

  return NextResponse.json({
    name: "Surat Central Fire Station HQ",
    distance_km: 2.54,
    eta_minutes: 6,
    coordinates: { lat: 21.1925, lon: 72.8258 },
    contact: {
      phone: "+91-261-2422222 (simulated)",
      email: "control@surat-fire.gov.in (simulated)",
      radio: "CHANNEL-14",
    },
    capabilities: ["Water tender (3x)", "AFFF Foam unit (2x)", "Rescue unit", "Thermal cameras"],
    city: "Surat",
    state: "Gujarat",
  });
}
