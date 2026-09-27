"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { Users, Package, FileText, MessageSquare } from "lucide-react";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    users: 0, products: 0, rfqs: 0, messages: 0,
    manufacturers: 0, retailers: 0, verified: 0,
  });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [users, products, rfqs, messages] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("rfqs").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
      ]);

      const { data: allUsers } = await supabase.from("profiles").select("role, is_verified");

      setStats({
        users: users.count || 0,
        products: products.count || 0,
        rfqs: rfqs.count || 0,
        messages: messages.count || 0,
        manufacturers: allUsers?.filter((u) => u.role === "manufacturer").length || 0,
        retailers: allUsers?.filter((u) => u.role === "retailer").length || 0,
        verified: allUsers?.filter((u) => u.is_verified).length || 0,
      });
    })();
  }, []);

  const cards = [
    { l: "Total Users", v: stats.users, i: Users },
    { l: "Products Listed", v: stats.products, i: Package },
    { l: "RFQs Posted", v: stats.rfqs, i: FileText },
    { l: "Messages Sent", v: stats.messages, i: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Card key={i}>
            <CardBody>
              <div className="w-9 h-9 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center">
                <c.i size={16} />
              </div>
              <div className="mt-4 text-[1.75rem] font-extrabold text-[#0A0A0A] leading-none">
                {c.v.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 text-[12px] text-[#6B6B6B]">{c.l}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">User Breakdown</div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-[2rem] font-extrabold text-[#0A0A0A]">{stats.manufacturers}</div>
              <div className="text-[12px] text-[#6B6B6B]">Manufacturers</div>
            </div>
            <div>
              <div className="text-[2rem] font-extrabold text-[#0A0A0A]">{stats.retailers}</div>
              <div className="text-[12px] text-[#6B6B6B]">Retailers</div>
            </div>
            <div>
              <div className="text-[2rem] font-extrabold text-[#B8894A]">{stats.verified}</div>
              <div className="text-[12px] text-[#6B6B6B]">Verified</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
