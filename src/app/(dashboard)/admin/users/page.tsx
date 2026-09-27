"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Loader2, Shield, Building2, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setUsers(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-bold text-[#0A0A0A]">All Users</div>
          <div className="text-[12px] text-[#6B6B6B]">{users.length} total</div>
        </div>
      </div>

      <Card>
        <div className="divide-y divide-[#E7E5E4]">
          {users.map((u) => (
            <div key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF9] transition">
              <div className="flex items-center gap-3">
                <Avatar name={u.business_name || "U"} size={40} />
                <div>
                  <div className="text-[13px] font-bold text-[#0A0A0A]">
                    {u.business_name || "Unnamed"}
                  </div>
                  <div className="text-[11px] text-[#6B6B6B]">
                    {u.city || "No city"} • {u.phone || "No phone"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={u.role === "manufacturer" ? "info" : "default"}>
                  {u.role}
                </Badge>
                {u.is_verified && <Badge variant="success">Verified</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
