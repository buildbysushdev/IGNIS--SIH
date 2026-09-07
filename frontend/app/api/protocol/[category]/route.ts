import { NextResponse } from "next/server";
import { getResponseProtocol } from "@/data/fireResponse";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://web-production-b1e6a.up.railway.app";

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  const { category } = params;

  try {
    const res = await fetch(`${BACKEND_URL}/api/protocol/${category}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  // Fallback to bundled dataset
  const protocol = getResponseProtocol(category);
  return NextResponse.json({
    category: category.toUpperCase(),
    ...protocol,
  });
}
