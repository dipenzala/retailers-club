import PageHero from "@/components/public/PageHero";
import Link from "next/link";

const POSTS = [
  { c: "Industry", t: "2026 Garment Trends: Kya Chal Raha Hai", e: "Summer collections me pastel shades, sustainability, aur AI-designed prints. Full breakdown.", d: "12 Feb 2026", r: "5 min read" },
  { c: "Business", t: "B2B Marketplace Se Sales 3x Kaise Badhayein", e: "Verified badge, quick response, aur quality photos — 3 cheezein jo sales 3x badha deti hain.", d: "08 Feb 2026", r: "7 min read" },
  { c: "Verification", t: "GST Verification: Complete Guide", e: "GST certificate upload karne se lekar verified badge milne tak ka pura process.", d: "02 Feb 2026", r: "4 min read" },
  { c: "Technology", t: "AI Se Product Upload 10x Fast", e: "Photo daalo, AI 30 second me listing ready kar dega. Kaise karein?", d: "28 Jan 2026", r: "3 min read" },
  { c: "Success Story", t: "Surat Manufacturer Ne 6 Mahine Me ₹50L Business Kiya", e: "Ramesh bhai ki journey — 12 products se 500 products, aur Rs 50 lakh ka business.", d: "22 Jan 2026", r: "8 min read" },
  { c: "Guide", t: "Retailers Ke Liye First Order Checklist", e: "Sample request, price negotiation, payment terms — first order ke liye ye sab important hai.", d: "15 Jan 2026", r: "6 min read" },
];

export default function Blog() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Insights, Guides & Stories" subtitle="Garment industry trends, business tips, aur success stories — sab ek jagah." />

      <section className="py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map((p, i) => (
              <article key={i} className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 relative">
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    {p.c}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-bold leading-snug group-hover:text-[#B8894A] transition">{p.t}</h3>
                  <p className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed line-clamp-2">{p.e}</p>
                  <div className="mt-4 flex items-center gap-3 text-[11px] text-[#9B9B9B]">
                    <span>{p.d}</span>
                    <span>•</span>
                    <span>{p.r}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
