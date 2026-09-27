"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Loader2, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ROLES = ["super_admin","admin","verification_admin","manufacturer","retailer","wholesaler","distributor","exporter","sales_agent"];

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const load = async () => {
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
      const { data: prof } = await sb.from("profiles").select("role").eq("id", user.id).single();
      setMe(prof);
    }
    const res = await fetch("/api/admin/users");
    const d = await res.json();
    setUsers(d.users || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (user_id: string, role: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, role }),
    });
    if (res.ok) { setEditing(null); load(); }
    else { const d = await res.json(); alert(d.error); }
  };

  const filtered = users.filter((u) =>
    (u.business_name || "").toLowerCase().includes(q.toLowerCase()) ||
    (u.phone || "").includes(q) || u.role.includes(q.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[15px] font-bold">Users & Roles</div>
          <div className="text-[12px] text-[#6B6B6B]">{filtered.length} of {users.length}</div>
        </div>
        <div className="flex items-center gap-2 bg-[#FAFAF9] border rounded-xl px-3 py-2 w-full md:w-72">
          <Search size={14} className="text-[#6B6B6B]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="bg-transparent outline-none text-[13px] flex-1" />
        </div>
      </div>
      <Card>
        <div className="divide-y">
          {filtered.map((u) => (
            <div key={u.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={u.business_name || "U"} size={40} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold truncate">{u.business_name || "Unnamed"}</div>
                    <div className="text-[11px] text-[#6B6B6B] truncate">{u.phone || "No phone"} • {u.city || "No city"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {u.is_verified && <Badge variant="success">Verified</Badge>}
                  <Badge variant={u.role.includes("admin") ? "gold" : "default"}>{u.role}</Badge>
                  {me?.role === "super_admin" && (
                    <Button size="sm" variant="secondary" onClick={() => setEditing(editing === u.id ? null : u.id)}>Change Role</Button>
                  )}
                </div>
              </div>
              {editing === u.id && me?.role === "super_admin" && (
                <div className="mt-3 p-3 bg-[#FAFAF9] rounded-xl flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button key={r} onClick={() => changeRole(u.id, r)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition ${
                        u.role === r ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white border-[#E7E5E4]"
                      }`}>{r}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
