"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Bookmark, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SavedPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createClient();
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return setLoading(false);
      const { data } = await sb.from("saves")
        .select("product_id, products(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setItems((data || []).map((s: any) => s.products).filter(Boolean));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-[1.35rem] font-extrabold">Saved Products</h1>
        <p className="text-[13px] text-[#6B6B6B] mt-1">Aapke bookmark kiye products — {items.length}</p>
      </div>

      {items.length === 0 ? (
        <Card><CardBody className="text-center py-20">
          <Bookmark size={32} className="mx-auto text-[#9B9B9B]" />
          <div className="text-[13px] text-[#6B6B6B] mt-3">Koi saved product nahi</div>
          <Link href="/feed" className="text-[#B8894A] text-[13px] font-semibold mt-2 inline-block">Feed pe jao →</Link>
        </CardBody></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((p) => (
            <Link key={p.id} href={`/p/${p.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition h-full">
                <div className="aspect-square bg-[#FAFAF9]">
                  {p.media_urls?.[0] && <img src={p.media_urls[0]} className="w-full h-full object-cover" alt={p.title} />}
                </div>
                <CardBody className="!p-3">
                  <Badge variant="gold" className="!text-[9px]">{p.category || "General"}</Badge>
                  <div className="mt-1.5 text-[12px] font-bold line-clamp-2">{p.title}</div>
                  <div className="mt-1 text-[13px] font-extrabold">₹{p.price}</div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
