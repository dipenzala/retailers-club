import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { owner_id, message } = await req.json();

  const { data: existing } = await supabase.from("number_requests").select("id, status")
    .eq("requester_id", user.id).eq("owner_id", owner_id).maybeSingle();
  if (existing) return NextResponse.json({ request: existing });

  const { data, error } = await supabase.from("number_requests").insert({
    requester_id: user.id, owner_id, message, status: "pending",
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: me } = await supabase.from("profiles").select("business_name").eq("id", user.id).single();
  await supabase.from("notifications").insert({
    user_id: owner_id, kind: "number_request",
    title: "New number access request",
    body: `${me?.business_name || "Someone"}: ${message || "Wants to see your number"}`,
    link: "/notifications",
  });
  return NextResponse.json({ request: data }, { status: 201 });
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { request_id, status } = await req.json();
  const { error } = await supabase.from("number_requests")
    .update({ status, responded_at: new Date().toISOString() })
    .eq("id", request_id).eq("owner_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ requests: [] });
  const { data } = await supabase.from("number_requests").select("*")
    .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  return NextResponse.json({ requests: data || [] });
}
