"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppShare({ text, url }: { text: string; url: string }) {
  const share = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
  };
  return (
    <button onClick={share} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
      <MessageCircle size={13} /> WhatsApp
    </button>
  );
}
