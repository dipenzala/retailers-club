import PageHero from "@/components/public/PageHero";
import { Target, Users, Zap, ShieldCheck, TrendingUp, Heart } from "lucide-react";

export default function About() {
  return (
    <>
      <PageHero eyebrow="About Us" title="India's Garment B2B, Reimagined" subtitle="Retailers Club is building the country's most trusted network of garment manufacturers and retailers — powered by AI, verified by hand, built for growth." />

      <section className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: "60,000+", l: "Businesses" },
              { v: "1L+", l: "Products" },
              { v: "28", l: "States" },
              { v: "500+", l: "Cities" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[2rem] md:text-[2.5rem] font-extrabold tracking-tight">{s.v}</div>
                <div className="text-[12px] text-[#6B6B6B] mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-5 bg-[#FAFAF9]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[1.75rem] md:text-[2rem] font-extrabold text-center mb-12">Our Mission</h2>
          <p className="text-[15px] text-[#6B6B6B] text-center max-w-3xl mx-auto leading-relaxed">
            Har garment business — chhoti ya badi — deserves access to a national marketplace without middlemen, without fake sellers, and without the headache of traditional trade. Retailers Club is that platform. Direct connection. Verified trust. Real growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
            {[
              { i: Target, t: "Our Vision", d: "India ka sabse bharosemand garment trade network — 10 lakh businesses tak." },
              { i: Heart, t: "Our Values", d: "Trust, transparency, aur technology ka sahi use — business ko aasan banana." },
              { i: Zap, t: "Our Promise", d: "Har deal me safety, har interaction me speed, har user ko respect." },
            ].map((c) => (
              <div key={c.t} className="bg-white border rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-[#FAFAF9] border flex items-center justify-center">
                  <c.i size={20} className="text-[#B8894A]" />
                </div>
                <div className="mt-4 font-bold text-[15px]">{c.t}</div>
                <div className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[1.75rem] font-extrabold">Leadership Team</h2>
          <p className="text-[13px] text-[#6B6B6B] mt-3">IIT, IIM alumni aur garment industry veterans</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {["Founder & CEO", "CTO", "Head of Ops", "Head of Growth"].map((r, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mx-auto flex items-center justify-center text-[1.5rem] font-bold text-[#6B6B6B]">
                  {["R", "S", "A", "P"][i]}
                </div>
                <div className="mt-3 text-[13px] font-bold">Team Member</div>
                <div className="text-[11px] text-[#6B6B6B]">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
