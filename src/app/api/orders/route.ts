import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ orders: [] });
  const { data } = await supabase.from("orders").select("*")
    .or(`retailer_id.eq.${user.id},manufacturer_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  return NextResponse.json({ orders: data || [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { data, error } = await supabase.from("orders").insert({
    retailer_id: user.id,
    manufacturer_id: body.manufacturer_id,
    product_id: body.product_id,
    quantity: body.quantity,
    unit_price: body.unit_price,
    total_amount: body.quantity * body.unit_price,
    shipping_address: body.shipping_address,
    notes: body.notes,
    status: "pending",
    payment_status: "unpaid",
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await supabase.from("order_status_history").insert({
    order_id: data.id, status: "pending", note: "Order created", created_by: user.id,
  });
  await supabase.from("notifications").insert({
    user_id: body.manufacturer_id, kind: "new_order",
    title: "New order received", body: `Order ${data.order_number} • ₹${data.total_amount}`,
    link: `/orders/${data.id}`,
  });
  return NextResponse.json({ order: data }, { status: 201 });
}
