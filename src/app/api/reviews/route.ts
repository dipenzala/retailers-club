import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");
  if (!userId) return NextResponse.json({ reviews: [] });
  const { data } = await supabase.from("reviews").select("*").eq("reviewee_id", userId).order("created_at", { ascending: false });
  return NextResponse.json({ reviews: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { data, error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    reviewee_id: body.reviewee_id,
    product_id: body.product_id,
    order_id: body.order_id,
    rating: body.rating,
    title: body.title,
    comment: body.comment,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("notifications").insert({
    user_id: body.reviewee_id, kind: "new_review",
    title: `New ${body.rating}★ review`, body: body.comment?.slice(0, 60),
    link: `/m/${body.reviewee_id}`,
  });
  return NextResponse.json({ review: data }, { status: 201 });
}
