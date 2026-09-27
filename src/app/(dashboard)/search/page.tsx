"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, Loader2, Sparkles, Navigation } from "lucide-react";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [nearby, setNearby] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [parsed, setParsed] = useState<any>(null);

  const aiSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch("/api/ai/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    const data = await res.json();
    setResults(data.results || []);
    setParsed(data.parsed);
    setLoading(false);
  };

  const findNearby = () => {
    if (!navigator.geolocation) return alert("Location not supported");
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await fetch(`/api/location/nearby?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&radius=100`);
        const data = await res.json();
        setNearby(data.results || []);
        setLocationLoading(false);
      },
      () => { alert("Location permission denied"); setLocationLoading(false); }
    );
  };

  useEffect(() => { aiSearch(); }, []);

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <Card>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3 py-2.5">
            <Sparkles size={16} className="text-[#B8894A]" />
            <input
              placeholder="Mujhe Ahmedabad ke paas ₹300 me women's kurti chahiye..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && aiSearch()}
              className="bg-transparent flex-1 outline-none text-[14px]"
            />
            <Button size="sm" onClick={aiSearch} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={14} /> : "Search"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={findNearby} disabled={locationLoading}>
              <Navigation size={13} /> {locationLoading ? "Finding..." : "Nearby Manufacturers"}
            </Button>
          </div>

          {parsed && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {parsed.category && <Badge variant="gold">{parsed.category}</Badge>}
              {parsed.color && <Badge>{parsed.color}</Badge>}
              {parsed.fabric && <Badge>{parsed.fabric}</Badge>}
              {parsed.priceMax && <Badge>Under ₹{parsed.priceMax}</Badge>}
              {parsed.location && <Badge><MapPin size={10} /> {parsed.location}</Badge>}
            </div>
          )}
        </CardBody>
      </Card>

      {nearby.length > 0 && (
        <div>
          <div className="text-[13px] font-bold mb-3 flex items-center gap-2">
            <MapPin size={14} /> Nearby Manufacturers ({nearby.length})
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {nearby.map((m) => (
              <Link key={m.id} href={`/m/${m.id}`}>
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardBody className="!p-4">
                    <div className="text-[13px] font-bold">{m.business_name}</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-1">{m.city} • {m.distance_km?.toFixed(1)} km</div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>
      ) : results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {results.map((p) => (
            <Link key={p.id} href={`/p/${p.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition cursor-pointer h-full">
                <div className="aspect-square bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4]">
                  {p.media_urls?.[0] && <img src={p.media_urls[0]} alt={p.title} className="w-full h-full object-cover" />}
                </div>
                <CardBody className="!p-3">
                  <Badge variant="gold" className="text-[9px]">{p.category}</Badge>
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
