"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Bell, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Notifications() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setItems(data.notifications || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-extrabold">Notifications</h1>
        {items.length > 0 && <Button size="sm" variant="secondary" onClick={markAllRead}><Check size={13} /> Mark all read</Button>}
      </div>

      {items.length === 0 ? (
        <Card><CardBody className="text-center py-16">
          <Bell size={32} className="mx-auto text-[#9B9B9B]" />
          <div className="text-[13px] text-[#6B6B6B] mt-3">No notifications yet</div>
        </CardBody></Card>
      ) : (
        <Card>
          <div className="divide-y divide-[#E7E5E4]">
            {items.map((n) => (
              <Link key={n.id} href={n.link || "#"}>
                <div className={`px-4 py-3 hover:bg-[#FAFAF9] transition ${!n.read_at ? "bg-[#FBF6EF]" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read_at ? "bg-[#B8894A]" : "bg-transparent"}`} />
                    <div>
                      <div className="text-[13px] font-bold">{n.title}</div>
                      <div className="text-[12px] text-[#6B6B6B] mt-0.5">{n.body}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
