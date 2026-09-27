import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { status, note } = await req.json();
  await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  await supabase.from("order_status_history").insert({ order_id: id, status, note, created_by: user.id });

  const { data: order } = await supabase.from("orders").select("retailer_id, manufacturer_id, order_number").eq("id", id).single();
  if (order) {
    const notifyId = user.id === order.manufacturer_id ? order.retailer_id : order.manufacturer_id;
    await supabase.from("notifications").insert({
      user_id: notifyId, kind: "order_update",
      title: `Order ${status}`, body: `Order ${order.order_number} is now ${status}`,
      link: `/orders/${id}`,
    });
  }
  return NextResponse.json({ ok: true });
}
