"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Crown,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  ArrowLeft,
  Camera,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/language-provider";

export interface BannerSlide {
  id: string;
  src: string;
  badge: string;
  badgeEn: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  highlight: string;
  highlightEn: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "slide-monogram",
    src: "/amani-monogram-banner.jpg",
    badge: "البانر الملكي المعتمد • 2025",
    badgeEn: "Official Royal Atelier • 2025",
    title: "أتيليه أماني خليل — الهوية الملكية الرسمية",
    titleEn: "Amani Khalil Atelier — Haute Beauté Signature",
    subtitle:
      "تفرغ تام لعروس واحدة يومياً بأفخم مستحضرات الهوت كوتور العالمية وأحدث تقنيات الإضاءة السينمائية 4K في الرياض.",
    subtitleEn:
      "Dedicated exclusively to one bride per day using haute-couture cosmetics and 4K editorial studio lighting in Riyadh.",
    highlight: "عروس واحدة يومياً • تفرغ ملكي",
    highlightEn: "One Bride Per Day • Exclusive Focus",
  },
  {
    id: "slide-vanity-brush",
    src: "/amani-vanity-brush.jpg",
    badge: "كواليس الاستوديو السينمائي",
    badgeEn: "Behind the 4K Vanity",
    title: "فن نحت الملامح وانتقاء الفراشي الاحترافية",
    titleEn: "The Art of Sculpting & Pro Brush Selection",
    subtitle:
      "مرايا هوليوود وإضاءة سينمائية متطورة تحاكي إضاءة القاعات الملكية، لضمان ثبات الإطلالة وتألقها حتى نهاية الحفل.",
    subtitleEn:
      "Hollywood mirrors calibrated to ballroom lighting so every contour stays radiant until the final moment.",
    highlight: "تثبيت هيدروليكي 4K يدوم 18 ساعة",
    highlightEn: "18-Hour 4K Hydraulic Hold",
  },
  {
    id: "slide-client-bridal",
    src: "/amani-client-bridal.jpg",
    badge: "جلسة عروس حصرية",
    badgeEn: "Exclusive Bridal Session",
    title: "تجهيز العروس الملكية بدقة الأكاديمية السويسرية",
    titleEn: "Swiss-Certified Bridal Preparation",
    subtitle:
      "تطبيق مباشر لأعلى معايير دبلوم CIDESCO الدولي لتهيئة البشرة والكونتور الطبيعي المتناغم مع فستان وطرحة الزفاف.",
    subtitleEn:
      "Clinical skin prep and seamless bridal sculpting certified by CIDESCO Switzerland.",
    highlight: "اعتماد CIDESCO الدولي السويسري",
    highlightEn: "CIDESCO Swiss Certified",
  },
  {
    id: "slide-mirror-glam",
    src: "/amani-mirror-glam.jpg",
    badge: "سحر البشرة الزجاجية",
    badgeEn: "Glass Skin Radiance",
    title: "إشراقة الملامح وسحر الـ Glass Skin الأصيل",
    titleEn: "Luminous Features & Authentic Glass Skin",
    subtitle:
      "الكشف عن أبهى تفاصيل جمالكِ الطبيعي بنعومة فائقة دون تكلف، لإطلالة ملكية خالدة في ذاكرة ضيوفكِ وألبوم زفافكِ.",
    subtitleEn:
      "Revealing your natural radiance with weightless elegance that looks timeless in person and on camera.",
    highlight: "بشرة مخملية نضرة ومقاومة للتأكسد",
    highlightEn: "Velvet Non-Oxidizing Finish",
  },
];

export function AnimatedStudioBanner() {
  const { t, dir } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = 5000; // 5 seconds per slide
  const stepInterval = 50;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIdx((c) => (c + 1) % BANNER_SLIDES.length);
          return 0;
        }
        return prev + (stepInterval / duration) * 100;
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [isPaused, currentIdx]);

  const goToSlide = (idx: number) => {
    setCurrentIdx(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % BANNER_SLIDES.length);
    setProgress(0);
  };

  const currentSlide = BANNER_SLIDES[currentIdx];

  return (
    <section
      aria-label="بانر الأتيليه الملكي المتحرك"
      className="relative w-full overflow-hidden bg-[#1f0009] text-white py-8 sm:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main Banner Showcase Frame */}
        <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden border-2 border-[#fed65b]/40 shadow-[0_25px_60px_rgba(47,2,13,0.55)] bg-[#2f020d] min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between group">
          {/* Background Images with Cross-Fade and Ken-Burns Cinematic Motion */}
          {BANNER_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIdx;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  unoptimized
                  priority={idx === 0}
                  className={`object-cover object-center transition-transform duration-[7000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                {/* Luxury Vignettes & Overlays for pristine typography readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#20000a] via-[#2f020d]/60 to-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#20000a]/90 via-transparent to-[#20000a]/40" />
              </div>
            );
          })}

          {/* Top Bar inside Banner: Badge, Slide Index & Controls */}
          <div className="relative z-20 p-5 sm:p-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-[#fed65b]/40 text-xs font-bold text-[#fed65b] shadow-lg animate-float">
                <Crown className="w-3.5 h-3.5 text-[#fed65b]" />
                <span>{currentSlide.badge}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/15">
                <ShieldCheck className="w-3 h-3 text-[#fed65b]" />
                <span>{currentSlide.highlight}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "تشغيل العرض التلقائي" : "إيقاف العرض التلقائي مؤقتاً"}
                className="h-9 w-9 rounded-full bg-black/50 backdrop-blur-md hover:bg-[#fed65b] text-white hover:text-[#2f020d] flex items-center justify-center transition-all cursor-pointer border border-white/15 text-xs shadow-md"
                title={isPaused ? "تشغيل" : "إيقاف مؤقت"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 ms-0.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <div className="h-9 px-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1 text-xs font-bold font-serif text-[#fed65b]">
                <span>0{currentIdx + 1}</span>
                <span className="text-white/40">/</span>
                <span className="text-white/70">0{BANNER_SLIDES.length}</span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows on Left and Right (Always accessible) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="البانر السابق"
            className="absolute top-1/2 start-4 sm:start-6 -translate-y-1/2 z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/55 backdrop-blur-xl border border-white/20 text-white hover:bg-[#fed65b] hover:text-[#2f020d] flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="البانر التالي"
            className="absolute top-1/2 end-4 sm:end-6 -translate-y-1/2 z-20 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/55 backdrop-blur-xl border border-white/20 text-white hover:bg-[#fed65b] hover:text-[#2f020d] flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Bottom Content Area: Editorial Headline, Call-to-action & Thumbnails */}
          <div className="relative z-20 p-6 sm:p-10 lg:p-12 space-y-6">
            <div className="max-w-3xl space-y-3">
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif text-white leading-tight tracking-tight drop-shadow-md">
                {t(currentSlide.title, currentSlide.titleEn)}
              </h3>
              <p className="text-xs sm:text-base text-[#eedfe0] max-w-2xl leading-relaxed drop-shadow">
                {t(currentSlide.subtitle, currentSlide.subtitleEn)}
              </p>
            </div>

            {/* Action Buttons & Quick Booking Trigger */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/book"
                className="h-12 px-7 rounded-full bg-[#fed65b] hover:bg-[#ffe088] text-[#241a00] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#735c00]" />
                <span>{t("احجزي موعدكِ الملكي الآن", "Book Your Royal Session")}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("packages-section");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="h-12 px-6 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/25 transition-all cursor-pointer"
              >
                <span>{t("معاينة باقات العرائس", "Explore Bridal Packages")}</span>
                <ArrowLeft className="w-4 h-4 text-[#fed65b]" />
              </button>
            </div>

            {/* 4 Interactive Thumbnail Strip & Live Timer Progress Bar */}
            <div className="pt-4 border-t border-white/15 space-y-3">
              {/* Animated Progress Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-[#fed65b] to-[#735c00] transition-all duration-75 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {BANNER_SLIDES.map((slide, idx) => {
                  const isSelected = idx === currentIdx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`relative flex items-center gap-2.5 p-2 rounded-2xl border transition-all cursor-pointer text-right group/thumb overflow-hidden ${
                        isSelected
                          ? "bg-white/20 border-[#fed65b] shadow-lg ring-1 ring-[#fed65b]/50 scale-[1.02]"
                          : "bg-black/40 border-white/15 hover:bg-white/10 hover:border-white/30 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                        <Image
                          src={slide.src}
                          alt={slide.title}
                          fill
                          unoptimized
                          className="object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-[11px] font-bold block truncate leading-tight ${
                            isSelected ? "text-[#fed65b]" : "text-white"
                          }`}
                        >
                          {slide.badge.split("•")[0]}
                        </span>
                        <span className="text-[10px] text-white/70 block truncate mt-0.5">
                          {slide.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

