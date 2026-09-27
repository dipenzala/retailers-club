"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import ShareSheet from "@/components/ShareSheet";
import { ArrowLeft, MessageSquare, Loader2, MapPin, Phone, Lock, Send, Share2, Bookmark, Heart, Link2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState<string | null>(null);
  const [revealing, setRevealing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      setProduct(data);

      if (data?.manufacturer_id) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.manufacturer_id).single();
        setManufacturer(prof);
      }

      if (user) {
        const [likeData, saveData] = await Promise.all([
          supabase.from("likes").select("id").eq("user_id", user.id).eq("product_id", id).maybeSingle(),
          supabase.from("saves").select("id").eq("user_id", user.id).eq("product_id", id).maybeSingle(),
        ]);
        setLiked(!!likeData.data);
        setSaved(!!saveData.data);
      }

      setLoading(false);
      if (data?.id) fetch("/api/products/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: data.id }) });
    })();
  }, [id]);

  const toggleLike = async () => {
    if (!userId) { showToast("Login karo"); return; }
    setLiked(!liked);
    await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id }) });
  };

  const toggleSave = async () => {
    if (!userId) { showToast("Login karo"); return; }
    setSaved(!saved);
    showToast(saved ? "Removed from saved" : "Saved!");
    await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id }) });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      showToast("Link copied!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      showToast("Copy failed");
    }
  };

  const shareWhatsApp = () => {
    const url = window.location.href;
    const text = `${product.title} — ₹${product.price} (MOQ ${product.moq})\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const revealNumber = async () => {
    if (!userId) { showToast("Login karo"); setTimeout(() => router.push("/login"), 800); return; }
    setRevealing(true);
    try {
      const res = await fetch("/api/contact/reveal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner_id: product.manufacturer_id }),
      });
      const data = await res.json();
      if (data.phone) {
        setPhone(data.phone);
        showToast("Number revealed. Owner notified.");
      } else if (data.pending) {
        showToast("Number request bhej di. Approval ka wait karo.");
      } else {
        showToast(data.error || "Unable to reveal");
      }
    } catch { showToast("Error"); }
    setRevealing(false);
  };

  const startChat = async () => {
    try {
      if (!userId) { showToast("Login karo"); setTimeout(() => router.push("/login"), 800); return; }
      if (userId === product.manufacturer_id) { showToast("Ye aapka hi product hai"); return; }

      setChatLoading(true);
      const supabase = createClient();

      const { data: existing } = await supabase
        .from("conversations").select("id")
        .contains("participants", [userId, product.manufacturer_id])
        .maybeSingle();

      if (existing?.id) { router.push(`/chat?c=${existing.id}`); return; }

      const { data: created, error } = await supabase.from("conversations").insert({
        participants: [userId, product.manufacturer_id],
        last_message: `Interested in: ${product.title}`,
        last_at: new Date().toISOString(),
      }).select().single();

      if (error || !created?.id) { showToast("Chat start nahi ho payi"); setChatLoading(false); return; }

      await supabase.from("messages").insert({
        conversation_id: created.id, sender_id: userId,
        content: `Hi, I'm interested in "${product.title}"`, kind: "text",
      });
      router.push(`/chat?c=${created.id}`);
    } catch (e: any) {
      showToast(e?.message || "Something went wrong");
      setChatLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#0A0A0A] text-white text-[13px] font-semibold px-5 py-3 rounded-2xl shadow-2xl">
          {toast}
        </div>
      )}

      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4]">
            {product.media_urls?.[0] && <img src={product.media_urls[0]} alt={product.title} className="w-full h-full object-cover" />}
          </div>
        </Card>

        <div className="space-y-4">
          {manufacturer && (
            <Link href={`/m/${manufacturer.id}`}>
              <Card>
                <CardBody className="flex items-center gap-3">
                  <Avatar name={manufacturer.business_name} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold">{manufacturer.business_name}</span>
                      {manufacturer.is_verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#B8894A] text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                      )}
                    </div>
                    {manufacturer.city && (
                      <div className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
                        <MapPin size={10} /> {manufacturer.city}
                      </div>
                    )}
                  </div>
                  <Badge variant="gold">View</Badge>
                </CardBody>
              </Card>
            </Link>
          )}

          <Card>
            <CardBody>
              <Badge variant="gold">{product.category || "General"}</Badge>
              <h1 className="text-[1.5rem] font-extrabold mt-3">{product.title}</h1>
              {product.description && <p className="text-[13px] text-[#6B6B6B] mt-2">{product.description}</p>}

              <div className="mt-5 flex items-baseline justify-between">
                <div className="text-[2rem] font-extrabold">₹{product.price}</div>
                <div className="text-[13px] text-[#6B6B6B]">MOQ {product.moq} pcs</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.fabric && <Badge>Fabric: {product.fabric}</Badge>}
                {product.color && <Badge>Color: {product.color}</Badge>}
                {product.gender && <Badge>{product.gender}</Badge>}
              </div>

              {/* SHARE + SAVE ROW */}
              <div className="mt-5 flex items-center gap-2">
                <button onClick={toggleLike} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E7E5E4] hover:bg-[#FAFAF9] transition">
                  <Heart size={16} className={liked ? "fill-red-500 text-red-500" : ""} />
                  <span className="text-[13px] font-semibold">{liked ? "Liked" : "Like"}</span>
                </button>
                <button onClick={toggleSave} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E7E5E4] hover:bg-[#FAFAF9] transition">
                  <Bookmark size={16} className={saved ? "fill-[#0A0A0A]" : ""} />
                  <span className="text-[13px] font-semibold">{saved ? "Saved" : "Save"}</span>
                </button>
                <button onClick={copyLink} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E7E5E4] hover:bg-[#FAFAF9] transition">
                  {linkCopied ? <Check size={16} className="text-emerald-600" /> : <Link2 size={16} />}
                  <span className="text-[13px] font-semibold">{linkCopied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* WHATSAPP SHARE */}
              <button
                onClick={shareWhatsApp}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-[13px] hover:bg-green-600 transition"
              >
                <MessageSquare size={15} /> Share on WhatsApp
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E7E5E4] hover:bg-[#FAFAF9] transition font-semibold text-[13px]"
              >
                <Share2 size={14} /> More options
              </button>

              {/* CHAT + CALL */}
              <div className="mt-5 space-y-2">
                <Button onClick={startChat} disabled={chatLoading} className="w-full">
                  {chatLoading ? (
                    <><Loader2 size={15} className="animate-spin" /> Opening chat...</>
                  ) : (
                    <><MessageSquare size={15} /> Chat with Manufacturer</>
                  )}
                </Button>

                {phone ? (
                  <a href={`tel:${phone}`} className="block">
                    <Button variant="secondary" className="w-full">
                      <Phone size={15} /> {phone}
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={revealNumber} disabled={revealing}>
                    {revealing ? (
                      <><Loader2 size={15} className="animate-spin" /> Revealing...</>
                    ) : manufacturer?.number_privacy === "hidden" ? (
                      <><Lock size={15} /> Number Hidden</>
                    ) : manufacturer?.number_privacy === "on_request" ? (
                      <><Send size={15} /> Request Number</>
                    ) : (
                      <><Phone size={15} /> View Mobile Number</>
                    )}
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Share sheet */}
      <ShareSheet
        open={showShare}
        onClose={() => setShowShare(false)}
        title={product.title}
        description={`₹${product.price} · MOQ ${product.moq}`}
        url={typeof window !== "undefined" ? window.location.href : ""}
        image={product.media_urls?.[0]}
      />
    </div>
  );
}
