"use client";
import { Bell, Search as SearchIcon, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/context";

export default function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E7E5E4] px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#FAFAF9] shrink-0">
          <Menu size={18} />
        </button>
        <h1 className="text-[15px] lg:text-[18px] font-extrabold text-[#0A0A0A] truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <Link
          href="/people"
          className="hidden md:flex items-center gap-2 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl px-3 py-2 w-56 lg:w-64 hover:border-[#0A0A0A] transition"
        >
          <SearchIcon size={15} className="text-[#6B6B6B] shrink-0" />
          <span className="text-[13px] text-[#9B9B9B] flex-1 text-left truncate">{t("searchPeople")}</span>
        </Link>

        <LanguageSwitcher />

        <Link href="/notifications" className="relative w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-[#FAFAF9] shrink-0">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B8894A]" />
        </Link>

        <Link href="/settings" className="shrink-0">
          <Avatar name="User" size={32} />
        </Link>
      </div>
    </header>
  );
}
