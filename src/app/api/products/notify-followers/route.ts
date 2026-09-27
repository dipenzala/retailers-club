import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { product_id, title } = await req.json();
  const { data: followers } = await supabase.from("follows").select("follower_id").eq("following_id", user.id);
  const { data: me } = await supabase.from("profiles").select("business_name").eq("id", user.id).single();
  if (followers && followers.length > 0) {
    await supabase.from("notifications").insert(followers.map((f) => ({
      user_id: f.follower_id, kind: "new_product",
      title: "New product from " + (me?.business_name || "a brand"),
      body: title || "New product launched", link: `/p/${product_id}`,
    })));
  }
  return NextResponse.json({ ok: true });
}
