"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { AnimatedStudioBanner } from "@/components/animated-studio-banner";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Crown,
  Sparkles,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Sparkle,
  Gem,
  Check,
  Camera,
  ZoomIn,
  Heart,
  Quote,
  Plus,
  Hotel,
  Building,
  Radio,
  ArrowDown,
  Phone,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

// Authentic Studio Photos of Makeup Artist Amani Khalil
const AMANI_STUDIO_LOOKS = [
  {
    id: "look-monogram-banner",
    src: "/amani-monogram-banner.jpg",
    title: "أتيليه أماني خليل — الهوية الملكية الرسمية",
    subtitle: "جلسات التجهيز الفندقي والقصور الفاخرة بأرقى مستحضرات الهوت كوتور",
    tag: "البانر الرسمي المعتمد",
  },
  {
    id: "look-vanity-brush",
    src: "/amani-vanity-brush.jpg",
    title: "استوديو التجهيز السينمائي الملكي 4K",
    subtitle: "مرايا هوليوود المتطورة وأدوات كونتور وإضاءة العين والوجنتين",
    tag: "أتيليه الرياض",
  },
  {
    id: "look-client-bridal",
    src: "/amani-client-bridal.jpg",
    title: "تجهيز العروس الملكية مباشرة بالاستوديو",
    subtitle: "تطبيق معايير دبلوم CIDESCO الدولي لتهيئة البشرة وتناغم الفاونديشن",
    tag: "جلسة عروس حصرية",
  },
  {
    id: "look-mirror-glam",
    src: "/amani-mirror-glam.jpg",
    title: "إشراقة الملامح وسحر البشرة الزجاجية Glass Skin",
    subtitle: "إبراز الجمال الطبيعي بدقة عالية وتثبيت هيدروليكي يدوم ١٨ ساعة",
    tag: "كواليس الجلسة",
  },
];

export function HomeClient() {
  const router = useRouter();
  const { packages, addons, reviews, gallery, setSelectedPackageId, createBooking, addReview } =
    useAppStore();

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [heroImageModalOpen, setHeroImageModalOpen] = useState(false);

  // Studio looks carousel for Amani Khalil
  const [heroLookIdx, setHeroLookIdx] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  useEffect(() => {
    if (isHeroHovered) return;
    const timer = setInterval(() => {
      setHeroLookIdx((prev) => (prev + 1) % AMANI_STUDIO_LOOKS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isHeroHovered]);

  // Home packages category filter
  const [packageCategory, setPackageCategory] = useState<string>("all");

  // Quick wizard addons state
  const [wizardAddons, setWizardAddons] = useState<string[]>([]);

  // Gallery state
  const [galleryCategory, setGalleryCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedLooks, setLikedLooks] = useState<Record<string, number>>({
    "look-hero": 184,
    "look-01": 142,
    "look-02": 98,
    "look-03": 115,
    "look-04": 86,
  });

  // Reviews state
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newPackageTitle, setNewPackageTitle] = useState("باقة العروس الملكية VIP");
  const [newRating, setNewRating] = useState(5);
  const [newVenue, setNewVenue] = useState("");
  const [newComment, setNewComment] = useState("");

  // Home 4-step quick wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardPkg, setWizardPkg] = useState("vip-bridal");
  const [wizardDate, setWizardDate] = useState("2025-10-18");
  const [wizardTime, setWizardTime] = useState("عصراً (02:00 م)");
  const [wizardVenue, setWizardVenue] = useState("فندق / قاعة بالرياض");
  const [wizardArea, setWizardArea] = useState("area_hotels_vip");
  const [wizardName, setWizardName] = useState("");
  const [wizardPhone, setWizardPhone] = useState("");
  const [wizardConfirmed, setWizardConfirmed] = useState(false);
  const [wizardBookingRef, setWizardBookingRef] = useState("");

  // Select package and scroll smoothly to the wizard directly below
  const handleScrollToWizard = (pkgId: string) => {
    setWizardPkg(pkgId);
    setWizardStep(2); // advance to date & time
    const el = document.getElementById("quick-wizard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      toast.success("تم اختيار الباقة بنجاح! حددي الموعد الآن ✨");
    }
  };

  const toggleWizardAddon = (addonId: string) => {
    setWizardAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSelectPackageDirect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    router.push("/book");
  };

  const selectedWizardPackageObj = packages.find((p) => p.id === wizardPkg) || packages[0];
  const basePkgPrice = selectedWizardPackageObj?.price || 0;
  const addonsTotalPrice = wizardAddons.reduce((sum, id) => {
    const ad = addons.find((a) => a.id === id);
    return sum + (ad?.price || 0);
  }, 0);
  const wizardTotalAmount = basePkgPrice + addonsTotalPrice;
  const wizardDepositAmount = Math.round(wizardTotalAmount * 0.3);

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkgObj = packages.find((p) => p.id === wizardPkg) || packages[0];
    const booking = createBooking({
      clientName: wizardName.trim() || "عميلة ملكية",
      phone: wizardPhone.trim() || "0550000000",
      packageId: pkgObj.id,
      packageName: pkgObj.title,
      date: wizardDate,
      timeSlot: wizardTime,
      locationType: "HOTEL_HALL",
      venue: wizardVenue,
      areaId: wizardArea,
      totalAmount: wizardTotalAmount,
      depositAmount: wizardDepositAmount,
      remainingAmount: wizardTotalAmount - wizardDepositAmount,
      status: "CONFIRMED",
      addonIds: wizardAddons,
    });
    setWizardBookingRef(booking.ref);
    setWizardConfirmed(true);
    toast.success("تم تأكيد موعدكِ بنجاح وتوليد الفاتورة الرسمية ✨");
  };

  const handleToggleLike = (lookId: string) => {
    setLikedLooks((prev) => {
      const current = prev[lookId] || 100;
      return {
        ...prev,
        [lookId]: current + 1,
      };
    });
    toast.success("شكراً لإعجابكِ بهذه الإطلالة الملكية 🤍");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newComment.trim()) return;

    addReview({
      clientName: newClientName.trim(),
      packageTitle: newPackageTitle,
      rating: newRating,
      date: "الآن",
      venue: newVenue.trim() || "الرياض",
      comment: newComment.trim(),
    });

    setNewClientName("");
    setNewVenue("");
    setNewComment("");
    setReviewModalOpen(false);
    toast.success("شكراً لكِ! تم إضافة تقييمكِ بنجاح ✨");
  };

  // Combine gallery items, placing authentic Amani Khalil atelier looks
  const extendedGallery = [
    {
      id: "look-hero",
      title: "جلسة الأتيليه الملكية الخاصة (Haute Beauté Signature)",
      category: "bridal",
      categoryAr: "عرائس ملكي",
      image: "/amani-hero.jpg",
      clientType: "أتيليه أماني خليل — شمال الرياض",
      styleTags: ["مكياج ملكي", "بشرة مخملية", "إضاءة سينمائية"],
    },
    {
      id: "look-amani-emerald",
      title: "إطلالة البورتريه الملكي للأناقة الزمردية",
      category: "artist",
      categoryAr: "جلسات الخبيرة أماني",
      image: "/amani-1.jpg",
      clientType: "جلسة البورتريه المعتمدة 2025",
      styleTags: ["خبيرة التجميل", "Glass Skin", "مكياج كلاسيكي فاخر"],
    },
    {
      id: "look-amani-studio",
      title: "كواليس جلسة المكياج وانتقاء فراشي الدمج",
      category: "artist",
      categoryAr: "جلسات الخبيرة أماني",
      image: "/amani-2.jpg",
      clientType: "استوديو التجهيز السينمائي 4K",
      styleTags: ["كواليس الأتيليه", "أدوات احترافية", "مرايا سينمائية"],
    },
    {
      id: "look-amani-palette",
      title: "جلسة تنسيق باليتات الظلال والمستحضرات",
      category: "artist",
      categoryAr: "جلسات الخبيرة أماني",
      image: "/amani-3.jpg",
      clientType: "جلسة مواءمة الألوان والتجهيز",
      styleTags: ["تناغم الألوان", "مستحضرات عالمية", "تحضير العروس"],
    },
    ...gallery,
  ];

  const filteredLooks = extendedGallery.filter((item) => {
    if (galleryCategory === "all") return true;
    return item.category === galleryCategory;
  });

  const activePackages = packages.filter((p) => {
    if (!p.active) return false;
    if (packageCategory === "bridal") return p.category === "bridal";
    if (packageCategory === "evening") return p.category === "evening" || p.category === "engagement";
    return true;
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "bridal") return r.packageTitle.includes("العروس");
    if (reviewFilter === "evening") return r.packageTitle.includes("السهرة") || r.packageTitle.includes("الملكة");
    return true;
  });

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero Section with Massive High-Resolution Studio Image */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] via-[#3a0d17] to-[#4a1521] text-white py-16 lg:py-28">
        {/* Ambient Warm Golden Glows */}
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#735c00]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#fed65b]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Right: Text & Value Propositions (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-start gap-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#fed65b] font-semibold shadow-sm animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Crown className="h-3.5 w-3.5 text-[#fed65b]" />
                <span>Certified Luxury Bridal MUA • الرياض • خدمة فندقية وقصور</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-[1.25] tracking-tight">
                جلسة ميكب في الرياض{" "}
                <span className="text-[#fed65b] block sm:inline">بلمسة احترافية</span>{" "}
                وتألق يدوم طوال ليلتكِ
              </h1>

              <p className="text-sm sm:text-lg text-[#eedfe0] max-w-xl leading-relaxed">
                إبراز جمالكِ الطبيعي بدقة عالية وعناية شخصية متكاملة مصممة خصيصاً لمناسبتكِ وليلة عمركِ،
                باستخدام أفخم مستحضرات التجميل العالمية الأصلية وتقنيات الإضاءة السينمائية 4K مع تفرغ تام لعروس واحدة يومياً.
              </p>

              {/* Accreditation Badge */}
              <div className="w-full max-w-xl p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between gap-4 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-[#fed65b] text-[#241a00] flex items-center justify-center font-bold shrink-0 shadow-sm animate-pulse-glow">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">دبلوم التجميل والمكياج السينمائي والعرائسي</h3>
                    <p className="text-xs text-[#eedfe0]">الأكاديمية الدولية للتجميل • الرياض (CIDESCO 2021)</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCertModalOpen(true)}
                  className="rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] text-xs font-bold shrink-0 cursor-pointer hover-shine"
                >
                  <Eye className="h-3.5 w-3.5 ms-1" />
                  <span>معاينة الاعتماد</span>
                </Button>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/book"
                  className="h-13 px-8 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] text-sm font-bold flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer hover-shine"
                >
                  <Calendar className="h-4 w-4 text-[#735c00]" />
                  <span>احجزي موعدكِ الآن</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("quick-wizard");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="h-13 px-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-2 border border-white/20 transition-all cursor-pointer hover-lift"
                >
                  <span>معالج الحجز السريع</span>
                  <ArrowDown className="h-4 w-4 text-[#fed65b]" />
                </button>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-6 border-t border-white/15">
                <div className="hover-lift">
                  <span className="text-2xl font-bold font-serif text-[#fed65b]">+١٠ سنوات</span>
                  <p className="text-xs text-[#eedfe0]">خبرة واحتراف</p>
                </div>
                <div className="hover-lift">
                  <span className="text-2xl font-bold font-serif text-[#fed65b]">+١٬٥٠٠</span>
                  <p className="text-xs text-[#eedfe0]">عروس ومناسبة</p>
                </div>
                <div className="hover-lift">
                  <span className="text-2xl font-bold font-serif text-[#fed65b]">٤.٩ ★</span>
                  <p className="text-xs text-[#eedfe0]">تقييم العميلات الموثق</p>
                </div>
                <div className="hover-lift">
                  <span className="text-2xl font-bold font-serif text-[#fed65b]">الرياض</span>
                  <p className="text-xs text-[#eedfe0]">فندقي ومنزلي</p>
                </div>
              </div>
            </div>

            {/* Left: Interactive Studio Portrait Switcher with All Real Amani Photos (6 cols) */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center w-full">
              <div
                className="relative w-full max-w-[680px] group"
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseLeave={() => setIsHeroHovered(false)}
              >
                {/* Ambient Golden Shimmer Frame with Breathing Glow */}
                <div className="absolute -inset-3 bg-gradient-to-r from-[#fed65b]/40 via-[#735c00]/30 to-[#fed65b]/40 rounded-[40px] blur-2xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none animate-pulse-glow" />

                {/* Main Image Container (Full 16:9 ratio, maximum size and quality) */}
                <div className="relative w-full aspect-[16/9] rounded-[34px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-[#fed65b]/60 bg-[#2f020d]">
                  <Image
                    key={AMANI_STUDIO_LOOKS[heroLookIdx].id}
                    src={AMANI_STUDIO_LOOKS[heroLookIdx].src}
                    alt={AMANI_STUDIO_LOOKS[heroLookIdx].title}
                    fill
                    unoptimized={true}
                    priority
                    loading="eager"
                    className="object-cover object-center group-hover:scale-[1.03] transition-all duration-700 animate-fade-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2f020d]/85 via-transparent to-black/25 pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 start-4 z-10 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-[#fed65b] border border-white/20 shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-[#fed65b]" />
                      <span>{AMANI_STUDIO_LOOKS[heroLookIdx].tag}</span>
                    </span>
                  </div>

                  {/* Zoom Preview Trigger */}
                  <button
                    type="button"
                    onClick={() => setHeroImageModalOpen(true)}
                    className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label="تكبير صورة الاستوديو بالحجم الكامل"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  {/* Previous & Next Arrow Navigators */}
                  <button
                    type="button"
                    onClick={() =>
                      setHeroLookIdx(
                        (prev) => (prev - 1 + AMANI_STUDIO_LOOKS.length) % AMANI_STUDIO_LOOKS.length
                      )
                    }
                    className="absolute top-1/2 start-3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHeroLookIdx((prev) => (prev + 1) % AMANI_STUDIO_LOOKS.length)
                    }
                    className="absolute top-1/2 end-3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Subtle luxury vignette at the very bottom edge only - non-intrusive */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                  {/* Top Floating Badge */}
                  <div className="absolute top-4 start-4 z-10 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-[#fed65b] border border-white/20 shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-[#fed65b]" />
                      <span>{AMANI_STUDIO_LOOKS[heroLookIdx].tag}</span>
                    </span>
                  </div>

                  {/* Zoom Preview Trigger */}
                  <button
                    type="button"
                    onClick={() => setHeroImageModalOpen(true)}
                    className="absolute top-4 end-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label="تكبير صورة الاستوديو بالحجم الكامل"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  {/* Previous & Next Arrow Navigators */}
                  <button
                    type="button"
                    onClick={() =>
                      setHeroLookIdx(
                        (prev) => (prev - 1 + AMANI_STUDIO_LOOKS.length) % AMANI_STUDIO_LOOKS.length
                      )
                    }
                    className="absolute top-1/2 start-3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHeroLookIdx((prev) => (prev + 1) % AMANI_STUDIO_LOOKS.length)
                    }
                    className="absolute top-1/2 end-3 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Sleek Non-obstructive Bottom Status Pill */}
                  <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between text-xs text-white/90 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-bold text-[#fed65b]">{AMANI_STUDIO_LOOKS[heroLookIdx].title}</span>
                      <span className="text-[11px] text-white/70 hidden sm:inline">• {AMANI_STUDIO_LOOKS[heroLookIdx].subtitle}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fed65b]/20 text-[#fed65b] shrink-0">
                      {heroLookIdx + 1} / {AMANI_STUDIO_LOOKS.length}
                    </span>
                  </div>
                </div>

                {/* Floating Certificate Seal */}
                <div className="absolute -top-3 -start-3 bg-white text-[#2f020d] px-3.5 py-2 rounded-2xl shadow-xl border border-[#eedfe0] flex items-center gap-2 z-20 animate-float">
                  <div className="h-8 w-8 rounded-full bg-[#fed65b] text-[#241a00] flex items-center justify-center font-bold">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">معتمدة دولياً CIDESCO</p>
                    <p className="text-[10px] text-[#524345]">سويسرا • مكياج عرائسي</p>
                  </div>
                </div>

                {/* Floating Exclusivity Tag */}
                <div className="absolute -bottom-3 -end-3 bg-[#4a1521] text-white px-3.5 py-2 rounded-2xl shadow-xl border border-[#fed65b]/40 flex items-center gap-2 z-20 animate-float">
                  <div className="h-8 w-8 rounded-full bg-[#fed65b]/20 text-[#fed65b] flex items-center justify-center">
                    <Crown className="h-4.5 w-4.5 text-[#fed65b]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#fed65b] leading-tight">عروس واحدة يومياً</p>
                    <p className="text-[10px] text-[#eedfe0]">تفرغ ملكي تام</p>
                  </div>
                </div>
              </div>

              {/* 4 Interactive Thumbnails Switcher */}
              <div className="mt-5 w-full max-w-[680px] grid grid-cols-4 gap-2.5 sm:gap-3.5 z-20">
                {AMANI_STUDIO_LOOKS.map((look, idx) => (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => setHeroLookIdx(idx)}
                    className={`relative rounded-2xl overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer group/thumb hover-lift ${
                      heroLookIdx === idx
                        ? "border-[#fed65b] ring-2 ring-[#fed65b]/50 shadow-lg scale-105"
                        : "border-white/20 opacity-70 hover:opacity-100 hover:border-white/50"
                    }`}
                  >
                    <Image
                      src={look.src}
                      alt={look.title}
                      fill
                      unoptimized={true}
                      className="object-cover object-center group-hover/thumb:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1 inset-x-1 text-[10px] font-bold text-white truncate text-center block">
                      {look.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Process Section */}
      <ScrollReveal>
        <section className="py-20 bg-[#fff8f7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">خطوات سهلة ومرنة</span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
                كيف تحجزين جلستكِ الملكية معنا؟
              </h2>
              <p className="text-sm text-[#524345] mt-3">
                أربع خطوات ميسرة تضمن لكِ تثبيت موعدكِ بدقة وسرية تامة دون الحاجة لإنشاء حساب
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  num: "١",
                  title: "اختاري الباقة المناسبة",
                  desc: "تصفحي باقات العرائس الملكية، السهرات، أو الخطوبة مع الإضافات التكميلية.",
                  icon: Crown,
                },
                {
                  num: "٢",
                  title: "حددي الموعد والمكان",
                  desc: "اختاري تاريخ مناسبتكِ ومقر الجلسة (فندق، قصر، أو منزلكِ بالرياض).",
                  icon: Calendar,
                },
                {
                  num: "٣",
                  title: "تأكيد الموعد بالعربون",
                  desc: "سددي عربون ٣٠٪ بأمان عبر مدى أو Apple Pay لاستلام العقد الموثق.",
                  icon: ShieldCheck,
                },
                {
                  num: "٤",
                  title: "استمتعي بإطلالة خيالية",
                  desc: "حضور أماني خليل في الموعد المخصص مع كامل الحقيبة ومستحضرات Dior الفاخرة.",
                  icon: Sparkles,
                },
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover:shadow-xl hover:border-[#735c00]/60 transition-all flex flex-col items-start gap-4 hover-lift"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="h-12 w-12 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
                        <Icon className="h-6 w-6 text-[#735c00]" />
                      </div>
                      <span className="text-3xl font-serif font-bold text-[#fed65b]">{step.num}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2f020d]">{step.title}</h3>
                    <p className="text-xs text-[#524345] leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

            {/* 2.2 CINEMATIC ANIMATED STUDIO SHOWCASE BANNER */}
      <ScrollReveal>
        <AnimatedStudioBanner />
      </ScrollReveal>

      {/* 2.5 MEET THE ARTIST: AMANI KHALIL (DEDICATED LUXURY SPOTLIGHT & AUTHENTIC STUDIO PHOTOS) */}
      <ScrollReveal>
        <section className="py-24 bg-gradient-to-b from-[#fff8f7] via-[#fff0f1] to-[#fff8f7] relative overflow-hidden border-t border-[#eedfe0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Right: Editorial Story & Credentials (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#735c00] text-xs font-bold border border-[#eedfe0] shadow-sm animate-float">
                  <Crown className="w-4 h-4 text-[#735c00]" />
                  <span>الخبيرة المعتمدة لعرائس النخبة بالرياض</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#2f020d] leading-tight">
                  أماني خليل
                  <span className="block text-xl sm:text-2xl font-sans font-normal text-[#735c00] mt-2">
                    شغف الجمال الملكي ودقة الإتقان السويسري
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-[#524345] leading-relaxed">
                  تخرجت أماني خليل من أعرق أكاديميات التجميل الأوروبية وحصلت على اعتماد <strong className="text-[#2f020d]">CIDESCO الدولي السويسري</strong>، وكرّست أكثر من <strong className="text-[#2f020d]">١٠ سنوات</strong> لصناعة إطلالات لا تُنسى لعرائس العائلات الكريمة ونخبة سيدات المجتمع الراقي في الرياض.
                </p>

                <blockquote className="p-4 rounded-2xl bg-white border-r-4 border-[#735c00] shadow-sm text-xs sm:text-sm text-[#2f020d] font-serif italic leading-relaxed">
                  &ldquo;المكياج الملكي الحقيقي لا يُغيّر ملامحكِ، بل يكشف بتناغم استثنائي عن أبهى تفاصيل جمالكِ الطبيعي — إطلالة فخمة وأصيلة تبقى خالدة في ألبوم ذكرياتكِ.&rdquo;
                  <footer className="mt-2 text-xs font-sans not-italic text-[#735c00] font-bold">
                    — أماني خليل، مؤسسة الأتيليه الملكي
                  </footer>
                </blockquote>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] shadow-sm hover-lift">
                    <div className="h-10 w-10 rounded-xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold mb-2">
                      <ShieldCheck className="h-5 w-5 text-[#735c00]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#2f020d]">اعتماد CIDESCO السويسري</h4>
                    <p className="text-[11px] text-[#524345] mt-1">معايير طبية دقيقة لتهيئة البشرة والتعقيم</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] shadow-sm hover-lift">
                    <div className="h-10 w-10 rounded-xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold mb-2">
                      <Sparkles className="h-5 w-5 text-[#735c00]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#2f020d]">تثبيت هيدروليكي 4K</h4>
                    <p className="text-[11px] text-[#524345] mt-1">مقاوم للتعرق والدموع والأضواء حتى ١٨ ساعة</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] shadow-sm hover-lift">
                    <div className="h-10 w-10 rounded-xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold mb-2">
                      <Crown className="h-5 w-5 text-[#735c00]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#2f020d]">تفرغ ملكي كامل</h4>
                    <p className="text-[11px] text-[#524345] mt-1">عروس واحدة فقط يومياً لضمان كامل وقتي واهتمامي بكِ</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Button
                    onClick={() => {
                      const el = document.getElementById("quick-wizard");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="h-12 px-8 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-md hover-shine cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 ms-2 text-[#fed65b]" />
                    <span>احجزي جلستكِ الخاصة مع أماني</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCertModalOpen(true)}
                    className="h-12 px-6 rounded-full border-[#735c00]/40 text-[#4a1521] hover:bg-white text-xs font-bold hover-lift"
                  >
                    <Award className="h-4 w-4 ms-2 text-[#735c00]" />
                    <span>معاينة شهادات الاعتماد والخبرة</span>
                  </Button>
                </div>
              </div>

              {/* Left: Artistic 3-Photo Showcase of Amani Khalil (5 cols) */}
              <div className="lg:col-span-5 relative space-y-4">
                {/* Main Featured Photo (Amani in Emerald Green dress - amani-1.jpg) */}
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border-2 border-[#735c00]/30 group hover-lift bg-[#2f020d]">
                  <Image
                    src="/amani-1.jpg"
                    alt="خبيرة التجميل أماني خليل — البورتريه الرسمي المعتمد"
                    fill
                    unoptimized={true}
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white">
                    <div>
                      <span className="text-xs font-bold block text-[#fed65b]">أماني خليل</span>
                      <span className="text-[11px] text-[#eedfe0]">جلسة البورتريه الرسمي المعتمد 2025</span>
                    </div>
                    <Badge variant="gold" className="text-[10px] font-bold">
                      CIDESCO Certified
                    </Badge>
                  </div>
                </div>

                {/* Two Companion Action Cards in the Studio (amani-2.jpg & amani-3.jpg) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/11] shadow-lg border border-[#eedfe0] group hover-lift bg-[#2f020d]">
                    <Image
                      src="/amani-2.jpg"
                      alt="أماني خليل في استوديو التجهيز الملكي وانتقاء الفرش"
                      fill
                      unoptimized={true}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 start-2 text-[10px] font-bold text-white">
                      كواليس انتقاء الفرش
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-[16/11] shadow-lg border border-[#eedfe0] group hover-lift bg-[#2f020d]">
                    <Image
                      src="/amani-3.jpg"
                      alt="أماني خليل وتنسيق باليتات الألوان الفاخرة"
                      fill
                      unoptimized={true}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 start-2 text-[10px] font-bold text-white">
                      تنسيق الباليتات
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. Featured Packages Grid (with Interactive Category Filter) */}
      <ScrollReveal>
        <section id="packages-section" className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">باقات مميزة</span>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
                  باقات الخدمات والأسعار الرسمية
                </h2>
                <p className="text-sm text-[#524345] mt-2">
                  أسعار شفافة ومحددة تشمل التجهيز المتكامل مع حقيبة رتوش هدية للعروس
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#4a1521] hover:text-[#2f020d] hover:underline hover-lift"
              >
                <span>مقارنة كافة الباقات والأسعار</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex justify-center mb-10">
              <Tabs value={packageCategory} onValueChange={setPackageCategory} className="w-full max-w-md">
                <TabsList className="bg-white p-1 rounded-full border border-[#eedfe0] grid grid-cols-3 w-full shadow-sm">
                  <TabsTrigger value="all" className="rounded-full text-xs font-semibold cursor-pointer">
                    جميع الباقات
                  </TabsTrigger>
                  <TabsTrigger value="bridal" className="rounded-full text-xs font-semibold cursor-pointer">
                    باقات العرائس
                  </TabsTrigger>
                  <TabsTrigger value="evening" className="rounded-full text-xs font-semibold cursor-pointer">
                    السهرات والملكة
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activePackages.slice(0, 3).map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-3xl transition-all duration-300 hover-lift ${
                    pkg.popular
                      ? "border-2 border-[#735c00] shadow-[0_12px_32px_rgba(74,21,33,0.12)] bg-[#fff8f7]"
                      : "border border-[#eedfe0] bg-white shadow-sm hover:shadow-xl"
                  }`}
                >
                  {pkg.popular && (
                    <div className="bg-[#4a1521] text-white text-center py-1.5 text-xs font-bold animate-shimmer">
                      ★ الأكثر طلباً لعرائس الموسم
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#735c00] bg-[#faeaeb] px-3 py-1 rounded-full">
                        {pkg.duration}
                      </span>
                      <span className="text-xs text-[#857374]">العربون: 30%</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#2f020d] mb-2">{pkg.title}</h3>
                    <p className="text-xs text-[#524345] leading-relaxed mb-6">{pkg.description}</p>

                    <div className="flex items-baseline gap-2 pb-6 border-b border-[#eedfe0]">
                      <span className="text-3xl sm:text-4xl font-bold font-serif text-[#2f020d]">
                        {pkg.price.toLocaleString("ar-SA")}
                      </span>
                      <span className="text-sm font-bold text-[#735c00]">ر.س</span>
                    </div>

                    <ul className="space-y-3 pt-6 mb-8">
                      {pkg.features.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#211a1b]">
                          <Check className="h-4 w-4 text-[#735c00] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0 sm:p-8 sm:pt-0 space-y-2">
                    <Button
                      onClick={() => handleScrollToWizard(pkg.id)}
                      className={`w-full h-12 rounded-full text-xs font-bold shadow-md cursor-pointer hover-shine ${
                        pkg.popular
                          ? "bg-[#4a1521] hover:bg-[#2f020d] text-white"
                          : "bg-[#faeaeb] hover:bg-[#eedfe0] text-[#2f020d]"
                      }`}
                    >
                      <Calendar className="h-4 w-4 ms-2 text-[#fed65b]" />
                      <span>حجز فوري بالمعالج أدناه ↓</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. INTERACTIVE 4-STEP QUICK BOOKING WIZARD (IMMEDIATELY AFTER PACKAGES!) */}
      <ScrollReveal>
        <section id="quick-wizard" className="py-20 bg-[#fff8f7] scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
                معالج الحجز الفوري
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
                احجزي موعدكِ الملكي خلال دقيقتين
              </h2>
              <p className="text-sm text-[#524345] mt-2">
                حددي تفاصيل إطلالتكِ وسيتولى النظام حجز الموعد وعرض الفاتورة الرسمية فوراً
              </p>
            </div>

            <Card className="rounded-3xl border border-[#d7c1c3] bg-white shadow-xl overflow-hidden hover-lift">
              {/* Real-time Order Bar on Top of Wizard */}
              <div className="bg-[#4a1521] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Crown className="w-4 h-4 text-[#fed65b]" />
                  <span>
                    الباقة المحددة: <strong className="text-[#fed65b]">{selectedWizardPackageObj.title}</strong>
                  </span>
                  {wizardAddons.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#fed65b] text-[#2f020d] text-[10px] font-bold animate-pulse-glow">
                      +{wizardAddons.length} خدمات تكميلية
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>
                    الإجمالي:{" "}
                    <strong className="text-sm font-bold font-serif text-[#fed65b]">
                      {wizardTotalAmount.toLocaleString("ar-SA")} ر.س
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    العربون (30%):{" "}
                    <strong>
                      {wizardDepositAmount.toLocaleString("ar-SA")} ر.س
                    </strong>
                  </span>
                </div>
              </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 bg-[#faeaeb] border-b border-[#eedfe0] text-center text-xs font-bold">
              {[
                { s: 1, label: "١. الباقة والخدمات التكميلية" },
                { s: 2, label: "٢. تاريخ وتوقيت الموعد" },
                { s: 3, label: "٣. تفاصيل موقع الحفل" },
                { s: 4, label: "٤. مراجعة وتأكيد الحجز" },
              ].map((st) => (
                <button
                  key={st.s}
                  type="button"
                  onClick={() => setWizardStep(st.s)}
                  className={`py-3.5 transition-colors cursor-pointer ${
                    wizardStep === st.s
                      ? "bg-[#2f020d] text-white"
                      : wizardStep > st.s
                      ? "bg-[#faeaeb] text-[#735c00] hover:bg-[#eedfe0]"
                      : "text-[#857374] hover:bg-white/50"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <CardContent className="p-6 sm:p-10">
              {wizardConfirmed ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#2f020d]">تم استقبال طلب حجزكِ الملكي بنجاح 💍</h3>
                  <p className="text-sm text-[#524345] max-w-md mx-auto">
                    رقم مرجع الحجز الرسمي: <span className="font-bold text-[#4a1521]">#{wizardBookingRef}</span>.
                    تم إرسال إشعار التثبيت لخبيرة التجميل أماني خليل.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/book/confirmation"
                      className="h-11 px-6 rounded-full bg-[#4a1521] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#2f020d]"
                    >
                      <span>معاينة الفاتورة الرسمية</span>
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setWizardConfirmed(false);
                        setWizardStep(1);
                      }}
                      className="rounded-full text-xs"
                    >
                      حجز موعد آخر
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWizardSubmit} className="space-y-6">
                  {wizardStep === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-[#2f020d]">١. اختاري باقة الجمال المطلوبة:</h4>
                          <span className="text-xs text-[#735c00] font-medium">باقة رئيسية واحدة</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {packages.map((pkg) => (
                            <label
                              key={pkg.id}
                              className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                                wizardPkg === pkg.id
                                  ? "border-[#4a1521] bg-[#fff0f1] ring-2 ring-[#4a1521] shadow-sm"
                                  : "border-[#eedfe0] hover:bg-[#fff8f7]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-[#2f020d]">{pkg.title}</span>
                                <input
                                  type="radio"
                                  name="pkg"
                                  checked={wizardPkg === pkg.id}
                                  onChange={() => setWizardPkg(pkg.id)}
                                  className="text-[#4a1521] focus:ring-[#735c00]"
                                />
                              </div>
                              <span className="text-xs font-bold text-[#735c00]">
                                {pkg.price.toLocaleString("ar-SA")} ر.س
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Complementary Services / Add-ons section */}
                      <div className="pt-6 border-t border-[#eedfe0] space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-[#2f020d] flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#735c00]" />
                              <span>٢. الخدمات التكميلية والمرافقة (اختياري):</span>
                            </h4>
                            <p className="text-xs text-[#524345] mt-0.5">
                              أضيفي لمسات استثنائية لراحتكِ وراحة مرافقتكِ بيوم المناسبة
                            </p>
                          </div>
                          {wizardAddons.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setWizardAddons([])}
                              className="text-xs font-semibold text-[#ba1a1a] hover:underline"
                            >
                              إلغاء التحديد ({wizardAddons.length})
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {addons.map((addon) => {
                            const isChecked = wizardAddons.includes(addon.id);
                            return (
                              <label
                                key={addon.id}
                                className={`p-3.5 rounded-2xl border cursor-pointer flex flex-col justify-between gap-2.5 transition-all ${
                                  isChecked
                                    ? "border-[#735c00] bg-[#fff8f7] ring-2 ring-[#735c00] shadow-sm"
                                    : "border-[#eedfe0] bg-white hover:bg-[#fff8f7]"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    name={addon.id}
                                    checked={isChecked}
                                    onChange={() => toggleWizardAddon(addon.id)}
                                    className="rounded text-[#4a1521] focus:ring-[#735c00] mt-0.5 h-4 w-4 cursor-pointer"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-bold text-xs text-[#2f020d]">{addon.title}</span>
                                      {addon.popular && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#faeaeb] text-[#735c00] font-bold">
                                          ★ الأكثر طلباً
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-[#524345] leading-relaxed mt-1">
                                      {addon.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-[#eedfe0]/60 flex items-center justify-between text-xs">
                                  <span className="text-[10px] text-[#735c00] font-medium">خدمة مساندة ملكية</span>
                                  <span className="font-bold text-[#735c00]">
                                    +{addon.price.toLocaleString("ar-SA")} ر.س
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#eedfe0]">
                        <div className="text-xs text-[#524345] flex items-center gap-2">
                          <span>الإجمالي المبدئي: </span>
                          <strong className="text-base font-bold font-serif text-[#4a1521]">
                            {wizardTotalAmount.toLocaleString("ar-SA")} ر.س
                          </strong>
                          {wizardAddons.length > 0 && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fed65b]/30 text-[#735c00] font-semibold">
                              (شامل {wizardAddons.length} خدمات تكميلية)
                            </span>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => setWizardStep(2)}
                          className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white px-8 py-2.5 font-bold text-xs flex items-center gap-2 shadow-lg hover-lift"
                        >
                          <span>المتابعة لاختيار التاريخ والموعد</span>
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-base font-bold text-[#2f020d]">تاريخ وتوقيت المناسبة:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-[#524345] block mb-1.5">تاريخ المناسبة</label>
                          <input
                            type="date"
                            value={wizardDate}
                            onChange={(e) => setWizardDate(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-sm focus:outline-none focus:border-[#735c00]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#524345] block mb-1.5">الفترة الزمنية المفضلة</label>
                          <select
                            value={wizardTime}
                            onChange={(e) => setWizardTime(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-sm focus:outline-none focus:border-[#735c00]"
                          >
                            <option value="صباحاً (11:00 ص)">صباحاً (11:00 ص) — جلسات الأتيليه والتجهيز المبكر</option>
                            <option value="عصراً (02:00 م)">عصراً (02:00 م) — الموعد المثالي لعرائس الفنادق</option>
                            <option value="مساءً (06:00 م)">مساءً (06:00 م) — مناسبات السهرة والحفلات</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button variant="outline" type="button" onClick={() => setWizardStep(1)} className="rounded-full">
                          السابق
                        </Button>
                        <Button type="button" onClick={() => setWizardStep(3)} className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white px-8">
                          المتابعة للموقع
                        </Button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-base font-bold text-[#2f020d]">مقر إقامة الجلسة بالرياض:</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-[#524345] block mb-1.5">اسم الفندق / القاعة أو الحي السكني</label>
                          <input
                            type="text"
                            value={wizardVenue}
                            onChange={(e) => setWizardVenue(e.target.value)}
                            placeholder="مثال: فندق الريتز-كارلتون، حي حطين، قاعة نيارة..."
                            className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-sm focus:outline-none focus:border-[#735c00]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-[#524345] block mb-1.5">النطاق الجغرافي وبدل التنقل</label>
                          <select
                            value={wizardArea}
                            onChange={(e) => setWizardArea(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-sm focus:outline-none focus:border-[#735c00]"
                          >
                            <option value="area_hotels_vip">أجنحة الفنادق 5 نجوم بالرياض (مشمول مجاناً)</option>
                            <option value="area_north">قصور شمال الرياض (حطين، النخيل، الملقا)</option>
                            <option value="area_diriyah">الدرعية ومطل البجيري (+150 ر.س)</option>
                            <option value="area_dq">حي السفارات (الأجنحة الدبلوماسية)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" type="button" onClick={() => setWizardStep(2)} className="rounded-full">
                          السابق
                        </Button>
                        <Button type="button" onClick={() => setWizardStep(4)} className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white px-8">
                          المتابعة للتأكيد
                        </Button>
                      </div>
                    </div>
                  )}

                  {wizardStep === 4 && (
                    <div className="space-y-4">
                      <h4 className="text-base font-bold text-[#2f020d]">بيانات التواصل وتثبيت الموعد:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-[#524345] block mb-1.5">اسمكِ الكريم</label>
                          <input
                            type="text"
                            required
                            value={wizardName}
                            onChange={(e) => setWizardName(e.target.value)}
                            placeholder="مثال: سارة بنت فيصل"
                            className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-sm focus:outline-none focus:border-[#735c00]"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-[#524345] block mb-1.5">رقم الجوال (واتساب)</label>
                          <input
                            type="tel"
                            required
                            value={wizardPhone}
                            onChange={(e) => setWizardPhone(e.target.value)}
                            placeholder="05xxxxxxxx"
                            className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-sm focus:outline-none focus:border-[#735c00]"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] text-xs text-[#524345] space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#eedfe0]">
                          <p className="font-bold text-[#4a1521]">ملخص الحجز الملكي السريع:</p>
                          <span className="font-bold text-sm text-[#4a1521]">
                            {wizardTotalAmount.toLocaleString("ar-SA")} ر.س
                          </span>
                        </div>
                        <p>• الباقة الأساسية: <strong className="text-[#2f020d]">{selectedWizardPackageObj.title}</strong> ({selectedWizardPackageObj.price.toLocaleString("ar-SA")} ر.س)</p>
                        {wizardAddons.length > 0 && (
                          <div className="ps-3 py-1.5 border-s-2 border-[#735c00] bg-white/70 rounded-e-lg text-[11px] space-y-1">
                            <span className="font-bold text-[#735c00] block">الخدمات التكميلية المختارة ({wizardAddons.length}):</span>
                            {wizardAddons.map((addonId) => {
                              const ad = addons.find((a) => a.id === addonId);
                              if (!ad) return null;
                              return (
                                <p key={addonId} className="flex items-center justify-between text-[#524345]">
                                  <span>+ {ad.title}</span>
                                  <span className="font-semibold text-[#735c00]">+{ad.price.toLocaleString("ar-SA")} ر.س</span>
                                </p>
                              );
                            })}
                          </div>
                        )}
                        <p>• الموعد المختار: {wizardDate} ({wizardTime})</p>
                        <p>• مقر الجلسة: {wizardVenue}</p>
                        <div className="pt-2 border-t border-[#eedfe0] flex items-center justify-between font-bold text-[#735c00]">
                          <span>• قيمة العربون المطلوب لتثبيت الموعد (30%):</span>
                          <span className="text-sm">
                            {wizardDepositAmount.toLocaleString("ar-SA")} ر.س
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" type="button" onClick={() => setWizardStep(3)} className="rounded-full">
                          السابق
                        </Button>
                        <Button type="submit" className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white px-8 font-bold hover-shine">
                          تأكيد الحجز واستخراج الفاتورة 💍
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      </ScrollReveal>

      {/* 5. EXPANDED LUXURY GALLERY SECTION ON HOME */}
      <ScrollReveal>
        <section className="py-20 bg-[#fff8f7] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faeaeb] text-[#735c00] text-xs font-bold mb-2 animate-float">
                  <Camera className="w-3.5 h-3.5" />
                  <span>ألبوم الإطلالات الحصرية 2025</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d]">
                  معرض الإطلالات الملكية الموثقة
                </h2>
                <p className="text-sm text-[#524345] mt-2">
                  استعرضي نماذج حقيقية لمكياج العرائس والسهرات وجلسات الاستوديو بعدسة تصوير احترافية
                </p>
              </div>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#4a1521] hover:text-[#2f020d] hover:underline hover-lift"
              >
                <span>مشاهدة المعرض الكامل ({extendedGallery.length} إطلالة)</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex justify-center mb-10">
              <Tabs value={galleryCategory} onValueChange={setGalleryCategory} className="w-full max-w-2xl">
                <TabsList className="bg-[#faeaeb] p-1.5 rounded-full flex flex-wrap justify-center gap-1 w-full shadow-inner">
                  <TabsTrigger value="all" className="rounded-full text-xs font-semibold px-4 cursor-pointer">
                    جميع الإطلالات
                  </TabsTrigger>
                  <TabsTrigger value="artist" className="rounded-full text-xs font-semibold px-4 cursor-pointer text-[#4a1521] font-bold">
                    جلسات الخبيرة أماني
                  </TabsTrigger>
                  <TabsTrigger value="bridal" className="rounded-full text-xs font-semibold px-4 cursor-pointer">
                    عرائس ملكي
                  </TabsTrigger>
                  <TabsTrigger value="evening" className="rounded-full text-xs font-semibold px-4 cursor-pointer">
                    سهرات ومناسبات
                  </TabsTrigger>
                  <TabsTrigger value="soft" className="rounded-full text-xs font-semibold px-4 cursor-pointer">
                    إطلالات ناعمة
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLooks.slice(0, 6).map((item, idx) => (
                <div
                  key={item.id}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-[#eedfe0] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover-lift"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2f020d]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />

                    {/* Top Badge */}
                    <div className="absolute top-3 start-3">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-[#fed65b] font-bold">
                        {item.categoryAr}
                      </span>
                    </div>

                    {/* Zoom Action */}
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#fed65b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      aria-label="تكبير الصورة"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    {/* Client Venue Caption */}
                    <div className="absolute bottom-3 start-3 end-3 text-white">
                      <p className="text-[11px] text-[#eedfe0] flex items-center gap-1">
                        <Hotel className="w-3 h-3 text-[#fed65b]" />
                        <span>{item.clientType}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="text-base font-bold text-[#2f020d] mb-2">{item.title}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {item.styleTags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-full bg-[#faeaeb] text-[10px] font-medium text-[#735c00]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#eedfe0] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(item.id)}
                        className="flex items-center gap-1.5 text-xs text-[#735c00] hover:text-[#4a1521] transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-[#faeaeb] text-[#735c00]" />
                        <span className="font-semibold">{likedLooks[item.id] || 120}</span>
                      </button>

                      <Button
                        size="sm"
                        onClick={() => handleSelectPackageDirect("vip-bridal")}
                        className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-[11px] font-bold px-4 h-8 hover-shine"
                      >
                        طلب هذا اللوك
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold shadow-md transition-all hover-shine"
              >
                <span>استكشاف كافة الإطلالات في الألبوم</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. EXPANDED CLIENT REVIEWS & SOCIAL PROOF SECTION */}
      <ScrollReveal>
        <section className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#735c00] text-xs font-bold mb-2 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>تقييمات واقعية وموثقة</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d]">
                تجارب وآراء عميلاتنا الوفيات
              </h2>
              <p className="text-sm text-[#524345] mt-2">
                شهادات حقيقية من عرائس وسيدات الرياض اللاتي تألقن في مناسباتهن الخاصة
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setReviewModalOpen(true)}
                className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold h-11 px-6 shadow-sm gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>شاركينا تقييمكِ</span>
              </Button>
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a1521] hover:underline"
              >
                <span>جميع التقييمات ({reviews.length})</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Rating Summary Scorecard Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#eedfe0] shadow-sm mb-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-right border-b md:border-b-0 md:border-l md:border-[#eedfe0] pb-6 md:pb-0 md:pe-6">
              <span className="text-5xl sm:text-6xl font-bold font-serif text-[#2f020d]">٤.٩</span>
              <div className="flex items-center gap-1 text-amber-500 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#524345]">
                متوسط التقييم العام بناءً على <strong className="text-[#2f020d]">+١٬٥٠٠ عروس ومناسبة</strong>
              </p>
            </div>

            <div className="md:col-span-5 space-y-2.5">
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-[#524345]">٥ نجوم</span>
                <Progress value={96} className="h-2 flex-1" />
                <span className="w-10 text-left font-bold text-[#2f020d]">٩٦٪</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-[#524345]">٤ نجوم</span>
                <Progress value={4} className="h-2 flex-1" />
                <span className="w-10 text-left font-bold text-[#2f020d]">٤٪</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#857374]">
                <span className="w-12">٣ نجوم</span>
                <Progress value={0} className="h-2 flex-1" />
                <span className="w-10 text-left font-bold">٠٪</span>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col justify-center items-center md:items-end text-center md:text-left gap-2">
              <div className="p-3.5 rounded-2xl bg-[#faeaeb] text-center w-full">
                <ShieldCheck className="w-6 h-6 text-[#735c00] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#4a1521] block">توثيق العقود بنسبة 100%</span>
                <span className="text-[10px] text-[#524345]">المركز السعودي للأعمال #FL-9941082</span>
              </div>
            </div>
          </div>

          {/* Interactive Review Category Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs value={reviewFilter} onValueChange={setReviewFilter} className="w-full max-w-md">
              <TabsList className="bg-white p-1 rounded-full border border-[#eedfe0] grid grid-cols-3 w-full">
                <TabsTrigger value="all" className="rounded-full text-xs font-semibold">
                  الكل ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="bridal" className="rounded-full text-xs font-semibold">
                  عرائس VIP
                </TabsTrigger>
                <TabsTrigger value="evening" className="rounded-full text-xs font-semibold">
                  سهرات وملكة
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Reviews Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredReviews.slice(0, 6).map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#857374]">{rev.date}</span>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <Quote className="w-4 h-4 text-[#735c00] shrink-0 rotate-180 mt-0.5 opacity-60" />
                    <p className="text-xs text-[#211a1b] leading-relaxed italic">{rev.comment}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#eedfe0] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#2f020d]">{rev.clientName}</h4>
                    <p className="text-[10px] text-[#735c00]">{rev.venue}</p>
                    <span className="text-[9px] text-[#857374] block">{rev.packageTitle}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-[#faeaeb] border-none text-[#4a1521]">
                    حجز مؤكد ✓
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* 7. World-Class Cosmetic Brands & Infinite Runway Marquee */}
      <ScrollReveal>
        <section className="py-16 bg-[#fff8f7] border-b border-[#eedfe0] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-8 text-center">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              أصالة وجودة لا تهاون فيها
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2f020d] mt-2">
              الماركات العالمية الفاخرة المعتمدة
            </h2>
            <p className="text-xs text-[#524345] mt-1 max-w-lg mx-auto">
              نقتني مستحضراتنا الأصلية مباشرة من دور الأزياء الفرنسية والبريطانية مع بروتوكول تعقيم طبي قبل كل جلسة
            </p>
          </div>

          {/* Continuous Infinite Runway Glide */}
          <div className="relative overflow-hidden w-full py-4">
            <div className="animate-marquee flex items-center gap-6">
              {[
                { brand: "DIOR", note: "Backstage & Capture Totale" },
                { brand: "CHARLOTTE TILBURY", note: "Hollywood Flawless Filter" },
                { brand: "TOM FORD", note: "Shade & Illuminate" },
                { brand: "CHANEL", note: "Les Beiges Water-Fresh" },
                { brand: "NARS", note: "Radiant Creamy Concealer" },
                { brand: "HOURGLASS", note: "Ambient Lighting Powder" },
                { brand: "YVES SAINT LAURENT", note: "Touche Éclat Le Teint" },
                { brand: "HUDA BEAUTY", note: "Easy Bake Loose Powder" },
                // Duplicate items for continuous infinite scroll loop
                { brand: "DIOR", note: "Backstage & Capture Totale" },
                { brand: "CHARLOTTE TILBURY", note: "Hollywood Flawless Filter" },
                { brand: "TOM FORD", note: "Shade & Illuminate" },
                { brand: "CHANEL", note: "Les Beiges Water-Fresh" },
                { brand: "NARS", note: "Radiant Creamy Concealer" },
                { brand: "HOURGLASS", note: "Ambient Lighting Powder" },
                { brand: "YVES SAINT LAURENT", note: "Touche Éclat Le Teint" },
                { brand: "HUDA BEAUTY", note: "Easy Bake Loose Powder" },
              ].map((b, bIdx) => (
                <div
                  key={bIdx}
                  className="w-52 p-4 rounded-2xl bg-white border border-[#eedfe0] shadow-sm flex flex-col items-center justify-center gap-1 hover:border-[#735c00]/60 transition-all flex-shrink-0 hover-lift cursor-default"
                >
                  <span className="font-serif font-bold text-sm text-[#2f020d] tracking-widest">{b.brand}</span>
                  <span className="text-[10px] text-[#735c00] font-medium">{b.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Hero Studio Image Fullscreen Modal */}
      <Dialog open={heroImageModalOpen} onOpenChange={setHeroImageModalOpen}>
        <DialogContent className="max-w-5xl bg-[#2f020d] border border-[#fed65b]/40 p-4 text-right text-white">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold font-serif text-[#fed65b] flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>{AMANI_STUDIO_LOOKS[heroLookIdx].title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#eedfe0]">
              {AMANI_STUDIO_LOOKS[heroLookIdx].subtitle} — خبيرة التجميل أماني خليل بالرياض
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mt-3 border border-white/20 bg-black">
            <Image
              src={AMANI_STUDIO_LOOKS[heroLookIdx].src}
              alt={AMANI_STUDIO_LOOKS[heroLookIdx].title}
              fill
              unoptimized={true}
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-[#eedfe0]">
            <span>جلسة تصوير رسمية معتمدة • استوديو أماني خليل بالرياض</span>
            <Button
              onClick={() => {
                setHeroImageModalOpen(false);
                router.push("/book");
              }}
              className="rounded-full bg-[#fed65b] hover:bg-white text-[#241a00] font-bold text-xs px-6"
            >
              حجز موعد مع أماني خليل
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal for Gallery */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && setLightboxIndex(null)}>
        <DialogContent className="max-w-3xl bg-[#2f020d] border border-[#fed65b]/40 p-4 text-right text-white">
          {lightboxIndex !== null && filteredLooks[lightboxIndex] && (
            <>
              <DialogHeader className="text-right">
                <DialogTitle className="text-lg font-bold text-[#fed65b]">
                  {filteredLooks[lightboxIndex].title}
                </DialogTitle>
                <DialogDescription className="text-xs text-[#eedfe0]">
                  {filteredLooks[lightboxIndex].clientType}
                </DialogDescription>
              </DialogHeader>

              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden my-3 border border-white/20 bg-black">
                <Image
                  src={filteredLooks[lightboxIndex].image}
                  alt={filteredLooks[lightboxIndex].title}
                  fill
                  unoptimized={true}
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredLooks.length) % filteredLooks.length
                      )
                    }
                    className="rounded-full bg-white/10 text-white border-white/20"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % filteredLooks.length)
                    }
                    className="rounded-full bg-white/10 text-white border-white/20"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={() => {
                    setLightboxIndex(null);
                    handleSelectPackageDirect("vip-bridal");
                  }}
                  className="rounded-full bg-[#fed65b] text-[#241a00] hover:bg-white font-bold text-xs px-6"
                >
                  احجزي مثل هذا اللوك 💍
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold text-[#2f020d] flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              <span>شاركينا تجربتكِ وتقييمكِ الملكي</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#524345]">
              رأيكِ يلهم عرائسنا ويساعدنا في المحافظة على أعلى معايير الفخامة والخصوصية.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold text-[#2f020d] block mb-1">اسمكِ الكريم</label>
              <input
                type="text"
                required
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="مثال: نورة بنت عبد العزيز"
                className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">الباقة المحجوزة</label>
                <select
                  value={newPackageTitle}
                  onChange={(e) => setNewPackageTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#eedfe0] bg-white text-xs"
                >
                  <option value="باقة العروس الملكية VIP">باقة العروس الملكية VIP</option>
                  <option value="باقة مكياج السهرة VIP">باقة مكياج السهرة VIP</option>
                  <option value="باقة الملكة والخطوبة">باقة الملكة والخطوبة</option>
                  <option value="جلسة التجربة والبروفة">جلسة التجربة والبروفة</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">التقييم</label>
                <div className="flex items-center gap-1 h-10 px-3 bg-white border border-[#eedfe0] rounded-xl text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating ? "fill-current text-amber-500" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2f020d] block mb-1">مقر الحفل / الفندق</label>
              <input
                type="text"
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                placeholder="مثال: فندق الريتز-كارلتون، الرياض"
                className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#2f020d] block mb-1">رأيكِ وتجربتكِ مع أماني خليل</label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="اكتبي تجربتكِ عن ثبات المكياج، دمج الألوان، والتعامل الراقي..."
                className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReviewModalOpen(false)}
                className="rounded-full text-xs"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold px-6"
              >
                نشر التقييم ✨
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* CIDESCO Certificate Dialog */}
      <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
        <DialogContent className="max-w-2xl bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold text-[#2f020d] flex items-center gap-2">
              <Award className="h-6 w-6 text-[#735c00]" />
              <span>الاعتماد الدولي الرسمي — CIDESCO</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#524345]">
              دبلوم التجميل والمكياج السينمائي والعرائسي المتقدم الصادر من الأكاديمية الدولية للتجميل بالرياض.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 rounded-2xl overflow-hidden border border-[#eedfe0] shadow-inner bg-white p-4 text-center">
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
              <Image
                src="/amani-hero.jpg"
                alt="شهادة الاعتماد الرسمي واستوديو أماني خليل"
                fill
                unoptimized={true}
                className="object-cover"
              />
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#faeaeb] text-xs text-[#4a1521] text-right space-y-1">
              <p className="font-bold">• خبيرة التجميل: أماني خليل</p>
              <p>• سنة التخرج والاعتماد: 2021</p>
              <p>• رقم السجل المهني: CIDESCO-SA-88219</p>
              <p>• الاختصاص: مكياج العرائس الفاخر، الإضاءة السينمائية، والتثبيت الهيدروليكي 4K</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Luxury Footer */}
      <SiteFooter />
    </div>
  );
}
