import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://web-production-b1e6a.up.railway.app";

const FALLBACK_SCENARIOS = [
  {
    id: "surat_emergency",
    name: "Surat Chemical Factory Emergency",
    duration_seconds: 45,
    description: "Emergency fire at chemical processing plant",
    location: { lat: 21.17, lon: 72.83, zoom: 12 },
    timeline_steps: 9,
  },
  {
    id: "punjab_stubble",
    name: "Punjab Stubble Burning Peak",
    duration_seconds: 60,
    description: "October-November agricultural burning demonstration",
    location: { lat: 30.5, lon: 75.5, zoom: 7 },
    timeline_steps: 9,
  },
  {
    id: "uttarakhand_forest",
    name: "Uttarakhand Forest Fire Response",
    duration_seconds: 50,
    description: "Summer forest fire in Himalayan region",
    location: { lat: 30.0, lon: 79.0, zoom: 9 },
    timeline_steps: 9,
  },
];

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/scenarios`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json(FALLBACK_SCENARIOS);
}
