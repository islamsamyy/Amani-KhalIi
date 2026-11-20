"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

interface ThemeToggleProps {
  variant?: "header" | "admin";
  className?: string;
}

export function ThemeToggle({ variant = "header", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const label = isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن";

  if (variant === "admin") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#fff0f1] hover:bg-[#faeaeb] border border-[#eedfe0] flex items-center justify-center text-[#2f020d] transition-all cursor-pointer active:scale-95 ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-[#fed65b]" />
        ) : (
          <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-[#4a1521]" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-[#fed65b] transition-all cursor-pointer backdrop-blur-md active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-[#fed65b]" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-[#fed65b]" />
      )}
    </button>
  );
}
