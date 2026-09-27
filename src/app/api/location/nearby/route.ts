import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radius = Number(searchParams.get("radius") || 100);
  if (!lat || !lng) return NextResponse.json({ results: [] });
  const supabase = await createClient();
  const { data } = await supabase.rpc("nearby_manufacturers", { lat, lng, radius_km: radius, result_limit: 30 });
  return NextResponse.json({ results: data || [] });
}
