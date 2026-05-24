import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "plm-freelancer-platform",
    timestamp: new Date().toISOString(),
  });
}
