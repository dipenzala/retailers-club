import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ reports: data || [] });
}
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { report_id, status } = await req.json();
  await supabase.from("reports").update({ status }).eq("id", report_id);
  return NextResponse.json({ ok: true });
}
