"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";

type RFQ = {
  id: string;
  title: string;
  category: string;
  quantity: number;
  budget: number;
  delivery_days: number;
  status: string;
};

const variantMap: Record<string, "success" | "warning" | "info"> = {
  open: "success",
  quoted: "info",
  closed: "warning",
};

export default function RFQPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rfq")
      .then((r) => r.json())
      .then((d) => {
        setRfqs(d.rfqs || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-[13px] text-[#6B6B6B]">
          Post your requirement — manufacturers send quotes
        </div>
        <Link href="/rfq/new">
          <Button size="md">
            <Plus size={15} /> Post New RFQ
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : rfqs.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-[15px] font-bold text-[#0A0A0A]">No RFQs yet</div>
          <div className="text-[13px] text-[#6B6B6B] mt-1">Post your first requirement</div>
          <Link href="/rfq/new">
            <Button className="mt-4">
              <Plus size={15} /> Post RFQ
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {rfqs.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[14px] font-bold text-[#0A0A0A]">{r.title}</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-0.5">{r.category}</div>
                  </div>
                  <Badge variant={variantMap[r.status] || "info"}>{r.status}</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-medium">Quantity</div>
                    <div className="mt-1 text-[15px] font-extrabold">{r.quantity}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-medium">Budget</div>
                    <div className="mt-1 text-[15px] font-extrabold">₹{r.budget}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B6B6B] font-medium">Delivery</div>
                    <div className="mt-1 text-[15px] font-extrabold">{r.delivery_days}d</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
