"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Loader2, Trophy, Medal } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LeaderboardPage() {
  const [top, setTop] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const sb = createClient();
    (async () => {
      const { data: products } = await sb.from("products").select("manufacturer_id");
      const counts: any = {};
      products?.forEach((p: any) => { counts[p.manufacturer_id] = (counts[p.manufacturer_id] || 0) + 1; });
      const ids = Object.keys(counts);
      if (ids.length === 0) return setLoading(false);
      const { data: profiles } = await sb.from("profiles").select("id, business_name, city, is_verified").in("id", ids);
      const list = (profiles || []).map((p: any) => ({ ...p, products: counts[p.id] }))
        .sort((a: any, b: any) => b.products - a.products).slice(0, 20);
      setTop(list); setLoading(false);
    })();
  }, []);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="text-center">
        <Trophy size={32} className="mx-auto text-[#B8894A]" />
        <h1 className="text-[1.5rem] font-extrabold mt-2">Top Manufacturers</h1>
        <p className="text-[13px] text-[#6B6B6B]">Based on product count and activity</p>
      </div>
      <Card>
        <div className="divide-y">
          {top.map((m, i) => (
            <Link key={m.id} href={`/m/${m.id}`}>
              <div className="px-5 py-3 flex items-center gap-3 hover:bg-[#FAFAF9]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                  i === 0 ? "bg-yellow-100 text-yellow-700" :
                  i === 1 ? "bg-gray-100 text-gray-700" :
                  i === 2 ? "bg-orange-100 text-orange-700" : "bg-[#FAFAF9] text-[#6B6B6B]"
                }`}>
                  {i < 3 ? <Medal size={14} /> : i + 1}
                </div>
                <Avatar name={m.business_name || "M"} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold truncate">{m.business_name}</div>
                  <div className="text-[11px] text-[#6B6B6B]">{m.city}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-extrabold">{m.products}</div>
                  <div className="text-[10px] text-[#6B6B6B]">products</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
