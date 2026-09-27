"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, Upload, Loader2, Image as ImageIcon } from "lucide-react";

export default function AIUpload() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attrs, setAttrs] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const upload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setImageUrl(data.url);
    setUploading(false);
  };

  const analyze = async () => {
    if (!imageUrl) return;
    setLoading(true);
    const res = await fetch("/api/ai/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl }),
    });
    const data = await res.json();
    setAttrs({ ...data.attributes, price: 0, moq: 50 });
    setLoading(false);
  };

  const create = async () => {
    setCreating(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: attrs.title, description: attrs.description, category: attrs.category,
        fabric: attrs.fabric, color: attrs.color, gender: attrs.gender,
        price: Number(attrs.price), moq: Number(attrs.moq),
        media_urls: [imageUrl], visibility: "verified_retailers",
      }),
    });
    setCreating(false);
    router.push("/feed");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#B8894A]" />
            <div className="text-[15px] font-bold">AI Quick Upload</div>
          </div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">Image daalo — AI title, category, fabric suggest karega</div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="aspect-video rounded-xl border-2 border-dashed border-[#E7E5E4] flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} className="w-full h-full object-cover" />
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
                {uploading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <ImageIcon size={28} className="text-[#6B6B6B]" />
                    <span className="text-[13px] text-[#6B6B6B] mt-2">Click to upload</span>
                  </>
                )}
              </label>
            )}
          </div>
          <Button onClick={analyze} disabled={!imageUrl || loading} className="w-full">
            <Sparkles size={14} /> {loading ? "Analyzing..." : "Analyze with AI"}
          </Button>
        </CardBody>
      </Card>

      {attrs && (
        <Card>
          <CardHeader><div className="text-[15px] font-bold">AI Suggestions</div></CardHeader>
          <CardBody className="space-y-3">
            {["title", "category", "fabric", "color", "gender", "description", "price", "moq"].map((k) => (
              <div key={k}>
                <label className="text-[11px] font-semibold text-[#6B6B6B] uppercase">{k}</label>
                <Input value={attrs[k] || ""} onChange={(e) => setAttrs({ ...attrs, [k]: e.target.value })} className="mt-1" />
              </div>
            ))}
            {attrs.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {attrs.tags.map((t: string, i: number) => (
                  <span key={i} className="text-[11px] bg-[#FBF6EF] text-[#B8894A] border border-[#E8D9BF] px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            )}
            <Button onClick={create} disabled={creating} className="w-full mt-2">
              <Upload size={14} /> {creating ? "Creating..." : "Publish Product"}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
