import PageHero from "@/components/public/PageHero";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

const JOBS = [
  { t: "Senior Full Stack Engineer", l: "Mumbai / Remote", ty: "Full-time", d: "Next.js, Node.js, Postgres experience" },
  { t: "Product Designer", l: "Mumbai", ty: "Full-time", d: "3+ years product design experience" },
  { t: "Growth Marketing Manager", l: "Remote", ty: "Full-time", d: "B2B SaaS growth experience preferred" },
  { t: "Customer Success Executive", l: "Delhi", ty: "Full-time", d: "Hindi + English fluency" },
  { t: "Sales Development Rep", l: "Surat", ty: "Full-time", d: "Garment industry knowledge a plus" },
  { t: "Data Analyst", l: "Bangalore / Remote", ty: "Full-time", d: "SQL, Python, dashboards" },
];

export default function Careers() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Build India's Garment Trade Infrastructure" subtitle="Hum ek aisi team bana rahe hain jo India ke 50 lakh garment businesses ko empower kare. Aap bhi part ban sakte hain." />

      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[1.5rem] font-extrabold mb-8">Open Positions</h2>
          <div className="space-y-4">
            {JOBS.map((j, i) => (
              <div key={i} className="bg-white border rounded-2xl p-5 hover:shadow-md transition group cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-[15px] font-bold">{j.t}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-[#6B6B6B]">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {j.l}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {j.ty}</span>
                    </div>
                    <div className="mt-2 text-[13px] text-[#6B6B6B]">{j.d}</div>
                  </div>
                  <ArrowRight size={16} className="text-[#6B6B6B] group-hover:translate-x-1 group-hover:text-[#0A0A0A] transition shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-[#FAFAF9] border rounded-2xl p-6 text-center">
            <div className="text-[15px] font-bold">Koi relevant opening nahi?</div>
            <div className="mt-2 text-[13px] text-[#6B6B6B]">
              Apna resume bhejo: <a href="mailto:careers@retailersclub.com" className="text-[#0A0A0A] font-semibold">careers@retailersclub.com</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
