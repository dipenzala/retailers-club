import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "Relevance";
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const verifiedOnly = searchParams.get("verifiedOnly") === "true";
  const readyStock = searchParams.get("readyStock") === "true";
  const customizable = searchParams.get("customizable") === "true";
  const sampleAvailable = searchParams.get("sampleAvailable") === "true";
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";

  const genders = (searchParams.get("gender") || "").split(",").filter(Boolean);
  const fabrics = (searchParams.get("fabric") || "").split(",").filter(Boolean);
  const colors = (searchParams.get("color") || "").split(",").filter(Boolean);
  const occasions = (searchParams.get("occasion") || "").split(",").filter(Boolean);
  const sizes = (searchParams.get("size") || "").split(",").filter(Boolean);
  const patterns = (searchParams.get("pattern") || "").split(",").filter(Boolean);
  const sleeves = (searchParams.get("sleeve") || "").split(",").filter(Boolean);
  const fits = (searchParams.get("fit") || "").split(",").filter(Boolean);

  let query = supabase.from("products").select("*").limit(80);

  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
  if (priceMin) query = query.gte("price", Number(priceMin));
  if (priceMax) query = query.lte("price", Number(priceMax));
  if (readyStock) query = query.eq("ready_stock", true);
  if (customizable) query = query.eq("customizable", true);
  if (sampleAvailable) query = query.eq("sample_available", true);
  if (genders.length) query = query.in("gender", genders);
  if (fabrics.length) query = query.in("fabric", fabrics);
  if (colors.length) query = query.in("color", colors);
  if (occasions.length) query = query.in("occasion", occasions);
  if (patterns.length) query = query.in("pattern", patterns);
  if (sleeves.length) query = query.in("sleeve_type", sleeves);
  if (fits.length) query = query.in("fit", fits);

  if (sort === "Newest") query = query.order("created_at", { ascending: false });
  else if (sort === "Price: Low to High") query = query.order("price", { ascending: true });
  else if (sort === "Price: High to Low") query = query.order("price", { ascending: false });
  else if (sort === "Popular") query = query.order("view_count", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message, results: [] });

  let filtered = data || [];

  // Filter by state/city via profile
  if ((state || city) && filtered.length > 0) {
    const ids = [...new Set(filtered.map((p) => p.manufacturer_id))];
    const { data: profiles } = await supabase.from("profiles").select("id, city, state, is_verified").in("id", ids);
    const map = new Map(profiles?.map((p) => [p.id, p]) || []);
    filtered = filtered.filter((p) => {
      const prof = map.get(p.manufacturer_id);
      if (!prof) return false;
      if (state && prof.state !== state) return false;
      if (city && !prof.city?.toLowerCase().includes(city.toLowerCase())) return false;
      return true;
    });
  }

  if (verifiedOnly && filtered.length > 0) {
    const ids = [...new Set(filtered.map((p) => p.manufacturer_id))];
    const { data: profiles } = await supabase.from("profiles").select("id, is_verified").in("id", ids);
    const verified = new Set(profiles?.filter((p) => p.is_verified).map((p) => p.id));
    filtered = filtered.filter((p) => verified.has(p.manufacturer_id));
  }

  return NextResponse.json({ results: filtered });
}
