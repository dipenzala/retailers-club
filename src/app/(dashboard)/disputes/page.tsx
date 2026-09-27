"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, AlertTriangle, Plus } from "lucide-react";
export default function DisputesPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "quality", description: "" });
  useEffect(() => {
    fetch("/api/disputes").then((r) => r.json()).then((d) => { setList(d.disputes || []); setLoading(false); });
  }, []);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-extrabold">Disputes</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus size={13} /> Raise</Button>
      </div>
      {showForm && (
        <Card><CardBody className="space-y-3">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
            <option value="quality">Quality Issue</option>
            <option value="delivery">Delivery Delay</option>
            <option value="payment">Payment Issue</option>
            <option value="other">Other</option>
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your issue..." className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px] min-h-[100px]" />
          <Button className="w-full" disabled>Submit (Select order first)</Button>
        </CardBody></Card>
      )}
      {list.length === 0 ? (
        <Card><CardBody className="text-center py-16">
          <AlertTriangle size={32} className="mx-auto text-[#9B9B9B]" />
          <div className="text-[13px] text-[#6B6B6B] mt-3">No disputes</div>
        </CardBody></Card>
      ) : (
        <div className="space-y-3">
          {list.map((d) => (
            <Card key={d.id}><CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-bold">{d.dispute_number}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-1">{d.category}</div>
                  <div className="text-[12px] mt-2">{d.description}</div>
                </div>
                <Badge variant={d.status === "open" ? "warning" : "success"}>{d.status}</Badge>
              </div>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
