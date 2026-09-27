import { NextResponse } from "next/server";
import { parseSearchQuery } from "@/lib/ai/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

    let parsed: any = {};
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-placeholder") {
      parsed = await parseSearchQuery(query);
    } else {
      // Basic fallback
      parsed = { keywords: query.split(" ") };
    }

    const supabase = await createClient();
    let q = supabase.from("products").select("*").limit(30);
    if (parsed.category) q = q.ilike("category", `%${parsed.category}%`);
    if (parsed.priceMax) q = q.lte("price", parsed.priceMax);
    if (parsed.fabric) q = q.ilike("fabric", `%${parsed.fabric}%`);
    if (parsed.color) q = q.ilike("color", `%${parsed.color}%`);

    const { data } = await q.order("created_at", { ascending: false });
    return NextResponse.json({ parsed, results: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
