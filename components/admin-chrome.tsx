"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import {
  Bell,
  Calendar,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileSpreadsheet,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/providers/language-provider";

interface AdminChromeProps {
  onOpenManualBooking: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    labelAr: "النظرة العامة والنشاط",
    labelEn: "Overview & Activity",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/bookings",
    labelAr: "جدول الحجوزات والمواعيد",
    labelEn: "Bookings & Schedule",
    icon: ClipboardList,
    badge: "12",
  },
  {
    href: "/admin/calendar",
    labelAr: "تقويم الزفاف والأجندة",
    labelEn: "Bridal Calendar",
    icon: CalendarDays,
  },
  {
    href: "/admin/services",
    labelAr: "إدارة الخدمات والباقات",
    labelEn: "Services & Packages",
    icon: Sparkles,
  },
  {
    href: "/admin/invoices",
    labelAr: "الفواتير والمدفوعات",
    labelEn: "Invoices & Payments",
    icon: FileSpreadsheet,
  },
  {
    href: "/admin/customers",
    labelAr: "سجل العميلات (CRM)",
    labelEn: "Clients CRM",
    icon: Users,
  },
  {
    href: "/admin/content",
    labelAr: "المحتوى والتقييمات",
    labelEn: "Content & Gallery",
    icon: FolderKanban,
    badge: "4",
  },
  {
    href: "/admin/blog",
    labelAr: "إدارة المدونة والمقالات",
    labelEn: "Blog & Journal",
    icon: Sparkles,
  },
  {
    href: "/admin/settings",
    labelAr: "الإعدادات والصلاحيات",
    labelEn: "Settings & Access",
    icon: Settings,
  },
];

export function AdminChrome({
  onOpenManualBooking,
  onOpenNotifications,
  unreadCount,
}: AdminChromeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, dir, isEnglish } = useLanguage();
  const {
    bookings,
    reviews,
    packages,
    invoices,
    customers,
    currentUser,
    isSupabaseConnected,
    signOutAdmin,
  } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [liveQuery, setLiveQuery] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOutAdmin();
    router.push("/admin/login");
    router.refresh();
  };

  // Reset mobile menu, profile menu, and search filter when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setLiveQuery("");
    setMatchCount(null);
  }, [pathname]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Real-time DOM search across admin tables & cards
  const applyLiveFilter = (q: string) => {
    setLiveQuery(q);
    const mainEl = document.querySelector("main");
    if (!mainEl) return;

    const normalized = q.trim().toLowerCase();
    const targets = mainEl.querySelectorAll<HTMLElement>(
      "tbody tr, .service-card, .faq-item, [data-searchable]"
    );

    if (!targets.length) {
      setMatchCount(null);
      return;
    }

    if (!normalized) {
      targets.forEach((el) => {
        el.style.display = "";
      });
      setMatchCount(null);
      return;
    }

    let matches = 0;
    targets.forEach((el) => {
      const text = (el.innerText || "").toLowerCase();
      if (text.includes(normalized)) {
        el.style.display = "";
        matches++;
      } else {
        el.style.display = "none";
      }
    });
    setMatchCount(matches);
  };

  const renderSidebarLinks = (onNavigate?: () => void) => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-1.5">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#4a1521] text-white shadow-[0_6px_18px_rgba(74,21,33,0.22)]"
                  : "text-[#524345] hover:bg-[#faeaeb] hover:text-[#2f020d]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? "text-[#fed65b]" : "text-[#735c00]"
                  }`}
                />
                <span className="truncate">{t(item.labelAr, item.labelEn)}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive
                      ? "bg-[#fed65b] text-[#241a00]"
                      : "bg-[#faeaeb] text-[#4a1521]"
                  }`}
                >
                  {item.href === "/admin/bookings"
                    ? bookings.length
                    : item.href === "/admin/content"
                    ? reviews.length
                    : item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-3">
          <Link
            href="/admin/services/new"
            onClick={onNavigate}
            className={`flex items-center justify-center gap-2 rounded-2xl border border-dashed px-4 py-2.5 text-xs font-bold transition-all ${
              pathname === "/admin/services/new"
                ? "border-[#4a1521] bg-[#faeaeb] text-[#2f020d]"
                : "border-[#d7c1c3] bg-white/70 text-[#4a1521] hover:border-[#735c00] hover:bg-white"
            }`}
          >
            <Plus className="h-4 w-4 text-[#735c00]" />
            <span>{t("إنشاء باقة خدمة جديدة", "Create New Service Package")}</span>
          </Link>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#eedfe0] space-y-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-[#2f020d] border border-[#eedfe0] hover:border-[#735c00]/60 transition-all"
        >
          <span>{t("معاينة الموقع العام", "Preview Public Website")}</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#735c00]" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#857374] hover:bg-[#ffdad6]/50 hover:text-[#93000a] transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t("تسجيل الخروج الآمن", "Safe Sign Out")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        dir={dir}
        aria-label={t("القائمة الإدارية الجانبية", "Admin Sidebar Navigation")}
        className={`hidden lg:flex fixed top-0 bottom-0 w-72 bg-[#fff0f1] border-[#eedfe0] shadow-[0_1px_12px_rgba(47,2,13,0.05)] z-40 flex-col p-5 overflow-y-auto ${
          isEnglish ? "left-0 border-r" : "right-0 border-l"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="pb-4 mb-4 border-b border-[#eedfe0] flex flex-col items-start gap-2">
          <Link href="/admin" className="flex items-center gap-3 group focus:outline-none">
            <div className="h-11 w-11 relative rounded-xl overflow-hidden shadow-sm border border-[#eedfe0] bg-[#2f020d] flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-[1.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/ak-monogram-hd.png"
                alt="أماني خليل AK Monogram"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-base text-[#2f020d] block leading-tight">
                {t("أماني خليل", "Amani Khalil")}
              </span>
              <Badge variant="gold" className="text-[10px] px-2 py-0.5 w-fit mt-1">
                {t("لوحة الإدارة الملكية", "Royal Admin Suite")}
              </Badge>
            </div>
          </Link>
        </div>

        <div className="flex-1">{renderSidebarLinks()}</div>
      </aside>

      {/* Top Fixed Admin Bar */}
      <header
        dir={dir}
        className={`fixed top-0 h-20 bg-[#fff8f7]/95 backdrop-blur-xl border-b border-[#eedfe0] shadow-[0_2px_12px_rgba(74,21,33,0.04)] z-30 px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 ${
          isEnglish ? "left-0 lg:left-72 right-0" : "right-0 lg:right-72 left-0"
        }`}
      >
        {/* Start: Mobile Menu Button + Live Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="فتح القائمة الإدارية"
            className="lg:hidden h-11 w-11 shrink-0 rounded-full bg-[#faeaeb] border border-[#d7c1c3] flex items-center justify-center text-[#2f020d] hover:bg-[#eedfe0] transition-colors cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/admin" className="lg:hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ak-monogram-hd.png"
              alt="أماني خليل"
              className="h-9 w-9 rounded-lg object-contain bg-[#2f020d] p-1"
            />
          </Link>

          <div className="relative flex-1 hidden sm:block">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374] pointer-events-none" />
            <input
              type="text"
              value={liveQuery}
              onChange={(e) => applyLiveFilter(e.target.value)}
              placeholder={t(
                "بحث فوري بالاسم، رقم الحجز #AK، الباقة، أو الحالة...",
                "Instant search by client name, #AK ref, package, or status..."
              )}
              className="w-full h-11 ps-10 pe-20 rounded-full bg-[#fff0f1] border border-[#eedfe0] text-xs sm:text-sm text-[#211a1b] placeholder:text-[#857374] focus:bg-white focus:border-[#735c00] focus:outline-none transition-all"
            />
            {liveQuery && (
              <div className="absolute end-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {matchCount !== null && (
                  <span className="rounded-full bg-[#fed65b] px-2 py-0.5 text-[10px] font-bold text-[#241a00]">
                    {matchCount} {t("نتيجة", "matches")}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => applyLiveFilter("")}
                  aria-label="مسح البحث"
                  className="h-6 w-6 rounded-full bg-[#eedfe0] hover:bg-[#d7c1c3] flex items-center justify-center text-[#2f020d] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* End: Quick Actions, Language/Theme Switchers, Notifications, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenManualBooking}
            className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(74,21,33,0.2)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 text-[#fed65b]" />
            <span className="hidden md:inline">{t("إضافة حجز يدوي", "Add Manual Booking")}</span>
            <span className="md:hidden">{t("حجز", "Book")}</span>
          </button>

          <LanguageToggle variant="admin" />
          <ThemeToggle variant="admin" />

          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="الإشعارات"
            className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#fff0f1] hover:bg-[#faeaeb] border border-[#eedfe0] flex items-center justify-center text-[#2f020d] transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 h-5 min-w-[20px] px-1 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#fff8f7]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-full bg-[#fff0f1] hover:bg-[#faeaeb] border border-[#eedfe0] p-1.5 pe-3 transition-colors cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-[#4a1521] text-[#fed65b] flex items-center justify-center text-xs font-bold">
                {t("أ.خ", "AK")}
              </div>
              <div className="hidden xl:flex flex-col items-start text-start">
                <span className="text-xs font-bold text-[#2f020d] leading-tight">
                  {t("أماني خليل", "Amani Khalil")}
                </span>
                <span className="text-[10px] text-[#735c00] font-semibold">
                  {t("المديرة والمؤسسة", "Founder & Director")}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#524345]" />
            </button>

            {profileMenuOpen && (
              <div className="absolute end-0 top-full mt-2 w-56 rounded-2xl border border-[#d7c1c3] bg-[#fff8f7] p-2 shadow-[0_16px_40px_rgba(47,2,13,0.16)] z-50">
                <div className="px-3 py-2 border-b border-[#eedfe0] mb-1">
                  <p className="text-xs font-bold text-[#2f020d]">
                    {t("أماني خليل — Haute Beauté", "Amani Khalil — Haute Beauté")}
                  </p>
                  <p className="text-[11px] text-[#524345] truncate">
                    {currentUser?.email || "admin@amanikhalil.sa"}
                  </p>
                </div>
                <Link
                  href="/admin/calendar"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#211a1b] hover:bg-[#faeaeb]"
                >
                  <Calendar className="h-4 w-4 text-[#735c00]" />
                  <span>{t("أجندة حجوزات العرائس", "Bridal Booking Calendar")}</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#211a1b] hover:bg-[#faeaeb]"
                >
                  <Settings className="h-4 w-4 text-[#735c00]" />
                  <span>{t("إعدادات النظام والصلاحيات", "System Settings & Access")}</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#211a1b] hover:bg-[#faeaeb]"
                >
                  <ExternalLink className="h-4 w-4 text-[#735c00]" />
                  <span>{t("الانتقال للموقع العام", "View Public Site")}</span>
                </Link>
                <div className="my-1 border-t border-[#eedfe0]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#93000a] hover:bg-[#ffdad6]/50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("تسجيل الخروج", "Sign Out")}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Admin Navigation Drawer (shadcn Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side={isEnglish ? "left" : "right"}
          className="w-80 bg-[#fff0f1] border-l border-[#d7c1c3] p-5 flex flex-col"
        >
          <SheetHeader className="border-b border-[#eedfe0] pb-4 text-start">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ak-monogram-hd.png" alt="أماني خليل" className="h-10 w-10 rounded-xl object-contain bg-[#2f020d] p-1 shadow-sm" />
              <span className="font-serif font-bold text-base text-[#2f020d]">
                {t("أماني خليل", "Amani Khalil")}
              </span>
            </div>
            <SheetTitle className="text-lg font-bold text-[#2f020d] mt-2">
              {t("لوحة التحكم الملكية", "Royal Admin Dashboard")}
            </SheetTitle>
            <SheetDescription className="text-xs text-[#524345]">
              {t(
                "إدارة المواعيد، الباقات، الفواتير، وملفات العرائس.",
                "Manage appointments, packages, invoices, and client profiles."
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 mt-4 overflow-y-auto">
            {renderSidebarLinks(() => setMobileMenuOpen(false))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

