import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const { product_id } = await req.json();
  const supabase = await createClient();
  const { data: p } = await supabase.from("products").select("view_count, manufacturer_id, title").eq("id", product_id).single();
  if (p) {
    await supabase.from("products").update({ view_count: (p.view_count || 0) + 1 }).eq("id", product_id);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id !== p.manufacturer_id) {
      const { data: v } = await supabase.from("profiles").select("business_name").eq("id", user.id).single();
      await supabase.from("notifications").insert({
        user_id: p.manufacturer_id, kind: "product_view",
        title: "Product viewed", body: `${v?.business_name || "Someone"} viewed "${p.title}"`,
        link: `/p/${product_id}`,
      });
    }
  }
  return NextResponse.json({ ok: true });
}
