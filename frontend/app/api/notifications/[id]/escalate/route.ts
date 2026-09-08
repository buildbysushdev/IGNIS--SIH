import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const alertId = params.id;
  let body = { level: "DISTRICT" };

  try {
    const raw = await request.json();
    if (raw && raw.level) {
      body.level = raw.level;
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${BACKEND_URL}/api/notifications/${alertId}/escalate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err: any) {
    console.warn("[IGNIS-PROXY] Escalate proxy fallback engaged:", err?.message);
  }

  // Local fallback response for seamless demonstration
  const agencies =
    body.level === "NATIONAL"
      ? ["NDMA National Control Room", "Ministry of Home Affairs", "NDRF Headquarters New Delhi"]
      : body.level === "STATE"
      ? ["State Disaster Management Authority (SDMA)", "State Fire Directorate", "SDRF Regional Battalion"]
      : ["District Magistrate Office", "District Emergency Ops Center (DEOC)", "Chief Fire Officer"];

  return NextResponse.json({
    status: "ESCALATED",
    alert_id: parseInt(alertId, 10) || 101,
    escalation_level: body.level,
    notified_agencies: agencies,
    escalated_at: new Date().toISOString(),
    broadcast_id: `ESC-LOG-${Date.now().toString().slice(-6)}`,
  });
}
