import { NextResponse } from "next/server";
import { parseSearchQuery, embed } from "@/lib/ai/openai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });

    const parsed = await parseSearchQuery(query);
    const vector = await embed(query);

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("search_products_semantic", {
      query_embedding: vector as any,
      match_threshold: 0.5,
      match_count: 20,
    });

    if (error) return NextResponse.json({ parsed, results: [], note: "RPC not set up yet" });
    return NextResponse.json({ parsed, results: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
