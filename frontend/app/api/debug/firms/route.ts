import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CANDIDATE_URLS = [
  process.env.BACKEND_INTERNAL_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "http://127.0.0.1:8000",
  "https://web-production-b1e6a.up.railway.app",
].filter(Boolean) as string[];

export async function GET() {
  for (const baseUrl of CANDIDATE_URLS) {
    try {
      const url = `${baseUrl.replace(/\/$/, "")}/api/debug/firms`;
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

  return NextResponse.json({
    key_present: false,
    live_count: 0,
    cache_count: 0,
    mode: "offline",
    sample: [],
    last_error: "Could not connect to backend diagnostics service",
  });
}
