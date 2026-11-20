"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatedCounter } from "@/components/animated-counter";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Sun,
  Moon,
  Camera,
  Crown,
  Calendar,
  Award,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

interface LightingPreset {
  id: string;
  labelAr: string;
  labelEn: string;
  subtitleAr: string;
  subtitleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  filterStyle: string;
  overlayGradient: string;
  recommendationAr: string;
  recommendationEn: string;
}

const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: "ballroom",
    labelAr: "إضاءة القاعات الملكية",
    labelEn: "Royal Ballroom Lighting",
    subtitleAr: "ثريا دافئة • قاعات 5 نجوم",
    subtitleEn: "Warm Chandeliers • 5-Star Venues",
    icon: Sparkles,
    image: "/amani-hero.jpg",
    filterStyle: "contrast(1.06) saturate(1.12) brightness(1.02)",
    overlayGradient: "from-[#2f020d]/75 via-transparent to-[#fed65b]/15",
    recommendationAr:
      "مثالية لتكنيك الكونتور البرونزي وإضاءة الوجنتين تحت أضواء القاعات الدافئة.",
    recommendationEn:
      "Calibrated for bronze sculpting and luminous cheek highlights under warm ballroom chandeliers.",
  },
  {
    id: "daylight",
    labelAr: "إضاءة النهار والحدائق",
    labelEn: "Natural Daylight & Gardens",
    subtitleAr: "ضوء طبيعي • Golden Hour",
    subtitleEn: "Natural Sun • Golden Hour",
    icon: Sun,
    image: "/amani-mirror-glam.jpg",
    filterStyle: "contrast(1.02) saturate(1.05) brightness(1.08)",
    overlayGradient: "from-[#2f020d]/65 via-transparent to-amber-200/20",
    recommendationAr:
      "تكنيك البشرة الزجاجية Glass Skin بدون خطوط واضحة أو تكتل تحت الشمس.",
    recommendationEn:
      "Seamless Glass Skin technique with zero harsh lines or caking in direct natural daylight.",
  },
  {
    id: "studio4k",
    labelAr: "فلاش التصوير 4K",
    labelEn: "4K Studio Flash",
    subtitleAr: "عدسة احترافية • بدون Flashback",
    subtitleEn: "Pro Lens • Zero Flashback",
    icon: Camera,
    image: "/amani-client-bridal.jpg",
    filterStyle: "contrast(1.1) saturate(1.04) brightness(1.0)",
    overlayGradient: "from-[#1a050b]/80 via-transparent to-white/10",
    recommendationAr:
      "تثبيت هيدروليكي مطفي في المناطق الحساسة يمنع اللمعان المزعج أمام الفلاش.",
    recommendationEn:
      "Targeted hydraulic matte setting prevents unwanted shine or flashback on 4K camera flashes.",
  },
];

interface LuxuryCountersInteractiveProps {
  onBookNow: () => void;
}

export function LuxuryCountersAndInteractive({
  onBookNow,
}: LuxuryCountersInteractiveProps) {
  const { t, dir } = useLanguage();
  const [activePresetId, setActivePresetId] = useState<string>("ballroom");
  const [glamIntensity, setGlamIntensity] = useState<number>(75);

  const activePreset =
    LIGHTING_PRESETS.find((p) => p.id === activePresetId) || LIGHTING_PRESETS[0];

  const intensityLabel =
    glamIntensity < 40
      ? t("ناعم وطبيعي (Soft Minimal)", "Soft Minimal")
      : glamIntensity < 75
        ? t("كلاسيكي متوازن (Signature Satin)", "Signature Satin")
        : t("ملكي فخم (Royal 4K Glam)", "Royal 4K Glam");

  return (
    <section
      dir={dir}
      aria-label={t("إحصائيات الأتيليه ومحاكاة الإضاءة", "Atelier Stats & Lighting Simulator")}
      className="py-20 bg-[#fff0f1] border-b border-[#eedfe0] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* 1. Animated Luxury Counters Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="group p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover-lift transition-all relative overflow-hidden">
            <div className="h-11 w-11 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Crown className="h-5 w-5 text-[#735c00]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-serif text-[#2f020d]">
              <AnimatedCounter target={1500} prefix="+" />
            </div>
            <p className="text-xs font-bold text-[#735c00] mt-1">
              {t("عروس ومناسبة سعيدة", "Brides & Luxury Events")}
            </p>
            <p className="text-[11px] text-[#524345] mt-1">
              {t("في أفخم فنادق وقصور الرياض", "Across Riyadh's finest hotels & palaces")}
            </p>
          </div>

          <div className="group p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover-lift transition-all relative overflow-hidden">
            <div className="h-11 w-11 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 text-[#735c00]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-serif text-[#2f020d]">
              <AnimatedCounter target={18} suffix={t(" ساعة", " hrs")} />
            </div>
            <p className="text-xs font-bold text-[#735c00] mt-1">
              {t("ثبات هيدروليكي 4K", "4K Hydraulic Hold")}
            </p>
            <p className="text-[11px] text-[#524345] mt-1">
              {t("مقاوم للحرارة والدموع والأضواء", "Heat, tear & studio-light resistant")}
            </p>
          </div>

          <div className="group p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover-lift transition-all relative overflow-hidden">
            <div className="h-11 w-11 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5 text-[#735c00]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-serif text-[#2f020d]">
              <AnimatedCounter target={4.9} decimals={1} suffix=" ★" />
            </div>
            <p className="text-xs font-bold text-[#735c00] mt-1">
              {t("تقييم العميلات الموثق", "Verified Client Rating")}
            </p>
            <p className="text-[11px] text-[#524345] mt-1">
              {t("أعلى معايير الرضا والخصوصية", "Highest satisfaction & strict privacy")}
            </p>
          </div>

          <div className="group p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover-lift transition-all relative overflow-hidden">
            <div className="h-11 w-11 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5 text-[#735c00]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-serif text-[#2f020d]">
              <AnimatedCounter target={100} suffix="%" />
            </div>
            <p className="text-xs font-bold text-[#735c00] mt-1">
              {t("تعقيم طبي CIDESCO", "CIDESCO Medical Hygiene")}
            </p>
            <p className="text-[11px] text-[#524345] mt-1">
              {t("ومستحضرات فاخرة أصلية بالكامل", "100% authentic luxury cosmetics")}
            </p>
          </div>
        </div>

        {/* 2. Interactive Bridal Lighting & Intensity Simulator */}
        <div className="rounded-3xl bg-white border border-[#eedfe0] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Interactive Controls (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <Badge variant="gold" className="text-[11px] px-3 py-1">
                {t("تجربة تفاعلية مباشرة", "Live Interactive Experience")}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2f020d]">
                {t("اختبري ثبات الإطلالة تحت إضاءة مناسبتكِ", "Preview Your Look Under Event Lighting")}
              </h2>
              <p className="text-xs sm:text-sm text-[#524345] leading-relaxed">
                {t(
                  "تنقلي بين بيئات الإضاءة المختلفة واضبطي درجة فخامة المكياج لمعاينة كيف تتناغم ألوان أماني خليل مع عدسات التصوير.",
                  "Switch between lighting environments and adjust glam intensity to see how Amani Khalil's pigments harmonize with 4K photography."
                )}
              </p>

              {/* 3 Lighting Environment Buttons */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-[#2f020d] block">
                  {t("١. اختاري بيئة الإضاءة:", "1. Select Lighting Environment:")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {LIGHTING_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const active = preset.id === activePreset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setActivePresetId(preset.id)}
                        className={`p-3 rounded-2xl border text-start transition-all cursor-pointer ${
                          active
                            ? "bg-[#4a1521] border-[#4a1521] text-white shadow-md scale-[1.02]"
                            : "bg-[#fff8f7] border-[#eedfe0] text-[#2f020d] hover:border-[#735c00]"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 mb-1.5 ${
                            active ? "text-[#fed65b]" : "text-[#735c00]"
                          }`}
                        />
                        <span className="text-xs font-bold block leading-snug">
                          {t(preset.labelAr, preset.labelEn)}
                        </span>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            active ? "text-[#eedfe0]" : "text-[#857374]"
                          }`}
                        >
                          {t(preset.subtitleAr, preset.subtitleEn)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Intensity Slider */}
              <div className="p-4 rounded-2xl bg-[#fff8f7] border border-[#eedfe0] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#2f020d] flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#735c00]" />
                    <span>{t("٢. درجة كثافة وفخامة المكياج:", "2. Glam & Coverage Intensity:")}</span>
                  </span>
                  <span className="font-bold text-[#735c00]">{glamIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={glamIntensity}
                  aria-label={t("درجة كثافة وفخامة المكياج", "Glam intensity")}
                  onChange={(e) => setGlamIntensity(Number(e.target.value))}
                  className="w-full accent-[#4a1521] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-[#524345]">
                  <span>{t("ناعم يومي", "Soft Minimal")}</span>
                  <span className="font-bold text-[#4a1521]">{intensityLabel}</span>
                  <span>{t("جلام ملكي", "Royal Glam")}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#eedfe0] flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#524345] flex-1 min-w-[200px]">
                {t(activePreset.recommendationAr, activePreset.recommendationEn)}
              </p>
              <Button
                type="button"
                onClick={onBookNow}
                className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold px-6 h-11 hover-shine cursor-pointer"
              >
                <Calendar className="h-4 w-4 me-2 text-[#fed65b]" />
                <span>{t("تثبيت الموعد الآن", "Book Session Now")}</span>
              </Button>
            </div>
          </div>

          {/* Live Visual Preview (6 cols) */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[420px] bg-[#2f020d] overflow-hidden">
            <Image
              key={activePreset.id}
              src={activePreset.image}
              alt={t(activePreset.labelAr, activePreset.labelEn)}
              fill
              unoptimized={true}
              style={{
                filter: `${activePreset.filterStyle} brightness(${0.92 + (glamIntensity / 100) * 0.14})`,
              }}
              className="object-cover object-center transition-all duration-700 animate-fade-in"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${activePreset.overlayGradient} pointer-events-none transition-all duration-500`}
            />
            <div className="absolute top-4 start-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] font-bold text-[#fed65b] border border-white/15">
                <Moon className="h-3.5 w-3.5" />
                <span>{t(activePreset.labelAr, activePreset.labelEn)}</span>
              </span>
            </div>
            <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#fed65b]">{intensityLabel}</p>
                <p className="text-[11px] text-white/80">
                  {t(activePreset.subtitleAr, activePreset.subtitleEn)}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#fed65b] text-[#241a00] text-[10px] font-bold shrink-0">
                4K Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
