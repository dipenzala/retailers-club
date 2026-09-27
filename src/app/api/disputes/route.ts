import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ disputes: [] });
  const { data } = await supabase.from("disputes").select("*")
    .or(`raised_by.eq.${user.id},against_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  return NextResponse.json({ disputes: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { data } = await supabase.from("disputes").insert({
    order_id: body.order_id,
    raised_by: user.id,
    against_id: body.against_id,
    category: body.category,
    description: body.description,
    evidence_urls: body.evidence_urls || [],
  }).select().single();
  return NextResponse.json({ dispute: data }, { status: 201 });
}
