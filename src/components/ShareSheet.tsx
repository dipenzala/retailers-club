"use client";
import { useState, useEffect } from "react";
import { X, Copy, Check, MessageCircle, Share2, Facebook, Linkedin, Send, Link as LinkIcon, Twitter, Mail } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url: string;
  image?: string;
};

export default function ShareSheet({ open, onClose, title, description, url, image }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const shareText = `${title}${description ? " — " + description : ""}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);
  const fullText = `${shareText}\n${url}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        onClose();
      } catch {}
    }
  };

  const options = [
    {
      label: "WhatsApp",
      color: "bg-green-500",
      icon: MessageCircle,
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank"),
    },
    {
      label: "Telegram",
      color: "bg-sky-500",
      icon: Send,
      action: () => window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank"),
    },
    {
      label: "Facebook",
      color: "bg-blue-600",
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank"),
    },
    {
      label: "Twitter / X",
      color: "bg-black",
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank"),
    },
    {
      label: "LinkedIn",
      color: "bg-blue-700",
      icon: Linkedin,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank"),
    },
    {
      label: "Email",
      color: "bg-amber-500",
      icon: Mail,
      action: () => window.open(`mailto:?subject=${encodedText}&body=${encodeURIComponent(fullText)}`, "_blank"),
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-200"
      >
        {/* Handle bar (mobile) */}
        <div className="md:hidden w-12 h-1 bg-[#E7E5E4] rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#B8894A]" />
            <span className="text-[15px] font-bold">Share</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAFAF9] flex items-center justify-center hover:bg-[#E7E5E4]">
            <X size={16} />
          </button>
        </div>

        {/* Product preview */}
        <div className="flex items-center gap-3 p-3 bg-[#FAFAF9] rounded-2xl mb-5">
          {image && (
            <img src={image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-[13px] font-bold truncate">{title}</div>
            {description && <div className="text-[11px] text-[#6B6B6B] truncate mt-0.5">{description}</div>}
          </div>
        </div>

        {/* Copy link */}
        <button
          onClick={copyLink}
          className="w-full flex items-center gap-3 p-3 rounded-2xl border border-[#E7E5E4] hover:bg-[#FAFAF9] transition mb-5"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FBF6EF] border border-[#E8D9BF] flex items-center justify-center shrink-0">
            {copied ? <Check size={16} className="text-emerald-600" /> : <LinkIcon size={16} className="text-[#B8894A]" />}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-[13px] font-bold">{copied ? "Link Copied!" : "Copy Link"}</div>
            <div className="text-[11px] text-[#6B6B6B] truncate">{url}</div>
          </div>
          <Copy size={14} className="text-[#6B6B6B] shrink-0" />
        </button>

        {/* Native share (mobile) */}
        {typeof navigator !== "undefined" && (navigator as any).share && (
          <button
            onClick={nativeShare}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#0A0A0A] text-white hover:bg-[#262626] transition mb-5"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Share2 size={16} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[13px] font-bold">More options</div>
              <div className="text-[11px] text-white/60">Phone ki share sheet kholo</div>
            </div>
          </button>
        )}

        {/* Social grid */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#9B9B9B] mb-3">Share on</div>
        <div className="grid grid-cols-3 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => { o.action(); onClose(); }}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl hover:bg-[#FAFAF9] transition"
            >
              <div className={`w-12 h-12 rounded-2xl ${o.color} flex items-center justify-center shadow-md`}>
                <o.icon size={20} className="text-white" />
              </div>
              <span className="text-[11px] font-semibold text-[#0A0A0A]">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
