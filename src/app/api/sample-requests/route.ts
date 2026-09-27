import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ samples: [] });
  const { data } = await supabase.from("sample_requests").select("*")
    .or(`retailer_id.eq.${user.id},manufacturer_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  return NextResponse.json({ samples: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { data } = await supabase.from("sample_requests").insert({
    retailer_id: user.id,
    manufacturer_id: body.manufacturer_id,
    product_id: body.product_id,
    quantity: body.quantity || 1,
    sample_price: body.sample_price || 0,
    notes: body.notes,
  }).select().single();
  await supabase.from("notifications").insert({
    user_id: body.manufacturer_id, kind: "sample_request",
    title: "New sample request", body: body.notes?.slice(0, 60) || "Sample requested",
    link: `/sample-requests`,
  });
  return NextResponse.json({ sample: data }, { status: 201 });
}
