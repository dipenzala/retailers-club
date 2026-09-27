import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const priceMax = Number(searchParams.get("price_max") || 0);
  const minPrice = Number(searchParams.get("min_price") || 0);

  let query = supabase.from("products").select("*").limit(40);

  if (q) query = query.ilike("title", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (priceMax > 0) query = query.lte("price", priceMax);
  if (minPrice > 0) query = query.gte("price", minPrice);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If city filter, filter by manufacturer city
  if (city && data) {
    const ids = [...new Set(data.map((p) => p.manufacturer_id))];
    const { data: profiles } = await supabase
      .from("profiles").select("id, city").in("id", ids);
    const cityIds = new Set(profiles?.filter((p) => p.city?.toLowerCase() === city.toLowerCase()).map((p) => p.id));
    return NextResponse.json({ results: data.filter((p) => cityIds.has(p.manufacturer_id)) });
  }

  return NextResponse.json({ results: data || [] });
}
