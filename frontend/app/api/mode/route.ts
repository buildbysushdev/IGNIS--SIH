import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let localMode = "LIVE";
let localSince = new Date().toISOString();
let localReason = "System boot default";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/mode`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({
    mode: localMode,
    since: localSince,
    reason: localReason,
    data_source:
      localMode === "LIVE"
        ? "NASA FIRMS Real-Time"
        : localMode === "CACHED"
        ? "Local Cache (last sync: 0 hours ago)"
        : "Simulated Data for Demonstration",
  });
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const queryMode = url.searchParams.get("mode");
    let target = "";
    try {
      const body = await request.json();
      target = (queryMode || body.mode || "").toUpperCase().trim();
    } catch {
      target = (queryMode || "").toUpperCase().trim();
    }

    if (!target) {
      return NextResponse.json({ error: "Mode parameter is required" }, { status: 400 });
    }

    // Try forwarding to backend
    try {
      const res = await fetch(`${BACKEND_URL}/api/mode/set?mode=${target}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: target }),
      });
      if (res.ok) {
        const data = await res.json();
        localMode = data.new_mode || target;
        return NextResponse.json(data);
      }
    } catch {}

    if (["LIVE", "CACHED", "DEMO", "AUTO"].includes(target)) {
      localMode = target === "AUTO" ? "LIVE" : target;
      localSince = new Date().toISOString();
      localReason = `Manual switch: ${localMode}`;
      return NextResponse.json({ success: true, new_mode: localMode });
    }

    return NextResponse.json(
      { error: "Invalid mode. Must be LIVE, CACHED, DEMO, or AUTO" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to set mode" }, { status: 500 });
  }
}
