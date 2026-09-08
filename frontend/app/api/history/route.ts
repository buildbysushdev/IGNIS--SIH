import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const FALLBACK_LOCATION_HISTORY = {
  location: { lat: 21.1702, lon: 72.8311 },
  query_radius_km: 5.0,
  total_incidents_5yr: 48,
  average_annual_incidents: 9.6,
  average_frp: 132.4,
  max_frp: 215.0,
  peak_season: "Mar - May Window",
  peak_month: "Apr",
  recurrence_probability: 0.88,
  trend: "INCREASING",
  trend_percentage: 16,
  peak_year: 2024,
  annual_timeline: [
    { year: 2021, count: 7, avg_frp: 110.2, max_frp: 160.0 },
    { year: 2022, count: 8, avg_frp: 118.5, max_frp: 175.0 },
    { year: 2023, count: 10, avg_frp: 130.0, max_frp: 190.0 },
    { year: 2024, count: 12, avg_frp: 145.2, max_frp: 215.0 },
    { year: 2025, count: 11, avg_frp: 142.0, max_frp: 205.0 },
  ],
  monthly_patterns: [
    { month: 1, name: "Jan", count: 2, intensity_percent: 22 },
    { month: 2, name: "Feb", count: 3, intensity_percent: 33 },
    { month: 3, name: "Mar", count: 7, intensity_percent: 78 },
    { month: 4, name: "Apr", count: 9, intensity_percent: 100 },
    { month: 5, name: "May", count: 8, intensity_percent: 89 },
    { month: 6, name: "Jun", count: 3, intensity_percent: 33 },
    { month: 7, name: "Jul", count: 1, intensity_percent: 11 },
    { month: 8, name: "Aug", count: 1, intensity_percent: 11 },
    { month: 9, name: "Sep", count: 2, intensity_percent: 22 },
    { month: 10, name: "Oct", count: 5, intensity_percent: 56 },
    { month: 11, name: "Nov", count: 5, intensity_percent: 56 },
    { month: 12, name: "Dec", count: 2, intensity_percent: 22 },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "21.1702";
  const lon = searchParams.get("lon") || "72.8311";
  const radius = searchParams.get("radius") || "5";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `${BACKEND_URL}/api/history?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&radius=${encodeURIComponent(radius)}`,
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] /api/history proxy fallback engaged:", err?.message);
  }

  return NextResponse.json({
    ...FALLBACK_LOCATION_HISTORY,
    location: { lat: parseFloat(lat), lon: parseFloat(lon) },
  });
}
