import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
  return NextResponse.json({ logs: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { action, target_type, target_id, meta } = await req.json();
  await supabase.from("audit_logs").insert({
    actor_id: user.id, action, target_type, target_id, meta: meta || {},
  });
  return NextResponse.json({ ok: true });
}
