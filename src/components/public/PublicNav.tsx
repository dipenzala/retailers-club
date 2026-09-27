"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scroll > 20 ? "bg-white/95 backdrop-blur shadow-sm" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="font-extrabold text-[15px] tracking-tight">Retailers Club</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#6B6B6B]">
          <Link href="/about" className="hover:text-[#0A0A0A]">About</Link>
          <Link href="/blog" className="hover:text-[#0A0A0A]">Blog</Link>
          <Link href="/help" className="hover:text-[#0A0A0A]">Help</Link>
          <Link href="/contact" className="hover:text-[#0A0A0A]">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-[13px] font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">Login</Link>
          <Link href="/register" className="bg-[#0A0A0A] text-white text-[13px] font-semibold px-4 py-2 rounded-xl">Get Started</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex items-center justify-center">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-5 py-4 space-y-3">
          <Link href="/about" className="block text-[14px] font-medium py-2" onClick={() => setOpen(false)}>About</Link>
          <Link href="/blog" className="block text-[14px] font-medium py-2" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/help" className="block text-[14px] font-medium py-2" onClick={() => setOpen(false)}>Help</Link>
          <Link href="/contact" className="block text-[14px] font-medium py-2" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/register" className="block text-center bg-[#0A0A0A] text-white py-3 rounded-xl font-semibold text-[13px]" onClick={() => setOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
