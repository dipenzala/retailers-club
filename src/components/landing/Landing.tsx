"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Search, ShieldCheck, Users, MapPin, ShoppingBag, Star,
  CheckCircle2, Play, TrendingUp, Award, Zap, MessageCircle, Video, ArrowUpRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AnimatedBackground from "./AnimatedBackground";

const CATEGORIES = [
  { name: "Women's Wear", slug: "womens-wear", emoji: "👗", color: "from-pink-100 to-rose-100" },
  { name: "Men's Wear", slug: "mens-wear", emoji: "👔", color: "from-blue-100 to-indigo-100" },
  { name: "Kids Wear", slug: "kids-wear", emoji: "🧒", color: "from-yellow-100 to-amber-100" },
  { name: "Ethnic Wear", slug: "ethnic-wear", emoji: "🪔", color: "from-orange-100 to-red-100" },
  { name: "Winter Wear", slug: "winter-wear", emoji: "🧥", color: "from-cyan-100 to-blue-100" },
  { name: "Sports Wear", slug: "sports-wear", emoji: "⚽", color: "from-green-100 to-emerald-100" },
  { name: "Accessories", slug: "accessories", emoji: "👜", color: "from-purple-100 to-fuchsia-100" },
  { name: "Innerwear", slug: "innerwear", emoji: "👕", color: "from-slate-100 to-gray-100" },
];

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [featured, setFeatured] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const [searchQ, setSearchQ] = useState("");
  const [exitShown, setExitShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setInterval(() => {
      setOnlineUsers((prev) => Math.max(900, prev + Math.floor(Math.random() * 20) - 10));
    }, 3500);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    const sb = createClient();
    sb.from("products").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setFeatured(data || []));
    sb.from("profiles").select("business_name, city, created_at")
      .order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setActivities((data || []).map((p: any, i) => ({
        name: p.business_name || "User",
        city: p.city || "India",
        time: ["2 min ago", "5 min ago", "12 min ago", "1 hr ago", "2 hr ago"][i] || "recently",
      }))));
  }, []);

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen relative">
        {/* NAV */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20 ? "bg-white/85 backdrop-blur-xl shadow-sm border-b border-[#E7E5E4]" : "bg-transparent"}`}>
          <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="font-extrabold text-[15px] tracking-tight">Retailers Club</span>
            </Link>

            <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#6B6B6B]">
              <Link href="/categories" className="hover:text-[#0A0A0A] transition">Categories</Link>
              <Link href="/search" className="hover:text-[#0A0A0A] transition">Browse</Link>
              <Link href="/about" className="hover:text-[#0A0A0A] transition">Why Us</Link>
              <Link href="/help" className="hover:text-[#0A0A0A] transition">How it Works</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:block text-[13px] font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition">Login</Link>
              <Link href="/register" className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#262626] transition">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-5">
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-[#E7E5E4] rounded-full px-4 py-1.5 mb-6 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[12px] font-semibold text-[#0A0A0A]">
                    {onlineUsers.toLocaleString("en-IN")} businesses online now
                  </span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  className="text-[2.5rem] md:text-[3.75rem] lg:text-[4.25rem] font-extrabold leading-[1.02] tracking-[-0.035em]">
                  India's Garment<br />
                  Business{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Network.
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                      <path d="M2 6C50 2 150 2 198 6" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="200" y2="0">
                          <stop stopColor="#6366f1" />
                          <stop offset="0.5" stopColor="#a855f7" />
                          <stop offset="1" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="mt-8 text-[15px] md:text-[17px] text-[#6B6B6B] max-w-lg leading-relaxed">
                  Verified manufacturers se direct deal karo. AI-powered search, real-time chat,
                  secure orders — India bhar me.
                </motion.p>

                {/* Search */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="mt-8 max-w-xl">
                  <form
                    onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${encodeURIComponent(searchQ)}`; }}
                    className="bg-white border border-[#E7E5E4] rounded-2xl shadow-lg shadow-black/5 p-1.5 flex items-center gap-1"
                  >
                    <Search size={18} className="text-[#6B6B6B] ml-3" />
                    <input
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      placeholder="Search: kurti, saree, jeans, t-shirt..."
                      className="flex-1 outline-none text-[14px] py-3 bg-transparent"
                    />
                    <button type="submit" className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl hover:bg-[#262626] transition">
                      Search
                    </button>
                  </form>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      { l: "Cotton Kurti", q: "kurti" },
                      { l: "Denim Jeans", q: "jeans" },
                      { l: "Silk Saree", q: "saree" },
                      { l: "Kids Wear", q: "kids" },
                    ].map((t) => (
                      <Link key={t.l} href={`/search?q=${encodeURIComponent(t.q)}`}
                        className="bg-white/80 backdrop-blur border text-[11px] font-medium text-[#6B6B6B] px-2.5 py-1 rounded-full hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition">
                        {t.l}
                      </Link>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                  className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link href="/register?role=manufacturer"
                    className="group bg-[#0A0A0A] text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#262626] transition shadow-lg shadow-black/10">
                    I'm a Manufacturer
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
                  </Link>
                  <Link href="/register?role=retailer"
                    className="bg-white border-2 border-[#0A0A0A] font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#FAFAF9] transition">
                    I'm a Retailer
                  </Link>
                </motion.div>

                {/* Trust chips */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[#6B6B6B]">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> No credit card</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Free verification</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> 7-day boost trial</span>
                </motion.div>
              </div>

              {/* Right — Product collage */}
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                className="relative h-[440px] lg:h-[540px] hidden lg:block">
                {/* Card 1 — back */}
                <div className="absolute top-0 right-0 w-[260px] h-[330px] rounded-3xl overflow-hidden shadow-2xl rotate-6 border-4 border-white">
                  {featured[0]?.media_urls?.[0] ? (
                    <img src={featured[0].media_urls[0]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300" />
                  )}
                </div>

                {/* Card 2 — left */}
                <div className="absolute top-24 left-0 w-[240px] h-[300px] rounded-3xl overflow-hidden shadow-2xl -rotate-6 border-4 border-white">
                  {featured[1]?.media_urls?.[0] ? (
                    <img src={featured[1].media_urls[0]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300" />
                  )}
                </div>

                {/* Card 3 — front */}
                <div className="absolute bottom-0 right-16 w-[220px] h-[280px] rounded-3xl overflow-hidden shadow-2xl rotate-2 border-4 border-white">
                  {featured[2]?.media_urls?.[0] ? (
                    <img src={featured[2].media_urls[0]} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300" />
                  )}
                </div>

                {/* Floating chip — Verified */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  className="absolute bottom-24 left-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-10 border">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold">GST Verified</div>
                    <div className="text-[10px] text-[#6B6B6B]">10,000+ sellers</div>
                  </div>
                </motion.div>

                {/* Floating chip — Rating */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
                  className="absolute top-8 right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 z-10 border">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <div>
                    <div className="text-[11px] font-bold">4.8/5</div>
                    <div className="text-[10px] text-[#6B6B6B]">12K+ reviews</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="relative py-6 px-5">
          <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur border border-[#E7E5E4] rounded-2xl px-6 py-4 flex flex-wrap justify-center gap-6 md:gap-12 text-[12px] font-semibold text-[#6B6B6B]">
            <div className="flex items-center gap-2"><Star size={14} className="fill-yellow-400 text-yellow-400" /> <span className="text-[#0A0A0A]">4.8/5</span> from 12,000+ businesses</div>
            <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-600" /> 100% GST Verified</div>
            <div className="flex items-center gap-2"><Award size={14} className="text-[#B8894A]" /> India's Fastest Growing B2B</div>
            <div className="flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> 24hr Response</div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-14 px-5">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: "1,00,000+", l: "Products Listed", i: ShoppingBag },
              { v: "10,000+", l: "Verified Manufacturers", i: ShieldCheck },
              { v: "50,000+", l: "Active Retailers", i: Users },
              { v: "28", l: "States Covered", i: MapPin },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center">
                <div className="w-11 h-11 mx-auto rounded-xl bg-white border flex items-center justify-center shadow-sm">
                  <s.i size={18} className="text-[#B8894A]" />
                </div>
                <div className="mt-3 text-[1.5rem] md:text-[2rem] font-extrabold tracking-tight">{s.v}</div>
                <div className="text-[11px] md:text-[12px] text-[#6B6B6B] font-medium mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LIVE ACTIVITY */}
        {activities.length > 0 && (
          <section className="py-10 px-5">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Live Activity</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {activities.slice(0, 5).map((a, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur border rounded-xl p-3">
                    <div className="text-[12px] font-bold truncate">{a.name}</div>
                    <div className="text-[10px] text-[#6B6B6B] truncate">{a.city}</div>
                    <div className="text-[10px] text-emerald-600 mt-1">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CATEGORIES */}
        <section id="categories" className="py-20 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Browse Categories</div>
              <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Shop by Category</h2>
              <p className="mt-3 text-[14px] text-[#6B6B6B]">Har category me hazaaron verified manufacturers</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((c, i) => (
                <motion.div key={c.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/search?category=${encodeURIComponent(c.name)}`}>
                    <div className={`group relative bg-gradient-to-br ${c.color} border border-[#E7E5E4] rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                        <ArrowUpRight size={16} className="text-[#0A0A0A]" />
                      </div>
                      <div className="text-[2.5rem] group-hover:scale-110 transition-transform duration-300">{c.emoji}</div>
                      <div className="text-[14px] font-bold mt-3">{c.name}</div>
                      <div className="text-[11px] text-[#6B6B6B] mt-1">Explore products</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED */}
        {featured.length > 0 && (
          <section id="featured" className="py-20 px-5">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Trending</div>
                <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Featured Products</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }}>
                    <Link href={`/p/${p.id}`}>
                      <div className="bg-white/85 backdrop-blur border rounded-2xl overflow-hidden hover:shadow-xl transition group">
                        <div className="aspect-square bg-[#FAFAF9] relative overflow-hidden">
                          {p.media_urls?.[0] ? (
                            <img src={p.media_urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={p.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9B9B9B]">No image</div>
                          )}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-[10px] font-bold">
                            {p.category || "New"}
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="text-[12px] font-bold line-clamp-2 leading-snug">{p.title}</div>
                          <div className="mt-2 flex justify-between items-baseline">
                            <div className="text-[15px] font-extrabold">₹{p.price}</div>
                            <div className="text-[10px] text-[#6B6B6B]">MOQ {p.moq}</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link href="/search" className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-semibold px-6 py-3 rounded-2xl hover:bg-[#262626] transition">
                  View All Products <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* WHY US */}
        <section id="why" className="py-20 px-5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Why Retailers Club</div>
              <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Built for Indian Garment Trade</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { i: ShieldCheck, t: "GST Verified Sellers", d: "Har seller ka GST, PAN, MSME manually verify hota hai. Fake sellers zero tolerance." },
                { i: Zap, t: "AI-Powered Search", d: "'Ahmedabad me ₹300 wali kurti' — AI samjhega aur exact results dega." },
                { i: MessageCircle, t: "Direct Chat", d: "Beech me koi agent nahi. Manufacturer se seedha deal karo." },
                { i: Video, t: "Video Product Viewing", d: "Product video call pe dekho, order confirm karo." },
                { i: TrendingUp, t: "Business Analytics", d: "Views, orders, trends — sab dashboard me." },
                { i: Award, t: "Trust Score", d: "Response time, ratings, order history visible." },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="bg-white/85 backdrop-blur border rounded-2xl p-6 hover:shadow-lg transition">
                  <div className="w-11 h-11 rounded-xl bg-[#FAFAF9] border flex items-center justify-center">
                    <f.i size={20} className="text-[#B8894A]" />
                  </div>
                  <div className="mt-4 text-[15px] font-bold">{f.t}</div>
                  <div className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">{f.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Simple Process</div>
              <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">First Deal in 24 Hours</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { n: "01", t: "Sign Up", d: "Phone + OTP (10 sec)" },
                { n: "02", t: "Verify", d: "GST, PAN, MSME upload" },
                { n: "03", t: "Post / Browse", d: "Products upload ya search" },
                { n: "04", t: "Chat & Deal", d: "Direct chat, order confirm" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="text-[3rem] font-extrabold text-[#E7E5E4] leading-none">{s.n}</div>
                  <div className="mt-3 text-[15px] font-bold">{s.t}</div>
                  <div className="mt-2 text-[13px] text-[#6B6B6B]">{s.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-5">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-[#0A0A0A] rounded-3xl p-10 md:p-16 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl" />
              <div className="relative">
                <h2 className="text-[2rem] md:text-[3rem] font-extrabold text-white tracking-[-0.02em] leading-tight">
                  Ready to grow your<br />garment business?
                </h2>
                <p className="mt-5 text-white/60 text-[15px] max-w-md mx-auto">
                  Join 60,000+ businesses already trading on Retailers Club.
                </p>
                <Link href="/register" className="mt-8 inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition">
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-[12px] text-white/60">
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> No credit card</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Free verification</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> 7-day boost trial</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919999999999?text=Hi%20Retailers%20Club" target="_blank" rel="noopener"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
        <MessageCircle size={24} className="text-white fill-white" />
      </a>
    </>
  );
}
