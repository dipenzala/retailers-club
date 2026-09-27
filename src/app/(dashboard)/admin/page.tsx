"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { createClient } from "@/lib/supabase/client";
import { Users, Package, FileText, MessageSquare, ShieldCheck, Flag, Bell, UserCog, BarChart3, Megaphone } from "lucide-react";

export default function MasterAdmin() {
  const [me, setMe] = useState<any>(null);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const sb = createClient();
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { data: prof } = await sb.from("profiles").select("*").eq("id", user.id).single();
      setMe(prof);
      const [users, products, rfqs, tickets] = await Promise.all([
        sb.from("profiles").select("*", { count: "exact", head: true }),
        sb.from("products").select("*", { count: "exact", head: true }),
        sb.from("rfqs").select("*", { count: "exact", head: true }),
        sb.from("support_tickets").select("*", { count: "exact", head: true }),
      ]);
      setStats({ users: users.count || 0, products: products.count || 0, rfqs: rfqs.count || 0, tickets: tickets.count || 0 });
    })();
  }, []);

  const tiles = [
    { href: "/admin/users", icon: UserCog, l: "Users & Roles", s: "Change roles", restricted: true },
    { href: "/admin/verification", icon: ShieldCheck, l: "Verification", s: "Approve/reject docs" },
    { href: "/admin/products", icon: Package, l: "Products", s: "Moderate listings" },
    { href: "/admin/reports", icon: Flag, l: "Reports", s: "Handle reports" },
    { href: "/admin/support", icon: MessageSquare, l: "Support", s: "Reply tickets" },
    { href: "/admin/broadcast", icon: Megaphone, l: "Broadcast", s: "Send notification" },
    { href: "/admin/analytics", icon: BarChart3, l: "Analytics", s: "Insights" },
    { href: "/admin/audit", icon: FileText, l: "Audit Logs", s: "All actions" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar name={me?.business_name || "A"} size={56} />
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[18px] font-extrabold">Admin Panel</div>
                {me?.role === "super_admin" && <Badge variant="gold">👑 MASTER ADMIN</Badge>}
                {me?.role === "admin" && <Badge variant="info">ADMIN</Badge>}
                {me?.role === "verification_admin" && <Badge variant="warning">VERIFICATION ADMIN</Badge>}
              </div>
              <div className="text-[13px] text-[#6B6B6B] mt-1">{me?.business_name || "Admin"}</div>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Users", v: stats.users, i: Users },
          { l: "Products", v: stats.products, i: Package },
          { l: "RFQs", v: stats.rfqs, i: FileText },
          { l: "Tickets", v: stats.tickets, i: MessageSquare },
        ].map((s, i) => (
          <Card key={i}><CardBody className="!p-4">
            <s.i size={16} className="text-[#6B6B6B]" />
            <div className="mt-3 text-[1.5rem] font-extrabold">{(s.v || 0).toLocaleString("en-IN")}</div>
            <div className="text-[11px] text-[#6B6B6B]">{s.l}</div>
          </CardBody></Card>
        ))}
      </div>
      <div>
        <div className="text-[15px] font-bold mb-3">Admin Tools</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tiles.map((t) => {
            if (t.restricted && me?.role !== "super_admin") return null;
            return (
              <Link key={t.href} href={t.href}>
                <Card className="hover:shadow-md transition cursor-pointer h-full">
                  <CardBody>
                    <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border flex items-center justify-center">
                      <t.icon size={18} />
                    </div>
                    <div className="mt-3 text-[13px] font-bold">{t.l}</div>
                    <div className="text-[11px] text-[#6B6B6B]">{t.s}</div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
