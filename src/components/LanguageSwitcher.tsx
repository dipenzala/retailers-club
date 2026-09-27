"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { LANGUAGES, LangCode } from "@/lib/i18n/translations";
import { useI18n } from "@/lib/i18n/context";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#FAFAF9] transition">
        <Globe size={14} />
        <span className="text-[12px] font-semibold hidden md:block">{current?.native || "English"}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 bg-white border border-[#E7E5E4] rounded-xl shadow-xl z-50 w-56 py-2 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#9B9B9B]">
            Select Language
          </div>
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2 text-[13px] hover:bg-[#FAFAF9] ${lang === l.code ? "font-bold" : ""}`}>
              <span>{l.native}</span>
              {lang === l.code && <Check size={13} className="text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
