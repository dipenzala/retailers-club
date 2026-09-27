"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Truck, Users, TrendingUp, Award, Zap, Star, Heart, ShoppingBag, Sparkles, MapPin, Play, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { name: "Women's Wear", slug: "womens-wear", icon: "👗", count: "45,000+", color: "from-pink-50 to-rose-50", emoji: "👗" },
  { name: "Men's Wear", slug: "mens-wear", icon: "👔", count: "38,000+", color: "from-blue-50 to-indigo-50", emoji: "👔" },
  { name: "Kids Wear", slug: "kids-wear", icon: "🧒", count: "18,000+", color: "from-yellow-50 to-amber-50", emoji: "🧒" },
  { name: "Ethnic Wear", slug: "ethnic-wear", icon: "🪔", count: "32,000+", color: "from-orange-50 to-red-50", emoji: "🪔" },
  { name: "Winter Wear", slug: "winter-wear", icon: "🧥", count: "12,000+", color: "from-cyan-50 to-blue-50", emoji: "🧥" },
  { name: "Sports Wear", slug: "sports-wear", icon: "⚽", count: "9,000+", color: "from-green-50 to-emerald-50", emoji: "⚽" },
  { name: "Accessories", slug: "accessories", icon: "👜", count: "22,000+", color: "from-purple-50 to-fuchsia-50", emoji: "👜" },
  { name: "Innerwear", slug: "innerwear", icon: "👕", count: "15,000+", color: "from-slate-50 to-gray-50", emoji: "👕" },
];

const STATS = [
  { v: "1,00,000+", l: "Products Listed", i: ShoppingBag },
  { v: "10,000+", l: "Verified Manufacturers", i: ShieldCheck },
  { v: "50,000+", l: "Active Retailers", i: Users },
  { v: "28", l: "States Covered", i: MapPin },
];

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<any>({});
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sb = createClient();
    sb.from("products").select("*").order("created_at", { ascending: false }).limit(8)
      .then(({ data }) => setFeaturedProducts(data || []));
    sb.from("products").select("category").then(({ data }) => {
      const counts: any = {};
      data?.forEach((p: any) => { counts[p.category] = (counts[p.category] || 0) + 1; });
      setCategoryCounts(counts);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
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
            <Link href="/login" className="hidden md:block text-[13px] font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">Login</Link>
            <Link href="/register" className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-[#262626]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-5">
        {/* Gradient bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl" />
          <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/40 to-amber-200/40 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-[#6B6B6B]">India's Largest Garment B2B Network</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-[2.5rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Garment Business,<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Nationwide.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-6 text-[15px] md:text-[17px] text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
            India bhar ke verified manufacturers aur retailers ko ek hi platform pe laao. AI-powered search, real-time chat, aur Pan-India delivery.
          </motion.p>

          {/* SEARCH BAR */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="mt-10 max-w-2xl mx-auto">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl shadow-lg shadow-black/5 p-2 flex items-center gap-2">
              <Search size={18} className="text-[#6B6B6B] ml-3" />
              <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search: kurti, saree, jeans, t-shirt..."
                className="flex-1 outline-none text-[14px] py-3" />
              <Link href={`/search?q=${encodeURIComponent(searchQ)}`} className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#262626]">
                Search
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {["Cotton Kurti","Denim Jeans","Silk Saree","Kids T-Shirt","Lehenga"].map((t) => (
                <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                  className="bg-white border border-[#E7E5E4] text-[12px] font-medium text-[#6B6B6B] px-3 py-1.5 rounded-full hover:border-[#0A0A0A] hover:text-[#0A0A0A]">
                  {t}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register?role=manufacturer" className="bg-[#0A0A0A] text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-[#262626] flex items-center justify-center gap-2">
              I'm a Manufacturer <ArrowRight size={16} />
            </Link>
            <Link href="/register?role=retailer" className="bg-white border-2 border-[#0A0A0A] text-[#0A0A0A] font-semibold px-7 py-3.5 rounded-2xl hover:bg-[#FAFAF9] flex items-center justify-center gap-2">
              I'm a Retailer
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#E7E5E4] py-10 px-5 bg-[#FAFAF9]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center">
              <s.i size={20} className="mx-auto text-[#B8894A]" />
              <div className="mt-3 text-[1.5rem] md:text-[2rem] font-extrabold tracking-tight">{s.v}</div>
              <div className="text-[11px] md:text-[12px] text-[#6B6B6B] font-medium mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Browse Categories</div>
            <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Shop by Category</h2>
            <p className="mt-3 text-[14px] md:text-[15px] text-[#6B6B6B]">Har category me hazaaron verified manufacturers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c, i) => (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/search?category=${c.slug}`}>
                  <div className={`group relative bg-gradient-to-br ${c.color} border border-[#E7E5E4] rounded-2xl p-5 hover:shadow-lg transition cursor-pointer h-full`}>
                    <div className="text-[3rem] mb-3">{c.emoji}</div>
                    <div className="text-[15px] font-bold">{c.name}</div>
                    <div className="text-[12px] text-[#6B6B6B] mt-1">{categoryCounts[c.name] || c.count} products</div>
                    <ArrowRight size={16} className="absolute top-5 right-5 text-[#6B6B6B] group-hover:translate-x-1 group-hover:text-[#0A0A0A] transition" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section id="featured" className="py-20 px-5 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Trending</div>
              <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Featured Products</h2>
              <p className="mt-3 text-[14px] md:text-[15px] text-[#6B6B6B]">Recently added by verified manufacturers</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.05 }}>
                  <Link href={`/p/${p.id}`}>
                    <div className="bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden hover:shadow-lg transition group">
                      <div className="aspect-square bg-[#FAFAF9] relative overflow-hidden">
                        {p.media_urls?.[0] ? (
                          <img src={p.media_urls[0]} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9B9B9B]">No image</div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-[10px] font-bold">
                          {p.category || "New"}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-[12px] md:text-[13px] font-bold line-clamp-2 leading-snug">{p.title}</div>
                        <div className="mt-2 flex items-baseline justify-between">
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
              <Link href="/search" className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-semibold px-6 py-3 rounded-2xl hover:bg-[#262626]">
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
              { i: Zap, t: "AI-Powered Search", d: "Natural language me search karo — 'Ahmedabad me ₹300 wali kurti' — AI samjhega." },
              { i: Truck, t: "Pan-India Delivery", d: "28 states, 500+ cities. Har pin code pe deliver." },
              { i: Users, t: "Direct Manufacturer", d: "Beech me koi agent nahi. Manufacturer se seedha deal karo." },
              { i: Award, t: "Trust Score", d: "Response time, ratings, order history — sab visible." },
              { i: TrendingUp, t: "Business Growth", d: "Analytics, trend insights, aur demand prediction tools." },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white border border-[#E7E5E4] rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-11 h-11 rounded-xl bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center">
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
      <section id="how" className="py-20 px-5 bg-[#FAFAF9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[0.2em] text-[#B8894A] uppercase mb-3">Simple Process</div>
            <h2 className="text-[2rem] md:text-[2.75rem] font-extrabold tracking-[-0.02em]">Sign up to First Deal in 24 Hours</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { n: "01", t: "Sign Up", d: "Business details, category, location" },
              { n: "02", t: "Verify", d: "GST, PAN, MSME upload karo" },
              { n: "03", t: "Post / Browse", d: "Products upload karo ya search karo" },
              { n: "04", t: "Chat & Deal", d: "Direct chat, RFQ, order confirm" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-[3rem] font-extrabold text-[#E7E5E4] leading-none">{s.n}</div>
                <div className="mt-3 text-[15px] font-bold">{s.t}</div>
                <div className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
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
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="bg-white text-[#0A0A0A] font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/90">
                  Get Started Free
                </Link>
                <Link href="/login" className="bg-white/10 backdrop-blur text-white font-semibold px-7 py-3.5 rounded-2xl border border-white/20 hover:bg-white/20">
                  Login
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-[12px] text-white/60">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> 7-day free boost</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Instant setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E7E5E4] py-12 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center"><span className="text-white text-sm font-bold">R</span></div>
                <span className="font-extrabold text-[14px]">Retailers Club</span>
              </div>
              <p className="mt-4 text-[13px] text-[#6B6B6B] max-w-xs leading-relaxed">
                India's largest B2B garment marketplace. Connecting verified manufacturers and retailers nationwide.
              </p>
              <div className="mt-4 flex gap-2">
                {["Instagram","Facebook","LinkedIn","YouTube"].map((s) => (
                  <div key={s} className="w-8 h-8 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center text-[11px] font-bold">
                    {s[0]}
                  </div>
                ))}
              </div>
            </div>
            {[
              { t: "Categories", l: ["Women's Wear","Men's Wear","Kids Wear","Ethnic Wear"] },
              { t: "Company", l: ["About Us","Careers","Blog","Press"] },
              { t: "Support", l: ["Help Center","Contact","FAQ","Report"] },
            ].map((c, i) => (
              <div key={i}>
                <div className="text-[12px] font-bold mb-4 uppercase tracking-wider text-[#0A0A0A]">{c.t}</div>
                <ul className="space-y-2.5 text-[13px] text-[#6B6B6B]">
                  {c.l.map((x) => <li key={x}><Link href="#" className="hover:text-[#0A0A0A]">{x}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-[#E7E5E4] flex flex-col md:flex-row justify-between gap-3 text-[12px] text-[#6B6B6B]">
            <div>© 2026 Retailers Club. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Sitemap</Link>
            </div>
            <div>Made in India 🇮🇳</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
