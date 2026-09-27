"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  { n: "Free", p: "₹0", s: "forever", f: ["Basic listing", "7-day boost trial", "10 products", "Chat access"], c: false },
  { n: "Manufacturer Pro", p: "₹999", s: "/month", f: ["Unlimited products", "Priority support", "Analytics dashboard", "RFQ auto-match"], c: true },
  { n: "Retailer Pro", p: "₹499", s: "/month", f: ["Advanced filters", "Early access", "Saved searches", "Contact history"], c: false },
];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="eyebrow mb-4">Pricing</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            Start free. Scale when ready.
          </h2>
          <p className="mt-5 text-[16px] text-[#6B6B6B]">
            Payment gateway plug-and-play — abhi sab free me use karo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl p-8 ${
                p.c
                  ? "bg-[#0A0A0A] text-white"
                  : "bg-white border border-[#E7E5E4]"
              }`}
            >
              <div className={`text-[12px] font-semibold uppercase tracking-wider ${p.c ? "text-white/60" : "text-[#6B6B6B]"}`}>
                {p.n}
              </div>
              <div className="mt-4 flex items-end gap-1.5">
                <div className={`text-[2.5rem] font-extrabold tracking-tight leading-none ${p.c ? "text-white" : "text-[#0A0A0A]"}`}>
                  {p.p}
                </div>
                <div className={`pb-1 text-[13px] ${p.c ? "text-white/60" : "text-[#6B6B6B]"}`}>
                  {p.s}
                </div>
              </div>
              <div className={`h-px my-6 ${p.c ? "bg-white/15" : "bg-[#E7E5E4]"}`} />
              <ul className="space-y-3">
                {p.f.map((f, j) => (
                  <li
                    key={j}
                    className={`flex items-center gap-2.5 text-[14px] ${p.c ? "text-white/90" : "text-[#0A0A0A]"}`}
                  >
                    <Check size={14} strokeWidth={2.5} className={p.c ? "text-white" : "text-[#B8894A]"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block text-center py-3 rounded-xl font-semibold text-[14px] transition ${
                  p.c
                    ? "bg-white text-[#0A0A0A] hover:bg-white/90"
                    : "bg-[#0A0A0A] text-white hover:bg-[#262626]"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
