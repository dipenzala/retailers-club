import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { image_url } = await req.json();
  if (!image_url) return NextResponse.json({ results: [] }, { status: 400 });

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-placeholder") {
    return NextResponse.json({ results: [], note: "Add OPENAI_API_KEY to enable visual search" });
  }

  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const vision = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Identify garment product. Return JSON: {category, color, fabric, keywords}" },
      { role: "user", content: [
        { type: "text", text: "Analyze" },
        { type: "image_url", image_url: { url: image_url } },
      ]},
    ],
    response_format: { type: "json_object" },
  });

  const attrs = JSON.parse(vision.choices[0].message.content || "{}");
  const supabase = await createClient();
  let q = supabase.from("products").select("*").limit(20);
  if (attrs.category) q = q.ilike("category", `%${attrs.category}%`);
  const { data } = await q;
  return NextResponse.json({ results: data || [], attrs });
}
