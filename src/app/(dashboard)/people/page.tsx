"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, Search, MapPin, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PeoplePage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const router = useRouter();

  const search = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role) params.set("role", role);
    const res = await fetch(`/api/users/search?${params}`);
    const d = await res.json();
    setUsers((d.users || []).filter((u: any) => u.id !== myId));
    setLoading(false);
  };

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data: { user } }) => {
      setMyId(user?.id || null);
      search();
    });
  }, []);

  const messageUser = async (userId: string) => {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { data: existing } = await sb.from("conversations").select("id")
      .contains("participants", [user.id, userId]).maybeSingle();
    if (existing) return router.push(`/chat?c=${existing.id}`);
    const { data } = await sb.from("conversations").insert({ participants: [user.id, userId] }).select().single();
    if (data) router.push(`/chat?c=${data.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-[1.35rem] font-extrabold">Find People</h1>
        <p className="text-[13px] text-[#6B6B6B] mt-1">Search manufacturers & retailers by name, city, role</p>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2 bg-[#FAFAF9] border rounded-xl px-3 py-2.5">
            <Search size={16} className="text-[#6B6B6B]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search by business name, city..." className="bg-transparent flex-1 outline-none text-[14px]" />
            <Button size="sm" onClick={search}>Search</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ k: "", l: "All" }, { k: "manufacturer", l: "Manufacturers" }, { k: "retailer", l: "Retailers" }].map((r) => (
              <button key={r.k} onClick={() => { setRole(r.k); setTimeout(search, 50); }}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition ${
                  role === r.k ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white border-[#E7E5E4] text-[#6B6B6B]"
                }`}>{r.l}</button>
            ))}
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>
      ) : users.length === 0 ? (
        <Card><CardBody className="text-center py-16 text-[13px] text-[#6B6B6B]">No users found</CardBody></Card>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card key={u.id} className="hover:shadow-md transition">
              <CardBody className="!p-4 flex items-center justify-between gap-3">
                <Link href={`/m/${u.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar name={u.business_name || "U"} size={44} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold truncate">{u.business_name || "Unnamed"}</span>
                      {u.is_verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-[#B8894A] text-white text-[8px] flex items-center justify-center font-bold shrink-0">✓</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B] mt-0.5">
                      {u.city && <span className="flex items-center gap-1"><MapPin size={10} /> {u.city}</span>}
                      <Badge variant={u.role === "manufacturer" ? "info" : "default"} className="!text-[9px]">{u.role}</Badge>
                    </div>
                  </div>
                </Link>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="secondary" onClick={() => messageUser(u.id)}>
                    <MessageSquare size={13} /> Message
                  </Button>
                  <Link href={`/m/${u.id}`}>
                    <Button size="sm" variant="secondary">View</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
