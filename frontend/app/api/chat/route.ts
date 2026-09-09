import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─── Increase maxDuration for Vercel (Pro plan allows up to 300s; Hobby: 60s)
export const maxDuration = 60;

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

const SYSTEM_PROMPT = `You are AGNI-AI, the official in-app tactical assistant for Project IGNIS
(Intelligent Geospatial Network for Industrial Fire Screening) — SIH Problem ID SIH26162 (NTRO).

STRICT RULES:
1. You ONLY answer questions about IGNIS: fire detection, NASA FIRMS satellite telemetry, OSM infrastructure classification,
   FRP (Fire Radiative Power), persistence analysis, false-alarm filtering (bonfire and garbage burn suppression),
   dispatch simulation, SMS radius alerts, IS 2190 protocols, NDMA guidelines, tactical operations, dashboard usage,
   APIs, deployment, and this SIH project context.
2. If the user asks about anything else (recipes, personal advice, homework, general knowledge,
   politics, other projects, jokes unrelated to IGNIS, etc.), reply EXACTLY with:
   "I'm AGNI-AI and can only help with the IGNIS fire-intelligence platform and this SIH project. Please ask about fires, alerts, dispatch, classification, or the dashboard."
3. Be concise, operator-friendly, and accurate to IGNIS domain language and tactical standards.
4. If the user describes a site issue (API down, map not loading, no fires, deploy error, NXDOMAIN, 503),
   suggest practical IGNIS-specific checks: /api/health, Railway deploy logs, FIRMS cache fallback,
   CORS, port binding 0.0.0.0, domain regeneration, filters (days/category), etc.
5. Never ask for or expose API keys, tokens, or secrets.
6. Never invent live fire incidents; if data is unavailable, say to use Mentorship Demo or Cached mode.`;

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
      "### 🤖 AGNI-AI Tactical Response\n\nAGNI-AI is actively monitoring real-time telemetry grid. All operations must adhere to NDMA Incident Command System (ICS) guidelines.\n\n- **Classification**: Consult IS 2190 for Class A/B/C/D extinguisher compatibility.\n- **Emergency Control Lines**: **112** (Unified) / **101** (Fire Control).\n\n> 💡 *Command link active. Ask about fire suppression, chemical containment, nearest stations, or system diagnostics.*",
    sources: ["NDMA Incident Response System", "IS 2190"],
    confidence: 0.88,
    suggested_actions: ["Query active fires", "Locate nearest fire station"],
    follow_up_questions: ["How to fight chemical fire?", "What is the current emergency status?", "Show critical fires in my region"],
  },
};

async function callDirectGemini(promptText: string) {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) return null;

  const models = ["gemini-flash-lite-latest", "gemini-flash-latest"];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: promptText.slice(0, 3000) }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const text = parts
        .filter((p: any) => p.text && !p.thought)
        .map((p: any) => p.text)
        .join(" ")
        .trim();
      if (text) {
        return {
          response: text,
          sources: ["IGNIS AI Intelligence Core (Direct)", "IS 2190 / NDMA Standards"],
          confidence: 0.98,
          suggested_actions: ["Simulate dispatch", "View regional telemetry", "Check /health status"],
          follow_up_questions: ["What is the turnout ETA for this sector?", "Show response protocol checklist"],
          data_card: null,
          map_action: null,
        };
      }
    } catch (err: any) {
      console.warn(`[IGNIS-PROXY] Direct Gemini (${model}) notice:`, err?.message);
      continue;
    }
  }
  return null;
}

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = { message: "" };
  }

  const rawMessage = String(body.message || "").trim();
  const lowerMsg = rawMessage.toLowerCase();

  // 1. Primary: Try dedicated FastAPI backend (with RAG, Station DB, persistence)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

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
    console.warn("[IGNIS-PROXY] /api/chat backend connection notice:", err?.message);
  }

  // 2. Secondary: Direct Gemini REST invocation (ideal for Vercel edge/serverless)
  if (rawMessage) {
    try {
      const directGemini = await callDirectGemini(rawMessage);
      if (directGemini) {
        return NextResponse.json(directGemini);
      }
    } catch (err: any) {
      console.warn("[IGNIS-PROXY] Direct Gemini invocation error:", err?.message);
    }
  }

  // 3. Tertiary: Tactical domain fallback based on query intent
  if (lowerMsg.includes("chemical") || lowerMsg.includes("foam") || lowerMsg.includes("lpg")) {
    return NextResponse.json(FALLBACK_ANSWERS.chemical);
  }
  if (lowerMsg.includes("station") || lowerMsg.includes("nearest") || lowerMsg.includes("dispatch")) {
    return NextResponse.json(FALLBACK_ANSWERS.station);
  }
  return NextResponse.json(FALLBACK_ANSWERS.default);
}
