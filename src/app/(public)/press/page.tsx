import PageHero from "@/components/public/PageHero";
import { Download, Mail } from "lucide-react";

const RELEASES = [
  { d: "10 Feb 2026", t: "Retailers Club Crosses 60,000 Businesses", e: "India's fastest-growing B2B garment platform hits major milestone." },
  { d: "25 Jan 2026", t: "AI Feature Launch: Photo to Listing in 30 Seconds", e: "New AI-powered upload reduces listing time by 95%." },
  { d: "08 Jan 2026", t: "Retailers Club Expands to 28 States", e: "Pan-India presence with on-ground teams in 12 cities." },
  { d: "15 Dec 2025", t: "Partnership with Top Logistics Providers", e: "Delhivery and BlueDart integration for seamless fulfillment." },
];

export default function Press() {
  return (
    <>
      <PageHero eyebrow="Press" title="Press & Media" subtitle="Latest news, media coverage, and press resources." />

      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-10">
            <a href="#" className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-5 py-3 rounded-xl font-semibold text-[13px]">
              <Download size={14} /> Download Brand Kit
            </a>
            <a href="mailto:press@retailersclub.com" className="inline-flex items-center gap-2 bg-white border px-5 py-3 rounded-xl font-semibold text-[13px]">
              <Mail size={14} /> press@retailersclub.com
            </a>
          </div>

          <h2 className="text-[1.5rem] font-extrabold mb-6">Latest News</h2>
          <div className="space-y-4">
            {RELEASES.map((r, i) => (
              <div key={i} className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
                <div className="text-[11px] text-[#9B9B9B] font-semibold">{r.d}</div>
                <div className="mt-2 text-[15px] font-bold">{r.t}</div>
                <div className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">{r.e}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
