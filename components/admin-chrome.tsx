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

interface AdminChromeProps {
  onOpenManualBooking: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "النظرة العامة والنشاط",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/bookings",
    label: "جدول الحجوزات والمواعيد",
    icon: ClipboardList,
    badge: "12",
  },
  {
    href: "/admin/calendar",
    label: "تقويم الزفاف والأجندة",
    icon: CalendarDays,
  },
  {
    href: "/admin/services",
    label: "إدارة الخدمات والباقات",
    icon: Sparkles,
  },
  {
    href: "/admin/invoices",
    label: "الفواتير والمدفوعات",
    icon: FileSpreadsheet,
  },
  {
    href: "/admin/customers",
    label: "سجل العميلات (CRM)",
    icon: Users,
  },
  {
    href: "/admin/content",
    label: "المحتوى والتقييمات",
    icon: FolderKanban,
    badge: "4",
  },
  {
    href: "/admin/blog",
    label: "إدارة المدونة والمقالات",
    icon: Sparkles,
  },
  {
    href: "/admin/settings",
    label: "الإعدادات والصلاحيات",
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
                <span className="truncate">{item.label}</span>
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
            <span>إنشاء باقة خدمة جديدة</span>
          </Link>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#eedfe0] space-y-2">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-[#2f020d] border border-[#eedfe0] hover:border-[#735c00]/60 transition-all"
        >
          <span>معاينة الموقع العام</span>
          <ExternalLink className="h-3.5 w-3.5 text-[#735c00]" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-[#857374] hover:bg-[#ffdad6]/50 hover:text-[#93000a] transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>تسجيل الخروج الآمن</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Right Sidebar */}
      <aside
        dir="rtl"
        aria-label="القائمة الإدارية الجانبية"
        className="hidden lg:flex fixed right-0 top-0 bottom-0 w-72 bg-[#fff0f1] border-l border-[#eedfe0] shadow-[0_1px_12px_rgba(47,2,13,0.05)] z-40 flex-col p-5 overflow-y-auto"
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
                أماني خليل
              </span>
              <span className="text-[10px] text-[#735c00] tracking-wider uppercase font-semibold">
                Haute Beauté Admin
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="gold" className="text-[10px] px-2.5 py-0.5">
              لوحة الإدارة الملكية
            </Badge>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#524345]">
              <span
                className={`h-2 w-2 rounded-full animate-pulse ${
                  isSupabaseConnected ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isSupabaseConnected ? "Supabase متصل" : "وضع محلي"}
            </span>
          </div>
        </div>

        <div className="flex-1">{renderSidebarLinks()}</div>
      </aside>

      {/* Top Fixed Admin Bar */}
      <header
        dir="rtl"
        className="fixed top-0 right-0 lg:right-72 left-0 h-20 bg-[#fff8f7]/95 backdrop-blur-xl border-b border-[#eedfe0] shadow-[0_2px_12px_rgba(74,21,33,0.04)] z-30 px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3"
      >
        {/* Right: Mobile Menu Button + Live Search */}
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
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374] pointer-events-none" />
            <input
              type="text"
              value={liveQuery}
              onChange={(e) => applyLiveFilter(e.target.value)}
              placeholder="بحث فوري بالاسم، رقم الحجز #AK، الباقة، أو الحالة..."
              className="w-full h-11 pr-10 pl-20 rounded-full bg-[#fff0f1] border border-[#eedfe0] text-xs sm:text-sm text-[#211a1b] placeholder:text-[#857374] focus:bg-white focus:border-[#735c00] focus:outline-none transition-all"
            />
            {liveQuery && (
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {matchCount !== null && (
                  <span className="rounded-full bg-[#fed65b] px-2 py-0.5 text-[10px] font-bold text-[#241a00]">
                    {matchCount} نتيجة
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

        {/* Left: Quick Actions, Notifications, Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenManualBooking}
            className="h-10 sm:h-11 px-3.5 sm:px-5 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_4px_14px_rgba(74,21,33,0.2)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 text-[#fed65b]" />
            <span className="hidden md:inline">إضافة حجز يدوي</span>
            <span className="md:hidden">حجز</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="الإشعارات"
            className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#fff0f1] hover:bg-[#faeaeb] border border-[#eedfe0] flex items-center justify-center text-[#2f020d] transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#fff8f7]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-full bg-[#fff0f1] hover:bg-[#faeaeb] border border-[#eedfe0] p-1.5 pl-3 transition-colors cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-[#4a1521] text-[#fed65b] flex items-center justify-center text-xs font-bold">
                أ.خ
              </div>
              <div className="hidden xl:flex flex-col items-start text-right">
                <span className="text-xs font-bold text-[#2f020d] leading-tight">
                  أماني خليل
                </span>
                <span className="text-[10px] text-[#735c00] font-semibold">
                  المديرة والمؤسسة
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#524345]" />
            </button>

            {profileMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-[#d7c1c3] bg-[#fff8f7] p-2 shadow-[0_16px_40px_rgba(47,2,13,0.16)] z-50">
                <div className="px-3 py-2 border-b border-[#eedfe0] mb-1">
                  <p className="text-xs font-bold text-[#2f020d]">
                    أماني خليل — Haute Beauté
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
                  <span>أجندة حجوزات العرائس</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#211a1b] hover:bg-[#faeaeb]"
                >
                  <Settings className="h-4 w-4 text-[#735c00]" />
                  <span>إعدادات النظام والصلاحيات</span>
                </Link>
                <Link
                  href="/"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#211a1b] hover:bg-[#faeaeb]"
                >
                  <ExternalLink className="h-4 w-4 text-[#735c00]" />
                  <span>الانتقال للموقع العام</span>
                </Link>
                <div className="my-1 border-t border-[#eedfe0]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#93000a] hover:bg-[#ffdad6]/50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Admin Navigation Drawer (shadcn Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className="w-80 bg-[#fff0f1] border-l border-[#d7c1c3] p-5 flex flex-col"
        >
          <SheetHeader className="border-b border-[#eedfe0] pb-4 text-right">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ak-monogram-hd.png" alt="أماني خليل" className="h-10 w-10 rounded-xl object-contain bg-[#2f020d] p-1 shadow-sm" />
              <span className="font-serif font-bold text-base text-[#2f020d]">أماني خليل</span>
            </div>
            <SheetTitle className="text-lg font-bold text-[#2f020d] mt-2">
              لوحة التحكم الملكية
            </SheetTitle>
            <SheetDescription className="text-xs text-[#524345]">
              إدارة المواعيد، الباقات، الفواتير، وملفات العرائس.
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

