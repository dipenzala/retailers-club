import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

const plans = [
  { n: "Free", p: 0, f: ["Basic listing", "5 products", "7-day boost trial"], c: false },
  { n: "Manufacturer Pro", p: 999, f: ["Unlimited products", "AI upload", "Priority support", "Analytics"], c: true },
  { n: "Retailer Pro", p: 499, f: ["Advanced filters", "Early access", "Saved searches", "Bulk inquiry"], c: false },
];

export default function SubscriptionPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-[1.5rem] font-extrabold">Choose Your Plan</h1>
        <p className="text-[13px] text-[#6B6B6B] mt-2">Payment gateway integration coming soon</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((p) => (
          <Card key={p.n} className={p.c ? "border-2 border-[#0A0A0A]" : ""}>
            {p.c && (
              <div className="-mt-3 mx-auto w-fit bg-[#0A0A0A] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
            )}
            <CardHeader><div className="text-[15px] font-bold">{p.n}</div></CardHeader>
            <CardBody>
              <div className="text-[2.25rem] font-extrabold">₹{p.p}<span className="text-[13px] text-[#6B6B6B] font-medium">/mo</span></div>
              <ul className="mt-5 space-y-2">
                {p.f.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13px]">
                    <Check size={14} className="text-[#B8894A]" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" disabled={p.p === 0}>
                {p.p === 0 ? "Current Plan" : "Coming Soon"}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
