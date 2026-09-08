import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CANDIDATE_URLS = [
  process.env.BACKEND_INTERNAL_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "http://127.0.0.1:8000",
  "http://localhost:8000",
].filter(Boolean) as string[];

export async function GET() {
  for (const baseUrl of CANDIDATE_URLS) {
    try {
      const url = `${baseUrl.replace(/\/$/, "")}/api/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json(
    {
      status: "degraded",
      nasa_firms: "disconnected",
      error: "Backend service unreachable on local or configured host",
      active_fires_24h: 0,
      timestamp: new Date().toISOString(),
    },
    { status: 503 }
  );
}
