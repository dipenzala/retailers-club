import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false });
  await supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", user.id);
  return NextResponse.json({ ok: true });
}
