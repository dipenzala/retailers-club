import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { blocked_id } = await req.json();
  const { data: existing } = await supabase
    .from("blocks").select("id").eq("blocker_id", user.id).eq("blocked_id", blocked_id).maybeSingle();

  if (existing) {
    await supabase.from("blocks").delete().eq("id", existing.id);
    return NextResponse.json({ blocked: false });
  }
  await supabase.from("blocks").insert({ blocker_id: user.id, blocked_id });
  return NextResponse.json({ blocked: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ blocks: [] });
  const { data } = await supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id);
  return NextResponse.json({ blocks: data || [] });
}
