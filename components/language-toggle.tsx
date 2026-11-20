"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { lang, toggleLang } = useLanguage();
  const isEnglish = lang === "en";

  const label = isEnglish ? "التبديل إلى اللغة العربية" : "Switch to English";

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={label}
      title={label}
      className={`h-11 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center gap-1.5 text-xs font-bold text-[#fed65b] transition-all cursor-pointer backdrop-blur-md active:scale-95 ${className}`}
    >
      <Globe className="h-3.5 w-3.5 text-[#fed65b]" />
      <span>{isEnglish ? "عربي" : "EN"}</span>
    </button>
  );
}
