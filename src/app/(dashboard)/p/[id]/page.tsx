"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeft, MessageSquare, Loader2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ProductPost() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [manufacturer, setManufacturer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const startChat = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");
    const { data } = await supabase
      .from("conversations")
      .insert({ participants: [user.id, product.manufacturer_id] })
      .select()
      .single();
    if (data) router.push(`/chat?c=${data.id}`);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <ArrowLeft size={14} /> Back to feed
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4]">
            {product.media_urls?.[0] && (
              <img src={product.media_urls[0]} alt={product.title} className="w-full h-full object-cover" />
            )}
          </div>
        </Card>

        <div className="space-y-4">
          {/* Manufacturer */}
          {manufacturer && (
            <Link href={`/m/${manufacturer.id}`}>
              <Card>
                <CardBody className="flex items-center gap-3">
                  <Avatar name={manufacturer.business_name || "M"} size={44} />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold text-[#0A0A0A]">
                        {manufacturer.business_name}
                      </span>
                      {manufacturer.is_verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#B8894A] text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                      )}
                    </div>
                    {manufacturer.city && (
                      <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B]">
                        <MapPin size={10} /> {manufacturer.city}
                      </div>
                    )}
                  </div>
                  <Badge variant="gold">View Profile</Badge>
                </CardBody>
              </Card>
            </Link>
          )}

          {/* Product info */}
          <Card>
            <CardBody>
              <Badge variant="gold">{product.category || "General"}</Badge>
              <h1 className="text-[1.5rem] font-extrabold text-[#0A0A0A] mt-3">{product.title}</h1>
              {product.description && (
                <p className="text-[13px] text-[#6B6B6B] mt-2">{product.description}</p>
              )}

              <div className="mt-5 flex items-baseline justify-between">
                <div className="text-[2rem] font-extrabold text-[#0A0A0A]">₹{product.price}</div>
                <div className="text-[13px] text-[#6B6B6B]">MOQ {product.moq} pcs</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.fabric && <Badge>Fabric: {product.fabric}</Badge>}
                {product.color && <Badge>Color: {product.color}</Badge>}
                {product.gender && <Badge>{product.gender}</Badge>}
              </div>

              <Button onClick={startChat} className="w-full mt-5">
                <MessageSquare size={15} /> Chat with Manufacturer
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
