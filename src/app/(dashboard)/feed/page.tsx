"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Carousel from "@/components/Carousel";
import { Heart, Bookmark, MessageSquare, MapPin, Loader2, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      if (user) fetch("/api/ping", { method: "POST" });
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(30);
      if (data) {
        const ids = [...new Set(data.map((p: any) => p.manufacturer_id))];
        const { data: profiles } = await supabase.from("profiles").select("id, business_name, city, is_verified").in("id", ids);
        const map = new Map(profiles?.map((p) => [p.id, p]) || []);
        setPosts(data.map((p: any) => ({ ...p, profiles: map.get(p.manufacturer_id) })));
        if (user) {
          const [l, s] = await Promise.all([
            supabase.from("likes").select("product_id").eq("user_id", user.id),
            supabase.from("saves").select("product_id").eq("user_id", user.id),
          ]);
          setLiked(new Set(l.data?.map((x) => x.product_id)));
          setSaved(new Set(s.data?.map((x) => x.product_id)));
        }
      }
      setLoading(false);
    })();
  }, []);

  const toggleLike = async (id: string) => {
    if (!userId) return;
    setLiked((p) => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
    await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id }) });
  };
  const toggleSave = async (id: string) => {
    if (!userId) return;
    setSaved((p) => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
    await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id }) });
  };
  const startChat = async (mid: string) => {
    if (!userId) return;
    const supabase = createClient();
    const { data: ex } = await supabase.from("conversations").select("id").contains("participants", [userId, mid]).maybeSingle();
    if (ex) return (window.location.href = `/chat?c=${ex.id}`);
    const { data } = await supabase.from("conversations").insert({ participants: [userId, mid] }).select().single();
    if (data) window.location.href = `/chat?c=${data.id}`;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  if (posts.length === 0) return (
    <div className="text-center py-20 px-4">
      <div className="text-[15px] font-bold">No products in feed</div>
      <div className="text-[13px] text-[#6B6B6B] mt-1">Retailers ke liye products yahan dikhenge</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4 lg:space-y-5">
      {posts.map((p) => (
        <Card key={p.id} className="overflow-hidden">
          <div className="px-3 lg:px-4 py-3 flex items-center justify-between border-b">
            <Link href={`/m/${p.manufacturer_id}`} className="flex items-center gap-2.5 min-w-0">
              <Avatar name={p.profiles?.business_name || "M"} size={34} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold truncate">{p.profiles?.business_name || "Manufacturer"}</span>
                  {p.profiles?.is_verified && <span className="w-3.5 h-3.5 rounded-full bg-[#B8894A] text-white text-[8px] flex items-center justify-center font-bold shrink-0">✓</span>}
                </div>
                {p.profiles?.city && <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B]"><MapPin size={10} /> {p.profiles.city}</div>}
              </div>
            </Link>
            <Badge variant="gold">{p.category || "General"}</Badge>
          </div>
          <Carousel media={p.media_urls || []} />
          <div className="px-3 lg:px-4 pt-3 pb-2 flex items-center gap-4">
            <button onClick={() => toggleLike(p.id)}><Heart size={22} className={liked.has(p.id) ? "fill-red-500 text-red-500" : "text-[#0A0A0A]"} /></button>
            <button onClick={() => startChat(p.manufacturer_id)}><MessageSquare size={22} /></button>
            <button><Share2 size={22} /></button>
            <button onClick={() => toggleSave(p.id)} className="ml-auto"><Bookmark size={22} className={saved.has(p.id) ? "fill-[#0A0A0A]" : ""} /></button>
          </div>
          <CardBody className="!pt-0 !px-3 lg:!px-6">
            <div className="text-[14px] font-bold">{p.title}</div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-[#6B6B6B]">
              <span className="font-bold text-[#0A0A0A]">₹{p.price}</span><span>•</span><span>MOQ {p.moq}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.fabric && <Badge>{p.fabric}</Badge>}
              {p.color && <Badge>{p.color}</Badge>}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" onClick={() => startChat(p.manufacturer_id)} className="flex-1"><MessageSquare size={13} /> Inquire</Button>
              <Link href={`/p/${p.id}`}><Button size="sm" variant="secondary">Details</Button></Link>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
