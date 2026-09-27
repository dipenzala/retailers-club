#!/bin/bash
set -e

echo "🚀 Phase 2 — Building full app shell..."

# ---------- Additional deps ----------
echo "📦 Installing additional deps..."
npm install zustand @supabase/ssr socket.io-client lucide-react clsx tailwind-merge

mkdir -p src/lib/supabase src/lib/store src/lib/utils
mkdir -p src/components/ui src/components/dashboard
mkdir -p "src/app/(dashboard)"
mkdir -p src/app/products src/app/chat src/app/rfq src/app/search src/app/settings
mkdir -p src/app/api/auth src/app/api/products src/app/api/chat src/app/api/rfq src/app/api/search src/app/api/verify
mkdir -p supabase/migrations socket-server

# ============================================================
# UTILS
# ============================================================
cat > src/lib/utils/cn.ts << 'EOF'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

cat > src/lib/utils/format.ts << 'EOF'
export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const compact = (n: number) =>
  new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);

export const timeAgo = (d: string | Date) => {
  const t = new Date(d).getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
EOF

# ============================================================
# SUPABASE CLIENTS
# ============================================================
cat > src/lib/supabase/client.ts << 'EOF'
"use client";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
EOF

cat > src/lib/supabase/server.ts << 'EOF'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
EOF

# ============================================================
# ZUSTAND STORE
# ============================================================
cat > src/lib/store/auth.ts << 'EOF'
"use client";
import { create } from "zustand";

export type Role = "super_admin" | "admin" | "verification_admin" | "manufacturer" | "retailer";

type User = { id: string; phone: string; role: Role; business_name?: string } | null;

type AuthState = {
  user: User;
  setUser: (u: User) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  logout: () => set({ user: null }),
}));
EOF

# ============================================================
# UI COMPONENTS
# ============================================================
cat > src/components/ui/Button.tsx << 'EOF'
import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed";
    const sizes = {
      sm: "px-3 py-2 text-[13px]",
      md: "px-4 py-2.5 text-[14px]",
      lg: "px-6 py-3.5 text-[15px]",
    };
    const variants = {
      primary: "bg-[#0A0A0A] text-white hover:bg-[#262626]",
      secondary: "bg-white border border-[#E7E5E4] text-[#0A0A0A] hover:border-[#0A0A0A]",
      ghost: "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#FAFAF9]",
      gold: "bg-[#B8894A] text-white hover:bg-[#a17840]",
    };
    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
EOF

cat > src/components/ui/Card.tsx << 'EOF'
import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E7E5E4] rounded-2xl",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5 border-b border-[#E7E5E4]", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}
EOF

cat > src/components/ui/Badge.tsx << 'EOF'
import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "gold" | "info";

const variants: Record<Variant, string> = {
  default: "bg-[#FAFAF9] text-[#6B6B6B] border-[#E7E5E4]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  gold: "bg-[#FBF6EF] text-[#B8894A] border-[#E8D9BF]",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
EOF

cat > src/components/ui/Input.tsx << 'EOF'
import { cn } from "@/lib/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[#0A0A0A] text-[14px] placeholder:text-[#9B9B9B] focus:border-[#0A0A0A] transition",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
EOF

cat > src/components/ui/Avatar.tsx << 'EOF'
import { cn } from "@/lib/utils/cn";

export function Avatar({
  name,
  size = 36,
  className,
}: { name: string; size?: number; className?: string }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div
      className={cn(
        "rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-bold shrink-0",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}
EOF

# ============================================================
# DASHBOARD — SIDEBAR + TOPBAR + LAYOUT
# ============================================================
cat > src/components/dashboard/Sidebar.tsx << 'EOF'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard, Package, MessageSquare, FileText, Search, ShieldCheck, Settings, LogOut, Users, BarChart3
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/search", label: "Discover", icon: Search },
  { href: "/rfq", label: "RFQs", icon: FileText },
  { href: "/chat", label: "Messages", icon: MessageSquare, badge: 3 },
  { href: "/verification", label: "Verification", icon: ShieldCheck },
];

const adminNav = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[240px] shrink-0 border-r border-[#E7E5E4] bg-white h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-[#E7E5E4]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold text-[#0A0A0A] text-[14px]">Retailers Club</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B] px-3 mb-2">
          Workspace
        </div>
        {nav.map((item) => {
          const active = path === item.href || path.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 transition",
                active
                  ? "bg-[#0A0A0A] text-white"
                  : "text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A]"
              )}
            >
              <item.icon size={16} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold bg-[#B8894A] text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B] px-3 mb-2 mt-6">
          Admin
        </div>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A] transition"
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-[#E7E5E4]">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A] transition"
        >
          <Settings size={16} strokeWidth={2} />
          Settings
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A] transition"
        >
          <LogOut size={16} strokeWidth={2} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
EOF

cat > src/components/dashboard/Topbar.tsx << 'EOF'
"use client";
import { Bell, Search as SearchIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E7E5E4] px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-[18px] font-extrabold text-[#0A0A0A] tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3 py-2 w-72">
          <SearchIcon size={15} className="text-[#6B6B6B]" />
          <input
            placeholder="Search products, manufacturers..."
            className="bg-transparent outline-none text-[13px] flex-1 placeholder:text-[#9B9B9B]"
          />
        </div>
        <button className="relative w-9 h-9 rounded-xl border border-[#E7E5E4] flex items-center justify-center hover:bg-[#FAFAF9] transition">
          <Bell size={16} className="text-[#0A0A0A]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B8894A]" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E7E5E4]">
          <Avatar name="Rajesh" size={34} />
          <div className="hidden md:block">
            <div className="text-[13px] font-bold text-[#0A0A0A] leading-tight">Rajesh K.</div>
            <div className="text-[11px] text-[#6B6B6B]">Manufacturer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
EOF

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

# ============================================================
# DASHBOARD PAGES
# ============================================================
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

# ============================================================
# PRODUCTS PAGE
# ============================================================
cat > src/app/products/page.tsx << 'EOF'
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, Filter, Upload } from "lucide-react";

const products = [
  { n: "Cotton Kurti — Pink", c: "Women's Wear", p: 285, m: "100 pcs", s: "Active" },
  { n: "Denim Jeans — Slim Fit", c: "Men's Wear", p: 640, m: "50 pcs", s: "Active" },
  { n: "Kids T-Shirt Bundle", c: "Kids Wear", p: 145, m: "200 pcs", s: "Pending" },
  { n: "Bridal Lehenga Choli", c: "Bridal", p: 2400, m: "10 pcs", s: "Active" },
  { n: "Cotton Saree — Handloom", c: "Ethnic", p: 850, m: "25 pcs", s: "Expiring" },
  { n: "Polyester Track Pants", c: "Sports", p: 320, m: "150 pcs", s: "Active" },
  { n: "Silk Dupatta — Printed", c: "Accessories", p: 190, m: "100 pcs", s: "Active" },
  { n: "Formal Shirt — White", c: "Men's Wear", p: 420, m: "75 pcs", s: "Active" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md">
            <Filter size={15} /> Filters
          </Button>
          <div className="flex gap-2">
            <Badge>All</Badge>
            <Badge>Active</Badge>
            <Badge>Pending</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md">
            <Upload size={15} /> Bulk AI Upload
          </Button>
          <Button size="md">
            <Plus size={15} /> New Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-md transition">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4] relative">
              <Badge
                variant={p.s === "Active" ? "success" : p.s === "Pending" ? "warning" : "danger"}
                className="absolute top-3 left-3"
              >
                {p.s}
              </Badge>
            </div>
            <CardBody className="!p-4">
              <div className="text-[11px] text-[#6B6B6B] font-semibold">{p.c}</div>
              <div className="mt-1 text-[13px] font-bold text-[#0A0A0A] line-clamp-1">{p.n}</div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-[15px] font-extrabold text-[#0A0A0A]">₹{p.p}</div>
                  <div className="text-[11px] text-[#6B6B6B]">MOQ {p.m}</div>
                </div>
                <button className="text-[11px] font-bold text-[#B8894A] hover:underline">
                  Edit
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

# ============================================================
# CHAT PAGE
# ============================================================
cat > src/app/chat/page.tsx << 'EOF'
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Send, Paperclip, MoreVertical } from "lucide-react";

const conversations = [
  { n: "Amit Retailers", m: "Kya aap 100 pcs de sakte ho?", t: "2m", u: 2, o: true },
  { n: "Priya Fashion House", m: "Price ₹280 final kar do", t: "18m", u: 0, o: true },
  { n: "Surat Textiles", m: "Sample bhej diya hai", t: "1h", u: 0, o: false },
  { n: "Delhi Wholesale Co.", m: "MOQ kya hai?", t: "3h", u: 0, o: true },
  { n: "Kolkata Garments", m: "Thanks for the order!", t: "1d", u: 0, o: false },
];

const messages = [
  { s: "them", t: "Hi, mujhe cotton kurti chahiye — 100 pcs." },
  { s: "me", t: "Namaste! Humare paas best quality hai. ₹285/pc, MOQ 100." },
  { s: "them", t: "Kya aap 100 pcs de sakte ho? Aur delivery kitne din?" },
  { s: "me", t: "Haan 100 pcs available hai. Delivery 5-7 working days." },
  { s: "them", t: "Theek hai. Sample bhej sakte ho?" },
];

export default function ChatPage() {
  return (
    <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden h-[calc(100vh-160px)] flex">
      {/* Conversation List */}
      <div className="w-[320px] border-r border-[#E7E5E4] flex flex-col">
        <div className="px-4 py-4 border-b border-[#E7E5E4]">
          <div className="text-[14px] font-bold text-[#0A0A0A]">Messages</div>
          <div className="text-[11px] text-[#6B6B6B] mt-0.5">5 conversations</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c, i) => (
            <div
              key={i}
              className={`px-4 py-3 border-b border-[#E7E5E4] cursor-pointer hover:bg-[#FAFAF9] transition ${
                i === 0 ? "bg-[#FAFAF9]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar name={c.n} size={38} />
                  {c.o && (
                    <span className="absolute -bottom-0 -right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-bold text-[#0A0A0A] truncate">{c.n}</div>
                    <div className="text-[10px] text-[#9B9B9B] shrink-0 ml-2">{c.t}</div>
                  </div>
                  <div className="text-[12px] text-[#6B6B6B] truncate mt-0.5">{c.m}</div>
                </div>
                {c.u > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#B8894A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.u}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="px-5 py-4 border-b border-[#E7E5E4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name="Amit Retailers" size={38} />
            <div>
              <div className="text-[14px] font-bold text-[#0A0A0A]">Amit Retailers</div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="gold">Verified</Badge>
            <button className="w-8 h-8 rounded-lg hover:bg-[#FAFAF9] flex items-center justify-center">
              <MoreVertical size={16} className="text-[#6B6B6B]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#FAFAF9]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.s === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  m.s === "me"
                    ? "bg-[#0A0A0A] text-white rounded-br-md"
                    : "bg-white border border-[#E7E5E4] text-[#0A0A0A] rounded-bl-md"
                }`}
              >
                {m.t}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#E7E5E4] flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl border border-[#E7E5E4] flex items-center justify-center hover:bg-[#FAFAF9]">
            <Paperclip size={16} className="text-[#6B6B6B]" />
          </button>
          <input
            placeholder="Message likho..."
            className="flex-1 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3 outline-none text-[13px] placeholder:text-[#9B9B9B]"
          />
          <button className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center hover:bg-[#262626]">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

# ============================================================
# RFQ PAGE
# ============================================================
cat > src/app/rfq/page.tsx << 'EOF'
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

const rfqs = [
  { t: "Cotton Kurti — 100 pcs", c: "Women's Wear", q: 100, b: "₹280 - ₹320", d: "5 days", s: "Open", r: 4 },
  { t: "Denim Jeans — Bulk 500", c: "Men's Wear", q: 500, b: "₹600 - ₹680", d: "10 days", s: "Quoted", r: 12 },
  { t: "Kids Frocks — Summer", c: "Kids", q: 200, b: "₹180 - ₹220", d: "7 days", s: "Open", r: 2 },
  { t: "Silk Saree — Wedding", c: "Ethnic", q: 50, b: "₹1800 - ₹2500", d: "15 days", s: "Closed", r: 8 },
];

const variantMap: Record<string, "success" | "warning" | "info"> = {
  Open: "success",
  Quoted: "info",
  Closed: "warning",
};

export default function RFQPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[12px] text-[#6B6B6B]">
            Post your requirement — AI will match the best manufacturers.
          </div>
        </div>
        <Button size="md">
          <Plus size={15} /> Post New RFQ
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {rfqs.map((r, i) => (
          <Card key={i} className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[14px] font-bold text-[#0A0A0A]">{r.t}</div>
                  <div className="text-[11px] text-[#6B6B6B] mt-0.5">{r.c}</div>
                </div>
                <Badge variant={variantMap[r.s]}>{r.s}</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[11px] text-[#6B6B6B] font-medium">Quantity</div>
                  <div className="mt-1 text-[15px] font-extrabold text-[#0A0A0A]">{r.q}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B6B6B] font-medium">Budget</div>
                  <div className="mt-1 text-[15px] font-extrabold text-[#0A0A0A]">{r.b}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B6B6B] font-medium">Delivery</div>
                  <div className="mt-1 text-[15px] font-extrabold text-[#0A0A0A]">{r.d}</div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
                <div className="text-[12px] text-[#6B6B6B]">
                  <span className="font-bold text-[#0A0A0A]">{r.r}</span> quotes received
                </div>
                <button className="text-[12px] font-bold text-[#B8894A] hover:underline">
                  View Quotes →
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

# ============================================================
# SEARCH PAGE
# ============================================================
cat > src/app/search/page.tsx << 'EOF'
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Search, MapPin, Sliders } from "lucide-react";

const results = [
  { n: "Cotton Kurti — Pink", c: "Women's Wear", p: 285, loc: "Surat, Gujarat", v: true, m: "100 pcs" },
  { n: "Handloom Cotton Kurti", c: "Women's Wear", p: 310, loc: "Ahmedabad, Gujarat", v: true, m: "50 pcs" },
  { n: "Designer Kurti Set", c: "Women's Wear", p: 295, loc: "Jaipur, Rajasthan", v: false, m: "80 pcs" },
  { n: "Printed Cotton Kurti", c: "Women's Wear", p: 240, loc: "Mumbai, Maharashtra", v: true, m: "150 pcs" },
];

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="flex items-center gap-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3">
            <Search size={16} className="text-[#6B6B6B]" />
            <input
              defaultValue="Cotton kurti near Ahmedabad under ₹300"
              className="bg-transparent outline-none flex-1 text-[14px]"
            />
            <Badge variant="gold">AI</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Women's Wear", "Under ₹300", "Surat", "Verified Only", "Ready Stock"].map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-[13px] text-[#6B6B6B]">
          <span className="font-bold text-[#0A0A0A]">248 results</span> found in 42ms
        </div>
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
          <Sliders size={13} /> Sort: Relevance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {results.map((r, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-md transition">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4] relative">
              {r.v && (
                <Badge variant="success" className="absolute top-3 left-3">
                  ✓ Verified
                </Badge>
              )}
            </div>
            <CardBody className="!p-4">
              <div className="text-[11px] text-[#6B6B6B] font-semibold">{r.c}</div>
              <div className="mt-1 text-[13px] font-bold text-[#0A0A0A]">{r.n}</div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-[#6B6B6B]">
                <MapPin size={11} /> {r.loc}
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="text-[15px] font-extrabold text-[#0A0A0A]">₹{r.p}</div>
                  <div className="text-[11px] text-[#6B6B6B]">MOQ {r.m}</div>
                </div>
                <button className="text-[11px] font-bold text-[#B8894A] hover:underline">
                  Contact
                </button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

# ============================================================
# VERIFICATION PAGE
# ============================================================
cat > src/app/verification/page.tsx << 'EOF'
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Upload, CheckCircle2, Clock } from "lucide-react";

const docs = [
  { t: "GST Certificate", s: "Approved", d: "Verified on 12 Aug 2026" },
  { t: "MSME / Udyam", s: "Approved", d: "Verified on 12 Aug 2026" },
  { t: "PAN Card", s: "Pending", d: "In review queue" },
  { t: "Business Address Proof", s: "Not Uploaded", d: "Action required" },
];

const variantMap: Record<string, "success" | "warning" | "danger"> = {
  Approved: "success",
  Pending: "warning",
  "Not Uploaded": "danger",
};

export default function VerificationPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardBody>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FBF6EF] border border-[#E8D9BF] flex items-center justify-center">
              <ShieldCheck size={22} className="text-[#B8894A]" />
            </div>
            <div className="flex-1">
              <div className="text-[16px] font-extrabold text-[#0A0A0A]">Verification Status</div>
              <div className="text-[13px] text-[#6B6B6B] mt-1">
                2 of 4 documents verified. Complete pending items to earn your verified badge.
              </div>
              <div className="mt-4 w-full h-2 bg-[#FAFAF9] rounded-full overflow-hidden">
                <div className="h-full bg-[#B8894A] rounded-full" style={{ width: "50%" }} />
              </div>
              <div className="mt-2 text-[12px] font-bold text-[#B8894A]">50% complete</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((d, i) => (
          <Card key={i}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {d.s === "Approved" ? (
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  ) : (
                    <Clock size={20} className="text-amber-600" />
                  )}
                  <div>
                    <div className="text-[13px] font-bold text-[#0A0A0A]">{d.t}</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-0.5">{d.d}</div>
                  </div>
                </div>
                <Badge variant={variantMap[d.s]}>{d.s}</Badge>
              </div>
              {d.s === "Not Uploaded" && (
                <Button size="sm" className="mt-4 w-full">
                  <Upload size={13} /> Upload Document
                </Button>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

# ============================================================
# SETTINGS PAGE
# ============================================================
cat > src/app/settings/page.tsx << 'EOF'
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">Profile</div>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name="Rajesh" size={64} />
            <div>
              <div className="text-[14px] font-bold text-[#0A0A0A]">Rajesh Kumar</div>
              <div className="text-[12px] text-[#6B6B6B]">Manufacturer • Surat, Gujarat</div>
            </div>
            <Button variant="secondary" size="sm" className="ml-auto">
              Change Photo
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-semibold text-[#0A0A0A] mb-1.5 block">
                Business Name
              </label>
              <Input defaultValue="Kumar Textiles Pvt Ltd" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#0A0A0A] mb-1.5 block">
                Phone
              </label>
              <Input defaultValue="+91 98765 43210" disabled />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#0A0A0A] mb-1.5 block">
                City
              </label>
              <Input defaultValue="Surat" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#0A0A0A] mb-1.5 block">
                Pincode
              </label>
              <Input defaultValue="395003" />
            </div>
          </div>
          <div className="pt-3 flex justify-end gap-2">
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-[15px] font-bold text-[#0A0A0A]">Privacy</div>
        </CardHeader>
        <CardBody className="space-y-3">
          {[
            "Show my mobile number to verified retailers",
            "Show online status",
            "Allow direct messages",
            "Send email notifications",
          ].map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-[13px] text-[#0A0A0A]">{t}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                <div className="w-10 h-5 bg-[#E7E5E4] peer-checked:bg-[#0A0A0A] rounded-full relative transition">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 peer-checked:translate-x-5 transition" />
                </div>
              </label>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
EOF

# ============================================================
# API ROUTES
# ============================================================
cat > src/app/api/products/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function GET() {
  // TODO: wire Supabase
  return NextResponse.json({ products: [], total: 0 });
}

export async function POST(req: Request) {
  const body = await req.json();
  // TODO: insert into Supabase
  return NextResponse.json({ ok: true, product: body }, { status: 201 });
}
EOF

cat > src/app/api/rfq/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ rfqs: [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ ok: true, rfq: body }, { status: 201 });
}
EOF

cat > src/app/api/chat/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ conversations: [] });
}
EOF

cat > src/app/api/search/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();
  // TODO: parse with OpenAI, filter with PostGIS + pgvector
  return NextResponse.json({
    query,
    parsed: { category: null, location: null, priceMax: null },
    results: [],
  });
}
EOF

cat > src/app/api/verify/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function POST() {
  // TODO: upload to private bucket, insert verification_docs
  return NextResponse.json({ ok: true }, { status: 201 });
}
EOF

cat > src/app/api/auth/route.ts << 'EOF'
import { NextResponse } from "next/server";

export async function POST() {
  // TODO: phone OTP via Supabase
  return NextResponse.json({ ok: true });
}
EOF

# ============================================================
# SOCKET SERVER
# ============================================================
cat > socket-server/index.js << 'EOF'
const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: { origin: "*" },
});

const online = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("🔌 connected:", socket.id);

  socket.on("user:online", (userId) => {
    online.set(userId, socket.id);
    io.emit("presence:update", { userId, status: "online" });
  });

  socket.on("message:send", ({ to, from, content, kind }) => {
    const payload = { to, from, content, kind: kind || "text", at: Date.now() };
    const toSocket = online.get(to);
    if (toSocket) io.to(toSocket).emit("message:new", payload);
    socket.emit("message:sent", payload);
  });

  socket.on("typing", ({ to, from }) => {
    const toSocket = online.get(to);
    if (toSocket) io.to(toSocket).emit("typing", { from });
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of online.entries()) {
      if (sid === socket.id) {
        online.delete(uid);
        io.emit("presence:update", { userId: uid, status: "offline" });
        break;
      }
    }
  });
});

console.log("🔌 Socket server on :3001");
EOF

# ============================================================
# DB MIGRATION (expanded)
# ============================================================
cat > supabase/migrations/001_init.sql << 'EOF'
-- ============================================
-- Retailers Club — Full Schema
-- ============================================
create extension if not exists "postgis";
create extension if not exists "pgvector";
create extension if not exists "uuid-ossp";

create type user_role as enum
  ('super_admin','admin','verification_admin','manufacturer','retailer','wholesaler','distributor','exporter','sales_agent');
create type verify_status as enum ('pending','approved','rejected','correction_requested');
create type product_visibility as enum ('public','retailers_only','verified_retailers','selected','private');
create type rfq_status as enum ('open','quoted','closed','cancelled');
create type message_kind as enum ('text','product','rfq','quote','image','doc');

-- Profiles
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'retailer',
  business_name text,
  phone text unique,
  city text, state text, pincode text,
  location geography(point),
  is_verified boolean default false,
  verify_status verify_status default 'pending',
  show_number boolean default true,
  show_online boolean default true,
  created_at timestamptz default now()
);
create index on profiles using gist(location);
create index on profiles(role);

-- Verification documents
create table verification_docs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  doc_type text not null,
  file_url text not null,
  status verify_status default 'pending',
  admin_notes text,
  reviewed_by uuid references profiles(id),
  created_at timestamptz default now()
);
create index on verification_docs(user_id);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  manufacturer_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  category text, fabric text, color text, gender text,
  price numeric, moq int,
  media_urls text[] default '{}',
  media_expires_at timestamptz,
  visibility product_visibility default 'verified_retailers',
  embedding vector(1536),
  created_at timestamptz default now()
);
create index on products(manufacturer_id);
create index on products(category);

-- RFQ
create table rfqs (
  id uuid primary key default uuid_generate_v4(),
  retailer_id uuid references profiles(id) on delete cascade,
  category text, title text, quantity int,
  budget numeric, delivery_days int,
  status rfq_status default 'open',
  created_at timestamptz default now()
);

create table quotes (
  id uuid primary key default uuid_generate_v4(),
  rfq_id uuid references rfqs(id) on delete cascade,
  manufacturer_id uuid references profiles(id),
  price numeric, moq int, delivery_days int, notes text,
  created_at timestamptz default now()
);

-- Chat
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  participants uuid[] not null,
  last_message text,
  last_at timestamptz default now()
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text, kind message_kind default 'text',
  meta jsonb,
  read_at timestamptz,
  created_at timestamptz default now()
);
create index on messages(conversation_id, created_at desc);

-- Contact reveal audit
create table contact_reveals (
  id uuid primary key default uuid_generate_v4(),
  viewer_id uuid references profiles(id),
  owner_id uuid references profiles(id),
  revealed_at timestamptz default now()
);

-- Boost
create table boosts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  radius_km int,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  is_trial boolean default false
);

-- Notifications
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  kind text, title text, body text, link text,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- Audit log
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid, action text, target text, meta jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- RLS
-- ============================================
alter table profiles enable row level security;
alter table products enable row level security;
alter table messages enable row level security;
alter table verification_docs enable row level security;
alter table contact_reveals enable row level security;
alter table notifications enable row level security;

create policy "self_read" on profiles for select using (auth.uid() = id);
create policy "public_verified_read" on profiles for select using (is_verified = true);
create policy "self_update" on profiles for update using (auth.uid() = id);

create policy "mfr_manage" on products for all using (auth.uid() = manufacturer_id);
create policy "verified_read" on products for select using (
  visibility in ('public','retailers_only','verified_retailers')
);

create policy "doc_owner" on verification_docs for all using (auth.uid() = user_id);
create policy "notif_owner" on notifications for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, phone, role)
  values (new.id, new.phone, 'retailer');
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();
EOF

# ============================================================
# UPDATE package.json scripts
# ============================================================
node -e "
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json','utf8'));
p.scripts = {
  ...p.scripts,
  'socket': 'node socket-server/index.js',
  'dev:all': 'concurrently -n web,socket -c blue,magenta \"npm run dev\" \"npm run socket\"'
};
if (!p.devDependencies) p.devDependencies = {};
p.devDependencies['concurrently'] = '^9.1.0';
fs.writeFileSync('package.json', JSON.stringify(p, null, 2));
"

echo "📦 Installing concurrently..."
npm install

echo ""
echo "======================================================"
echo "  ✅ Phase 2 complete — Full app shell ready!"
echo "======================================================"
echo ""
echo "  Run:  npm run dev:all"
echo ""
echo "  Pages:"
echo "    Landing        /"
echo "    Login          /login"
echo "    Register       /register"
echo "    Dashboard      /dashboard"
echo "    Products       /products"
echo "    Chat           /chat"
echo "    RFQ            /rfq"
echo "    Search         /search"
echo "    Verification   /verification"
echo "    Settings       /settings"
echo ""
echo "  DB schema: supabase/migrations/001_init.sql"
echo "======================================================"