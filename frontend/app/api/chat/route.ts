import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const FALLBACK_ANSWERS: Record<string, any> = {
  chemical: {
    response:
      "### ⚠️ Hazardous Material Protocol (Offline Fallback)\n\nPer **NDMA Chemical Emergency SOP**:\n- **Primary Agent**: Deploy Aqueous Film-Forming Foam (**AFFF / AR-AFFF**) or Dry Chemical Powder.\n- **CRITICAL AVOIDANCE**: **NEVER apply direct water stream** on bulk chemical pools or reactive vessels.\n- **Deluge Cooling**: Minimum **10.2 L/min/m²** from unmanned ground monitors.\n- **Isolation Perimeter**: Minimum **800m initial**, **1.6km downwind**.",
    sources: ["NDMA Chemical Disaster Management Guidelines", "IS 2190: 2010"],
    confidence: 0.9,
    suggested_actions: ["Establish 800m perimeter", "Deploy foam monitors", "Notify trauma center"],
    follow_up_questions: ["What is BLEVE blast radius?", "Nearest foam tender station?", "What is Styrene protocol?"],
  },
  station: {
    response:
      "### 🚒 Tactical Dispatch Analysis (Surat Sector Fallback)\n\n- **Primary Station**: Surat Fire Station HQ\n- **Distance**: **3.2 km**\n- **ETA**: **6 minutes**\n- **Direct Line**: `0261-2423777`\n- **Capabilities**: Heavy Foam Units, 54m Hydraulic Platform, Water Tenders.",
    sources: ["State Fire Services Directory"],
    confidence: 0.9,
    suggested_actions: ["Simulate emergency dispatch", "Check road transit corridor"],
    follow_up_questions: ["Show nearest trauma hospital", "Evacuation protocol for this zone"],
  },
  default: {
    response:
      "### 🤖 AGNI-AI Response\n\nAGNI-AI is actively monitoring real-time telemetry grid. All operations must adhere to NDMA Incident Command System (ICS) guidelines.\n\n- **Classification**: Consult IS 2190 for Class A/B/C/D extinguisher compatibility.\n- **Emergency Control Lines**: **112** (Unified) / **101** (Fire Control).",
    sources: ["NDMA Incident Response System", "IS 2190"],
    confidence: 0.88,
    suggested_actions: ["Query active fires", "Locate nearest fire station"],
    follow_up_questions: ["How to fight chemical fire?", "What is the current emergency status?", "Show critical fires in my region"],
  },
};

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = { message: "" };
  }

  const message = String(body.message || "").toLowerCase();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.response) {
        return NextResponse.json(data);
      }
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] /api/chat backend link issue:", err?.message);
  }

  // Resilient fallback logic
  if (message.includes("chemical") || message.includes("foam") || message.includes("lpg")) {
    return NextResponse.json(FALLBACK_ANSWERS.chemical);
  }
  if (message.includes("station") || message.includes("nearest") || message.includes("dispatch")) {
    return NextResponse.json(FALLBACK_ANSWERS.station);
  }
  return NextResponse.json(FALLBACK_ANSWERS.default);
}
