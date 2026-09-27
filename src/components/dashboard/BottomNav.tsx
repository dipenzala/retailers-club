"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/people", label: "People", icon: Search },
  { href: "/products/new", label: "Post", icon: Plus, primary: true },
  { href: "/chat", label: "Chats", icon: MessageSquare },
  { href: "/settings", label: "Profile", icon: User },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E7E5E4]">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const active = path === item.href;
          if (item.primary) {
            return (
              <Link key={item.href} href={item.href} className="flex items-center justify-center -mt-5">
                <div className="w-12 h-12 rounded-full bg-[#0A0A0A] flex items-center justify-center shadow-lg">
                  <item.icon size={20} className="text-white" />
                </div>
              </Link>
            );
          }
          return (
            <Link key={item.href} href={item.href}
              className={cn("flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
                active ? "text-[#0A0A0A]" : "text-[#9B9B9B]")}>
              <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
