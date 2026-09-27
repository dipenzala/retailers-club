"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Package, Loader2 } from "lucide-react";

const STATUS_COLORS: any = {
  pending: "warning",
  confirmed: "info",
  manufacturing: "warning",
  dispatched: "info",
  delivered: "success",
  cancelled: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((d) => {
      setOrders(d.orders || []); setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-[18px] font-extrabold">Orders ({orders.length})</h1>
      {orders.length === 0 ? (
        <Card><CardBody className="text-center py-16">
          <Package size={32} className="mx-auto text-[#9B9B9B]" />
          <div className="text-[13px] text-[#6B6B6B] mt-3">No orders yet</div>
        </CardBody></Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`}>
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-extrabold">{o.order_number}</div>
                      <div className="text-[11px] text-[#6B6B6B] mt-1">
                        Qty {o.quantity} × ₹{o.unit_price} = <b>₹{o.total_amount}</b>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={STATUS_COLORS[o.status] || "default"}>{o.status}</Badge>
                      <Badge variant={o.payment_status === "paid" ? "success" : "warning"}>{o.payment_status}</Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
