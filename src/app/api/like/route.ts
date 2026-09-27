import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_id } = await req.json();
  const { data: existing } = await supabase
    .from("likes").select("id")
    .eq("user_id", user.id).eq("product_id", product_id).maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
    return NextResponse.json({ liked: false });
  }
  await supabase.from("likes").insert({ user_id: user.id, product_id });
  return NextResponse.json({ liked: true });
}
