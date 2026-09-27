"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { Users, Package, FileText, MessageSquare, Heart, TrendingUp } from "lucide-react";
export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>({});
  useEffect(() => {
    const sb = createClient();
    (async () => {
      const [users, products, rfqs, messages, likes] = await Promise.all([
        sb.from("profiles").select("*", { count: "exact", head: true }),
        sb.from("products").select("*", { count: "exact", head: true }),
        sb.from("rfqs").select("*", { count: "exact", head: true }),
        sb.from("messages").select("*", { count: "exact", head: true }),
        sb.from("likes").select("*", { count: "exact", head: true }),
      ]);
      const { data: allUsers } = await sb.from("profiles").select("role, is_verified");
      setStats({
        users: users.count || 0, products: products.count || 0, rfqs: rfqs.count || 0,
        messages: messages.count || 0, likes: likes.count || 0,
        manufacturers: allUsers?.filter((u) => u.role === "manufacturer").length || 0,
        retailers: allUsers?.filter((u) => u.role === "retailer").length || 0,
        verified: allUsers?.filter((u) => u.is_verified).length || 0,
      });
    })();
  }, []);
  const cards = [
    { l: "Users", v: stats.users, i: Users },
    { l: "Products", v: stats.products, i: Package },
    { l: "RFQs", v: stats.rfqs, i: FileText },
    { l: "Messages", v: stats.messages, i: MessageSquare },
    { l: "Likes", v: stats.likes, i: Heart },
    { l: "Verified", v: stats.verified, i: TrendingUp },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, i) => (
          <Card key={i}><CardBody className="!p-4">
            <c.i size={16} className="text-[#6B6B6B]" />
            <div className="mt-3 text-[1.5rem] font-extrabold">{(c.v || 0).toLocaleString("en-IN")}</div>
            <div className="text-[11px] text-[#6B6B6B]">{c.l}</div>
          </CardBody></Card>
        ))}
      </div>
      <Card>
        <CardHeader><div className="text-[15px] font-bold">Breakdown</div></CardHeader>
        <CardBody className="grid grid-cols-3 gap-4">
          <div><div className="text-[1.75rem] font-extrabold">{stats.manufacturers || 0}</div><div className="text-[11px] text-[#6B6B6B]">Manufacturers</div></div>
          <div><div className="text-[1.75rem] font-extrabold">{stats.retailers || 0}</div><div className="text-[11px] text-[#6B6B6B]">Retailers</div></div>
          <div><div className="text-[1.75rem] font-extrabold text-[#B8894A]">{stats.verified || 0}</div><div className="text-[11px] text-[#6B6B6B]">Verified</div></div>
        </CardBody>
      </Card>
    </div>
  );
}
