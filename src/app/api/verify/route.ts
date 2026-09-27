import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ module: "verify", status: "stub-ready" });
}

export async function POST() {
  return NextResponse.json({ module: "verify", status: "stub-ready" }, { status: 201 });
}
