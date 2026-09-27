"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, LANGUAGES, LangCode, getTranslation } from "./translations";
import { createClient } from "@/lib/supabase/client";

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: keyof typeof translations.en) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("rc_lang") : null;
    if (saved && LANGUAGES.find((l) => l.code === saved)) {
      setLangState(saved as LangCode);
      return;
    }
    // Auto-detect from browser
    const browser = typeof window !== "undefined" ? navigator.language.split("-")[0] : "en";
    const match = LANGUAGES.find((l) => l.code === browser);
    if (match) setLangState(match.code as LangCode);
  }, []);

  const setLang = async (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("rc_lang", l);
    document.documentElement.lang = l;
    // Save to DB
    try {
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (user) await sb.from("profiles").update({ language: l }).eq("id", user.id);
    } catch {}
  };

  const t = (key: keyof typeof translations.en) => getTranslation(lang, key);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as LangCode, setLang: () => {}, t: (k: any) => translations.en[k] || k };
  return ctx;
}
