import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fireId = params.id;
  try {
    const res = await fetch(`${BACKEND_URL}/api/field-report/fire/${fireId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({
    fire_id: parseInt(fireId, 10),
    reports: [],
    count: 0,
  });
}
