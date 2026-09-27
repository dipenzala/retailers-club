"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATS = [
  { name: "Women's Wear", sub: ["Kurtis", "Sarees", "Tops", "Dresses", "Lehengas"], emoji: "👗", color: "from-pink-100 to-rose-100" },
  { name: "Men's Wear", sub: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Kurta"], emoji: "👔", color: "from-blue-100 to-indigo-100" },
  { name: "Kids Wear", sub: ["Boys", "Girls", "Newborn", "Party Wear"], emoji: "🧒", color: "from-yellow-100 to-amber-100" },
  { name: "Ethnic Wear", sub: ["Lehenga", "Sherwani", "Salwar Suit", "Sarees"], emoji: "🪔", color: "from-orange-100 to-red-100" },
  { name: "Winter Wear", sub: ["Jackets", "Sweaters", "Hoodies", "Coats"], emoji: "🧥", color: "from-cyan-100 to-blue-100" },
  { name: "Sports Wear", sub: ["Track Pants", "Jerseys", "Gym Wear"], emoji: "⚽", color: "from-green-100 to-emerald-100" },
  { name: "Accessories", sub: ["Bags", "Dupattas", "Belts", "Jewellery"], emoji: "👜", color: "from-purple-100 to-fuchsia-100" },
  { name: "Innerwear", sub: ["Vests", "Briefs", "Lingerie", "Socks"], emoji: "👕", color: "from-slate-100 to-gray-100" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="bg-white border-b border-[#E7E5E4] py-12 px-5">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-[13px] text-[#6B6B6B]">← Back to Home</Link>
          <h1 className="text-[2rem] md:text-[2.5rem] font-extrabold mt-4">Browse All Categories</h1>
          <p className="text-[14px] text-[#6B6B6B] mt-2">Har category me verified manufacturers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATS.map((c) => (
          <Link key={c.name} href={`/search?category=${encodeURIComponent(c.name)}`}
            className={`block bg-gradient-to-br ${c.color} border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group`}>
            <div className="flex items-start justify-between">
              <div className="text-[3rem]">{c.emoji}</div>
              <ArrowRight size={18} className="text-[#6B6B6B] group-hover:translate-x-1 group-hover:text-[#0A0A0A] transition" />
            </div>
            <div className="mt-4 text-[17px] font-bold">{c.name}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.sub.map((s) => (
                <span key={s} className="text-[11px] bg-white/70 backdrop-blur px-2 py-0.5 rounded-full font-medium">
                  {s}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
