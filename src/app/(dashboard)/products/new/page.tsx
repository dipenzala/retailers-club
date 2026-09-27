"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "", fabric: "",
    color: "", gender: "", price: "", moq: "", visibility: "verified_retailers",
  });
  const router = useRouter();

  const submit = async () => {
    if (!form.title) return setError("Title required");
    setLoading(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price) || 0,
        moq: Number(form.moq) || 0,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/products");
    else {
      const d = await res.json();
      setError(d.error || "Failed");
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">New Product</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[14px] min-h-[100px]"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Fabric" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            <Input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            <Input placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <Input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="MOQ" type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
          </div>
          <select
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[14px]"
          >
            <option value="public">Public</option>
            <option value="retailers_only">Retailers Only</option>
            <option value="verified_retailers">Verified Retailers</option>
            <option value="private">Private</option>
          </select>
          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={submit} disabled={loading || !form.title}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
