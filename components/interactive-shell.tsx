"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sparkles,
  Calendar,
  Compass,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  Crown,
  Search,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
  Minus,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { AdminChrome } from "@/components/admin-chrome";
import { useAppStore } from "@/providers/app-store-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface RouteItem {
  title: string;
  subtitle: string;
  href: string;
  category: "public" | "booking";
  badge?: string;
}

interface BookingInspectorData {
  ref: string;
  clientName: string;
  packageName: string;
  date: string;
  amount: string;
  status: string;
}

const ALL_ROUTES: RouteItem[] = [
  // Public Pages
  {
    title: "الصفحة الرئيسية",
    subtitle: "الواجهة الملكية ومعالج الحجز السريع",
    href: "/",
    category: "public",
    badge: "الرئيسية",
  },
  {
    title: "عن خبيرة التجميل أماني خليل",
    subtitle: "الفلسفة الفنية والاعتمادات والشهادات الدولية المعتمدة",
    href: "/about",
    category: "public",
  },
  {
    title: "باقات الخدمات والأسعار الرسمية",
    subtitle: "مقارنة الباقات وحاسبة الإضافات التفاعلية",
    href: "/services",
    category: "public",
    badge: "تفاعلي",
  },
  {
    title: "باقة العروس الملكية الفاخرة",
    subtitle: "تفاصيل الباقة الملكية المتكاملة للعروس والمرافقة",
    href: "/services/vip-bridal",
    category: "public",
    badge: "الأكثر طلباً",
  },
  {
    title: "مكياج العرائس الفاخر بالرياض",
    subtitle: "صفحة هبوط مخصصة لعرائس الرياض وزيارات القصور",
    href: "/bridal-makeup-riyadh",
    category: "public",
  },
  {
    title: "مكياج السهرات والمناسبات بالرياض",
    subtitle: "إطلالات السهرات والملكة والمناسبات الخاصة",
    href: "/occasion-makeup-riyadh",
    category: "public",
  },
  {
    title: "معرض الأعمال والإطلالات الملكية",
    subtitle: "ألبوم الصور الموثقة مع عارض الصور التفاعلي",
    href: "/gallery",
    category: "public",
  },
  {
    title: "آراء وتقييمات العميلات",
    subtitle: "تقييمات موثقة من واقع حجوزات مكتملة",
    href: "/reviews",
    category: "public",
  },
  {
    title: "الأسئلة الشائعة",
    subtitle: "بحث فوري وتصنيف تفاعلي لكافة الاستفسارات",
    href: "/faq",
    category: "public",
  },
  {
    title: "المدونة الملكية وأسرار الجمال",
    subtitle: "نصائح العرائس، أسرار ثبات المكياج، وصيحات الموضة",
    href: "/blog",
    category: "public",
    badge: "جديد",
  },
  {
    title: "تواصل والسياسات وشروط الحجز",
    subtitle: "نموذج الاستشارة وسياسات العربون والخصوصية",
    href: "/contact",
    category: "public",
  },

  // Booking Flow
  {
    title: "حجز موعد ملكي فاخر",
    subtitle: "تدفق الحجز من 4 خطوات مع حاسبة العربون 30%",
    href: "/book",
    category: "booking",
    badge: "حجز فوري",
  },
  {
    title: "تأكيد الحجز والفاتورة الرسمية",
    subtitle: "تفاصيل الموعد المؤكد، رقم المرجع، وتحميل الفاتورة",
    href: "/book/confirmation",
    category: "booking",
  },
];

const WHATSAPP_PRESETS: Record<string, string> = {
  "1": "مرحباً بكِ عروستنا الغالية {اسم_العروس} 💍✨\nتم استلام عربون الحجز بنجاح وتثبيت موعدكِ الملكي بتاريخ {موعد_المناسبة} في {مقر_الحفل}.\nرقم الحجز المرجعي: {رقم_الحجز}\nنتشرف بمرافقتكِ في أجمل ليالي العمر — أماني خليل.",
  "2": "تذكير ودي لعروستنا الجميلة {اسم_العروس} 🌸\nيتبقى 48 ساعة على موعد جلستنا الملكية بتاريخ {موعد_المناسبة} في {مقر_الحفل}.\nنوصيكِ بشرب الماء بكثرة وتجنب المقشرات، وسنكون معكِ على الموعد تماماً بإذن الله.",
  "3": "ألف مبروك يا أجمل عروس {اسم_العروس} 🤍✨\nسعدنا جداً بمرافقتكِ في ليلتكِ الاستثنائية. يسعدنا تقييم تجربتكِ عبر الرابط التالي: {رابط_السداد} مع كامل الخصوصية والسرية التامة.",
};

export function InteractiveShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { createBooking, packages, areas, bookings, reviews } = useAppStore();

  const [navSheetOpen, setNavSheetOpen] = useState(false);
  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const [manualBookingOpen, setManualBookingOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pendingBookingsNotifs = bookings.filter(
    (b) => b.status === "PENDING_PAYMENT"
  );
  const unapprovedReviewsNotifs = reviews.filter((r) => !r.approved);
  const confirmedBookingsNotifs = bookings.filter(
    (b) => b.status === "CONFIRMED"
  );
  const actionableCount =
    pendingBookingsNotifs.length + unapprovedReviewsNotifs.length;

  const [unreadCount, setUnreadCount] = useState<number>(actionableCount);

  useEffect(() => {
    setUnreadCount(actionableCount);
  }, [actionableCount]);

  // Package Quick-Booking Modal State
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [selectedPackageInfo, setSelectedPackageInfo] = useState({
    name: "باقة العروس الملكية VIP",
    price: 2800,
  });

  // Booking Inspector Modal State
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingInspectorData>({
    ref: "AK-2025-8942",
    clientName: "سارة بنت فيصل آل سعود",
    packageName: "باقة العروس الملكية VIP",
    date: "الخميس، 9 أكتوبر 2025",
    amount: "3,550 ر.س",
    status: "مؤكد بالعربون (30%)",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Quick manual booking form state
  const [brideName, setBrideName] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("vip-bridal");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("area_hotels_vip");
  const [bookingDate, setBookingDate] = useState("2025-10-26");
  const [bookingTimeSlot, setBookingTimeSlot] = useState("عصراً (02:00 م)");
  const [district, setDistrict] = useState("حي الملقا - الرياض");

  // Expose global helpers for Stitch HTML inline handlers
  useEffect(() => {
    const win = window as unknown as Record<string, unknown>;

    win.__openNavSheet = () => setNavSheetOpen(true);
    win.__openManualBooking = () => setManualBookingOpen(true);
    win.__openNotifications = () => setNotificationsOpen(true);
    win.__openPackageDialog = (pkgName: string, price?: number) => {
      let inferredPrice = price || 2800;
      if (!price) {
        if (pkgName.includes("تجربة") || pkgName.includes("Trial")) {
          inferredPrice = 950;
        } else if (pkgName.includes("المرافقات") || pkgName.includes("جناح")) {
          inferredPrice = 4800;
        } else if (pkgName.includes("سهرة") || pkgName.includes("مناسبات")) {
          inferredPrice = 950;
        } else if (pkgName.includes("سوفت")) {
          inferredPrice = 650;
        }
      }
      setSelectedPackageInfo({
        name: pkgName || "باقة العروس الملكية VIP",
        price: inferredPrice,
      });
      setPackageDialogOpen(true);
    };
    win.__openBookingDetails = (
      refOrData: string | Partial<BookingInspectorData>
    ) => {
      if (typeof refOrData === "string") {
        setBookingDetails((prev) => ({
          ...prev,
          ref: refOrData.replace(/^#/, "") || "AK-2025-8942",
        }));
      } else if (refOrData && typeof refOrData === "object") {
        setBookingDetails((prev) => ({
          ...prev,
          ...refOrData,
        }));
      }
      setBookingDetailsOpen(true);
    };
    win.__navigate = (path: string) => {
      router.push(path);
    };
    win.__toast = (msg: string, desc?: string) => {
      toast.success(msg, { description: desc });
    };
    win.__toastError = (msg: string, desc?: string) => {
      toast.error(msg, { description: desc });
    };
  }, [router]);

  // Escape key closes any open Stitch modal overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const modalIds = [
        "certificate-modal",
        "certModal",
        "galleryLightbox",
        "upload-modal",
        "calendarDropdown",
      ];
      modalIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains("hidden")) {
          el.classList.add("hidden");
          el.classList.remove("flex");
        }
      });
      document.body.style.overflow = "";
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Smooth scroll for in-page anchor links without interfering with React forms or buttons
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetSection = document.querySelector(href);
        if (targetSection) {
          e.preventDefault();
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !bridePhone.trim()) {
      toast.error("يرجى إدخال اسم العميلة ورقم الجوال");
      return;
    }

    const matchedPkg =
      packages.find((p) => p.id === selectedPackageId) || packages[0];
    const matchedArea =
      areas.find((a) => a.id === selectedAreaId) || areas[0];

    const isVipBridal = matchedPkg?.id === "vip-bridal";
    const travelFee = isVipBridal ? 0 : (matchedArea?.travelFee ?? 0);
    const totalNum = (matchedPkg?.price ?? 2800) + travelFee;
    const depositNum = Math.round(
      (totalNum * (matchedPkg?.depositPercentage ?? 30)) / 100
    );

    const createdBooking = createBooking({
      clientName: brideName.trim(),
      phone: bridePhone.trim(),
      packageId: matchedPkg?.id || "vip-bridal",
      packageName: matchedPkg?.title || "باقة العروس الملكية VIP",
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      locationType: "HOTEL_HALL",
      venue: district || matchedArea?.nameAr || "الرياض",
      areaId: matchedArea?.id || "area_hotels_vip",
      totalAmount: totalNum,
      depositAmount: depositNum,
      remainingAmount: totalNum - depositNum,
      status: "CONFIRMED",
      addonIds: [],
      notes: "حجز إداري مباشر من لوحة التحكم",
    });

    try {
      sessionStorage.setItem(
        "amani_last_booking",
        JSON.stringify({
          ref: createdBooking.ref,
          brideName: brideName.trim(),
          bridePhone: bridePhone.trim(),
          pkgTitle: matchedPkg?.title || "باقة العروس الملكية VIP",
          date: bookingDate,
          venue: district,
          grandTotal: totalNum,
          deposit: depositNum,
          remaining: totalNum - depositNum,
        })
      );
    } catch {
      // ignore storage errors
    }

    setManualBookingOpen(false);
    toast.success(`تم إنشاء الحجز الملكي للعروس ${brideName} وحفظه في قاعدة البيانات!`, {
      description: `المرجع #${createdBooking.ref} • التاريخ: ${bookingDate}`,
      action: {
        label: "عرض الفاتورة",
        onClick: () => router.push("/book/confirmation"),
      },
    });
    setBrideName("");
    setBridePhone("");
  };

  const handleProceedPackageBooking = () => {
    try {
      sessionStorage.setItem(
        "amani_selected_pkg",
        JSON.stringify(selectedPackageInfo)
      );
    } catch {
      // ignore
    }
    setPackageDialogOpen(false);
    router.push("/book");
  };

  const filteredRoutes = ALL_ROUTES.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.href.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentRouteObj = ALL_ROUTES.find((r) => r.href === pathname);
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminDashboard = isAdminRoute && pathname !== "/admin/login";

  return (
    <>
      {/* Unified Public Header with Brand Logo */}
      {!isAdminRoute && (
        <div data-shell-ui="true">
          <SiteHeader
            onOpenMobileMenu={() => setNavSheetOpen(true)}
          />
        </div>
      )}

      {/* Unified Responsive Admin Sidebar + Top Header with Brand Logo */}
      {isAdminDashboard && (
        <div data-shell-ui="true">
          <AdminChrome
            onOpenManualBooking={() => setManualBookingOpen(true)}
            onOpenNotifications={() => setNotificationsOpen(true)}
            unreadCount={unreadCount}
          />
        </div>
      )}

      {children}

      {/* Floating Royal Quick-Navigation & Interactive Dock (shadcn/ui powered) - Public pages only to keep admin workspace clean */}
      {!isAdminRoute && (
        isDockMinimized ? (
          <button
            type="button"
            onClick={() => setIsDockMinimized(false)}
            className="hidden sm:flex fixed bottom-5 left-5 z-40 h-10 w-10 items-center justify-center rounded-full border border-[#735c00]/50 bg-[#2f020d]/95 text-[#fed65b] shadow-2xl backdrop-blur-xl transition-all hover:scale-110 hover:border-[#fed65b] cursor-pointer"
            title="عرض دليل الصفحات والملاحة السريعة"
            aria-label="عرض دليل الصفحات والملاحة السريعة"
          >
            <Compass className="h-5 w-5" />
          </button>
        ) : (
          <div
            data-shell-ui="true"
            dir="rtl"
            className="hidden sm:flex fixed bottom-5 left-5 z-40 items-center gap-2 rounded-full border border-[#735c00]/30 bg-[#2f020d]/95 p-1.5 text-white shadow-[0_12px_32px_rgba(47,2,13,0.45)] backdrop-blur-xl transition-all hover:border-[#fed65b]/60"
          >
            <Button
              variant="gold"
              size="sm"
              onClick={() => setNavSheetOpen(true)}
              className="rounded-full px-4 py-2 text-xs font-bold shadow-md cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>دليل الصفحات ({ALL_ROUTES.length})</span>
            </Button>

            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#4a1521] px-3.5 py-2 text-xs font-semibold text-[#ffd9dd] transition-colors hover:bg-[#71333f] hover:text-white"
            >
              <Calendar className="h-3.5 w-3.5 text-[#fed65b]" />
              <span>حجز موعد</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsDockMinimized(true)}
              className="h-7 w-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-xs ms-0.5"
              title="تصغير شريط التنقل"
              aria-label="تصغير شريط التنقل"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      )}

      {/* shadcn Sheet: Mobile Navigation & Sitemap */}
      <Sheet open={navSheetOpen} onOpenChange={setNavSheetOpen}>
        <SheetContent
          data-shell-ui="true"
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto bg-[#fff8f7] border-l border-[#d7c1c3] p-6"
        >
          <SheetHeader className="border-b border-[#eedfe0] pb-4 text-right">
            <div className="flex items-center justify-between gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="أماني خليل"
                className="h-10 w-auto max-w-[165px] object-contain"
              />
              <Badge variant="gold">{ALL_ROUTES.length} صفحة</Badge>
            </div>
            <SheetTitle className="text-xl font-bold text-[#2f020d]">
              التنقل السريع ومستكشف الصفحات
            </SheetTitle>
            <SheetDescription className="text-[#524345]">
              انتقلي بسهولة بين صفحات الموقع العام وتدفق الحجز الملكي.
            </SheetDescription>

            <div className="relative mt-3">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي عن صفحة أو مسار (مثال: عرائس، حجز، خدمات)..."
                className="pr-10 bg-white"
              />
            </div>
          </SheetHeader>

          <div className="mt-5">
            {currentRouteObj && (
              <div className="mb-4 rounded-2xl bg-[#faeaeb] p-3.5 border border-[#d7c1c3]">
                <div className="text-xs font-semibold text-[#735c00] mb-1">
                  الصفحة الحالية النشطة:
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#2f020d]">
                    {currentRouteObj.title}
                  </span>
                  <code className="text-xs bg-white px-2 py-0.5 rounded-md text-[#4a1521] border border-[#d7c1c3]">
                    {pathname}
                  </code>
                </div>
              </div>
            )}

            <Tabs defaultValue="all" dir="rtl" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-11 bg-[#faeaeb] p-1">
                <TabsTrigger value="all" className="text-xs px-2">
                  الكل ({filteredRoutes.length})
                </TabsTrigger>
                <TabsTrigger value="public" className="text-xs px-2">
                  الموقع العام
                </TabsTrigger>
                <TabsTrigger value="booking" className="text-xs px-2">
                  تدفق الحجز
                </TabsTrigger>
              </TabsList>

              {(["all", "public", "booking"] as const).map(
                (tabKey) => {
                  const items = filteredRoutes.filter((r) =>
                    tabKey === "all" ? true : r.category === tabKey
                  );
                  return (
                    <TabsContent
                      key={tabKey}
                      value={tabKey}
                      className="space-y-2.5 mt-4"
                    >
                      {items.map((route) => {
                        const isActive = pathname === route.href;
                        return (
                          <Link
                            key={route.href}
                            href={route.href}
                            onClick={() => setNavSheetOpen(false)}
                            className={`group flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                              isActive
                                ? "border-[#4a1521] bg-[#4a1521] text-white shadow-md"
                                : "border-[#eedfe0] bg-white text-[#211a1b] hover:border-[#735c00]/50 hover:bg-[#fff0f1]"
                            }`}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm">
                                  {route.title}
                                </span>
                                {route.badge && (
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                      isActive
                                        ? "bg-[#fed65b] text-[#241a00]"
                                        : "bg-[#faeaeb] text-[#4a1521]"
                                    }`}
                                  >
                                    {route.badge}
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs ${
                                  isActive ? "text-[#ffd9dd]" : "text-[#524345]"
                                }`}
                              >
                                {route.subtitle}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <code
                                className={`text-[11px] px-2 py-0.5 rounded ${
                                  isActive
                                    ? "bg-black/20 text-[#fed65b]"
                                    : "bg-[#faeaeb] text-[#524345]"
                                }`}
                              >
                                {route.href}
                              </code>
                              <ExternalLink
                                className={`h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 ${
                                  isActive ? "text-[#fed65b]" : "text-[#857374]"
                                }`}
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </TabsContent>
                  );
                }
              )}
            </Tabs>

            <div className="mt-6 pt-4 border-t border-[#eedfe0] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setNavSheetOpen(false);
                  setManualBookingOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 text-[#735c00]" />
                <span>حجز سريع (Modal)</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => {
                  setNavSheetOpen(false);
                  router.push("/book");
                }}
              >
                <Sparkles className="h-4 w-4 text-[#fed65b]" />
                <span>صفحة الحجز الملكي</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* shadcn Dialog: Package Quick-Selection & Booking Modal */}
      <Dialog open={packageDialogOpen} onOpenChange={setPackageDialogOpen}>
        <DialogContent data-shell-ui="true" className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold">اختيار الباقة الملكية</Badge>
              <Badge variant="secondary">تثبيت بعربون 30%</Badge>
            </div>
            <DialogTitle>{selectedPackageInfo.name}</DialogTitle>
            <DialogDescription>
              اختيار موفق! يمكنكِ المتابعة مباشرة لاختيار تاريخ المناسبة والخدمات الإضافية أو التحدث مع المنسقة عبر الواتساب.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl bg-[#faeaeb] p-4 space-y-2.5 text-sm border border-[#d7c1c3]">
            <div className="flex items-center justify-between">
              <span className="text-[#524345]">قيمة الباقة الأساسية:</span>
              <span className="font-bold text-base text-[#2f020d]">
                {selectedPackageInfo.price.toLocaleString("ar-SA")} ر.س
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#524345]">العربون لتثبيت التاريخ (30%):</span>
              <span className="font-bold text-[#735c00]">
                {Math.round(selectedPackageInfo.price * 0.3).toLocaleString(
                  "ar-SA"
                )}{" "}
                ر.س
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#d7c1c3]/60 text-xs text-[#524345]">
              <ShieldCheck className="h-4 w-4 text-[#735c00] shrink-0" />
              <span>يشمل عقد حجز رسمي وضمان المرونة حتى 21 يوماً قبل الموعد</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <a
              href={`https://wa.me/966500000000?text=${encodeURIComponent(
                `مرحباً أماني خليل، أود الاستفسار وحجز: ${selectedPackageInfo.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPackageDialogOpen(false)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d7c1c3] bg-white px-5 text-xs font-bold text-[#2f020d] hover:bg-[#fff0f1] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>استشارة عبر واتساب</span>
            </a>
            <Button
              type="button"
              variant="default"
              onClick={handleProceedPackageBooking}
              className="flex-1"
            >
              <span>المتابعة لإتمام الحجز الفوري</span>
              <ArrowLeft className="h-4 w-4 text-[#fed65b]" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* shadcn Dialog: Quick Manual Booking Creation */}
      <Dialog open={manualBookingOpen} onOpenChange={setManualBookingOpen}>
        <DialogContent data-shell-ui="true" className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold">حجز ملكي سريع</Badge>
              <Badge variant="secondary">الرياض - خدمة منزلية وفندقية</Badge>
            </div>
            <DialogTitle>إضافة حجز موعد جديد</DialogTitle>
            <DialogDescription>
              أدخلي بيانات العروس أو العميلة لتثبيت الموعد وإصدار سند العربون الرسمي فوراً.
            </DialogDescription>
          </DialogHeader>

          <form
            data-react-form="true"
            onSubmit={handleCreateManualBooking}
            className="space-y-4 mt-2"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2f020d]">
                اسم العروس / العميلة الكريم *
              </label>
              <Input
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="مثال: الأميرة سارة آل سعود / نورة القحطاني"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2f020d]">
                  رقم الجوال (واتساب) *
                </label>
                <Input
                  value={bridePhone}
                  onChange={(e) => setBridePhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className="text-right"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2f020d]">
                  تاريخ المناسبة *
                </label>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2f020d]">
                  الفترة الزمنية *
                </label>
                <select
                  value={bookingTimeSlot}
                  onChange={(e) => setBookingTimeSlot(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#d7c1c3] bg-white px-3 py-2 text-xs text-[#211a1b] focus:outline-none focus:ring-2 focus:ring-[#735c00]/40"
                >
                  <option value="صباحاً (11:00 ص)">صباحاً (11:00 ص)</option>
                  <option value="عصراً (02:00 م)">عصراً (02:00 م)</option>
                  <option value="عصراً (02:30 م)">عصراً (02:30 م)</option>
                  <option value="مساءً (04:30 م)">مساءً (04:30 م)</option>
                  <option value="مساءً (06:45 م)">مساءً (06:45 م)</option>
                  <option value="مساءً (08:30 م)">مساءً (08:30 م)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2f020d]">
                  الباقة المختارة *
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#d7c1c3] bg-white px-3 py-2 text-xs text-[#211a1b] focus:outline-none focus:ring-2 focus:ring-[#735c00]/40"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.price.toLocaleString("ar-SA")} ر.س)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2f020d]">
                  منطقة أو فندق الخدمة *
                </label>
                <select
                  value={selectedAreaId}
                  onChange={(e) => setSelectedAreaId(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#d7c1c3] bg-white px-3 py-2 text-xs text-[#211a1b] focus:outline-none focus:ring-2 focus:ring-[#735c00]/40"
                >
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nameAr} ({a.travelFee === 0 ? "تغطية مشمولة" : `+${a.travelFee} ر.س`})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2f020d]">
                الحي / الفندق في الرياض
              </label>
              <Input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="حي الملقا / فندق الريتز كارلتون / الفورسيزونز"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setManualBookingOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" variant="default">
                <CheckCircle2 className="h-4 w-4 text-[#fed65b]" />
                <span>تأكيد الحجز وإصدار السند</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* shadcn Dialog: Notifications Center */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent data-shell-ui="true" className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="gold">
                {unreadCount > 0
                  ? `${unreadCount} تنبيهات جديدة`
                  : "لا توجد تنبيهات غير مقروءة"}
              </Badge>
            </div>
            <DialogTitle className="mt-1">مركز الإشعارات الملكي</DialogTitle>
            <DialogDescription>
              أحدث الحجوزات، الدفعات المؤكدة، وتنبيهات المواعيد القادمة.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2 max-h-[360px] overflow-y-auto">
            {actionableCount === 0 && confirmedBookingsNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#857374] bg-[#fff8f7] rounded-2xl border border-[#eedfe0]">
                لا توجد تنبيهات غير مقروءة حالياً ✓
              </div>
            ) : (
              <>
                {/* Pending Bookings requiring deposit */}
                {pendingBookingsNotifs.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      router.push("/admin/bookings");
                    }}
                    className="cursor-pointer rounded-2xl border border-[#d7c1c3] bg-white p-3.5 transition-all hover:border-[#735c00]"
                  >
                    <div className="flex items-center justify-between text-xs text-[#735c00] font-bold mb-1">
                      <span>طلب حجز بانتظار سداد العربون</span>
                      <span className="font-mono">#{b.ref}</span>
                    </div>
                    <p className="text-sm font-bold text-[#2f020d]">
                      العروس {b.clientName} — {b.packageName}
                    </p>
                    <p className="text-xs text-[#524345] mt-0.5">
                      العربون: {b.depositAmount.toLocaleString("en-US")} ر.س • الموعد: {b.date} ({b.timeSlot})
                    </p>
                  </div>
                ))}

                {/* Unapproved Reviews requiring moderation */}
                {unapprovedReviewsNotifs.slice(0, 2).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      router.push("/admin/content");
                    }}
                    className="cursor-pointer rounded-2xl border border-[#d7c1c3] bg-white p-3.5 transition-all hover:border-[#735c00]"
                  >
                    <div className="flex items-center justify-between text-xs text-[#735c00] font-bold mb-1">
                      <span>تقييم جديد بانتظار الاعتماد ⭐</span>
                      <span>{r.date}</span>
                    </div>
                    <p className="text-sm font-bold text-[#2f020d]">
                      {r.clientName} أضافت تقييماً {r.rating} نجوم
                    </p>
                    <p className="text-xs text-[#524345] mt-0.5 line-clamp-1">
                      &ldquo;{r.comment}&rdquo;
                    </p>
                  </div>
                ))}

                {/* Confirmed / Upcoming appointments */}
                {confirmedBookingsNotifs.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      router.push("/admin/calendar");
                    }}
                    className="cursor-pointer rounded-2xl border border-[#eedfe0] bg-white p-3.5 transition-all hover:border-[#735c00]"
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-1">
                      <span>موعد مؤكد بالعربون ✓</span>
                      <span>{b.date}</span>
                    </div>
                    <p className="text-sm font-bold text-[#2f020d]">
                      جلسة {b.clientName} — {b.venue}
                    </p>
                    <p className="text-xs text-[#524345] mt-0.5">
                      الساعة {b.timeSlot} • {b.packageName}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setUnreadCount(0);
                setNotificationsOpen(false);
                toast.success("تم تحديد جميع الإشعارات كمقروءة");
              }}
            >
              تحديد الكل كمقروء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* shadcn Dialog: Rich Booking & Invoice Inspector */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent data-shell-ui="true" className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="w-fit">
                مرجع #{bookingDetails.ref}
              </Badge>
              <Badge variant="secondary">{bookingDetails.status}</Badge>
            </div>
            <DialogTitle className="mt-2">
              {bookingDetails.clientName}
            </DialogTitle>
            <DialogDescription>
              معاينة شاملة لملف الحجز، حالة الدفعات، وإجراءات التواصل السريع.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl bg-[#faeaeb] p-4 space-y-2.5 text-sm border border-[#d7c1c3]">
            <div className="flex justify-between gap-2">
              <span className="text-[#524345]">الباقة المختارة:</span>
              <span className="font-bold text-[#2f020d] text-left">
                {bookingDetails.packageName}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#524345]">تاريخ الموعد:</span>
              <span className="font-semibold text-[#211a1b]">
                {bookingDetails.date}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#524345]">إجمالي القيمة:</span>
              <span className="font-bold text-[#735c00]">
                {bookingDetails.amount}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#524345]">الخبيرة المسؤولة:</span>
              <span className="font-semibold">أماني خليل + مساعدة VIP</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                try {
                  const numAmount =
                    parseInt(
                      bookingDetails.amount.replace(/[^\d]/g, ""),
                      10
                    ) || 3550;
                  sessionStorage.setItem(
                    "amani_last_booking",
                    JSON.stringify({
                      ref: bookingDetails.ref,
                      brideName: bookingDetails.clientName,
                      pkgTitle: bookingDetails.packageName,
                      date: bookingDetails.date,
                      grandTotal: numAmount,
                      deposit: Math.round(numAmount * 0.3),
                      remaining: numAmount - Math.round(numAmount * 0.3),
                    })
                  );
                } catch {
                  // ignore
                }
                setBookingDetailsOpen(false);
                router.push("/book/confirmation");
              }}
            >
              معاينة الفاتورة الرسمية
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setBookingDetails((prev) => ({
                  ...prev,
                  status: "مؤكد وموثق ✓",
                }));
                setBookingDetailsOpen(false);
                toast.success(
                  `تم إرسال تذكير واتساب وتحديث حالة #${bookingDetails.ref}`
                );
              }}
            >
              تأكيد وإرسال تذكير واتساب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
