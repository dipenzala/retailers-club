import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const role = searchParams.get("role") || "";
  const city = searchParams.get("city") || "";

  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, business_name, city, state, role, is_verified, tier")
    .order("is_verified", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(60);

  if (q) query = query.or(`business_name.ilike.%${q}%,city.ilike.%${q}%,state.ilike.%${q}%`);
  if (role) query = query.eq("role", role);
  if (city) query = query.ilike("city", `%${city}%`);

  const { data, error } = await query;
  if (error) {
    console.error("search error", error);
    return NextResponse.json({ error: error.message, users: [] });
  }

  return NextResponse.json({ users: data || [] });
}
