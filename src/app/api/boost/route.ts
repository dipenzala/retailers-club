import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("boosts")
    .select("*")
    .eq("user_id", user.id)
    .order("starts_at", { ascending: false });

  return NextResponse.json({ boosts: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { radius_km, is_trial } = await req.json();
  const days = is_trial ? 7 : 30;
  const starts = new Date();
  const ends = new Date(Date.now() + days * 86400000);

  const { data, error } = await supabase
    .from("boosts")
    .insert({
      user_id: user.id,
      radius_km,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      is_trial: !!is_trial,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ boost: data }, { status: 201 });
}
