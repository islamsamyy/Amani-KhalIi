"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Menu,
  Sparkles,
  Crown,
  Star,
  Gem,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface SiteHeaderProps {
  onOpenMobileMenu: () => void;
  onToggleLanguage?: () => void;
  currentDir?: "rtl" | "ltr";
}

const SERVICE_SUBLINKS = [
  {
    href: "/services",
    title: "كافة الباقات والأسعار الرسمية",
    subtitle: "مقارنة شاملة وحاسبة الإضافات التفاعلية",
    icon: Sparkles,
  },
  {
    href: "/services/vip-bridal",
    title: "باقة العروس الملكية VIP",
    subtitle: "تجهيز متكامل ومرافقة خاصة للعروس",
    icon: Crown,
    badge: "الأكثر طلباً",
  },
  {
    href: "/bridal-makeup-riyadh",
    title: "مكياج العرائس الفاخر بالرياض",
    subtitle: "زيارات القصور والفنادق والأجنحة الملكية",
    icon: Gem,
  },
  {
    href: "/occasion-makeup-riyadh",
    title: "مكياج السهرات والمناسبات",
    subtitle: "إطلالات السهرات والملكة والتخرج",
    icon: Star,
  },
];

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  {
    href: "/services",
    label: "الباقات والخدمات",
    hasDropdown: true,
  },
  { href: "/gallery", label: "معرض الأعمال" },
  { href: "/reviews", label: "آراء العميلات" },
  { href: "/blog", label: "المدونة" },
  { href: "/about", label: "عن أماني" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "تواصل والسياسات" },
];

export function SiteHeader({
  onOpenMobileMenu,
  onToggleLanguage,
  currentDir,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 16);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((scrollY / totalHeight) * 100);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  const handleMouseEnterDropdown = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setServicesOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const isServiceRoute =
    pathname.startsWith("/services") ||
    pathname === "/bridal-makeup-riyadh" ||
    pathname === "/occasion-makeup-riyadh";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "h-20 bg-[#2f020d]/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(47,2,13,0.35)] border-b border-[#fed65b]/20"
          : "h-24 bg-gradient-to-b from-[#2f020d]/95 via-[#2f020d]/70 to-transparent backdrop-blur-md border-b border-white/10"
      }`}
    >
      {/* Scroll Progress Indicator Bar at Header Top */}
      <div
        className="absolute bottom-0 inset-x-0 h-[2px] bg-[#fed65b] transition-all duration-150 origin-right"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
        {/* Brand Identity / Official Visual Logo (AK Monogram) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            aria-label="أماني خليل - الصفحة الرئيسية"
            className="flex items-center py-1 group focus:outline-none transition-transform duration-300 hover:scale-[1.05]"
          >
            <div className="h-11 sm:h-12 w-11 sm:w-12 relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden bg-[#2f020d] border border-white/20 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ak-monogram-hd.png"
                alt="أماني خليل - AK Haute Beauté"
                className="h-full w-full object-contain p-1.5 rounded-lg group-hover:brightness-110 transition-all drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              />
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation Pill */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden xl:flex items-center gap-1 p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        >
          {NAV_LINKS.map((item) => {
            const isActive = item.hasDropdown
              ? isServiceRoute
              : pathname === item.href;

            if (item.hasDropdown) {
              return (
                <div
                  key={item.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleMouseEnterDropdown}
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <button
                    type="button"
                    onClick={() => setServicesOpen((prev) => !prev)}
                    aria-expanded={servicesOpen}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer select-none ${
                      isActive
                        ? "bg-[#fed65b] text-[#241a00] shadow-[0_2px_12px_rgba(254,214,91,0.35)]"
                        : "text-[#eedfe0] hover:text-white hover:bg-white/15"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        servicesOpen ? "rotate-180" : ""
                      } ${isActive ? "text-[#241a00]" : "text-[#fed65b]"}`}
                    />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {servicesOpen && (
                    <div className="absolute top-full start-0 pt-3 w-84 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                      <div className="rounded-3xl border border-[#fed65b]/30 bg-[#2f020d]/98 backdrop-blur-2xl p-3 shadow-[0_24px_50px_rgba(0,0,0,0.6)] space-y-1">
                        <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#fed65b] uppercase tracking-wider">
                            باقات المناسبات والعرائس
                          </span>
                          <Crown className="h-3 w-3 text-[#fed65b]" />
                        </div>

                        {SERVICE_SUBLINKS.map((sub) => {
                          const Icon = sub.icon;
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setServicesOpen(false)}
                              className={`flex items-start gap-3 rounded-2xl p-2.5 transition-all duration-200 group ${
                                subActive
                                  ? "bg-[#fed65b] text-[#241a00]"
                                  : "text-white hover:bg-white/10"
                              }`}
                            >
                              <div
                                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                  subActive
                                    ? "bg-[#2f020d] text-[#fed65b]"
                                    : "bg-white/10 text-[#fed65b] group-hover:bg-[#fed65b] group-hover:text-[#241a00]"
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold truncate">
                                    {sub.title}
                                  </span>
                                  {sub.badge && (
                                    <span
                                      className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${
                                        subActive
                                          ? "bg-[#2f020d] text-[#fed65b]"
                                          : "bg-[#fed65b] text-[#241a00]"
                                      }`}
                                    >
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-[10px] mt-0.5 truncate ${
                                    subActive
                                      ? "text-[#241a00]/80"
                                      : "text-[#eedfe0]/70 group-hover:text-[#eedfe0]"
                                  }`}
                                >
                                  {sub.subtitle}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "bg-[#fed65b] text-[#241a00] shadow-[0_2px_12px_rgba(254,214,91,0.35)]"
                    : "text-[#eedfe0] hover:text-white hover:bg-white/15"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* End Actions: Luxury Booking Button & Mobile Menu */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/book"
            className="group relative inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-xs font-bold text-[#241a00] bg-gradient-to-r from-[#fed65b] via-[#ffd966] to-[#fed65b] shadow-[0_4px_20px_rgba(254,214,91,0.35)] hover:shadow-[0_8px_30px_rgba(254,214,91,0.55)] active:scale-95 transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/25 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <Crown className="h-3.5 w-3.5 text-[#241a00] relative z-10 transition-transform group-hover:rotate-12 duration-300" />
            <span className="relative z-10 font-bold">حجز موعد ملكي</span>
          </Link>

          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="فتح قائمة التصفح"
            className="xl:hidden w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <Menu className="h-5 w-5 text-[#fed65b]" />
          </button>
        </div>
      </div>
    </header>
  );
}
