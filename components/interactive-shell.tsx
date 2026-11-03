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
  LayoutDashboard,
  Search,
  MessageCircle,
  ArrowLeft,
  ShieldCheck,
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
  category: "public" | "booking" | "admin";
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
    title: "الرئيسية | Amani Khalil",
    subtitle: "الواجهة الملكية ومعالج الحجز السريع",
    href: "/",
    category: "public",
    badge: "الرئيسية",
  },
  {
    title: "عن خبيرة التجميل أماني خليل",
    subtitle: "الفلسفة الفنية والاعتمادات الدولية CIDESCO",
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
    title: "باقة العروس الملكية VIP",
    subtitle: "تفاصيل الباقة الملكية المتكاملة للعروس",
    href: "/services/vip-bridal",
    category: "public",
    badge: "VIP",
  },
  {
    title: "مكياج العرائس الفاخر بالرياض",
    subtitle: "صفحة هبوط مخصصة لعرائس الرياض",
    href: "/bridal-makeup-riyadh",
    category: "public",
  },
  {
    title: "مكياج السهرات والمناسبات بالرياض",
    subtitle: "إطلالات السهرات والمناسبات الخاصة",
    href: "/occasion-makeup-riyadh",
    category: "public",
  },
  {
    title: "معرض الأعمال والإطلالات الملكية",
    subtitle: "ألبوم الصور الموثقة مع عارض Lightbox",
    href: "/gallery",
    category: "public",
  },
  {
    title: "آراء وتقييمات العميلات",
    subtitle: "تقييمات موثقة من حجوزات مكتملة",
    href: "/reviews",
    category: "public",
  },
  {
    title: "الأسئلة الشائعة | FAQ",
    subtitle: "بحث فوري وتصنيف تفاعلي للأسئلة",
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
    title: "حجز موعد ملكي | Luxury Booking",
    subtitle: "تدفق الحجز من 4 خطوات مع حاسبة العربون 30%",
    href: "/book",
    category: "booking",
    badge: "حجز فوري",
  },
  {
    title: "تأكيد الحجز والفاتورة الرسمية",
    subtitle: "تفاصيل الموعد المؤكد، رقم المرجع، وتحميل PDF",
    href: "/book/confirmation",
    category: "booking",
  },

  // Admin Dashboard
  {
    title: "لوحة التحكم | النظرة العامة",
    subtitle: "ملخص النشاط اليومي والمؤشرات المالية",
    href: "/admin",
    category: "admin",
    badge: "الإدارة",
  },
  {
    title: "إدارة الحجوزات والمواعيد",
    subtitle: "جدول الحجوزات، الفرز، ومعاينة تفاصيل العروس",
    href: "/admin/bookings",
    category: "admin",
  },
  {
    title: "تقويم الزفاف وإشغال المواعيد",
    subtitle: "التقويم التفاعلي الشهري والأسبوعي",
    href: "/admin/calendar",
    category: "admin",
  },
  {
    title: "إدارة الخدمات والباقات الرسمية",
    subtitle: "تعديل الأسعار، الإضافات، وتفعيل الباقات",
    href: "/admin/services",
    category: "admin",
  },
  {
    title: "نافذة إضافة باقة جديدة",
    subtitle: "نموذج إنشاء باقة جديدة وتحديد العربون",
    href: "/admin/services/new",
    category: "admin",
    badge: "Modal",
  },
  {
    title: "سجل الفواتير والمدفوعات الرسمية",
    subtitle: "متابعة العربون 30%، الدفعات، والتقارير الضريبية",
    href: "/admin/invoices",
    category: "admin",
  },
  {
    title: "سجل العميلات وتتبع التفضيلات (CRM)",
    subtitle: "ملفات العرائس، نوع البشرة، وسجل الجلسات",
    href: "/admin/customers",
    category: "admin",
  },
  {
    title: "إدارة المحتوى والتقييمات والمعرض",
    subtitle: "اعتماد التقييمات، رفع الصور، وتحديث السياسات",
    href: "/admin/content",
    category: "admin",
  },
  {
    title: "إدارة المدونة والمقالات الملكية",
    subtitle: "إضافة وتعديل مقالات الجمال، النشر، والتحكم بالظهور",
    href: "/admin/blog",
    category: "admin",
    badge: "جديد",
  },
  {
    title: "إعدادات النظام والصلاحيات",
    subtitle: "بيانات العمل، صلاحيات الفريق، وقوالب الواتساب",
    href: "/admin/settings",
    category: "admin",
  },
  {
    title: "تسجيل الدخول الإداري",
    subtitle: "بوابة الدخول الآمن عبر كلمة المرور أو OTP أو Passkey",
    href: "/admin/login",
    category: "admin",
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
  const { createBooking, packages } = useAppStore();

  const [currentDir, setCurrentDir] = useState<"rtl" | "ltr">("rtl");
  const [navSheetOpen, setNavSheetOpen] = useState(false);
  const [manualBookingOpen, setManualBookingOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

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
  const [selectedPkg, setSelectedPkg] = useState(
    "باقة العروس الملكية VIP (3,500 ر.س)"
  );
  const [bookingDate, setBookingDate] = useState("2025-10-26");
  const [district, setDistrict] = useState("حي الملقا - الرياض");

  const handleToggleLanguage = useCallback(() => {
    setCurrentDir((prev) => {
      const next = prev === "rtl" ? "ltr" : "rtl";
      document.documentElement.setAttribute("dir", next);
      document.documentElement.setAttribute("lang", next === "rtl" ? "ar" : "en");
      toast.success(
        next === "ltr"
          ? "Switched layout direction to English (LTR)"
          : "تم التبديل إلى الواجهة العربية (RTL)",
        {
          description:
            next === "ltr"
              ? "Navigation and layout flow adapted to Left-to-Right."
              : "تم ضبط اتجاه القراءة والتصميم من اليمين إلى اليسار.",
        }
      );
      return next;
    });
  }, []);

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

  // Global event delegation for links, forms, filters, pagination, and interactive buttons
  useEffect(() => {
    const handleSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement | null;
      if (!form) return;
      // Do not intercept shadcn dialog forms inside React portals if they have their own handler
      if (form.dataset.reactForm === "true") return;

      e.preventDefault();
      const msgEl = document.getElementById("formSuccessMessage");
      if (msgEl) {
        msgEl.classList.remove("hidden");
        msgEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      toast.success("تم استلام طلبكِ بنجاح ✨", {
        description: "سيتواصل معكِ مكتب أماني خليل عبر الواتساب خلال دقائق.",
      });
    };

    const extractRowData = (el: HTMLElement): BookingInspectorData => {
      const row = el.closest("tr") || el.closest("[class*='rounded-2xl']");
      if (!row) {
        return {
          ref: "AK-2025-8942",
          clientName: "سارة بنت فيصل آل سعود",
          packageName: "باقة العروس الملكية VIP",
          date: "الخميس، 9 أكتوبر 2025",
          amount: "3,550 ر.س",
          status: "مؤكد بالعربون (30%)",
        };
      }
      const rawText = (row as HTMLElement).innerText || "";
      const refMatch = rawText.match(/(?:AK|INV)-\d{4}-\d{3,5}/i);
      const amountMatch = rawText.match(/[\d,٬]+\s*ر\.س/);
      const cells = row.querySelectorAll("td");

      let clientName = "سارة بنت فيصل آل سعود";
      let packageName = "باقة العروس الملكية VIP";
      let date = "أكتوبر 2025";
      let status = "مؤكد بالعربون (30%)";

      if (cells.length >= 4) {
        clientName =
          cells[0]?.querySelector(".font-bold, .font-semibold")?.textContent?.trim() ||
          cells[1]?.querySelector(".font-bold, .font-semibold")?.textContent?.trim() ||
          clientName;
        packageName = cells[2]?.textContent?.trim().split("\n")[0] || packageName;
        date = cells[3]?.textContent?.trim().split("\n")[0] || date;
        status =
          row.querySelector("span[class*='rounded-full']")?.textContent?.trim() ||
          status;
      } else {
        const heading = row.querySelector("h3, h4, .font-bold");
        if (heading?.textContent) clientName = heading.textContent.trim();
      }

      return {
        ref: refMatch ? refMatch[0] : "AK-2025-8942",
        clientName,
        packageName,
        date,
        amount: amountMatch ? amountMatch[0] : "3,550 ر.س",
        status,
      };
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ignore clicks inside our custom React header/chrome/dialogs
      if (target.closest("[data-shell-ui='true']")) return;

      // 1. Check if clicked inside an <a> tag
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("/") && !href.startsWith("//")) {
          e.preventDefault();
          router.push(href);
          return;
        }
        if (href && href.startsWith("#") && href.length > 1) {
          const targetSection = document.querySelector(href);
          if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: "smooth" });
            return;
          }
        }
      }

      // 2. Check if clicked inside a <tr onclick="selectBooking(...)"> or similar
      const button = target.closest("button");
      if (!button) return;

      const btnText = (button.innerText || "").replace(/\s+/g, " ").trim();
      const hasOnClick = button.hasAttribute("onclick");

      // Skip buttons that already have dedicated page-level JS listeners
      if (
        button.classList.contains("filter-btn") ||
        button.classList.contains("filter-pill") ||
        button.classList.contains("content-tab-btn") ||
        button.classList.contains("faq-toggle") ||
        button.classList.contains("gallery-tab") ||
        button.classList.contains("date-chip") ||
        button.classList.contains("time-slot") ||
        button.id === "tab-pass" ||
        button.id === "tab-otp" ||
        button.id === "tab-bio" ||
        button.id === "open-upload-modal-btn" ||
        button.id === "close-upload-modal-btn" ||
        button.id === "cancel-upload-btn" ||
        button.id === "clear-search" ||
        button.id === "reset-search-btn"
      ) {
        return;
      }

      // Mobile menu button -> Open shadcn Navigation Sheet
      if (btnText === "menu") {
        e.preventDefault();
        setNavSheetOpen(true);
        return;
      }

      // Language switcher button
      if (btnText.includes("language") || btnText.includes("EN |")) {
        e.preventDefault();
        handleToggleLanguage();
        return;
      }

      // Notifications button in Admin
      if (btnText === "notifications") {
        e.preventDefault();
        setNotificationsOpen(true);
        return;
      }

      // Manual booking / Add client / New invoice buttons in Admin
      if (
        btnText.includes("إضافة حجز يدوي") ||
        btnText.includes("حجز يدوي جديد") ||
        btnText.includes("إضافة حجز / إغلاق يوم") ||
        btnText.includes("حجز موعد جديد للعروس") ||
        btnText.includes("إصدار فاتورة / سند قبض جديد") ||
        btnText.includes("تسجيل دفعة جديدة") ||
        btnText.includes("إضافة عميلة جديدة")
      ) {
        e.preventDefault();
        setManualBookingOpen(true);
        return;
      }

      // Add New Package / Edit Package buttons in Admin Services
      if (
        btnText.includes("إضافة باقة جديدة") ||
        btnText.includes("تعديل الباقة") ||
        btnText.includes("إضافة خدمة تكميلية")
      ) {
        e.preventDefault();
        router.push("/admin/services/new");
        return;
      }

      // Public Services "إضافة للحجز" button -> toggle checkbox or open package modal
      if (btnText === "إضافة للحجز") {
        e.preventDefault();
        const card = button.closest("div");
        const checkbox = card?.querySelector<HTMLInputElement>(
          "input[type='checkbox']"
        );
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change", { bubbles: true }));
          toast.success(
            checkbox.checked
              ? "تمت إضافة الخدمة التكميلية لحاسبة الحجز ✨"
              : "تمت إزالة الخدمة التكميلية"
          );
        } else {
          setSelectedPackageInfo({
            name: "خدمة تكميلية للعروس",
            price: 500,
          });
          setPackageDialogOpen(true);
        }
        return;
      }

      // Pause / Resume Service Package in Admin Services
      if (btnText === "pause_circle" || btnText === "play_circle") {
        e.preventDefault();
        const iconSpan = button.querySelector(".material-symbols-outlined") || button;
        const card = button.closest<HTMLElement>("[class*='rounded-2xl']");
        const isPaused = iconSpan.textContent?.trim() === "play_circle";

        if (isPaused) {
          iconSpan.textContent = "pause_circle";
          if (card) card.style.opacity = "1";
          toast.success("تم إعادة تفعيل الباقة واستقبال الحجوزات ✨");
        } else {
          iconSpan.textContent = "play_circle";
          if (card) card.style.opacity = "0.62";
          toast.info("تم إيقاف استقبال الحجوزات لهذه الباقة مؤقتاً");
        }
        return;
      }

      // Delete / Hide / Unpin with Undo action
      if (
        btnText === "delete" ||
        btnText === "delete_outline" ||
        btnText === "visibility_off" ||
        btnText.includes("إلغاء التثبيت") ||
        btnText === "إفساح"
      ) {
        if (!hasOnClick) {
          e.preventDefault();
          const container =
            button.closest<HTMLElement>("tr") ||
            button.closest<HTMLElement>("[class*='rounded-xl']") ||
            button.closest<HTMLElement>("[class*='rounded-2xl']");
          if (container) {
            container.style.display = "none";
            toast.success("تم تحديث العنصر بنجاح", {
              description: "يمكنكِ التراجع عن هذا الإجراء فوراً إذا رغبتِ.",
              action: {
                label: "تراجع",
                onClick: () => {
                  container.style.display = "";
                  toast.success("تمت استعادة العنصر كما كان");
                },
              },
            });
          }
          return;
        }
      }

      // WhatsApp Variable Chips in Admin Settings: {اسم_العروس}, {موعد_المناسبة}, etc.
      if (/^\{.+\}$/.test(btnText)) {
        e.preventDefault();
        const textarea = document.querySelector<HTMLTextAreaElement>("main textarea");
        if (textarea) {
          const start = textarea.selectionStart ?? textarea.value.length;
          const end = textarea.selectionEnd ?? textarea.value.length;
          textarea.value =
            textarea.value.slice(0, start) +
            " " +
            btnText +
            " " +
            textarea.value.slice(end);
          textarea.focus();
          toast.success(`تم إدراج المتغير ${btnText} في القالب`);
        }
        return;
      }

      // WhatsApp Preset Switchers in Admin Settings ("1. تأكيد...", "2. تذكير...", "3. شكر...")
      if (/^[123]\.\s/.test(btnText)) {
        e.preventDefault();
        const key = btnText.charAt(0);
        const textarea = document.querySelector<HTMLTextAreaElement>("main textarea");
        if (textarea && WHATSAPP_PRESETS[key]) {
          textarea.value = WHATSAPP_PRESETS[key];
          textarea.focus();
        }
        const parent = button.parentElement;
        if (parent) {
          parent.querySelectorAll("button").forEach((b) => {
            b.classList.remove("bg-primary-container", "text-on-primary");
          });
          button.classList.add("bg-primary-container", "text-on-primary");
        }
        toast.success(`تم تحميل قالب: ${btnText}`);
        return;
      }

      // Save changes buttons across admin & reviews pages
      if (
        btnText.includes("حفظ كافة التغييرات") ||
        btnText.includes("حفظ التعديلات") ||
        btnText.includes("حفظ السياسات والأسعار") ||
        btnText.includes("حفظ الملاحظة") ||
        btnText.includes("حفظ ونشر العمل") ||
        btnText.includes("حفظ وتفعيل الباقة") ||
        btnText.includes("حفظ كمسودة") ||
        btnText.includes("تحديث صياغة بنود العقد") ||
        btnText.includes("إرسال التقييم للاعتماد")
      ) {
        if (!hasOnClick) {
          e.preventDefault();
          toast.success("تم حفظ البيانات بنجاح ✨", {
            description: "تم تحديث السجل ومزامنته فورياً في النظام.",
          });
          return;
        }
      }

      // Approve / Feature review buttons in Admin Content & Overview
      if (
        btnText.includes("اعتماد") ||
        btnText.includes("تمييز (Featured)") ||
        btnText === "تثبيت يدوي" ||
        btnText === "تم التوثيق"
      ) {
        e.preventDefault();
        button.classList.add("opacity-75");
        toast.success("تم التوثيق والاعتماد الرسمي بنجاح ⭐");
        return;
      }

      // Receipt / View icon buttons in Admin Bookings, Invoices, CRM, Services
      if (
        btnText === "receipt_long" ||
        (btnText === "visibility" && !hasOnClick) ||
        btnText === "تفاصيل الإطلالة"
      ) {
        e.preventDefault();
        if (pathname === "/admin/services" || pathname === "/admin/services/new") {
          router.push("/services");
          return;
        }
        const details = extractRowData(button);
        setBookingDetails(details);
        setBookingDetailsOpen(true);
        return;
      }

      // Export PDF / Excel / Print buttons
      if (
        btnText.includes("تصدير") ||
        btnText.includes("التقرير الضريبي") ||
        btnText.includes("كشف بوابات الدفع") ||
        btnText.includes("طباعة") ||
        btnText === "download"
      ) {
        if (!hasOnClick) {
          e.preventDefault();
          toast.success("جارٍ تجهيز وتصدير المستند الرسمي (PDF)", {
            description: "سيبدأ تنزيل الملف المعتمد خلال لحظات.",
          });
          return;
        }
      }

      // Sync / Reset filter buttons
      if (
        btnText.includes("مزامنة") ||
        btnText.includes("تحديث فوري") ||
        btnText.includes("تحديث العروض") ||
        btnText === "refresh" ||
        btnText === "filter_alt_off" ||
        btnText.includes("إعادة ضبط") ||
        btnText.includes("استعادة الافتراضي")
      ) {
        e.preventDefault();
        // Also unhide any filtered table rows
        document
          .querySelectorAll<HTMLElement>("main tbody tr")
          .forEach((tr) => (tr.style.display = ""));
        toast.success("تم التحديث وإعادة ضبط العرض بنجاح");
        return;
      }

      // WhatsApp reminder / send buttons in Admin
      if (
        btnText.includes("تذكير واتساب") ||
        btnText.includes("تذكير بالسداد") ||
        btnText.includes("إرسال إشعار الدفع") ||
        btnText.includes("إرسال تجريبي") ||
        btnText.includes("توليد وإرسال عبر الواتساب") ||
        btnText.includes("طلب تقييم") ||
        btnText === "sms" ||
        btnText === "send" ||
        btnText === "chat"
      ) {
        e.preventDefault();
        toast.success("تم إرسال رسالة الواتساب الرسمية بنجاح 💬", {
          description: "تم تسليم الإشعار الموثق إلى جوال العميلة.",
        });
        return;
      }

      // Pagination buttons (1, 2, 3, 29, chevron_right, chevron_left)
      if (
        /^\d+$/.test(btnText) ||
        btnText === "chevron_right" ||
        btnText === "chevron_left"
      ) {
        const parent = button.parentElement;
        if (parent && parent.querySelectorAll("button").length >= 3) {
          e.preventDefault();
          if (/^\d+$/.test(btnText)) {
            parent.querySelectorAll("button").forEach((b) => {
              if (/^\d+$/.test((b.innerText || "").trim())) {
                b.classList.remove(
                  "bg-primary-container",
                  "bg-primary",
                  "text-on-primary",
                  "text-white"
                );
              }
            });
            button.classList.add("bg-primary-container", "text-on-primary");
          }
          toast.success(
            /^\d+$/.test(btnText)
              ? `تم الانتقال إلى الصفحة ${btnText}`
              : "تم تحديث صفحة السجل"
          );
          return;
        }
      }

      // Generic Filter Pills / View Mode Switchers (siblings inside a pill bar)
      if (!hasOnClick && button.parentElement) {
        const siblings = Array.from(
          button.parentElement.querySelectorAll(":scope > button")
        );
        if (siblings.length >= 2 && siblings.length <= 8) {
          const looksLikeFilterGroup = siblings.some(
            (s) =>
              s.className.includes("bg-primary") ||
              s.className.includes("bg-surface-container") ||
              (s.textContent || "").includes("الكل")
          );
          if (looksLikeFilterGroup) {
            e.preventDefault();
            siblings.forEach((s) => {
              s.classList.remove(
                "bg-primary-container",
                "bg-primary",
                "text-on-primary",
                "text-white",
                "shadow-sm"
              );
              s.classList.add("text-on-surface-variant");
            });
            button.classList.remove("text-on-surface-variant");
            button.classList.add(
              "bg-primary-container",
              "text-on-primary",
              "shadow-sm"
            );

            // Filter table rows if on an admin table page
            const rows = document.querySelectorAll<HTMLElement>("main tbody tr");
            if (rows.length > 0) {
              if (btnText.includes("الكل") || btnText.includes("كافة")) {
                rows.forEach((r) => (r.style.display = ""));
              } else {
                const keywords: string[] = [];
                if (btnText.includes("عربون") || btnText.includes("مؤكد"))
                  keywords.push("عربون", "مؤكد");
                if (btnText.includes("مسدد") || btnText.includes("مكتمل"))
                  keywords.push("مسدد", "مكتمل");
                if (btnText.includes("بانتظار") || btnText.includes("معلق"))
                  keywords.push("بانتظار", "معلق");
                if (btnText.includes("ملغي") || btnText.includes("مسترجع"))
                  keywords.push("ملغي", "مسترجع");
                if (btnText.includes("VIP") || btnText.includes("عرائس"))
                  keywords.push("VIP", "عروس", "ملكي");

                if (keywords.length > 0) {
                  let shown = 0;
                  rows.forEach((r) => {
                    const txt = r.innerText || "";
                    const match = keywords.some((k) => txt.includes(k));
                    r.style.display = match ? "" : "none";
                    if (match) shown++;
                  });
                  if (shown === 0) {
                    // Fallback: keep all visible if mock rows don't contain exact label
                    rows.forEach((r) => (r.style.display = ""));
                  }
                }
              }
            }
            return;
          }
        }
      }
    };

    document.addEventListener("submit", handleSubmit);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("submit", handleSubmit);
      document.removeEventListener("click", handleClick);
    };
  }, [router, pathname, handleToggleLanguage]);

  const handleCreateManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName.trim() || !bridePhone.trim()) {
      toast.error("يرجى إدخال اسم العميلة ورقم الجوال");
      return;
    }

    const cleanPkgTitle = selectedPkg.replace(/\s*\([^)]*\)/, "").trim();
    const matchedPkg =
      packages.find((p) => cleanPkgTitle.includes(p.title) || p.title.includes(cleanPkgTitle)) ||
      packages[0];

    const priceMatch = selectedPkg.match(/([\d,]+)/);
    const totalNum = priceMatch
      ? parseInt(priceMatch[1].replace(/,/g, ""), 10)
      : matchedPkg?.price || 3500;
    const depositNum = Math.round(totalNum * 0.3);

    const createdBooking = createBooking({
      clientName: brideName.trim(),
      phone: bridePhone.trim(),
      packageId: matchedPkg?.id || "vip-bridal",
      packageName: cleanPkgTitle,
      date: bookingDate,
      timeSlot: "عصراً (02:00 م)",
      locationType: "HOTEL_HALL",
      venue: district || "الرياض",
      areaId: "area_hotels_vip",
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
          pkgTitle: cleanPkgTitle,
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
            onToggleLanguage={handleToggleLanguage}
            currentDir={currentDir}
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

      {/* Floating Royal Quick-Navigation & Interactive Dock (shadcn/ui powered) */}
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

        <Link
          href={isAdminRoute ? "/" : "/admin"}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
        >
          {isAdminRoute ? (
            <>
              <Crown className="h-3.5 w-3.5 text-[#fed65b]" />
              <span>الموقع العام</span>
            </>
          ) : (
            <>
              <LayoutDashboard className="h-3.5 w-3.5 text-[#fed65b]" />
              <span>لوحة التحكم</span>
            </>
          )}
        </Link>
      </div>

      {/* shadcn Sheet: Mobile Navigation & Complete 22-Screen Sitemap */}
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
                alt="Amani Khalil | أماني خليل"
                className="h-10 w-auto max-w-[165px] object-contain"
              />
              <Badge variant="gold">{ALL_ROUTES.length} شاشة متكاملة</Badge>
            </div>
            <SheetTitle className="text-xl font-bold text-[#2f020d]">
              التنقل السريع ومستكشف الصفحات
            </SheetTitle>
            <SheetDescription className="text-[#524345]">
              انتقلي بسهولة بين صفحات الموقع العام، تدفق الحجز الملكي، ولوحة الإدارة.
            </SheetDescription>

            <div className="relative mt-3">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي عن صفحة أو مسار (مثال: عرائس، حجز، فواتير)..."
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
              <TabsList className="grid w-full grid-cols-4 h-11 bg-[#faeaeb] p-1">
                <TabsTrigger value="all" className="text-xs px-2">
                  الكل ({filteredRoutes.length})
                </TabsTrigger>
                <TabsTrigger value="public" className="text-xs px-2">
                  الموقع العام
                </TabsTrigger>
                <TabsTrigger value="booking" className="text-xs px-2">
                  الحجز
                </TabsTrigger>
                <TabsTrigger value="admin" className="text-xs px-2">
                  الإدارة
                </TabsTrigger>
              </TabsList>

              {(["all", "public", "booking", "admin"] as const).map(
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2f020d]">
                الباقة المختارة
              </label>
              <select
                value={selectedPkg}
                onChange={(e) => setSelectedPkg(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[#d7c1c3] bg-white px-4 py-2 text-sm text-[#211a1b] focus:outline-none focus:ring-2 focus:ring-[#735c00]/40"
              >
                <option value="باقة العروس الملكية VIP (3,500 ر.س)">
                  باقة العروس الملكية VIP (3,500 ر.س)
                </option>
                <option value="باقة العروس الكلاسيكية (2,800 ر.س)">
                  باقة العروس الكلاسيكية (2,800 ر.س)
                </option>
                <option value="مكياج سهرة فاخر VIP (950 ر.س)">
                  مكياج سهرة فاخر VIP (950 ر.س)
                </option>
                <option value="إطلالة سوفت غلام ناعمة (650 ر.س)">
                  إطلالة سوفت غلام ناعمة (650 ر.س)
                </option>
                <option value="جناح العروس والمرافقات (4,800 ر.س)">
                  جناح العروس والمرافقات (4,800 ر.س)
                </option>
              </select>
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

          <div className="space-y-3 my-2">
            <div
              onClick={() => {
                setNotificationsOpen(false);
                router.push("/admin/bookings");
              }}
              className="cursor-pointer rounded-2xl border border-[#d7c1c3] bg-white p-3.5 transition-all hover:border-[#735c00]"
            >
              <div className="flex items-center justify-between text-xs text-[#735c00] font-bold mb-1">
                <span>تم سداد عربون جديد (30%)</span>
                <span>منذ 5 دقائق</span>
              </div>
              <p className="text-sm font-bold text-[#2f020d]">
                العروس سارة بنت عبدالله — باقة العروس الملكية VIP
              </p>
              <p className="text-xs text-[#524345] mt-0.5">
                تم تحصيل 1,050 ر.س عبر Apple Pay • المرجع #AK-2025-8942
              </p>
            </div>

            <div
              onClick={() => {
                setNotificationsOpen(false);
                router.push("/admin/calendar");
              }}
              className="cursor-pointer rounded-2xl border border-[#d7c1c3] bg-white p-3.5 transition-all hover:border-[#735c00]"
            >
              <div className="flex items-center justify-between text-xs text-[#4a1521] font-bold mb-1">
                <span>تذكير بموعد غداً</span>
                <span>منذ ساعة</span>
              </div>
              <p className="text-sm font-bold text-[#2f020d]">
                جلسة زفاف في فندق الريتز كارلتون - الجناح الملكي
              </p>
              <p className="text-xs text-[#524345] mt-0.5">
                الساعة 2:00 مساءً • تم إرسال إرشادات العناية بالبشرة للعروس
              </p>
            </div>

            <div
              onClick={() => {
                setNotificationsOpen(false);
                router.push("/admin/content");
              }}
              className="cursor-pointer rounded-2xl border border-[#d7c1c3] bg-white p-3.5 transition-all hover:border-[#735c00]"
            >
              <div className="flex items-center justify-between text-xs text-[#735c00] font-bold mb-1">
                <span>تقييم جديد بانتظار الاعتماد ⭐</span>
                <span>منذ 3 ساعات</span>
              </div>
              <p className="text-sm font-bold text-[#2f020d]">
                نورة السديري أضافت تقييماً 5 نجوم مع موافقة نشر
              </p>
            </div>
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
