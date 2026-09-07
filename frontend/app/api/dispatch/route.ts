import { NextResponse } from "next/server";
import { getResponseProtocol } from "@/data/fireResponse";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lat = Number(body.latitude || body.fire_location?.lat || 0);
    const lon = Number(body.longitude || body.fire_location?.lon || 0);
    const category = body.category || body.fire_category || "UNKNOWN";
    const station = body.fire_station || {
      name: "Surat Central Fire Station",
      distance_km: 2.3,
      eta_minutes: 6,
      phone: "+91-261-2422222",
    };

    const protocol = getResponseProtocol(category);
    const dispatchId = `DISPATCH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const record = {
      dispatch_id: dispatchId,
      fire_location: { lat, lon },
      fire_category: category,
      fire_station: station,
      recommended_equipment: protocol.equipment,
      safety_distance: protocol.safety_distance_m,
      sent_to: ["fire_station", "district_collector", "ndma"],
      timestamp: new Date().toISOString(),
      status: "DISPATCHED",
      simulation_disclaimer:
        "⚠️ SIMULATION MODE: In production, this would send SMS via Twilio to fire station and email to district collector.",
    };

    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "Failed to process dispatch" }, { status: 400 });
  }
}
