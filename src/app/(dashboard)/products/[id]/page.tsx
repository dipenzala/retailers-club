"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Loader2, ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        setLoading(false);
      });
  }, [id]);

  const startChat = async () => {
    if (!product) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const { data: conv } = await supabase
      .from("conversations")
      .insert({ participants: [user.id, product.manufacturer_id] })
      .select()
      .single();

    if (conv) router.push(`/chat?c=${conv.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
        <ArrowLeft size={14} /> Back
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
          <div>
            <Badge variant="gold">{product.category || "General"}</Badge>
            <h1 className="text-[1.5rem] font-extrabold text-[#0A0A0A] mt-3">{product.title}</h1>
            <p className="text-[13px] text-[#6B6B6B] mt-2">{product.description}</p>
          </div>

          <Card>
            <CardBody>
              <div className="flex items-baseline justify-between">
                <div className="text-[2rem] font-extrabold text-[#0A0A0A]">₹{product.price}</div>
                <div className="text-[13px] text-[#6B6B6B]">MOQ {product.moq} pcs</div>
              </div>
              <div className="mt-4 space-y-1.5 text-[13px] text-[#6B6B6B]">
                {product.fabric && <div>Fabric: {product.fabric}</div>}
                {product.color && <div>Color: {product.color}</div>}
                {product.gender && <div>Gender: {product.gender}</div>}
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
