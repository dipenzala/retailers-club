import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { owner_id } = await req.json();
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const { count } = await supabase.from("contact_reveals").select("*", { count: "exact", head: true })
    .eq("viewer_id", user.id).gte("created_at", dayAgo);
  if ((count || 0) >= 20) return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
  const { data: owner } = await supabase.from("profiles").select("phone, show_number").eq("id", owner_id).single();
  if (!owner) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!owner.show_number) return NextResponse.json({ error: "Number is private" }, { status: 403 });
  const { data: viewer } = await supabase.from("profiles").select("business_name, role").eq("id", user.id).single();
  await supabase.from("contact_reveals").insert({ viewer_id: user.id, owner_id });
  await supabase.from("notifications").insert({
    user_id: owner_id, kind: "contact_reveal",
    title: "Someone viewed your mobile number",
    body: `${viewer?.business_name || "A user"} (${viewer?.role || "user"}) viewed your contact number`,
    link: "/notifications",
  });
  return NextResponse.json({ phone: owner.phone });
}
