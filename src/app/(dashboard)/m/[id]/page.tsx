"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, MapPin, MessageSquare, ShieldCheck, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ManufacturerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwn(user?.id === id);

      const [prof, prods, stats] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("products").select("*").eq("manufacturer_id", id).order("created_at", { ascending: false }),
        fetch(`/api/follow?user=${id}`).then((r) => r.json()),
      ]);

      setProfile(prof.data);
      setProducts(prods.data || []);
      setFollowers(stats.followers || 0);
      setFollowing(stats.following || 0);

      if (user) {
        const { data: f } = await supabase.from("follows").select("id")
          .eq("follower_id", user.id).eq("following_id", id).maybeSingle();
        setIsFollowing(!!f);
      }
      setLoading(false);
    })();
  }, [id]);

  const toggleFollow = async () => {
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ following_id: id }),
    });
    const data = await res.json();
    setIsFollowing(data.following);
    setFollowers((prev) => prev + (data.following ? 1 : -1));
  };

  const startChat = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: existing } = await supabase.from("conversations")
      .select("id").contains("participants", [user.id, id]).maybeSingle();
    if (existing) return (window.location.href = `/chat?c=${existing.id}`);
    const { data } = await supabase.from("conversations").insert({ participants: [user.id, id] }).select().single();
    if (data) window.location.href = `/chat?c=${data.id}`;
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  if (!profile) return <div className="text-center py-20">Manufacturer not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar name={profile.business_name || "M"} size={96} />
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[1.35rem] lg:text-[1.5rem] font-extrabold">{profile.business_name || "Manufacturer"}</h1>
                {profile.is_verified && <Badge variant="success"><ShieldCheck size={11} /> Verified</Badge>}
              </div>
              {profile.city && <div className="flex items-center gap-1 text-[13px] text-[#6B6B6B] mt-1"><MapPin size={12} /> {profile.city}</div>}
              <div className="flex gap-6 mt-4">
                <div><div className="text-[1.1rem] lg:text-[1.25rem] font-extrabold">{products.length}</div><div className="text-[11px] text-[#6B6B6B]">Products</div></div>
                <div><div className="text-[1.1rem] lg:text-[1.25rem] font-extrabold">{followers}</div><div className="text-[11px] text-[#6B6B6B]">Followers</div></div>
                <div><div className="text-[1.1rem] lg:text-[1.25rem] font-extrabold">{following}</div><div className="text-[11px] text-[#6B6B6B]">Following</div></div>
              </div>
              {!isOwn && (
                <div className="mt-5 flex gap-2">
                  <Button onClick={startChat} className="flex-1 lg:flex-none"><MessageSquare size={14} /> Message</Button>
                  <Button variant={isFollowing ? "secondary" : "primary"} onClick={toggleFollow} className="flex-1 lg:flex-none">
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      <div>
        <div className="text-[13px] font-bold mb-3 flex items-center gap-2"><Package size={14} /> Products</div>
        {products.length === 0 ? (
          <Card><CardBody className="text-center py-16 text-[13px] text-[#6B6B6B]">No products yet</CardBody></Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
            {products.map((p) => (
              <Link key={p.id} href={`/p/${p.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4]">
                    {p.media_urls?.[0] && <img src={p.media_urls[0]} alt={p.title} className="w-full h-full object-cover" />}
                  </div>
                  <CardBody className="!p-3">
                    <div className="text-[12px] font-bold line-clamp-1">{p.title}</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-1">₹{p.price}</div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
