import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { owner_id } = await req.json();
  if (!owner_id) return NextResponse.json({ error: "owner_id required" }, { status: 400 });

  // Rate limit: 20 reveals per 24hrs
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const { count } = await supabase
    .from("contact_reveals")
    .select("*", { count: "exact", head: true })
    .eq("viewer_id", user.id)
    .gte("created_at", dayAgo);

  if ((count || 0) >= 20) {
    return NextResponse.json({ error: "Daily limit reached. Try again tomorrow." }, { status: 429 });
  }

  const { data: owner } = await supabase.from("profiles").select("phone, show_number").eq("id", owner_id).single();
  if (!owner) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!owner.show_number) return NextResponse.json({ error: "Number is private" }, { status: 403 });

  // Log reveal
  await supabase.from("contact_reveals").insert({ viewer_id: user.id, owner_id });

  // Notify owner
  await supabase.from("notifications").insert({
    user_id: owner_id,
    kind: "contact_reveal",
    title: "Number viewed",
    body: "Someone viewed your mobile number",
    link: "/notifications",
  });

  return NextResponse.json({ phone: owner.phone });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ reveals: [] });
  const { data } = await supabase
    .from("contact_reveals")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  return NextResponse.json({ reveals: data || [] });
}
