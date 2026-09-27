"use client";
import { useState, useEffect } from "react";
import { X, Copy, Check, MessageCircle, Share2, Send, Link as LinkIcon, Mail, Hash, Briefcase, ThumbsUp } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url: string;
  image?: string;
};

// Custom SVG icons (since lucide removed branded ones)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

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
      color: "bg-[#25D366]",
      Icon: WhatsAppIcon,
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, "_blank"),
    },
    {
      label: "Telegram",
      color: "bg-[#229ED9]",
      Icon: TelegramIcon,
      action: () => window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank"),
    },
    {
      label: "Facebook",
      color: "bg-[#1877F2]",
      Icon: FacebookIcon,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank"),
    },
    {
      label: "Twitter / X",
      color: "bg-black",
      Icon: TwitterIcon,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank"),
    },
    {
      label: "LinkedIn",
      color: "bg-[#0A66C2]",
      Icon: LinkedInIcon,
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank"),
    },
    {
      label: "Email",
      color: "bg-[#EA4335]",
      Icon: EmailIcon,
      action: () => window.open(`mailto:?subject=${encodedText}&body=${encodeURIComponent(fullText)}`, "_blank"),
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-200"
      >
        <div className="md:hidden w-12 h-1 bg-[#E7E5E4] rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#B8894A]" />
            <span className="text-[15px] font-bold">Share</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAFAF9] flex items-center justify-center hover:bg-[#E7E5E4]">
            <X size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#FAFAF9] rounded-2xl mb-5">
          {image && <img src={image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
          <div className="min-w-0">
            <div className="text-[13px] font-bold truncate">{title}</div>
            {description && <div className="text-[11px] text-[#6B6B6B] truncate mt-0.5">{description}</div>}
          </div>
        </div>

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

        <div className="text-[11px] font-bold uppercase tracking-wider text-[#9B9B9B] mb-3">Share on</div>
        <div className="grid grid-cols-3 gap-3">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => { o.action(); onClose(); }}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl hover:bg-[#FAFAF9] transition"
            >
              <div className={`w-12 h-12 rounded-2xl ${o.color} flex items-center justify-center shadow-md text-white`}>
                <o.Icon />
              </div>
              <span className="text-[11px] font-semibold text-[#0A0A0A]">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
