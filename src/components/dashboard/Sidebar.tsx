"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Package, MessageSquare, FileText, Search, ShieldCheck, Settings, LogOut,
  Users, BarChart3, Rocket, Sparkles, Home, Bell, X, HelpCircle, Flag, Megaphone, ShoppingBag,
  Gift, Trophy, AlertTriangle, CheckCircle2, Bookmark
} from "lucide-react";

const nav = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/people", label: "Find People", icon: Users },
  { href: "/search", label: "Discover", icon: Search },
  { href: "/products/new", label: "Post Product", icon: Sparkles },
  { href: "/products", label: "My Products", icon: Package },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/sample-requests", label: "Samples", icon: CheckCircle2 },
  { href: "/rfq", label: "RFQs", icon: FileText },
  { href: "/chat", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/verification", label: "Verification", icon: ShieldCheck },
  { href: "/boost", label: "Boost", icon: Rocket },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/referrals", label: "Refer & Earn", icon: Gift },
  { href: "/disputes", label: "Disputes", icon: AlertTriangle },
  { href: "/support", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const sb = createClient();
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return;
      const { data } = await sb.from("profiles").select("role").eq("id", user.id).single();
      setRole(data?.role || null);
    })();
  }, []);

  const logout = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isAdmin = role && ["super_admin", "admin", "verification_admin"].includes(role);
  const isMaster = role === "super_admin";
  const isAdminOrMaster = isMaster || role === "admin";

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] lg:w-[240px] shrink-0 border-r bg-white flex flex-col transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="px-5 py-5 border-b flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-[#0A0A0A] flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="font-bold text-[14px]">Retailers Club</span>
          </Link>
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase text-[#9B9B9B] px-3 mb-2">Workspace</div>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1 transition",
                path === item.href ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
              <item.icon size={16} /><span>{item.label}</span>
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="text-[10px] font-bold uppercase text-[#9B9B9B] px-3 mb-2 mt-6">
                {isMaster ? "👑 Master Admin" : "🛡️ Admin"}
              </div>
              <Link href="/admin" onClick={onClose}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                  path === "/admin" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                <LayoutDashboard size={16} /><span>Admin Home</span>
              </Link>
              {isMaster && (
                <Link href="/admin/users" onClick={onClose}
                  className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                    path === "/admin/users" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                  <Users size={16} /><span>Users & Roles</span>
                </Link>
              )}
              <Link href="/admin/verification" onClick={onClose}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                  path === "/admin/verification" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                <ShieldCheck size={16} /><span>Verification</span>
              </Link>
              {isAdminOrMaster && (
                <>
                  <Link href="/admin/products" onClick={onClose}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                      path === "/admin/products" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                    <Package size={16} /><span>Products</span>
                  </Link>
                  <Link href="/admin/reports" onClick={onClose}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                      path === "/admin/reports" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                    <Flag size={16} /><span>Reports</span>
                  </Link>
                  <Link href="/admin/support" onClick={onClose}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                      path === "/admin/support" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                    <MessageSquare size={16} /><span>Support</span>
                  </Link>
                  <Link href="/admin/broadcast" onClick={onClose}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                      path === "/admin/broadcast" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                    <Megaphone size={16} /><span>Broadcast</span>
                  </Link>
                  <Link href="/admin/analytics" onClick={onClose}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                      path === "/admin/analytics" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                    <BarChart3 size={16} /><span>Analytics</span>
                  </Link>
                  <Link href="/admin/audit" onClick={onClose}
                    className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium mb-1",
                      path === "/admin/audit" ? "bg-[#0A0A0A] text-white" : "text-[#6B6B6B] hover:bg-[#FAFAF9]")}>
                    <FileText size={16} /><span>Audit Logs</span>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <div className="p-3 border-t">
          <Link href="/settings" onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#6B6B6B] hover:bg-[#FAFAF9]">
            <Settings size={16} /> Settings
          </Link>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#6B6B6B] hover:bg-red-50 hover:text-red-600 transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
