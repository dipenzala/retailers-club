"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#0A0A0A] rounded-[1.75rem] px-8 py-16 md:px-14 md:py-20 text-center overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="relative">
            <h2 className="text-[2.25rem] md:text-[3rem] font-extrabold tracking-[-0.03em] text-white leading-tight">
              Ready to scale your
              <br />
              garment business?
            </h2>
            <p className="mt-6 text-white/60 text-[16px] max-w-lg mx-auto leading-relaxed">
              Join India's most trusted B2B garment network. Verified.
              AI-powered. Built for 3 lakh users.
            </p>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center gap-2 bg-white text-[#0A0A0A] px-7 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition"
            >
              Create Free Account <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
