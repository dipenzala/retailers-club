"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard, Package, MessageSquare, FileText, Search,
  ShieldCheck, Settings, LogOut, Users, BarChart3, Rocket, Sparkles, Home
} from "lucide-react";

const nav = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/products", label: "My Products", icon: Package },
  { href: "/products/new", label: "Post Product", icon: Sparkles },
  { href: "/rfq", label: "RFQs", icon: FileText },
  { href: "/chat", label: "Messages", icon: MessageSquare },
  { href: "/verification", label: "Verification", icon: ShieldCheck },
];

const adminNav = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[240px] shrink-0 border-r border-[#E7E5E4] bg-white h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-[#E7E5E4]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="font-bold text-[#0A0A0A] text-[14px]">Retailers Club</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B] px-3 mb-2">
          Workspace
        </div>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 transition",
                active ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A]"
              )}
            >
              <item.icon size={16} strokeWidth={2} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}

        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B] px-3 mb-2 mt-6">
          Admin
        </div>
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 transition",
              path === item.href ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9] hover:text-[#0A0A0A]"
            )}
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-[#E7E5E4]">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9]">
          <Settings size={16} /> Settings
        </Link>
        <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9]">
          <LogOut size={16} /> Logout
        </Link>
      </div>
    </aside>
  );
}
