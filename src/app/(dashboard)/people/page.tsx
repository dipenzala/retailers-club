"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, Search, MapPin, MessageSquare, Navigation, Users, Building2, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type User = {
  id: string;
  business_name: string | null;
  city: string | null;
  state: string | null;
  role: string;
  is_verified: boolean;
  tier: number;
  distance_km?: number;
};

export default function PeoplePage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [nearby, setNearby] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "asking" | "granted" | "denied">("idle");
  const router = useRouter();

  // Load current user
  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data: { user } }) => setMyId(user?.id || null));
  }, []);

  // Load nearby (auto request location)
  useEffect(() => {
    if (!myId) return;
    setLocStatus("asking");
    if (!navigator.geolocation) {
      loadNearbyFallback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocStatus("granted");
        const res = await fetch(
          `/api/users/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&radius=500&role=manufacturer`
        );
        const d = await res.json();
        setNearby((d.users || []).filter((u: User) => u.id !== myId));
        setNearbyLoading(false);
      },
      () => {
        setLocStatus("denied");
        loadNearbyFallback();
      },
      { timeout: 8000 }
    );
  }, [myId]);

  const loadNearbyFallback = async () => {
    const res = await fetch("/api/users/nearby?role=manufacturer");
    const d = await res.json();
    setNearby((d.users || []).filter((u: User) => u.id !== myId));
    setNearbyLoading(false);
  };

  const search = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role) params.set("role", role);
    const res = await fetch(`/api/users/search?${params}`);
    const d = await res.json();
    setUsers((d.users || []).filter((u: User) => u.id !== myId));
    setLoading(false);
  };

  useEffect(() => {
    if (myId) search();
  }, [myId]);

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

  const UserCard = ({ u, showDistance = false }: { u: User; showDistance?: boolean }) => (
    <Card className="hover:shadow-md transition">
      <CardBody className="!p-4">
        <div className="flex items-start gap-3">
          <Link href={`/m/${u.id}`}>
            <Avatar name={u.business_name || "U"} size={48} />
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/m/${u.id}`} className="block">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] font-bold truncate">{u.business_name || "Unnamed"}</span>
                {u.is_verified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#B8894A] text-white text-[8px] flex items-center justify-center font-bold shrink-0">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B6B6B] flex-wrap">
                {u.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={10} /> {u.city}
                    {u.state && `, ${u.state}`}
                  </span>
                )}
                {showDistance && u.distance_km !== undefined && (
                  <span className="text-[#B8894A] font-semibold">• {u.distance_km.toFixed(1)} km away</span>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={u.role === "manufacturer" ? "info" : "default"} className="!text-[9px]">
                {u.role}
              </Badge>
              {u.tier > 0 && <Badge variant="gold" className="!text-[9px]">Tier {u.tier}</Badge>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <Button size="sm" variant="secondary" onClick={() => messageUser(u.id)}>
              <MessageSquare size={12} /> Message
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[1.5rem] font-extrabold">Find People</h1>
        <p className="text-[13px] text-[#6B6B6B] mt-1">
          Manufacturers & retailers discover karo — nearby, city, ya name se
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2 bg-[#FAFAF9] border rounded-xl px-3 py-2.5">
            <Search size={16} className="text-[#6B6B6B]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search by business name, city, state..."
              className="bg-transparent flex-1 outline-none text-[14px]"
            />
            <Button size="sm" onClick={search}>Search</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { k: "", l: "All", i: Users },
              { k: "manufacturer", l: "Manufacturers", i: Building2 },
              { k: "retailer", l: "Retailers", i: Store },
            ].map((r) => (
              <button
                key={r.k}
                onClick={() => { setRole(r.k); setTimeout(search, 50); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition ${
                  role === r.k ? "bg-[#0A0A0A] text-white border-[#0A0A0A]" : "bg-white border-[#E7E5E4] text-[#6B6B6B] hover:border-[#0A0A0A]"
                }`}
              >
                <r.i size={12} /> {r.l}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Nearby Manufacturers — TOP SECTION */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-[#B8894A]" />
            <h2 className="text-[15px] font-extrabold">Nearby Manufacturers</h2>
          </div>
          {locStatus === "granted" && (
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Location active
            </span>
          )}
          {locStatus === "denied" && (
            <span className="text-[11px] text-[#6B6B6B]">Showing recent instead</span>
          )}
          {locStatus === "asking" && (
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
              <Loader2 size={10} className="animate-spin" /> Getting location...
            </span>
          )}
        </div>

        {nearbyLoading ? (
          <Card><CardBody className="flex justify-center py-10">
            <Loader2 className="animate-spin" size={20} />
          </CardBody></Card>
        ) : nearby.length === 0 ? (
          <Card><CardBody className="text-center py-8 text-[13px] text-[#6B6B6B]">
            Koi nearby manufacturer nahi mila.
            <br />
            <span className="text-[12px]">Location permission do ya city change karo</span>
          </CardBody></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nearby.slice(0, 6).map((u) => (
              <UserCard key={u.id} u={u} showDistance={locStatus === "granted"} />
            ))}
          </div>
        )}
      </section>

      {/* All Users Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#B8894A]" />
            <h2 className="text-[15px] font-extrabold">
              {role === "manufacturer" ? "All Manufacturers" : role === "retailer" ? "All Retailers" : "All Businesses"}
            </h2>
            <Badge variant="default">{users.length}</Badge>
          </div>
        </div>

        {loading ? (
          <Card><CardBody className="flex justify-center py-10">
            <Loader2 className="animate-spin" size={20} />
          </CardBody></Card>
        ) : users.length === 0 ? (
          <Card><CardBody className="text-center py-10">
            <Users size={32} className="mx-auto text-[#9B9B9B]" />
            <div className="text-[13px] text-[#6B6B6B] mt-3">No users found</div>
            <div className="text-[12px] text-[#9B9B9B] mt-1">Try different search or filters</div>
          </CardBody></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {users.map((u) => <UserCard key={u.id} u={u} />)}
          </div>
        )}
      </section>
    </div>
  );
}
