import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ tickets: [], faqs: [] });
  const [tickets, faqs] = await Promise.all([
    supabase.from("support_tickets").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("faqs").select("*").order("sort_order"),
  ]);
  return NextResponse.json({ tickets: tickets.data || [], faqs: faqs.data || [] });
}
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { subject, description, category } = await req.json();
  const { data } = await supabase.from("support_tickets").insert({
    user_id: user.id, subject, description, category: category || "verification",
  }).select().single();
  return NextResponse.json({ ticket: data });
}
