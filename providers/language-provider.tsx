"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type AppLanguage = "ar" | "en";
export type AppDirection = "rtl" | "ltr";

interface LanguageContextValue {
  lang: AppLanguage;
  dir: AppDirection;
  isEnglish: boolean;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
  t: (ar: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LANG_STORAGE_KEY = "amani_lang_v1";

function applyLanguageToDocument(next: AppLanguage) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dir: AppDirection = next === "en" ? "ltr" : "rtl";
  root.lang = next;
  root.dir = dir;
  root.setAttribute("data-lang", next);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === "en" || saved === "ar") {
        setLangState(saved);
        applyLanguageToDocument(saved);
        return;
      }
      applyLanguageToDocument("ar");
    } catch {
      applyLanguageToDocument("ar");
    }
  }, []);

  const setLang = useCallback((next: AppLanguage) => {
    setLangState(next);
    applyLanguageToDocument(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: AppLanguage = prev === "ar" ? "en" : "ar";
      applyLanguageToDocument(next);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (ar: string, en: string) => (lang === "en" ? en : ar),
    [lang]
  );

  const dir: AppDirection = lang === "en" ? "ltr" : "rtl";

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir,
        isEnglish: lang === "en",
        setLang,
        toggleLang,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "ar",
      dir: "rtl",
      isEnglish: false,
      setLang: () => {},
      toggleLang: () => {},
      t: (ar: string) => ar,
    };
  }
  return ctx;
}
