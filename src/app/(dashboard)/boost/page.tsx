"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Rocket, Loader2, Check } from "lucide-react";

const options = [
  { r: 25, p: 499, l: "Top 25 km" },
  { r: 50, p: 899, l: "Top 50 km" },
  { r: 100, p: 1499, l: "Top 100 km" },
];

export default function BoostPage() {
  const [selected, setSelected] = useState(25);
  const [loading, setLoading] = useState(false);
  const [boosts, setBoosts] = useState<any[]>([]);
  const [done, setDone] = useState(false);

  const load = async () => {
    const res = await fetch("/api/boost");
    const d = await res.json();
    setBoosts(d.boosts || []);
  };

  useEffect(() => { load(); }, []);

  const activate = async (is_trial: boolean) => {
    setLoading(true);
    await fetch("/api/boost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ radius_km: selected, is_trial }),
    });
    setLoading(false);
    setDone(true);
    load();
  };

  const active = boosts.find((b) => new Date(b.ends_at) > new Date());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {active && (
        <Card>
          <CardBody className="flex items-center gap-3">
            <Rocket size={20} className="text-[#B8894A]" />
            <div className="flex-1">
              <div className="text-[14px] font-bold">Active Boost</div>
              <div className="text-[12px] text-[#6B6B6B]">
                {active.radius_km} km radius • Ends {new Date(active.ends_at).toLocaleDateString()}
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket size={16} className="text-[#B8894A]" />
            <div className="text-[15px] font-bold">Profile Boost</div>
          </div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">Apni profile ko top placement dilwao</div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-3">
            {options.map((o) => (
              <button key={o.r} onClick={() => setSelected(o.r)}
                className={`p-4 rounded-xl border-2 text-center transition ${
                  selected === o.r ? "border-[#0A0A0A] bg-[#0A0A0A] text-white" : "border-[#E7E5E4] bg-white"
                }`}>
                <div className="text-[13px] font-bold">{o.l}</div>
                <div className={`text-[20px] font-extrabold mt-1 ${selected === o.r ? "" : "text-[#0A0A0A]"}`}>₹{o.p}</div>
                <div className={`text-[11px] mt-0.5 ${selected === o.r ? "text-white/60" : "text-[#6B6B6B]"}`}>/month</div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="secondary" onClick={() => activate(true)} disabled={loading || done}>
              7-Day Free Trial
            </Button>
            <Button onClick={() => activate(false)} disabled={loading || done} className="flex-1">
              {done ? <><Check size={14} /> Activated</> : loading ? "Activating..." : "Activate Boost"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
