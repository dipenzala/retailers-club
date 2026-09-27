import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!me || !["super_admin","admin","verification_admin"].includes(me.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
  return NextResponse.json({ users: data || [] });
}
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!me || me.role !== "super_admin") return NextResponse.json({ error: "Only master admin can change roles" }, { status: 403 });
  const { user_id, role } = await req.json();
  await supabase.from("profiles").update({ role }).eq("id", user_id);
  await supabase.from("audit_logs").insert({
    actor_id: user.id, action: "role_changed", target_type: "profile", target_id: user_id, meta: { new_role: role },
  });
  return NextResponse.json({ ok: true });
}
