"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

interface LanguageToggleProps {
  variant?: "header" | "admin";
  className?: string;
}

export function LanguageToggle({
  variant = "header",
  className = "",
}: LanguageToggleProps) {
  const { lang, toggleLang } = useLanguage();
  const isEnglish = lang === "en";

  const label = isEnglish ? "التبديل إلى اللغة العربية" : "Switch to English";

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={toggleLang}
        aria-label={label}
        title={label}
        className={`h-10 sm:h-11 px-3 rounded-full bg-[#fff0f1] hover:bg-[#faeaeb] border border-[#eedfe0] flex items-center justify-center gap-1.5 text-xs font-bold text-[#2f020d] transition-all cursor-pointer active:scale-95 ${className}`}
      >
        <Globe className="h-3.5 w-3.5 text-[#735c00]" />
        <span>{isEnglish ? "عربي" : "EN"}</span>
      </button>
    );
  }

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
