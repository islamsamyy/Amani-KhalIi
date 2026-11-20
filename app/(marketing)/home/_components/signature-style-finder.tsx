"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { Sparkles, Clock, Camera, Calendar, Check, Crown } from "lucide-react";

export interface SignatureStyleOption {
  id: string;
  nameAr: string;
  nameEn: string;
  tag: string;
  packageId: string;
  image: string;
  description: string;
  duration: string;
  holdHours: string;
  lighting: string;
  keyProducts: string[];
}

export const SIGNATURE_STYLES: SignatureStyleOption[] = [
  {
    id: "royal-bridal",
    nameAr: "إطلالة العروس الملكية",
    nameEn: "Royal Bridal 4K",
    tag: "الأكثر اختياراً للعرائس",
    packageId: "vip-bridal",
    image: "/amani-hero.jpg",
    description:
      "نحت متوازن للملامح مع تغطية مخملية فائقة النعومة تمنحكِ إطلالة أرستقراطية خالدة تحت أضواء القاعات الملكية وعدسات 4K.",
    duration: "4 - 5 ساعات",
    holdHours: "ثبات هيدروليكي حتى 18 ساعة",
    lighting: "مُعايرة لإضاءة القصور والفلاش الاحترافي",
    keyProducts: ["Dior Backstage Foundation", "Charlotte Tilbury Airbrush", "Tom Ford Shade & Illuminate"],
  },
  {
    id: "glass-skin",
    nameAr: "البشرة الزجاجية الناعمة",
    nameEn: "Glass Skin Dewy",
    tag: "إشراقة طبيعية فاخرة",
    packageId: "vip-bridal",
    image: "/amani-mirror-glam.jpg",
    description:
      "ترطيب عميق وتأسيس طبي يبرز نضارة البشرة الطبيعية بتوهج حريري ناعم يليق بعروس الفنادق وجلسات التصوير النهارية.",
    duration: "3.5 - 4 ساعات",
    holdHours: "ترطيب وتثبيت مقاوم للتأكسد 16 ساعة",
    lighting: "مثالية للإضاءة النهارية والـ Golden Hour",
    keyProducts: ["Chanel Les Beiges", "Hourglass Ambient Lighting", "YSL Touche Éclat"],
  },
  {
    id: "velvet-bronze",
    nameAr: "سهرة مخملية برونزية",
    nameEn: "Velvet Bronze Glam",
    tag: "فخامة السهرات الكبرى",
    packageId: "evening-vip",
    image: "/gallery/IMG_5731.webp",
    description:
      "عيون مسحوبة بتدرجات البرونز الدافئ ورموش ثلاثية الأبعاد تمنح نظرتكِ عمقاً وجاذبية استثنائية في المناسبات المسائية.",
    duration: "ساعتان ونصف",
    holdHours: "ثبات مخملي طوال السهرة",
    lighting: "مصممة لأجواء السهرات والإضاءة الدافئة",
    keyProducts: ["Pat McGrath Bronze Palette", "NARS Radiant Creamy", "Huda Beauty Easy Bake"],
  },
  {
    id: "soft-pearl",
    nameAr: "أناقة الملكة الكلاسيكية",
    nameEn: "Soft Pearl Engagement",
    tag: "عقد القران والملكة",
    packageId: "engagement-royal",
    image: "/gallery/IMG_5730.webp",
    description:
      "ألوان باستيل وردية ولؤلؤية متناغمة مع فساتين الخطوبة وعقد القران، تمنحكِ أنوثة حالمة ومظهراً متألقاً في الصور.",
    duration: "3 ساعات",
    holdHours: "ثبات ناعم حتى 14 ساعة",
    lighting: "متوازنة لإضاءة الاستقبال والتصوير القريب",
    keyProducts: ["Dior Rosy Glow", "Charlotte Tilbury Pillow Talk", "Armani Luminous Silk"],
  },
];

interface SignatureStyleFinderProps {
  onSelectStyle: (packageId: string, styleName: string) => void;
}

export function SignatureStyleFinder({ onSelectStyle }: SignatureStyleFinderProps) {
  const { t, dir, isEnglish } = useLanguage();
  const [activeId, setActiveId] = useState<string>(SIGNATURE_STYLES[0].id);
  const activeStyle =
    SIGNATURE_STYLES.find((s) => s.id === activeId) || SIGNATURE_STYLES[0];

  return (
    <section
      dir={dir}
      aria-label={t("مختار ستايل الإطلالة الملكية", "Signature Aesthetic Finder")}
      className="py-20 bg-[#fff8f7] border-b border-[#eedfe0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              Signature Aesthetic Finder
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-1.5">
              {t("اختاري توقيع إطلالتكِ قبل الحجز", "Choose Your Signature Look Before Booking")}
            </h2>
            <p className="text-sm text-[#524345] mt-2 max-w-2xl">
              {t(
                "استعرضي أساليب المكياج المعتمدة في أتيليه أماني خليل، واختاري الستايل الأقرب لذوقكِ لتجهيز الباقة المناسبة فوراً.",
                "Explore Amani Khalil's signature bridal and soirée looks and select your favorite aesthetic to pre-configure your booking."
              )}
            </p>
          </div>
          <Badge variant="gold" className="self-start md:self-auto text-xs px-3.5 py-1">
            {t("4 ستايلات حصرية معتمدة", "4 Curated Signature Styles")}
          </Badge>
        </div>

        {/* Selector Pills */}
        <div
          role="tablist"
          aria-label={t("أنماط المكياج", "Makeup Styles")}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          {SIGNATURE_STYLES.map((style) => {
            const isSelected = style.id === activeStyle.id;
            return (
              <button
                key={style.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveId(style.id)}
                className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#4a1521] border-[#4a1521] text-white shadow-lg"
                    : "bg-white border-[#eedfe0] text-[#2f020d] hover:border-[#735c00]/60 hover:bg-[#fff0f1]"
                }`}
              >
                <span
                  className={`text-[10px] font-bold block mb-1 ${
                    isSelected ? "text-[#fed65b]" : "text-[#735c00]"
                  }`}
                >
                  {isEnglish ? style.nameAr : style.nameEn}
                </span>
                <span className="text-sm font-bold block leading-snug">
                  {t(style.nameAr, style.nameEn)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editorial Preview Card */}
        <div className="rounded-3xl border border-[#eedfe0] bg-white shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Visual Portrait (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] bg-[#2f020d] overflow-hidden">
            <Image
              key={activeStyle.id}
              src={activeStyle.image}
              alt={t(activeStyle.nameAr, activeStyle.nameEn)}
              fill
              unoptimized={true}
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f020d]/85 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute top-4 start-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-[#fed65b] border border-white/15">
                <Crown className="h-3.5 w-3.5" />
                <span>{activeStyle.tag}</span>
              </span>
            </div>
            <div className="absolute bottom-4 inset-x-4 text-white">
              <p className="text-xs font-serif text-[#fed65b]">
                {isEnglish ? activeStyle.nameAr : activeStyle.nameEn}
              </p>
              <h3 className="text-lg font-bold">{t(activeStyle.nameAr, activeStyle.nameEn)}</h3>
            </div>
          </div>

          {/* Editorial Specs & CTA (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-[#735c00] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("تفاصيل الإطلالة والتقنية", "Look & Technique Details")}</span>
                </span>
                <h3 className="text-2xl font-bold font-serif text-[#2f020d] mt-1">
                  {t(activeStyle.nameAr, activeStyle.nameEn)}
                </h3>
                <p className="text-sm text-[#524345] leading-relaxed mt-2">
                  {activeStyle.description}
                </p>
              </div>

              {/* 3 Technical Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#fff8f7] border border-[#eedfe0]">
                  <Clock className="h-4 w-4 text-[#735c00] mb-1.5" />
                  <span className="text-[11px] text-[#857374] block">
                    {t("مدة التجهيز", "Session Duration")}
                  </span>
                  <strong className="text-xs text-[#2f020d]">{activeStyle.duration}</strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fff8f7] border border-[#eedfe0]">
                  <Sparkles className="h-4 w-4 text-[#735c00] mb-1.5" />
                  <span className="text-[11px] text-[#857374] block">
                    {t("معدل الثبات", "Wear Longevity")}
                  </span>
                  <strong className="text-xs text-[#2f020d]">{activeStyle.holdHours}</strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#fff8f7] border border-[#eedfe0]">
                  <Camera className="h-4 w-4 text-[#735c00] mb-1.5" />
                  <span className="text-[11px] text-[#857374] block">
                    {t("معايرة العدسة", "Lens Calibration")}
                  </span>
                  <strong className="text-xs text-[#2f020d]">{activeStyle.lighting}</strong>
                </div>
              </div>

              {/* Signature Products */}
              <div>
                <span className="text-xs font-bold text-[#2f020d] block mb-2">
                  {t(
                    "أبرز المستحضرات العالمية المعتمدة لهذا الستايل:",
                    "Curated Luxury Products for This Look:"
                  )}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStyle.keyProducts.map((prod) => (
                    <span
                      key={prod}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faeaeb] text-[#4a1521] text-[11px] font-semibold"
                    >
                      <Check className="h-3 w-3 text-[#735c00]" />
                      <span dir="ltr">{prod}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#eedfe0] flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#524345]">
                {t(
                  "يتم تخصيص درجات الألوان والرموش بما يتناسب مع ملامحكِ ولون بشرتكِ.",
                  "Shades and custom Mink lashes are tailored to your skin undertone and features."
                )}
              </p>
              <Button
                type="button"
                onClick={() => onSelectStyle(activeStyle.packageId, activeStyle.nameAr)}
                className="h-11 px-7 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Calendar className="h-4 w-4 me-2 text-[#fed65b]" />
                <span>{t("احجزي هذا الستايل الآن", "Book This Style Now")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
