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
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${BACKEND_URL}/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    // Fallback if backend or Open-Meteo is unreachable
  }

  // Graceful fallback weather
  return NextResponse.json({
    source: "Edge Climatology Fallback",
    temperature: 31.5,
    wind_speed: 12.0,
    wind_direction: 255.0,
    wind_compass: "WSW",
    humidity: 54.0,
    timestamp: new Date().toISOString(),
    is_cached: true,
  });
}
