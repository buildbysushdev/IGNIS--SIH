import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─── Increase maxDuration for Vercel (Pro plan allows up to 300s; Hobby: 60s)
export const maxDuration = 60;

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
      "### 🚒 Tactical Dispatch Analysis (Fallback)\n\n- **Primary Station**: Nearest City Fire Station HQ\n- **Emergency Line**: `101` (Fire Control) / `112` (Unified Emergency)\n- **Capabilities**: Heavy Foam Units, Hydraulic Platform, Water Tenders.",
    sources: ["State Fire Services Directory"],
    confidence: 0.9,
    suggested_actions: ["Simulate emergency dispatch", "Check road transit corridor"],
    follow_up_questions: ["Show nearest trauma hospital", "Evacuation protocol for this zone"],
  },
  default: {
    response:
      "### 🤖 AGNI-AI Response\n\nAGNI-AI is actively monitoring real-time telemetry grid. All operations must adhere to NDMA Incident Command System (ICS) guidelines.\n\n- **Classification**: Consult IS 2190 for Class A/B/C/D extinguisher compatibility.\n- **Emergency Control Lines**: **112** (Unified) / **101** (Fire Control).\n\n> ⚠️ *AI backend is temporarily busy — this is a cached tactical response. Ask again in a moment for a live AI-generated reply.*",
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
    // 45-second timeout — Gemini LLM can take 20-30s on first cold call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

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
    const isTimeout = err?.name === "AbortError" || err?.message?.includes("abort");
    if (isTimeout) {
      console.warn("[IGNIS-PROXY] /api/chat timed out after 45s — Gemini API slow");
      return NextResponse.json({
        response:
          "### ⏳ AGNI-AI is processing...\n\nThe AI response is taking longer than usual (Gemini API may be under high load). Please try again in a few seconds.\n\n> 💡 *Tip: For immediate fire intelligence, check the live map hotspots and stats panel.*",
        sources: ["IGNIS System"],
        confidence: 0.5,
        suggested_actions: ["Try again", "Check active fire map", "View emergency alerts"],
        follow_up_questions: ["What fires are active now?", "Show nearest fire station"],
      });
    }
    console.warn("[IGNIS-PROXY] /api/chat backend link issue:", err?.message);
  }

  // Resilient fallback based on query keywords
  if (message.includes("chemical") || message.includes("foam") || message.includes("lpg")) {
    return NextResponse.json(FALLBACK_ANSWERS.chemical);
  }
  if (message.includes("station") || message.includes("nearest") || message.includes("dispatch")) {
    return NextResponse.json(FALLBACK_ANSWERS.station);
  }
  return NextResponse.json(FALLBACK_ANSWERS.default);
}
