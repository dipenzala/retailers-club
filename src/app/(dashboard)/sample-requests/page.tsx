"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Loader2, Package } from "lucide-react";
export default function SamplesPage() {
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/sample-requests").then((r) => r.json()).then((d) => {
      setSamples(d.samples || []); setLoading(false);
    });
  }, []);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-[18px] font-extrabold">Sample Requests</h1>
      {samples.length === 0 ? (
        <Card><CardBody className="text-center py-16">
          <Package size={32} className="mx-auto text-[#9B9B9B]" />
          <div className="text-[13px] text-[#6B6B6B] mt-3">No sample requests</div>
        </CardBody></Card>
      ) : (
        <div className="space-y-3">
          {samples.map((s) => (
            <Card key={s.id}><CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-bold">{s.request_number}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-1">Qty {s.quantity} • ₹{s.sample_price}</div>
                  {s.notes && <div className="text-[11px] text-[#9B9B9B] mt-1">{s.notes}</div>}
                </div>
                <Badge variant={s.status === "pending" ? "warning" : "success"}>{s.status}</Badge>
              </div>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
