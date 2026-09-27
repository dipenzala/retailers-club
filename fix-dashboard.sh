#!/bin/bash
set -e

echo "🔧 Creating missing (dashboard) folder + pages..."

# Ensure folder exists
mkdir -p "src/app/(dashboard)/dashboard"

# ---------- Dashboard Layout ----------
cat > "src/app/(dashboard)/layout.tsx" << 'EOF'
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Dashboard" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
EOF

# ---------- Dashboard Page ----------
cat > "src/app/(dashboard)/dashboard/page.tsx" << 'EOF'
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Package, MessageSquare, Eye, ArrowUpRight } from "lucide-react";

const stats = [
  { l: "Total Views", v: "12,483", d: "+18%", icon: Eye },
  { l: "Active Products", v: "142", d: "+6", icon: Package },
  { l: "New Inquiries", v: "38", d: "+12%", icon: MessageSquare },
  { l: "Followers", v: "1,284", d: "+9%", icon: TrendingUp },
];

const recent = [
  { n: "Cotton Kurti — Pink", c: "Women's Wear", s: "Active", v: "1,240" },
  { n: "Denim Jeans — Slim", c: "Men's Wear", s: "Active", v: "892" },
  { n: "Kids T-Shirt — Bundle", c: "Kids", s: "Pending", v: "453" },
  { n: "Lehenga Choli — Bridal", c: "Women's Wear", s: "Active", v: "2,108" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center">
                  <s.icon size={16} className="text-[#0A0A0A]" />
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <ArrowUpRight size={11} /> {s.d}
                </span>
              </div>
              <div className="mt-4 text-[1.75rem] font-extrabold text-[#0A0A0A] tracking-tight leading-none">
                {s.v}
              </div>
              <div className="mt-1 text-[12px] text-[#6B6B6B] font-medium">{s.l}</div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-[15px] font-bold text-[#0A0A0A]">Recent Products</div>
              <a href="/products" className="text-[12px] font-semibold text-[#B8894A] hover:underline">
                View all
              </a>
            </div>
          </CardHeader>
          <div className="divide-y divide-[#E7E5E4]">
            {recent.map((r, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF9] transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4]" />
                  <div>
                    <div className="text-[13px] font-bold text-[#0A0A0A]">{r.n}</div>
                    <div className="text-[11px] text-[#6B6B6B]">{r.c}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[12px] text-[#6B6B6B]">{r.v} views</span>
                  <Badge variant={r.s === "Active" ? "success" : "warning"}>{r.s}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-[15px] font-bold text-[#0A0A0A]">Subscription</div>
          </CardHeader>
          <CardBody>
            <Badge variant="gold">FREE PLAN</Badge>
            <div className="mt-4 text-[2rem] font-extrabold text-[#0A0A0A] tracking-tight leading-none">
              ₹0<span className="text-[14px] text-[#6B6B6B] font-medium"> / month</span>
            </div>
            <div className="mt-5 space-y-2.5 text-[13px] text-[#6B6B6B]">
              <div>✓ Basic listing</div>
              <div>✓ 7-day boost trial</div>
              <div>✓ 10 products</div>
            </div>
            <button className="mt-6 w-full py-3 rounded-xl bg-[#0A0A0A] text-white text-[13px] font-semibold hover:bg-[#262626] transition">
              Upgrade to Pro
            </button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
EOF

# ---------- Verify all other pages ----------
mkdir -p src/app/products/new src/app/products/upload src/app/chat src/app/rfq src/app/search src/app/verification src/app/settings src/app/boost

echo ""
echo "✅ Dashboard folder + pages created!"
echo ""
echo "Now run:"
echo "  rm -rf .next"
echo "  npm run dev:all"
echo ""