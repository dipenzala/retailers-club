"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Users, MapPin, ShoppingBag, Star, CheckCircle2, Play, TrendingUp, Award, Zap, MessageCircle, Video, TrendingDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const [showExit, setShowExit] = useState(false);
  const [exitDismissed, setExitDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);

    // Live user count
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(800, prev + Math.floor(Math.random() * 30) - 15));
    }, 3000);

    // Exit intent
    const handleExit = (e: MouseEvent) => {
      if (e.clientY < 10 && !exitDismissed && !localStorage.getItem("exit_dismissed")) {
        setShowExit(true);
      }
    };
    document.addEventListener("mouseleave", handleExit);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
      document.removeEventListener("mouseleave", handleExit);
    };
  }, [exitDismissed]);

  useEffect(() => {
    const sb = createClient();
    sb.from("products").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setFeatured(data || []));
    sb.from("profiles").select("business_name, city, created_at").order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => setActivities((data || []).map((p: any, i) => ({
        name: p.business_name || "User", city: p.city || "India",
        msg: "joined Retailers Club", time: i === 0 ? "2 min ago" : i === 1 ? "5 min ago" : i === 2 ? "12 min ago" : i === 3 ? "1 hr ago" : "2 hr ago",
      }))));
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Exit Intent Popup */}
      {showExit && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setShowExit(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setShowExit(false); setExitDismissed(true); localStorage.setItem("exit_dismissed", "1"); }} className="absolute top-4 right-4 text-[#9B9B9B] hover:text-[#0A0A0A]">✕</button>
            <div className="text-center">
              <div className="text-[3rem]">🎁</div>
              <h3 className="text-[1.5rem] font-extrabold mt-2">Ruko! Ek second</h3>
              <p className="text-[13px] text-[#6B6B6B] mt-2">Register karo aur paao:</p>
              <ul className="mt-4 space-y-2 text-left">
                {["7-day free Boost trial", "Free verification (worth ₹999)", "First order pe 5% cashback"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px]"><CheckCircle2 size={14} className="text-emerald-600" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" onClick={() => { setShowExit(false); setExitDismissed(true); localStorage.setItem("exit_dismissed", "1"); }}
                className="mt-6 inline-block bg-[#0A0A0A] text-white font-semibold px-6 py-3 rounded-xl w-full text-center">
                Claim Free Now →
              </Link>
              <button onClick={() => { setShowExit(false); setExitDismissed(true); localStorage.setItem("exit_dismissed", "1"); }}
                className="mt-3 text-[12px] text-[#6B6B6B]">No thanks, I'll pay later</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrollY > 20 ? "bg-white/95 backdrop-blur shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">Retailers Club</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#6B6B6B]">
            <a href="#categories" className="hover:text-[#0A0A0A]">Categories</a>
            <a href="#featured" className="hover:text-[#0A0A0A]">Featured</a>
            <a href="#why" className="hover:text-[#0A0A0A]">Why Us</a>
            <a href="#how" className="hover:text-[#0A0A0A]">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-[13px] font-semibold text-[#6B6B6B]">Login</Link>
            <Link href="/register" className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2 rounded-xl">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/40 to-amber-200/40 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] font-semibold text-[#6B6B6B]">{onlineUsers.toLocaleString("en-IN")} users online now</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.05] tracking-[-0.03em]">
                Garment Business,<br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Nationwide.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="mt-6 text-[15px] md:text-[17px] text-[#6B6B6B] max-w-lg leading-relaxed">
                India bhar ke verified manufacturers aur retailers ko ek platform pe laao. AI-powered search, real-time chat, secure orders.
              </motion.p>

              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="mt-8 max-w-lg">
                <div className="bg-white border border-[#E7E5E4] rounded-2xl shadow-lg shadow-black/5 p-1.5 flex items-center gap-1">
                  <Search size={18} className="text-[#6B6B6B] ml-3" />
                  <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search: kurti, saree, jeans..." className="flex-1 outline-none text-[14px] py-3" />
                  <Link href={`/search?q=${encodeURIComponent(searchQ)}`}
                    className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl">Go</Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Cotton Kurti", "Denim Jeans", "Silk Saree", "Kids"].map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                      className="bg-white border text-[11px] font-medium text-[#6B6B6B] px-2.5 py-1 rounded-full hover:border-[#0A0A0A]">
                      {t}
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/register?role=manufacturer" className="bg-[#0A0A0A] text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2">
                  I'm a Manufacturer <ArrowRight size={16} />
                </Link>
                <Link href="/register?role=retailer" className="bg-white border-2 border-[#0A0A0A] font-semibold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2">
                  I'm a Retailer
                </Link>
              </motion.div>
            </div>

            {/* Product Collage */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="relative h-[400px] lg:h-[500px] hidden lg:block">
              <div className="absolute top-0 right-0 w-[240px] h-[300px] rounded-3xl overflow-hidden shadow-2xl rotate-6">
                {featured[0]?.media_urls?.[0] ? <img src={featured[0].media_urls[0]} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300" />}
              </div>
              <div className="absolute top-20 left-0 w-[220px] h-[280px] rounded-3xl overflow-hidden shadow-2xl -rotate-6">
                {featured[1]?.media_urls?.[0] ? <img src={featured[1].media_urls[0]} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-indigo-300" />}
              </div>
              <div className="absolute bottom-0 right-10 w-[200px] h-[260px] rounded-3xl overflow-hidden shadow-2xl rotate-3">
                {featured[2]?.media_urls?.[0] ? <img src={featured[2].media_urls[0]} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300" />}
              </div>
              <div className="absolute bottom-20 left-10 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold">GST Verified</div>
                  <div className="text-[10px] text-[#6B6B6B]">10,000+ sellers</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-[#E7E5E4] py-6 px-5 bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 md:gap-12 text-[12px] font-semibold text-[#6B6B6B]">
          <div className="flex items-center gap-2"><Star size={14} className="fill-yellow-400 text-yellow-400" /> <span className="text-[#0A0A0A]">4.8/5</span> from 12,000+ businesses</div>
          <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-600" /> 100% GST Verified</div>
          <div className="flex items-center gap-2"><Award size={14} className="text-[#B8894A]" /> India's Fastest Growing B2B</div>
          <div className="flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> 24hr Average Response</div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: "1,00,000+", l: "Products Listed", i: ShoppingBag },
            { v: "10,000+", l: "Verified Manufacturers", i: ShieldCheck },
            { v: "50,000+", l: "Active Retailers", i: Users },
            { v: "28", l: "States Covered", i: MapPin },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <s.i size={20} className="mx-auto text-[#B8894A]" />
              <div className="mt-3 text-[1.5rem] md:text-[2rem] font-extrabold tracking-tight">{s.v}</div>
              <div className="text-[11px] md:text-[12px] text-[#6B6B6B] font-medium mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LIVE ACTIVITY */}
      {activities.length > 0 && (
        <section className="py-8 px-5 bg-[#FAFAF9] border-y">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Live Activity</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {activities.slice(0, 5).map((a, i) => (
                <div key={i} className="bg-white border rounded-xl p-3">
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
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/search?category=${c.slug}`}>
                  <div className={`group bg-gradient-to-br ${c.color} border border-[#E7E5E4] rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer`}>
                    <div className="text-[2.5rem]">{c.emoji}</div>
                    <div className="text-[14px] font-bold mt-3">{c.name}</div>
                    <ArrowRight size={14} className="mt-2 text-[#6B6B6B] group-hover:translate-x-1 group-hover:text-[#0A0A0A] transition" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section id="featured" className="py-20 px-5 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Trending</div>
              <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Featured Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }}>
                  <Link href={`/p/${p.id}`}>
                    <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition group">
                      <div className="aspect-square bg-[#FAFAF9] relative overflow-hidden">
                        {p.media_urls?.[0] ? <img src={p.media_urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /> :
                          <div className="w-full h-full flex items-center justify-center text-[#9B9B9B]">No image</div>}
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-[10px] font-bold">{p.category || "New"}</div>
                      </div>
                      <div className="p-3">
                        <div className="text-[12px] font-bold line-clamp-2">{p.title}</div>
                        <div className="mt-2 flex justify-between">
                          <div className="text-[15px] font-extrabold">₹{p.price}</div>
                          <div className="text-[10px] text-[#6B6B6B] self-end">MOQ {p.moq}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEO TESTIMONIALS */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Success Stories</div>
            <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Businesses Jo Grow Kar Rahe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { n: "Rakesh Kumar", c: "Retailer, Jaipur", q: "3 din me verified manufacturers mile. Pehle mahine me 40 orders aaye.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
              { n: "Priya Sharma", c: "Manufacturer, Surat", q: "AI upload ne 200 products 2 ghante me list kar diye. 3x sales badhi.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
              { n: "Amit Patel", c: "Wholesaler, Ludhiana", q: "Real-time chat aur RFQ system ne sales cycle 60% kam kar diya.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition">
                <div className="aspect-video bg-gradient-to-br from-[#FAFAF9] to-[#E7E5E4] relative">
                  <img src={t.img} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={20} className="ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[13px] leading-relaxed">"{t.q}"</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white text-[13px] font-bold">{t.n[0]}</div>
                    <div>
                      <div className="text-[13px] font-bold">{t.n}</div>
                      <div className="text-[11px] text-[#6B6B6B]">{t.c}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 px-5 bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Why Retailers Club</div>
            <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Built for Indian Garment Trade</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { i: ShieldCheck, t: "GST Verified Sellers", d: "Har seller ka GST, PAN, MSME manually verify hota hai." },
              { i: Zap, t: "AI-Powered Search", d: "'Ahmedabad me ₹300 wali kurti' — AI samjhega." },
              { i: MessageCircle, t: "Direct Chat", d: "Beech me koi agent nahi. Seedha deal karo." },
              { i: Video, t: "Video Product Viewing", d: "Product video call pe dekho, order confirm karo." },
              { i: TrendingUp, t: "Business Analytics", d: "Views, orders, trends — sab dashboard me." },
              { i: Award, t: "Trust Score", d: "Response time, ratings, order history visible." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
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
              { n: "01", t: "Sign Up", d: "Sahi phone number + OTP (10 sec)" },
              { n: "02", t: "Verify", d: "GST, PAN, MSME upload" },
              { n: "03", t: "Post / Browse", d: "Products upload karo ya search" },
              { n: "04", t: "Chat & Deal", d: "Direct chat, RFQ, order confirm" },
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
      <section className="py-20 px-5 bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0A0A0A] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
            <div className="relative">
              <h2 className="text-[2rem] md:text-[3rem] font-extrabold text-white tracking-[-0.02em] leading-tight">
                Ready to grow your<br />garment business?
              </h2>
              <p className="mt-5 text-white/60 text-[15px] max-w-md mx-auto">
                Join 60,000+ businesses already trading on Retailers Club.
              </p>
              <Link href="/register" className="mt-8 inline-block bg-white text-[#0A0A0A] font-semibold px-8 py-4 rounded-2xl">
                Get Started Free →
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

      {/* FOOTER */}
      <footer className="border-t py-12 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center"><span className="text-white text-sm font-bold">R</span></div>
                <span className="font-extrabold text-[14px]">Retailers Club</span>
              </div>
              <p className="mt-4 text-[13px] text-[#6B6B6B] max-w-xs leading-relaxed">
                India's largest B2B garment marketplace.
              </p>
              <div className="mt-4 flex gap-2">
                {["Instagram","Facebook","LinkedIn","YouTube"].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-lg bg-[#FAFAF9] border flex items-center justify-center text-[11px] font-bold">{s[0]}</div>
                ))}
              </div>
            </div>
            {[
              { t: "Categories", l: ["Women's Wear","Men's Wear","Kids Wear","Ethnic Wear"] },
              { t: "Company", l: ["About Us","Careers","Blog","Press"] },
              { t: "Support", l: ["Help Center","Contact","FAQ","Report"] },
            ].map((c, i) => (
              <div key={i}>
                <div className="text-[12px] font-bold mb-4 uppercase tracking-wider">{c.t}</div>
                <ul className="space-y-2.5 text-[13px] text-[#6B6B6B]">
                  {c.l.map((x) => <li key={x}><Link href="#" className="hover:text-[#0A0A0A]">{x}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between gap-3 text-[12px] text-[#6B6B6B]">
            <div>© 2026 Retailers Club. All rights reserved.</div>
            <div className="flex gap-4"><Link href="#">Privacy</Link><Link href="#">Terms</Link></div>
            <div>Made in India 🇮🇳</div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support */}
      <a href="https://wa.me/919999999999?text=Hi%20Retailers%20Club" target="_blank"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-110 transition">
        <MessageCircle size={24} className="text-white fill-white" />
      </a>
    </div>
  );
}
