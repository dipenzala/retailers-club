"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const queries = [
  "Mujhe Ahmedabad ke paas ₹300 me women's kurti chahiye",
  "Surat se cotton fabric manufacturer dikhao",
  "Plus size lehenga wholesale Delhi NCR",
  "₹500 se kam me kids t-shirt bulk order",
];

export default function AISearch() {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);

  useEffect(() => {
    const full = queries[idx];
    if (sub < full.length) {
      const t = setTimeout(() => setSub(sub + 1), 35);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setSub(0);
      setIdx((idx + 1) % queries.length);
    }, 2200);
    return () => clearTimeout(t);
  }, [sub, idx]);

  useEffect(() => setText(queries[idx].slice(0, sub)), [sub, idx]);

  return (
    <section id="ai" className="section">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="eyebrow mb-4">Natural Language</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            Type like you talk.
          </h2>
          <p className="mt-5 text-[16px] text-[#6B6B6B]">
            AI samjhega location, price, category, gender — sab.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-10 bg-white border border-[#E7E5E4] rounded-2xl p-2 shadow-sm"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Search size={18} className="text-[#6B6B6B]" strokeWidth={2} />
            <div className="flex-1 text-left text-[15px] font-medium text-[#0A0A0A]">
              <span>{text}</span>
              <span className="inline-block w-[2px] h-4 bg-[#0A0A0A] align-middle ml-0.5 animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {["Ahmedabad", "Women's Kurti", "Under ₹300", "Verified"].map((t) => (
            <span
              key={t}
              className="bg-white border border-[#E7E5E4] rounded-full px-3 py-1.5 text-[12px] font-medium text-[#6B6B6B]"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
