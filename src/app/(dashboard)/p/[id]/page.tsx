"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeft, MessageSquare, Loader2, MapPin, Phone } from "lucide-react";
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

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      setProduct(data);
      if (data?.manufacturer_id) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", data.manufacturer_id).single();
        setManufacturer(prof);
      }
      setLoading(false);
    })();
  }, [id]);

  const revealNumber = async () => {
    setRevealing(true);
    const res = await fetch("/api/contact/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: product.manufacturer_id }),
    });
    const data = await res.json();
    if (data.phone) setPhone(data.phone);
    else alert(data.error || "Unable to reveal");
    setRevealing(false);
  };

  const startChat = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    const { data: existing } = await supabase.from("conversations").select("id").contains("participants", [user.id, product.manufacturer_id]).maybeSingle();
    if (existing) return router.push(`/chat?c=${existing.id}`);
    const { data } = await supabase.from("conversations").insert({ participants: [user.id, product.manufacturer_id] }).select().single();
    if (data) router.push(`/chat?c=${data.id}`);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
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
                    <div className="text-[14px] font-bold">{manufacturer.business_name}</div>
                    {manufacturer.city && <div className="text-[11px] text-[#6B6B6B] flex items-center gap-1"><MapPin size={10} /> {manufacturer.city}</div>}
                  </div>
                  {manufacturer.is_verified && <Badge variant="success">Verified</Badge>}
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
              </div>

              <div className="mt-5 space-y-2">
                <Button onClick={startChat} className="w-full">
                  <MessageSquare size={15} /> Chat with Manufacturer
                </Button>
                {phone ? (
                  <a href={`tel:${phone}`} className="block">
                    <Button variant="secondary" className="w-full">
                      <Phone size={15} /> {phone}
                    </Button>
                  </a>
                ) : (
                  <Button variant="secondary" className="w-full" onClick={revealNumber} disabled={revealing}>
                    <Phone size={15} /> {revealing ? "Revealing..." : "View Mobile Number"}
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
