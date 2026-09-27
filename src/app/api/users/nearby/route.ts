import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radius = Number(searchParams.get("radius") || 500);
  const role = searchParams.get("role") || "manufacturer";

  const supabase = await createClient();

  if (lat && lng) {
    // Try PostGIS function
    const { data, error } = await supabase.rpc("nearby_manufacturers", {
      lat, lng, radius_km: radius, result_limit: 20,
    });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ users: data, mode: "geo" });
    }
  }

  // Fallback — return recent manufacturers (no geo)
  const { data } = await supabase
    .from("profiles")
    .select("id, business_name, city, state, role, is_verified, tier")
    .eq("role", role)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ users: data || [], mode: "recent" });
}
