"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "AI Search", href: "#ai" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-[#E7E5E4] rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold tracking-tight text-[#0A0A0A] text-[15px]">
            Retailers Club
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-[13px] font-semibold bg-[#0A0A0A] text-white px-4 py-2 rounded-lg hover:bg-[#262626] transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
