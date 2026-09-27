import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radius = Number(searchParams.get("radius") || 25);
  if (!lat || !lng) return NextResponse.json({ error: "lat/lng required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("nearby_manufacturers", {
    lat, lng, radius_km: radius, result_limit: 30,
  });
  if (error) return NextResponse.json({ results: [], note: error.message });
  return NextResponse.json({ results: data || [] });
}
