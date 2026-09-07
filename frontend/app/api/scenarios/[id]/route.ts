import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import suratScen from "@/data/scenarios/surat_emergency.json";
import punjabScen from "@/data/scenarios/punjab_stubble.json";
import uttarakhandScen from "@/data/scenarios/uttarakhand_forest.json";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://web-production-b1e6a.up.railway.app";

const BUNDLED_SCENARIOS: Record<string, any> = {
  surat_emergency: suratScen,
  punjab_stubble: punjabScen,
  uttarakhand_forest: uttarakhandScen,
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1. Try backend
  try {
    const res = await fetch(`${BACKEND_URL}/api/scenarios/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  // 2. Try reading from filesystem
  try {
    const possiblePaths = [
      path.join(process.cwd(), "data", "scenarios", `${id}.json`),
      path.join(process.cwd(), "..", "backend", "scenarios", `${id}.json`),
      path.join(process.cwd(), "backend", "scenarios", `${id}.json`),
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const fileContent = fs.readFileSync(p, "utf-8");
        return NextResponse.json(JSON.parse(fileContent));
      }
    }
  } catch {}

  // 3. Bundled import fallback
  if (BUNDLED_SCENARIOS[id]) {
    return NextResponse.json(BUNDLED_SCENARIOS[id]);
  }

  return NextResponse.json(
    { error: `Scenario '${id}' not found` },
    { status: 404 }
  );
}

