import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
  return NextResponse.json({ logs: data || [] });
}
