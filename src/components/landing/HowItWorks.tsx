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
