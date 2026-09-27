"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heart, Bookmark, MessageSquare, MapPin, Loader2, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  title: string;
  description: string;
  category: string;
  fabric: string;
  color: string;
  price: number;
  moq: number;
  media_urls: string[];
  manufacturer_id: string;
  profiles?: { business_name: string; city: string; is_verified: boolean };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(async ({ data }) => {
        if (!data) return setLoading(false);
        const ids = [...new Set(data.map((p: any) => p.manufacturer_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, business_name, city, is_verified")
          .in("id", ids);
        const map = new Map(profiles?.map((p) => [p.id, p]) || []);
        setPosts(data.map((p: any) => ({ ...p, profiles: map.get(p.manufacturer_id) })));
        setLoading(false);
      });
  }, []);

  const toggleLike = (id: string) =>
    setLiked((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const toggleSave = (id: string) =>
    setSaved((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const startChat = async (manufacturerId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .insert({ participants: [user.id, manufacturerId] })
      .select()
      .single();
    if (data) window.location.href = `/chat?c=${data.id}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="text-[15px] font-bold text-[#0A0A0A]">No products in feed yet</div>
        <div className="text-[13px] text-[#6B6B6B] mt-1">
          Manufacturers ke products yahan dikhenge
        </div>
        <Link href="/products/new" className="inline-block mt-4">
          <Button>Post a Product</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 lg:space-y-5">
      {posts.map((p) => (
        <Card key={p.id} className="overflow-hidden">
          {/* Header */}
          <div className="px-3 lg:px-4 py-3 flex items-center justify-between border-b border-[#E7E5E4]">
            <Link href={`/m/${p.manufacturer_id}`} className="flex items-center gap-2.5 min-w-0">
              <Avatar name={p.profiles?.business_name || "M"} size={34} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#0A0A0A] truncate">
                    {p.profiles?.business_name || "Manufacturer"}
                  </span>
                  {p.profiles?.is_verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#B8894A] text-white text-[8px] flex items-center justify-center font-bold shrink-0">
                      ✓
                    </span>
                  )}
                </div>
                {p.profiles?.city && (
                  <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B]">
                    <MapPin size={10} /> {p.profiles.city}
                  </div>
                )}
              </div>
            </Link>
            <Badge variant="gold" className="shrink-0">
              {p.category || "General"}
            </Badge>
          </div>

          {/* Image */}
          <Link href={`/p/${p.id}`}>
            <div className="aspect-square bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4] relative cursor-pointer">
              {p.media_urls?.[0] ? (
                <img
                  src={p.media_urls[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[13px] text-[#9B9B9B]">
                  No image
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-[#0A0A0A] text-white px-3 py-1.5 rounded-full">
                <span className="text-[13px] font-bold">₹{p.price}</span>
                <span className="text-[10px] text-white/70 ml-2">MOQ {p.moq}</span>
              </div>
            </div>
          </Link>

          {/* Actions */}
          <div className="px-3 lg:px-4 pt-3 pb-2 flex items-center gap-4">
            <button onClick={() => toggleLike(p.id)}>
              <Heart
                size={22}
                className={liked.has(p.id) ? "fill-red-500 text-red-500" : "text-[#0A0A0A]"}
                strokeWidth={2}
              />
            </button>
            <button onClick={() => startChat(p.manufacturer_id)}>
              <MessageSquare size={22} className="text-[#0A0A0A]" strokeWidth={2} />
            </button>
            <button>
              <Share2 size={22} className="text-[#0A0A0A]" strokeWidth={2} />
            </button>
            <button onClick={() => toggleSave(p.id)} className="ml-auto">
              <Bookmark
                size={22}
                className={saved.has(p.id) ? "fill-[#0A0A0A] text-[#0A0A0A]" : "text-[#0A0A0A]"}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Info */}
          <CardBody className="!pt-0 !px-3 lg:!px-6">
            <div className="text-[14px] font-bold text-[#0A0A0A]">{p.title}</div>
            {p.description && (
              <p className="mt-1 text-[13px] text-[#6B6B6B] line-clamp-2">{p.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.fabric && <Badge>{p.fabric}</Badge>}
              {p.color && <Badge>{p.color}</Badge>}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => startChat(p.manufacturer_id)}
                className="flex-1"
              >
                <MessageSquare size={13} /> Inquire Now
              </Button>
              <Link href={`/p/${p.id}`}>
                <Button size="sm" variant="secondary">
                  Details
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
