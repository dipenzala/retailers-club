"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8894A]" />
          <span className="text-[12px] font-medium text-[#6B6B6B]">
            India's Garment B2B Network
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem] font-extrabold tracking-[-0.03em] leading-[1.02] text-[#0A0A0A]"
        >
          Manufacturers
          <br />
          meet Retailers.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-2xl mx-auto text-[17px] text-[#6B6B6B] leading-relaxed"
        >
          Verified partners, AI-powered product uploads, real-time chat, and
          location-based discovery. Built for 3 lakh users, zero lag.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/register" className="btn-primary">
            Start Free — 7 Day Boost
            <ArrowRight size={16} />
          </Link>
          <a href="#how" className="btn-secondary">
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left"
        >
          {[
            { l: "GST / MSME Verified", s: "Manual + API checks" },
            { l: "AI Quick Upload", s: "Photo → Full listing" },
            { l: "PostGIS Location", s: "Sub-50ms nearby search" },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white border border-[#E7E5E4] rounded-xl p-5"
            >
              <div className="text-[13px] font-bold text-[#0A0A0A]">{f.l}</div>
              <div className="mt-1 text-[13px] text-[#6B6B6B]">{f.s}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
