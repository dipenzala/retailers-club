"use client";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Retailers Club" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
