import { NextResponse } from "next/server";
import { FALLBACK_ALERTS_DATA } from "@/data/fallbackFires";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hours = searchParams.get("hours") || "24";
  const targetUrl = `${BACKEND_URL}/api/alerts?hours=${encodeURIComponent(hours)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] Alerts fetch failed:", err?.message);
  }

  return NextResponse.json(FALLBACK_ALERTS_DATA);
}
