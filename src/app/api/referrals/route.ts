import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ referrals: [], code: null });
  const { data: me } = await supabase.from("profiles").select("referral_code").eq("id", user.id).single();
  let code = me?.referral_code;
  if (!code) {
    code = "RC" + Math.random().toString(36).slice(2, 8).toUpperCase();
    await supabase.from("profiles").update({ referral_code: code }).eq("id", user.id);
  }
  const { data } = await supabase.from("referrals").select("*").eq("referrer_id", user.id).order("created_at", { ascending: false });
  return NextResponse.json({ referrals: data || [], code });
}
