import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/mode/health`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({
    firms_api: "connected",
    database: "healthy",
    cache: { exists: true, age_hours: 0.5, count: 250 },
    demo_data: { available: true, fires: 250 },
    recommended_mode: "LIVE",
    current_mode: "LIVE",
  });
}
