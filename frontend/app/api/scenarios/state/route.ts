import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://web-production-b1e6a.up.railway.app";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/scenarios/state`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({
    is_playing: false,
    scenario_id: null,
    elapsed_seconds: 0,
    progress_pct: 0,
  });
}
