"use client";
import { motion } from "framer-motion";
import {
  Bot, MessageSquare, ShieldCheck, MapPin, FileText, Bell, BarChart3, Rocket,
} from "lucide-react";

const features = [
  { icon: Bot, t: "AI Quick Upload", d: "Photo daalo — AI title, category, fabric, tags suggest karega." },
  { icon: MessageSquare, t: "Real-time Chat", d: "Typing indicators, presence, RFQ and quote cards." },
  { icon: ShieldCheck, t: "Manual Verification", d: "GST, MSME, PAN — admin review with full audit trail." },
  { icon: MapPin, t: "PostGIS Discovery", d: "State → District → City → Pincode radius search." },
  { icon: FileText, t: "RFQ & Quotations", d: "Requirement post karo — AI auto-matches manufacturers." },
  { icon: Bell, t: "Smart Notifications", d: "Quiet hours, frequency caps, spam-free alerts." },
  { icon: BarChart3, t: "Demand Analytics", d: "Top searched categories and high-demand locations." },
  { icon: Rocket, t: "Profile Boost", d: "Top 25/50/100 km placement — Redis cached ranking." },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="eyebrow mb-4">Platform</div>
          <h2 className="text-[2.5rem] md:text-[3.25rem] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
            Everything you need to trade at scale
          </h2>
          <p className="mt-5 text-[16px] text-[#6B6B6B] max-w-xl mx-auto">
            Production-ready modules — from AI upload to verified chat to location discovery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.06 }}
              className="card p-6"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FAFAF9] border border-[#E7E5E4] flex items-center justify-center">
                <f.icon size={18} className="text-[#0A0A0A]" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[15px] font-bold text-[#0A0A0A] tracking-tight">
                {f.t}
              </h3>
              <p className="mt-2 text-[13px] text-[#6B6B6B] leading-relaxed">
                {f.d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
