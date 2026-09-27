"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, Trash2 } from "lucide-react";
export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const res = await fetch("/api/admin/products");
    const d = await res.json(); setProducts(d.products || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id }) });
    load();
  };
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="space-y-5">
      <div className="text-[15px] font-bold">Products ({products.length})</div>
      <Card>
        <div className="divide-y">
          {products.map((p) => (
            <div key={p.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAF9] border overflow-hidden shrink-0">
                  {p.media_urls?.[0] && <img src={p.media_urls[0]} className="w-full h-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold truncate">{p.title}</div>
                  <div className="text-[11px] text-[#6B6B6B]">₹{p.price} • {p.category}</div>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => remove(p.id)}><Trash2 size={13} /></Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
