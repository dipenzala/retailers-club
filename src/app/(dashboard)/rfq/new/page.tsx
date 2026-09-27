"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewRFQ() {
  const [form, setForm] = useState({
    title: "", category: "", quantity: "", budget: "", delivery_days: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        quantity: Number(form.quantity),
        budget: Number(form.budget),
        delivery_days: Number(form.delivery_days),
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/rfq");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">Post New RFQ</div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">
            Apni requirement post karo — manufacturers quotes bhejenge
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input placeholder="Title (e.g., Cotton Kurti 100 pcs)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <Input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <Input placeholder="Budget ₹" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <Input placeholder="Delivery days" type="number" value={form.delivery_days} onChange={(e) => setForm({ ...form, delivery_days: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={submit} disabled={loading || !form.title}>
              {loading ? "Posting..." : "Post RFQ"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
