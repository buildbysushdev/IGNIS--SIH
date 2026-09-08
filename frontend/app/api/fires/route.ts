import { NextResponse } from "next/server";
import { FALLBACK_TELEMETRY_DATA } from "@/data/fallbackFires";
import { DEMO_TELEMETRY_DATA } from "@/data/demoFires";

export const dynamic = "force-dynamic";

const CANDIDATE_URLS = [
  process.env.BACKEND_INTERNAL_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "http://127.0.0.1:8000",
  "http://127.0.0.1:8000",
].filter(Boolean) as string[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get("mode") || "").toUpperCase();

  if (mode === "DEMO") {
    return NextResponse.json(
      {
        ...DEMO_TELEMETRY_DATA,
        mode: "DEMO",
        ignis_status: "demo",
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

  for (const baseUrl of CANDIDATE_URLS) {
    try {
      let targetUrl = `${baseUrl.replace(/\/$/, "")}/api/fires?days=${encodeURIComponent(days)}&source=${encodeURIComponent(source)}${
        force ? "&force=true" : ""
      }`;
      if (mode) {
        targetUrl += `&mode=${encodeURIComponent(mode)}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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
        const fires = Array.isArray(data.fires) ? data.fires : [];
        if (fires.length > 0 || days !== "1") {
          // Guarantee complete summary
          const summary = data.summary || {
            total: fires.length,
            emergency: 0,
            persistent: 0,
            agricultural: 0,
            forest: 0,
            unknown: 0,
          };
          return NextResponse.json(
            {
              ...data,
              fires,
              total: fires.length,
              summary,
              ignis_status: data.ignis_status || "live",
            },
            {
              headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
                "X-Ignis-Status": data.ignis_status || "live",
              },
            }
          );
        }
      }
    } catch (err: any) {
      // Try next candidate URL
      continue;
    }
  }

  // Graceful fallback to verified satellite telemetry snapshot
  return NextResponse.json(
    {
      ...FALLBACK_TELEMETRY_DATA,
      mode: mode === "CACHED" ? "CACHED" : "CACHED",
      ignis_status: "cached_fallback",
      data_source: "Local Cache Repository (verified telemetry snapshot)",
    },
    {
      headers: {
        "X-Ignis-Fallback": "true",
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    }
  );
}
