"use client";
import { Bell, Search as SearchIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E7E5E4] px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-[18px] font-extrabold text-[#0A0A0A] tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3 py-2 w-72">
          <SearchIcon size={15} className="text-[#6B6B6B]" />
          <input
            placeholder="Search products, manufacturers..."
            className="bg-transparent outline-none text-[13px] flex-1 placeholder:text-[#9B9B9B]"
          />
        </div>
        <button className="relative w-9 h-9 rounded-xl border border-[#E7E5E4] flex items-center justify-center hover:bg-[#FAFAF9] transition">
          <Bell size={16} className="text-[#0A0A0A]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B8894A]" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E7E5E4]">
          <Avatar name="Rajesh" size={34} />
          <div className="hidden md:block">
            <div className="text-[13px] font-bold text-[#0A0A0A] leading-tight">Rajesh K.</div>
            <div className="text-[11px] text-[#6B6B6B]">Manufacturer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
