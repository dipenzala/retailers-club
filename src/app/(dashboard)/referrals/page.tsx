"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Gift, Copy, Check, Loader2 } from "lucide-react";

export default function ReferralsPage() {
  const [code, setCode] = useState("");
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referrals").then((r) => r.json()).then((d) => {
      setCode(d.code || ""); setList(d.referrals || []); setLoading(false);
    });
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const url = `${window.location.origin}/register?ref=${code}`;
    window.open(`https://wa.me/?text=Join Retailers Club — India's garment B2B platform! Use my code ${code} → ${url}`, "_blank");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={24} /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="text-center">
        <Gift size={32} className="mx-auto text-[#B8894A]" />
        <h1 className="text-[1.5rem] font-extrabold mt-2">Refer & Earn</h1>
        <p className="text-[13px] text-[#6B6B6B]">Invite friends, get free Boost days</p>
      </div>

      <Card>
        <CardBody>
          <div className="text-[11px] font-semibold text-[#6B6B6B] uppercase">Your Referral Code</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 bg-[#FAFAF9] border border-dashed border-[#E7E5E4] rounded-xl px-4 py-3 text-center">
              <span className="text-[20px] font-extrabold tracking-wider">{code}</span>
            </div>
            <Button size="sm" variant="secondary" onClick={copy}>
              {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
            </Button>
          </div>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1" onClick={shareWhatsApp}>
              Share on WhatsApp
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><div className="text-[15px] font-bold">Your Referrals ({list.length})</div></CardHeader>
        {list.length === 0 ? (
          <CardBody className="text-center py-12 text-[13px] text-[#6B6B6B]">No referrals yet</CardBody>
        ) : (
          <div className="divide-y">
            {list.map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold">{r.referred_email || "User"}</div>
                  <div className="text-[11px] text-[#6B6B6B]">Reward: {r.reward_value} {r.reward_type}</div>
                </div>
                <Badge variant={r.status === "completed" ? "success" : "warning"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
