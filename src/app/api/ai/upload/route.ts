import { NextResponse } from "next/server";
import { suggestProductAttributes } from "@/lib/ai/openai";

export async function POST(req: Request) {
  try {
    const { image_url } = await req.json();
    if (!image_url) return NextResponse.json({ error: "image_url required" }, { status: 400 });
    const attrs = await suggestProductAttributes(image_url);
    return NextResponse.json({ attributes: attrs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
