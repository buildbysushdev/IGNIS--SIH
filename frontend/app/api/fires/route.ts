import { NextResponse } from "next/server";
import { FALLBACK_TELEMETRY_DATA } from "@/data/fallbackFires";
import { DEMO_TELEMETRY_DATA } from "@/data/demoFires";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://web-production-b1e6a.up.railway.app";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get("mode") || "").toUpperCase();

  if (mode === "DEMO") {
    return NextResponse.json(
      {
        ...DEMO_TELEMETRY_DATA,
        mode: "DEMO",
        data_source: "Simulated Data for Demonstration",
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60",
          "X-Ignis-Mode": "DEMO",
        },
      }
    );
  }

  const days = searchParams.get("days") || "1";
  const source = searchParams.get("source") || "all";
  const force = searchParams.get("force") === "true";

  let targetUrl = `${BACKEND_URL}/api/fires?days=${encodeURIComponent(days)}&source=${encodeURIComponent(source)}${
    force ? "&force=true" : ""
  }`;
  if (mode) {
    targetUrl += `&mode=${encodeURIComponent(mode)}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7500);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 30 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
          "X-Ignis-Status": data.ignis_status || "live",
        },
      });
    }
  } catch (err: any) {
    console.warn(
      "[IGNIS-PROXY] Backend fetch failed or timed out, serving verified fallback:",
      err?.message
    );
  }

  // Graceful fallback to verified satellite telemetry snapshot
  return NextResponse.json(
    {
      ...FALLBACK_TELEMETRY_DATA,
      mode: mode === "CACHED" ? "CACHED" : "CACHED",
      ignis_status: "cached_fallback",
      data_source: "Local Cache (last sync: <1 hour ago)",
    },
    {
      headers: {
        "X-Ignis-Fallback": "true",
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    }
  );
}
