import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let inMemoryMode = "live";

export async function GET() {
  return NextResponse.json({
    mode: inMemoryMode,
    description: "LIVE: NASA FIRMS Satellite | DEMO: 250+ Scripted Anomalies | CACHED: Local SQLite Cache",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mode = (body.mode || "").toLowerCase().trim();
    if (["live", "demo", "cached"].includes(mode)) {
      inMemoryMode = mode;
      return NextResponse.json({ status: "success", mode: inMemoryMode });
    }
    return NextResponse.json(
      { error: "Invalid mode. Must be 'live', 'demo', or 'cached'" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
