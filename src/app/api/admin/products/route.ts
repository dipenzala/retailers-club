import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(200);
  return NextResponse.json({ products: data || [] });
}
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { product_id } = await req.json();
  await supabase.from("products").delete().eq("id", product_id);
  return NextResponse.json({ ok: true });
}
