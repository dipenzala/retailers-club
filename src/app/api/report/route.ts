import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { reported_id, reason, details } = await req.json();
  await supabase.from("reports").insert({ reporter_id: user.id, reported_id, reason, details });
  await supabase.from("audit_logs").insert({
    actor_id: user.id, action: "report_created", target_type: "profile", target_id: reported_id, meta: { reason },
  });
  return NextResponse.json({ ok: true });
}
