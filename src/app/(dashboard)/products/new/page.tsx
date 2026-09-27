"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";

export default function NewProduct() {
  const [form, setForm] = useState({ title: "", description: "", category: "", fabric: "", color: "", gender: "", price: "", moq: "", visibility: "retailers_only" });
  const [media, setMedia] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const upload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setMedia((prev) => [...prev, data.url]);
    }
    setUploading(false);
  };

  const submit = async () => {
    if (!form.title) return setError("Title required");
    setLoading(true); setError("");
    const res = await fetch("/api/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) || 0, moq: Number(form.moq) || 0, media_urls: media }),
    });
    setLoading(false);
    if (res.ok) {
      const p = await res.json();
      if (p.product?.id) fetch("/api/products/notify-followers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: p.product.id, title: form.title }),
      });
      router.push("/feed");
    } else { const d = await res.json(); setError(d.error || "Failed"); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold">Post New Product</div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">Multiple images/videos upload karo</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold mb-2 block">Media ({media.length})</label>
            <div className="grid grid-cols-3 gap-2">
              {media.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                  {/\.(mp4|webm|mov)$/i.test(url) ? <video src={url} className="w-full h-full object-cover" /> : <img src={url} className="w-full h-full object-cover" />}
                  <button onClick={() => setMedia(media.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center"><X size={12} /></button>
                </div>
              ))}
              <label className="aspect-square rounded-xl border-2 border-dashed border-[#E7E5E4] flex flex-col items-center justify-center cursor-pointer hover:border-[#0A0A0A]">
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
                {uploading ? <Loader2 className="animate-spin" size={20} /> : (<><ImageIcon size={20} className="text-[#6B6B6B]" /><span className="text-[10px] text-[#6B6B6B] mt-1">Add</span></>)}
              </label>
            </div>
          </div>
          <Input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 outline-none text-[14px] min-h-[100px]" />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="Fabric" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} />
            <Input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            <Input placeholder="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} />
            <Input placeholder="Price ₹" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input placeholder="MOQ" type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} />
          </div>
          <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            className="w-full bg-[#FAFAF9] border rounded-xl px-4 py-3 text-[14px]">
            <option value="retailers_only">Retailers Only (recommended)</option>
            <option value="verified_retailers">Verified Retailers Only</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          {error && <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={submit} disabled={loading || !form.title || media.length === 0}>
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
