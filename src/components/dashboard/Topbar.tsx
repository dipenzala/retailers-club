"use client";
import { Bell, Search as SearchIcon, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

export default function Topbar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E7E5E4] px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAFAF9] shrink-0"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-[15px] lg:text-[18px] font-extrabold text-[#0A0A0A] tracking-tight truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden md:flex items-center gap-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3 py-2 w-72">
          <SearchIcon size={15} className="text-[#6B6B6B]" />
          <input
            placeholder="Search products..."
            className="bg-transparent outline-none text-[13px] flex-1 placeholder:text-[#9B9B9B]"
          />
        </div>

        <button className="relative w-9 h-9 rounded-xl border border-[#E7E5E4] flex items-center justify-center hover:bg-[#FAFAF9] transition shrink-0">
          <Bell size={16} className="text-[#0A0A0A]" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B8894A]" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#E7E5E4]">
          <Avatar name="User" size={32} />
          <div className="hidden md:block">
            <div className="text-[13px] font-bold text-[#0A0A0A] leading-tight">User</div>
            <div className="text-[11px] text-[#6B6B6B]">Manufacturer</div>
          </div>
        </div>
      </div>
    </header>
  );
}
