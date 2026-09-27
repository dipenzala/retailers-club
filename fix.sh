#!/bin/bash
# Retailers Club — Tailwind v3 fix + Premium Ultra Clean Theme
set -e

echo "🔧 Fixing Tailwind + applying premium clean theme..."

# ---------- Force Tailwind v3 ----------
echo "📦 Downgrading to Tailwind v3..."
npm uninstall tailwindcss @tailwindcss/postcss 2>/dev/null || true
npm install -D tailwindcss@3.4.17 postcss@8.4.49 autoprefixer@10.4.20

# ---------- postcss.config.js ----------
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# ---------- tailwind.config.ts ----------
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0A0A0A",
        muted: "#6B6B6B",
        cream: "#FAFAF9",
        border: "#E7E5E4",
        gold: "#B8894A",
        navy: "#0F172A",
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# ---------- globals.css (clean premium) ----------
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #FAFAF9;
  --surface: #FFFFFF;
  --text: #0A0A0A;
  --muted: #6B6B6B;
  --border: #E7E5E4;
  --accent: #0F172A;
  --gold: #B8894A;
}

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-jakarta), system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  line-height: 1.6;
}

/* ---------- Cards ---------- */
.card {
  background: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: 1rem;
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
}
.card:hover {
  border-color: #D6D3D1;
  transform: translateY(-3px);
  box-shadow: 0 12px 32px -12px rgba(10,10,10,0.08);
}

/* ---------- Buttons ---------- */
.btn-primary {
  background: var(--text);
  color: #fff;
  font-weight: 600;
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  transition: background .2s ease, transform .2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-primary:hover {
  background: #262626;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #FFFFFF;
  color: var(--text);
  font-weight: 600;
  padding: 0.875rem 1.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  transition: border-color .2s ease, background .2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-secondary:hover {
  border-color: var(--text);
  background: #FAFAF9;
}

/* ---------- Labels ---------- */
.eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gold);
}

/* ---------- Divider ---------- */
.rule {
  height: 1px;
  background: var(--border);
}

/* ---------- Animations ---------- */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee {
  animation: marquee 60s linear infinite;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---------- Section spacing helper ---------- */
.section {
  padding-top: 7rem;
  padding-bottom: 7rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* ---------- Scroll progress ---------- */
.scroll-progress {
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: var(--text);
  z-index: 100;
}
EOF

# ---------- layout.tsx ----------
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Retailers Club — India's Garment B2B Network",
  description:
    "Pan-India B2B garment marketplace connecting verified manufacturers with retailers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
EOF

# ---------- Navbar ----------
cat > src/components/landing/Navbar.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "AI Search", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-[#E7E5E4] rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold tracking-tight text-[#0A0A0A] text-[15px]">
            Retailers Club
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-[13px] font-semibold bg-[#0A0A0A] text-white px-4 py-2 rounded-lg hover:bg-[#262626] transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
EOF

# ---------- Hero ----------
cat > src/components/landing/Hero.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8894A]" />
          <span className="text-[12px] font-medium text-[#6B6B6B]">
            India's Garment B2B Network
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem] font-extrabold tracking-[-0.03em] leading-[1.02] text-[#0A0A0A]"
        >
          Manufacturers
          <br />
          meet Retailers.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-2xl mx-auto text-[17px] text-[#6B6B6B] leading-relaxed"
        >
          Verified partners, AI-powered product uploads, real-time chat, and
          location-based discovery. Built for 3 lakh users, zero lag.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register" className="btn-primary">
            Start Free — 7 Day Boost
            <ArrowRight size={16} />
          </Link>
          <a href="#how" className="btn-secondary">
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left"
        >
          {[
            { l: "GST / MSME Verified", s: "Manual + API checks" },
            { l: "AI Quick Upload", s: "Photo → Full listing" },
            { l: "PostGIS Location", s: "Sub-50ms nearby search" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white border border-[#E7E5E4] rounded-xl p-5"
            >
              <div className="text-[13px] font-bold text-[#0A0A0A]">{f.l}</div>
              <div className="mt-1 text-[13px] text-[#6B6B6B]">{f.s}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
EOF

# ---------- TrustBar ----------
cat > src/components/landing/TrustBar.tsx << 'EOF'
"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.floor(v).toLocaleString("en-IN") + suffix);
  useEffect(() => {
    if (inView) animate(mv, to, { duration: 1.8 });
  }, [inView, to, mv]);
  return <span ref={ref}>{rounded}</span>;
}

export default function TrustBar() {
  const stats = [
    { v: 10000, s: "+", l: "Verified Manufacturers" },
    { v: 50000, s: "+", l: "Retailers Onboarded" },
    { v: 28, s: "", l: "States Covered" },
    { v: 3, s: "L+", l: "User Capacity" },
  ];
  return (
    <section className="border-y border-[#E7E5E4] py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-[2.5rem] md:text-[3rem] font-extrabold tracking-tight text-[#0A0A0A] leading-none">
              <Counter to={s.v} suffix={s.s} />
            </div>
            <div className="mt-3 text-[13px] text-[#6B6B6B] font-medium">
              {s.l}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
EOF

# ---------- Features ----------
cat > src/components/landing/Features.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import {
  Bot, MessageSquare, ShieldCheck, MapPin, FileText, Bell, BarChart3, Rocket,
} from "lucide-react";

const features = [
  { icon: Bot, t: "AI Quick Upload", d: "Photo daalo — AI title, category, fabric, tags suggest karega." },
  { icon: MessageSquare, t: "Real-time Chat", d: "Typing indicators, presence, RFQ and quote cards." },
  { icon: ShieldCheck, t: "Manual Verification", d: "GST, MSME, PAN — admin review with full audit trail." },
  { icon: MapPin, t: "PostGIS Discovery", d: "State → District → City → Pincode radius search." },
  { icon: FileText, t: "RFQ & Quotations", d: "Requirement post karo — AI auto-matches manufacturers." },
  { icon: Bell, t: "Smart Notifications", d: "Quiet hours, frequency caps, spam-free alerts." },
  { icon: BarChart3, t: "Demand Analytics", d: "Top searched categories and high-demand locations." },
  { icon: Rocket, t: "Profile Boost", d: "Top 25/50/100 km placement — Redis cached ranking." },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="eyebrow mb-4">Platform</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            Everything you need to trade at scale
          </h2>
          <p className="mt-5 text-[16px] text-[#6B6B6B] max-w-xl mx-auto">
            Production-ready modules — from AI upload to verified chat to location discovery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.06 }}
              className="card p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center">
                <f.icon size={18} className="text-[#0A0A0A]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[15px] font-bold text-[#0A0A0A] tracking-tight">
                {f.t}
              </h3>
              <p className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">
                {f.d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
EOF

# ---------- HowItWorks ----------
cat > src/components/landing/HowItWorks.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";

const steps = [
  { n: "01", t: "Sign Up", d: "Business, location and categories — 2 minute onboarding." },
  { n: "02", t: "Get Verified", d: "Upload GST/MSME — admin review — Verified badge." },
  { n: "03", t: "List / Discover", d: "AI upload products or search with natural language." },
  { n: "04", t: "Chat & Trade", d: "RFQ → Quote → Deal. Real-time, in-platform." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section bg-white border-y border-[#E7E5E4]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="eyebrow mb-4">Process</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            From signup to first deal in one day
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="text-[3.5rem] font-extrabold tracking-tight text-[#E7E5E4] leading-none">
                {s.n}
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-[#0A0A0A]">{s.t}</h3>
              <p className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
EOF

# ---------- AISearch ----------
cat > src/components/landing/AISearch.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const queries = [
  "Mujhe Ahmedabad ke paas ₹300 me women's kurti chahiye",
  "Surat se cotton fabric manufacturer dikhao",
  "Plus size lehenga wholesale Delhi NCR",
  "₹500 se kam me kids t-shirt bulk order",
];

export default function AISearch() {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);

  useEffect(() => {
    const full = queries[idx];
    if (sub < full.length) {
      const t = setTimeout(() => setSub(sub + 1), 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setSub(0);
      setIdx((idx + 1) % queries.length);
    }, 2200);
    return () => clearTimeout(t);
  }, [sub, idx]);

  useEffect(() => setText(queries[idx].slice(0, sub)), [sub, idx]);

  return (
    <section id="ai" className="section">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="eyebrow mb-4">Natural Language</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            Type like you talk.
          </h2>
          <p className="mt-5 text-[16px] text-[#6B6B6B]">
            AI samjhega location, price, category, gender — sab.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10 bg-white border border-[#E7E5E4] rounded-2xl p-2 shadow-sm"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Search size={18} className="text-[#6B6B6B]" strokeWidth={2} />
            <div className="flex-1 text-left text-[15px] font-medium text-[#0A0A0A]">
              <span>{text}</span>
              <span className="inline-block w-[2px] h-4 bg-[#0A0A0A] align-middle ml-0.5 animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {["Ahmedabad", "Women's Kurti", "Under ₹300", "Verified"].map((t) => (
            <span
              key={t}
              className="bg-white border border-[#E7E5E4] rounded-full px-3 py-1.5 text-[12px] font-medium text-[#6B6B6B]"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
EOF

# ---------- Testimonials ----------
cat > src/components/landing/Testimonials.tsx << 'EOF'
"use client";
const items = [
  { q: "Surat se Delhi tak — 3 din me verified manufacturers mile. Pehle mahine me 40 orders.", n: "Rakesh M.", r: "Retailer, Jaipur" },
  { q: "AI upload ne meri 200 products 2 ghante me list kar di. Pehle 2 hafte lagte the.", n: "Priya S.", r: "Manufacturer, Surat" },
  { q: "Real-time chat aur RFQ system ne humara sales cycle 60% kam kar diya.", n: "Amit K.", r: "Wholesaler, Ludhiana" },
  { q: "Location-based search ne local buyer-seller matching 10x fast kiya.", n: "Sneha P.", r: "Retailer, Ahmedabad" },
];

export default function Testimonials() {
  const row = [...items, ...items];
  return (
    <section className="py-24 overflow-hidden bg-white border-y border-[#E7E5E4]">
      <div className="text-center mb-14 px-6">
        <div className="eyebrow mb-4">Trusted</div>
        <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
          Voices from the trade
        </h2>
      </div>
      <div className="flex gap-4 marquee w-max">
        {row.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-[#E7E5E4] rounded-2xl p-6 w-[360px] shrink-0"
          >
            <p className="text-[14px] leading-relaxed text-[#0A0A0A]">"{t.q}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[12px] font-bold">
                {t.n.charAt(0)}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#0A0A0A]">{t.n}</div>
                <div className="text-[12px] text-[#6B6B6B]">{t.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
EOF

# ---------- Pricing ----------
cat > src/components/landing/Pricing.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  { n: "Free", p: "₹0", s: "forever", f: ["Basic listing", "7-day boost trial", "10 products", "Chat access"], c: false },
  { n: "Manufacturer Pro", p: "₹999", s: "/month", f: ["Unlimited products", "Priority support", "Analytics dashboard", "RFQ auto-match"], c: true },
  { n: "Retailer Pro", p: "₹499", s: "/month", f: ["Advanced filters", "Early access", "Saved searches", "Contact history"], c: false },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="eyebrow mb-4">Pricing</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            Start free. Scale when ready.
          </h2>
          <p className="mt-5 text-[16px] text-[#6B6B6B]">
            Payment gateway plug-and-play — abhi sab free me use karo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-8 ${
                p.c
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-white border border-[#E7E5E4]"
              }`}
            >
              <div className={`text-[12px] font-semibold uppercase tracking-wider ${p.c ? "text-white/60" : "text-[#6B6B6B]"}`}>
                {p.n}
              </div>
              <div className="mt-4 flex items-end gap-1.5">
                <div className={`text-[2.5rem] font-extrabold tracking-tight leading-none ${p.c ? "text-white" : "text-[#0A0A0A]"}`}>
                  {p.p}
                </div>
                <div className={`pb-1 text-[13px] ${p.c ? "text-white/60" : "text-[#6B6B6B]"}`}>
                  {p.s}
                </div>
              </div>
              <div className={`h-px my-6 ${p.c ? "bg-white/15" : "bg-[#E7E5E4]"}`} />
              <ul className="space-y-3">
                {p.f.map((f, j) => (
                  <li
                    key={j}
                    className={`flex items-center gap-2.5 text-[14px] ${p.c ? "text-white/90" : "text-[#0A0A0A]"}`}
                  >
                    <Check size={14} strokeWidth={2.5} className={p.c ? "text-white" : "text-[#B8894A]"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block text-center py-3 rounded-xl font-semibold text-[14px] transition ${
                  p.c
                    ? "bg-white text-[#0A0A0A] hover:bg-white/90"
                    : "bg-[#0A0A0A] text-white hover:bg-[#262626]"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
EOF

# ---------- CTA ----------
cat > src/components/landing/CTA.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#0A0A0A] rounded-[1.75rem] px-8 py-16 md:px-14 md:py-20 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="relative">
            <h2 className="text-[2.25rem] md:text-[3rem] font-extrabold tracking-[-0.03em] text-white leading-tight">
              Ready to scale your
              <br />
              garment business?
            </h2>
            <p className="mt-6 text-white/60 text-[16px] max-w-lg mx-auto leading-relaxed">
              Join India's most trusted B2B garment network. Verified.
              AI-powered. Built for 3 lakh users.
            </p>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-2 bg-white text-[#0A0A0A] px-7 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition"
            >
              Create Free Account <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
EOF

# ---------- Footer ----------
cat > src/components/landing/Footer.tsx << 'EOF'
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E5E4] px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span className="font-bold text-[#0A0A0A] text-[15px]">
                Retailers Club
              </span>
            </div>
            <p className="mt-4 text-[13px] text-[#6B6B6B] max-w-xs leading-relaxed">
              India's AI-powered garment B2B network. Verified manufacturers,
              real-time trade.
            </p>
          </div>
          {[
            { t: "Product", l: ["Features", "Pricing", "AI Search", "RFQ"] },
            { t: "Company", l: ["About", "Careers", "Blog", "Contact"] },
            { t: "Legal", l: ["Privacy", "Terms", "Security", "Compliance"] },
          ].map((c, i) => (
            <div key={i}>
              <div className="text-[13px] font-bold mb-4 text-[#0A0A0A]">
                {c.t}
              </div>
              <ul className="space-y-2.5">
                {c.l.map((x) => (
                  <li key={x}>
                    <Link
                      href="#"
                      className="text-[13px] text-[#6B6B6B] hover:text-[#0A0A0A] transition"
                    >
                      {x}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-[#E7E5E4] flex flex-col md:flex-row justify-between gap-3 text-[12px] text-[#6B6B6B]">
          <div>© 2026 Retailers Club. All rights reserved.</div>
          <div className="font-medium">Made in India</div>
        </div>
      </div>
    </footer>
  );
}
EOF

# ---------- Auth pages (clean) ----------
cat > "src/app/(auth)/login/page.tsx" << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#FAFAF9]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#E7E5E4] rounded-2xl p-8 w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold text-[#0A0A0A] text-[15px]">Retailers Club</span>
        </Link>
        <h1 className="text-[1.5rem] font-extrabold text-center text-[#0A0A0A] tracking-tight">
          Welcome back
        </h1>
        <p className="text-[13px] text-[#6B6B6B] text-center mt-2">
          {step === "phone" ? "Phone number se login karo" : "OTP daalo (demo: 123456)"}
        </p>

        <div className="mt-8 space-y-3">
          {step === "phone" ? (
            <>
              <div className="flex items-center bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4">
                <span className="text-[#6B6B6B] font-medium text-[14px]">+91</span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  className="bg-transparent flex-1 px-3 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
                />
              </div>
              <button
                onClick={() => setStep("otp")}
                className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4">
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  className="bg-transparent w-full py-3.5 outline-none text-center tracking-[1em] text-[18px] text-[#0A0A0A]"
                />
              </div>
              <button className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition">
                Verify & Login
              </button>
              <button
                onClick={() => setStep("phone")}
                className="w-full text-[13px] text-[#6B6B6B] font-medium"
              >
                Change number
              </button>
            </>
          )}
        </div>

        <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
          New here?{" "}
          <Link href="/register" className="text-[#0A0A0A] font-semibold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
EOF

cat > "src/app/(auth)/register/page.tsx" << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState<"manufacturer" | "retailer">("retailer");
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#FAFAF9]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#E7E5E4] rounded-2xl p-8 w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold text-[#0A0A0A] text-[15px]">Retailers Club</span>
        </Link>
        <h1 className="text-[1.5rem] font-extrabold text-center text-[#0A0A0A] tracking-tight">
          Create account
        </h1>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { k: "retailer" as const, l: "Retailer" },
            { k: "manufacturer" as const, l: "Manufacturer" },
          ].map((r) => (
            <button
              key={r.k}
              onClick={() => setRole(r.k)}
              className={`rounded-xl p-4 text-center transition border ${
                role === r.k
                  ? "border-[#0A0A0A] bg-[#0A0A0A] text-white"
                  : "border-[#E7E5E4] bg-[#FAFAF9] text-[#0A0A0A]"
              }`}
            >
              <span className="text-[14px] font-semibold">{r.l}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          <input
            placeholder="Business Name"
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
          />
          <input
            placeholder="Phone (+91)"
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
          />
          <input
            placeholder="City"
            className="w-full bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-4 py-3.5 outline-none text-[#0A0A0A] text-[14px]"
          />
          <button className="w-full bg-[#0A0A0A] text-white py-3.5 rounded-xl font-semibold text-[14px] hover:bg-[#262626] transition">
            Continue → OTP
          </button>
        </div>

        <p className="text-center text-[13px] text-[#6B6B6B] mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0A0A0A] font-semibold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
EOF

# ---------- Fix ScrollProgress ----------
cat > src/components/landing/ScrollProgress.tsx << 'EOF'
"use client";
import { motion, useScroll, useSpring } from "framer-motion";
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="scroll-progress" style={{ width }} />;
}
EOF

echo ""
echo "======================================================"
echo "  ✅ Fixed + Premium Clean Theme applied!"
echo "======================================================"
echo ""
echo "  Now run:"
echo "    rm -rf .next node_modules/.cache"
echo "    npm run dev"
echo ""
echo "  Palette:  Ivory + Ink Black + Muted Gold"
echo "  Font:     Plus Jakarta Sans"
echo "  Vibe:     Ultra clean / Apple–Stripe–Linear level"
echo "======================================================"