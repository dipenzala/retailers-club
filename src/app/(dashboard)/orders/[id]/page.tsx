"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Loader2, Check, Truck, Package, X, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["pending", "confirmed", "manufacturing", "dispatched", "delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
      const { data: prof } = await sb.from("profiles").select("role").eq("id", user.id).single();
      setMe({ ...prof, id: user.id });
    }
    const { data } = await sb.from("orders").select("*").eq("id", id).single();
    setOrder(data);
    const { data: h } = await sb.from("order_status_history").select("*").eq("order_id", id).order("created_at");
    setHistory(h || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
    load();
  };

  const payNow = async () => {
    alert("Razorpay integration pending. Add keys to enable.");
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: order.status, note: "Payment initiated" }),
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const currentStep = STEPS.indexOf(order.status);
  const isMfr = me?.id === order.manufacturer_id;
  const isRet = me?.id === order.retailer_id;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <ArrowLeft size={14} /> Back
      </button>

      <Card>
        <CardBody>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] text-[#6B6B6B] font-semibold">ORDER</div>
              <div className="text-[20px] font-extrabold">{order.order_number}</div>
            </div>
            <Badge variant={order.payment_status === "paid" ? "success" : "warning"}>
              {order.payment_status}
            </Badge>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i <= currentStep ? "bg-[#0A0A0A] text-white" : "bg-[#FAFAF9] border border-[#E7E5E4]"
                }`}>{i + 1}</div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < currentStep ? "bg-[#0A0A0A]" : "bg-[#E7E5E4]"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[9px] font-semibold text-[#6B6B6B] uppercase">
            {STEPS.map((s) => <span key={s}>{s}</span>)}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><div className="text-[14px] font-bold">Order Details</div></CardHeader>
        <CardBody className="space-y-2 text-[13px]">
          <div className="flex justify-between"><span className="text-[#6B6B6B]">Quantity</span><span>{order.quantity}</span></div>
          <div className="flex justify-between"><span className="text-[#6B6B6B]">Unit Price</span><span>₹{order.unit_price}</span></div>
          <div className="flex justify-between border-t pt-2 mt-2 text-[15px] font-extrabold">
            <span>Total</span><span>₹{order.total_amount}</span>
          </div>
          {order.shipping_address && (
            <div className="pt-3 border-t mt-3">
              <div className="text-[11px] text-[#6B6B6B] font-semibold">SHIPPING</div>
              <div className="text-[12px] mt-1">{order.shipping_address}</div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {isRet && order.payment_status === "unpaid" && (
          <Button onClick={payNow} className="flex-1"><CreditCard size={14} /> Pay ₹{order.total_amount}</Button>
        )}
        {isMfr && order.status === "pending" && (
          <Button onClick={() => updateStatus("confirmed")} disabled={updating} className="flex-1"><Check size={14} /> Confirm Order</Button>
        )}
        {isMfr && order.status === "confirmed" && (
          <Button onClick={() => updateStatus("manufacturing")} disabled={updating} className="flex-1"><Package size={14} /> Start Manufacturing</Button>
        )}
        {isMfr && order.status === "manufacturing" && (
          <Button onClick={() => updateStatus("dispatched")} disabled={updating} className="flex-1"><Truck size={14} /> Mark Dispatched</Button>
        )}
        {isRet && order.status === "dispatched" && (
          <Button onClick={() => updateStatus("delivered")} disabled={updating} className="flex-1"><Check size={14} /> Mark Delivered</Button>
        )}
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <Button variant="secondary" onClick={() => updateStatus("cancelled")} disabled={updating}><X size={14} /> Cancel</Button>
        )}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader><div className="text-[14px] font-bold">Timeline</div></CardHeader>
        <CardBody className="!p-0">
          <div className="divide-y">
            {history.map((h) => (
              <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold capitalize">{h.status}</div>
                  {h.note && <div className="text-[11px] text-[#6B6B6B]">{h.note}</div>}
                </div>
                <div className="text-[11px] text-[#9B9B9B]">{new Date(h.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
