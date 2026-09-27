#!/bin/bash
# Retailers Club — Light Theme Patch
set -e

echo "🎨 Applying light theme..."

# ---------- globals.css ----------
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #fdfcfa;
  --bg-soft: #f4f4ef;
  --surface: #ffffff;
  --border: rgba(15,23,42,0.08);
  --border-soft: rgba(15,23,42,0.05);
  --brand: #4f46e5;
  --brand-2: #7c3aed;
  --accent: #f59e0b;
  --coral: #fb7185;
  --mint: #10b981;
  --text: #0f172a;
  --muted: #64748b;
}

* { -webkit-font-smoothing: antialiased; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-jakarta), system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}

/* Soft surface cards (light) */
.glass {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15,23,42,0.03),
    0 8px 24px rgba(15,23,42,0.05);
}

.glass-strong {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow:
    0 4px 12px rgba(15,23,42,0.05),
    0 20px 40px rgba(79,70,229,0.08);
}

/* Gradient text — warm positive */
.gradient-text {
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 40%, #ec4899 70%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
}

.brand-soft {
  background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%);
}

/* Soft aurora — light */
.aurora {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(600px 400px at 15% 10%, rgba(99,102,241,0.12), transparent 60%),
    radial-gradient(700px 500px at 85% 15%, rgba(236,72,153,0.10), transparent 60%),
    radial-gradient(500px 400px at 50% 85%, rgba(245,158,11,0.10), transparent 60%);
  pointer-events: none;
}

/* Subtle grain — light */
.noise::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.15'/></svg>");
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.35;
}

/* Buttons */
.btn-glow {
  box-shadow: 0 8px 20px rgba(99,102,241,0.25);
  transition: box-shadow .3s ease, transform .2s ease;
}
.btn-glow:hover {
  box-shadow: 0 12px 30px rgba(99,102,241,0.35);
  transform: translateY(-2px);
}

.card-hover {
  transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .3s, border-color .3s;
}
.card-hover:hover {
  transform: translateY(-6px);
  box-shadow:
    0 12px 32px rgba(79,70,229,0.12),
    0 4px 12px rgba(15,23,42,0.06);
  border-color: rgba(99,102,241,0.25);
}

/* Animations */
@keyframes float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-14px); }
}
.float { animation: float 6s ease-in-out infinite; }
.float-slow { animation: float 9s ease-in-out infinite; }

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee { animation: marquee 40s linear infinite; }

@keyframes blob {
  0%,100% { transform: translate(0,0) scale(1); }
  33%     { transform: translate(30px,-30px) scale(1.1); }
  66%     { transform: translate(-20px,20px) scale(0.95); }
}
.blob { animation: blob 12s ease-in-out infinite; }

.scroll-progress {
  position: fixed; top: 0; left: 0; height: 3px;
  background: linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#f59e0b);
  z-index: 100;
}

/* Grid pattern */
.grid-bg {
  background-image:
    linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
}
EOF

# ---------- layout.tsx (better font) ----------
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
  title: "Retailers Club — India's AI-Powered Garment B2B Network",
  description:
    "Pan-India B2B garment marketplace connecting verified manufacturers with retailers. AI upload, real-time chat, RFQ, location discovery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        {children}
      </body>
    </html>
  );
}
EOF

# ---------- Navbar ----------
cat > src/components/landing/Navbar.tsx << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "AI Search", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-[var(--text)]">Retailers Club</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--muted)]">
          {links.map(l => (
            <a key={l.href} href={l.href} className="hover:text-[var(--brand)] transition font-medium">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[var(--muted)] hover:text-[var(--brand)] transition font-medium">
            Login
          </Link>
          <Link href="/register" className="btn-glow text-sm px-4 py-2 rounded-xl brand-gradient text-white font-semibold">
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
import { ArrowRight, ShieldCheck, Zap, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-28 px-6 overflow-hidden">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/40 blur-3xl blob" />
      <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full bg-pink-200/40 blur-3xl blob" style={{ animationDelay: "3s" }} />

      <div className="relative max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-[var(--text)] mb-8 font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          India's AI-Powered Garment B2B Network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1] text-[var(--text)]"
        >
          <span className="gradient-text">Manufacturers</span>
          <br />
          meet <span className="gradient-text">Retailers.</span>
          <br />
          <span className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--muted)] mt-4 block">
            Nationwide. Verified. AI-Powered.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 max-w-2xl mx-auto text-lg text-[var(--muted)] leading-relaxed"
        >
          Real-time chat. GST-verified partners. AI product upload. Location-based discovery.
          Built for scale — <span className="text-[var(--text)] font-semibold">3 lakh users, zero lag.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="btn-glow group brand-gradient text-white font-semibold px-7 py-3.5 rounded-2xl flex items-center gap-2">
            Start Free — 7 Day Boost
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </Link>
          <a href="#how" className="glass px-7 py-3.5 rounded-2xl font-semibold text-[var(--text)] hover:bg-[var(--bg-soft)] transition">
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
        >
          {[
            { icon: ShieldCheck, label: "GST / MSME Verified", sub: "Manual + API checks", color: "text-indigo-600", bg: "bg-indigo-50" },
            { icon: Zap, label: "AI Quick Upload", sub: "Photo → Full listing", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: MapPin, label: "PostGIS Location", sub: "<50ms nearby search", color: "text-pink-600", bg: "bg-pink-50" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass card-hover rounded-2xl p-5 text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}>
                <f.icon className={f.color} size={20} />
              </div>
              <div className="mt-3 font-bold text-[var(--text)]">{f.label}</div>
              <div className="text-sm text-[var(--muted)]">{f.sub}</div>
            </motion.div>
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
  const rounded = useTransform(mv, v => Math.floor(v).toLocaleString("en-IN") + suffix);
  useEffect(() => { if (inView) animate(mv, to, { duration: 2 }); }, [inView, to, mv]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function TrustBar() {
  const stats = [
    { v: 10000, s: "+", l: "Verified Manufacturers", c: "text-indigo-600" },
    { v: 50000, s: "+", l: "Retailers Onboarded", c: "text-pink-600" },
    { v: 28,    s: "",  l: "States Covered", c: "text-amber-600" },
    { v: 3,     s: "L+", l: "Capacity Ready", c: "text-emerald-600" },
  ];
  return (
    <section className="py-16 px-6 border-y border-[var(--border)] bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className={`text-4xl md:text-5xl font-extrabold ${s.c}`}>
              <Counter to={s.v} suffix={s.s} />
            </div>
            <div className="mt-2 text-sm text-[var(--muted)] font-medium">{s.l}</div>
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
import { Bot, MessageSquare, ShieldCheck, MapPin, FileText, Bell, BarChart3, Rocket } from "lucide-react";

const features = [
  { icon: Bot, t: "AI Quick Upload", d: "Photo/Video daalo — AI title, category, fabric, tags sab suggest karega.", c: "text-indigo-600 bg-indigo-50" },
  { icon: MessageSquare, t: "Real-time Chat", d: "Typing indicators, presence, RFQ cards, quote cards — full messenger.", c: "text-pink-600 bg-pink-50" },
  { icon: ShieldCheck, t: "Manual Verification", d: "GST, MSME, PAN — admin review + automated API check with audit trail.", c: "text-emerald-600 bg-emerald-50" },
  { icon: MapPin, t: "PostGIS Discovery", d: "State → District → City → Pincode. Radius search under 50ms.", c: "text-amber-600 bg-amber-50" },
  { icon: FileText, t: "RFQ & Quotations", d: "Requirement post karo — AI relevant manufacturers se auto-match karega.", c: "text-violet-600 bg-violet-50" },
  { icon: Bell, t: "Smart Notifications", d: "Deduplication, quiet hours, frequency caps — spam-free alerts.", c: "text-blue-600 bg-blue-50" },
  { icon: BarChart3, t: "Demand Analytics", d: "Top searched categories, high-demand locations — market pulse.", c: "text-rose-600 bg-rose-50" },
  { icon: Rocket, t: "Profile Boost", d: "Top 25/50/100 km placement — Redis cached ranking for scale.", c: "text-cyan-600 bg-cyan-50" },
];

export default function Features() {
  return (
    <section id="features" className="py-28 px-6 relative bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand)] mb-3 font-bold">Platform</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)]">Everything you need to trade at scale</h2>
          <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto text-lg">
            Production-ready modules — from AI upload to verified chat to location discovery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 4) * 0.08 }}
              className="glass card-hover rounded-2xl p-6 relative overflow-hidden group bg-white"
            >
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl ${f.c.split(" ")[1]} flex items-center justify-center`}>
                  <f.icon size={20} className={f.c.split(" ")[0]} />
                </div>
                <h3 className="mt-5 font-bold text-lg text-[var(--text)]">{f.t}</h3>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.d}</p>
              </div>
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
import { UserPlus, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";

const steps = [
  { icon: UserPlus, t: "Sign Up", d: "Business + Location + Categories — 2 min onboarding.", c: "text-indigo-600 bg-indigo-50" },
  { icon: ShieldCheck, t: "Get Verified", d: "GST/MSME upload → Admin review → Verified badge.", c: "text-emerald-600 bg-emerald-50" },
  { icon: Sparkles, t: "List / Discover", d: "AI upload products or search with natural language.", c: "text-amber-600 bg-amber-50" },
  { icon: MessageSquare, t: "Chat & Trade", d: "RFQ → Quote → Deal. Real-time, in-platform.", c: "text-pink-600 bg-pink-50" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-28 px-6 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand)] mb-3 font-bold">Process</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)]">From signup to first deal in one day</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className={`mx-auto w-24 h-24 rounded-3xl ${s.c.split(" ")[1]} border border-[var(--border)] flex items-center justify-center relative bg-white shadow-sm`}>
                <s.icon size={30} className={s.c.split(" ")[0]} />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full brand-gradient text-white text-xs flex items-center justify-center font-bold shadow-md">
                  {i + 1}
                </div>
              </div>
              <h3 className="mt-6 font-bold text-lg text-[var(--text)]">{s.t}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{s.d}</p>
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
import { Search, Sparkles } from "lucide-react";
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
    } else {
      const t = setTimeout(() => { setSub(0); setIdx((idx + 1) % queries.length); }, 2200);
      return () => clearTimeout(t);
    }
  }, [sub, idx]);

  useEffect(() => setText(queries[idx].slice(0, sub)), [sub, idx]);

  return (
    <section id="ai" className="py-28 px-6 relative bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand)] mb-3 font-bold">Natural Language</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)]">Type like you talk. Find like magic.</h2>
          <p className="mt-4 text-[var(--muted)] text-lg">AI samjhega location, price, category, gender — sab.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-12 glass-strong rounded-3xl p-2 max-w-3xl mx-auto relative bg-white"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Search className="text-[var(--muted)]" size={20} />
            <div className="flex-1 text-left text-lg font-medium text-[var(--text)]">
              <span>{text}</span>
              <span className="inline-block w-[2px] h-5 bg-[var(--brand)] align-middle ml-0.5 animate-pulse" />
            </div>
            <div className="brand-gradient rounded-xl p-2 shadow-md shadow-indigo-200">
              <Sparkles size={16} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-2 text-xs"
        >
          {["Ahmedabad", "Women's Kurti", "Under ₹300", "Verified Only"].map(t => (
            <span key={t} className="glass rounded-full px-3 py-1.5 text-[var(--text)] font-medium bg-white">
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
import { motion } from "framer-motion";

const items = [
  { q: "Surat se Delhi tak — 3 din me verified manufacturers mile. Pehle mahine me 40 orders.", n: "Rakesh M.", r: "Retailer, Jaipur", c: "bg-indigo-100 text-indigo-700" },
  { q: "AI upload ne meri 200 products 2 ghante me list kar di. Pehle 2 hafte lagte the.", n: "Priya S.", r: "Manufacturer, Surat", c: "bg-pink-100 text-pink-700" },
  { q: "Real-time chat + RFQ system ne humara sales cycle 60% kam kar diya.", n: "Amit K.", r: "Wholesaler, Ludhiana", c: "bg-amber-100 text-amber-700" },
  { q: "Location-based search ne local buyer-seller match 10x fast kiya.", n: "Sneha P.", r: "Retailer, Ahmedabad", c: "bg-emerald-100 text-emerald-700" },
];

export default function Testimonials() {
  const row = [...items, ...items];
  return (
    <section className="py-28 overflow-hidden bg-white">
      <div className="text-center mb-14 px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand)] mb-3 font-bold">Trusted</div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)]">Voices from the trade</h2>
      </div>
      <div className="flex gap-5 marquee w-max">
        {row.map((t, i) => (
          <div key={i} className="glass rounded-2xl p-6 w-[340px] shrink-0 bg-white">
            <p className="text-[15px] leading-relaxed text-[var(--text)]">"{t.q}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${t.c} flex items-center justify-center font-bold`}>
                {t.n.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text)]">{t.n}</div>
                <div className="text-xs text-[var(--muted)]">{t.r}</div>
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
  { n: "Free", p: "₹0", s: "Always", f: ["Basic listing", "7-day boost trial", "10 products", "Chat access"], c: false },
  { n: "Manufacturer Pro", p: "₹999", s: "/month", f: ["Unlimited products", "Priority support", "Analytics dashboard", "RFQ auto-match"], c: true },
  { n: "Retailer Pro", p: "₹499", s: "/month", f: ["Advanced filters", "Early access", "Saved searches", "Contact history"], c: false },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 px-6 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--brand)] mb-3 font-bold">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text)]">Start free. Scale when ready.</h2>
          <p className="mt-4 text-[var(--muted)] text-lg">Payment gateway plug-and-play — abhi sab free me use karo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-3xl p-8 relative bg-white ${p.c ? "border-2 border-indigo-200 shadow-xl shadow-indigo-100" : "border border-[var(--border)] shadow-sm"}`}
            >
              {p.c && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 brand-gradient text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                  Most Popular
                </div>
              )}
              <div className="text-sm text-[var(--muted)] font-semibold">{p.n}</div>
              <div className="mt-4 flex items-end gap-1">
                <div className="text-4xl font-extrabold text-[var(--text)]">{p.p}</div>
                <div className="text-[var(--muted)] pb-1 font-medium">{p.s}</div>
              </div>
              <ul className="mt-6 space-y-3">
                {p.f.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[var(--text)]">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Check size={12} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`mt-8 block text-center py-3 rounded-2xl font-bold ${p.c ? "brand-gradient text-white btn-glow" : "bg-[var(--bg-soft)] text-[var(--text)] hover:bg-indigo-50"}`}>
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
    <section className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] p-14 text-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 shadow-xl shadow-indigo-100/50"
        >
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-200/50 blur-3xl" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-extrabold gradient-text">
              Ready to scale your garment business?
            </h2>
            <p className="mt-6 text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Join India's most trusted B2B garment network. Verified. AI-powered. Built for 3 lakh users.
            </p>
            <Link href="/register" className="mt-10 inline-flex items-center gap-2 brand-gradient text-white px-8 py-4 rounded-2xl font-bold btn-glow">
              Create Free Account <ArrowRight size={18} />
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
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 py-14 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-[var(--text)]">Retailers Club</span>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)] max-w-xs">
            India's AI-powered garment B2B network. Verified manufacturers, real-time trade.
          </p>
        </div>
        {[
          { t: "Product", l: ["Features", "Pricing", "AI Search", "RFQ"] },
          { t: "Company", l: ["About", "Careers", "Blog", "Contact"] },
          { t: "Legal", l: ["Privacy", "Terms", "Security", "Compliance"] },
        ].map((c, i) => (
          <div key={i}>
            <div className="text-sm font-bold mb-4 text-[var(--text)]">{c.t}</div>
            <ul className="space-y-2.5 text-sm text-[var(--muted)]">
              {c.l.map(x => <li key={x}><Link href="#" className="hover:text-[var(--brand)] transition">{x}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)] flex justify-between">
        <div>© 2026 Retailers Club. All rights reserved.</div>
        <div className="font-medium">Made in India 🇮🇳</div>
      </div>
    </footer>
  );
}
EOF

# ---------- Auth pages light ----------
cat > "src/app/(auth)/login/page.tsx" << 'EOF'
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function Login() {
  const [step, setStep] = useState<"phone"|"otp">("phone");
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[var(--bg)]">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 w-full max-w-md relative bg-white"
      >
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-[var(--text)]">Retailers Club</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-center text-[var(--text)]">Welcome back</h1>
        <p className="text-sm text-[var(--muted)] text-center mt-2">
          {step === "phone" ? "Phone number se login karo" : "OTP daalo (demo: 123456)"}
        </p>

        {step === "phone" ? (
          <div className="mt-8 space-y-4">
            <div className="flex items-center bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl px-4">
              <span className="text-[var(--muted)] font-medium">+91</span>
              <input type="tel" placeholder="98765 43210" className="bg-transparent flex-1 px-3 py-3.5 outline-none text-[var(--text)]" />
            </div>
            <button onClick={() => setStep("otp")} className="w-full brand-gradient text-white py-3.5 rounded-2xl font-bold btn-glow">
              Send OTP
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl px-4">
              <input type="text" placeholder="123456" maxLength={6} className="bg-transparent w-full py-3.5 outline-none text-center tracking-[1em] text-lg text-[var(--text)]" />
            </div>
            <button className="w-full brand-gradient text-white py-3.5 rounded-2xl font-bold btn-glow">
              Verify & Login
            </button>
            <button onClick={() => setStep("phone")} className="w-full text-sm text-[var(--muted)] font-medium">
              Change number
            </button>
          </div>
        )}

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          New here? <Link href="/register" className="text-[var(--brand)] font-bold">Create account</Link>
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
import { Sparkles, Building2, Store } from "lucide-react";
import { useState } from "react";

export default function Register() {
  const [role, setRole] = useState<"manufacturer"|"retailer">("retailer");
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden bg-[var(--bg)]">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 w-full max-w-md relative bg-white"
      >
        <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-[var(--text)]">Retailers Club</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-center text-[var(--text)]">Create account</h1>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { k: "retailer", icon: Store, label: "Retailer" },
            { k: "manufacturer", icon: Building2, label: "Manufacturer" },
          ].map((r: any) => (
            <button
              key={r.k}
              onClick={() => setRole(r.k)}
              className={`rounded-2xl p-4 flex flex-col items-center gap-2 transition border-2 ${role === r.k ? "border-indigo-400 bg-indigo-50" : "border-[var(--border)] bg-[var(--bg-soft)]"}`}
            >
              <r.icon size={22} className={role === r.k ? "text-indigo-600" : "text-[var(--muted)]"} />
              <span className="text-sm font-bold text-[var(--text)]">{r.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <input placeholder="Business Name" className="w-full bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl px-4 py-3.5 outline-none text-[var(--text)]" />
          <input placeholder="Phone (+91)" className="w-full bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl px-4 py-3.5 outline-none text-[var(--text)]" />
          <input placeholder="City" className="w-full bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl px-4 py-3.5 outline-none text-[var(--text)]" />
          <button className="w-full brand-gradient text-white py-3.5 rounded-2xl font-bold btn-glow">
            Continue → OTP
          </button>
        </div>

        <p className="text-center text-sm text-[var(--muted)] mt-6">
          Already have an account? <Link href="/login" className="text-[var(--brand)] font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
EOF

# ---------- Dashboard shells (light) ----------
for role in admin manufacturer retailer verification; do
cat > "src/app/(dashboard)/$role/page.tsx" << EOF
export default function ${role^}Dashboard() {
  return (
    <div className="min-h-screen p-8 bg-[var(--bg)]">
      <h1 className="text-3xl font-extrabold capitalize text-[var(--text)]">${role} Dashboard</h1>
      <p className="text-[var(--muted)] mt-2">Skeleton ready — DB + API wiring next phase.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="glass rounded-2xl p-6 h-32 bg-white" />
        ))}
      </div>
    </div>
  );
}
EOF
done

echo ""
echo "======================================================"
echo "  ✅ Light theme applied successfully!"
echo "======================================================"
echo ""
echo "  Run:  npm run dev"
echo "  Open: http://localhost:3000"
echo ""
echo "  Font:   Plus Jakarta Sans"
echo "  Theme:  Soft Cream / White + Indigo–Pink–Amber accents"
echo "======================================================"