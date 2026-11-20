"use client";

import React from "react";
import { ShieldCheck, Sparkles, Lock, Award, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

const TIMELINE_STAGES = [
  {
    timeAr: "قبل 21 يوماً",
    timeEn: "21 Days Before",
    titleAr: "استشارة البشرة والألوان",
    titleEn: "Skin & Shade Consultation",
    descAr: "تقييم نوع البشرة والأندر تون وتنسيق درجات المكياج مع فستان الزفاف والطرحة.",
    descEn: "Skin & undertone evaluation plus palette coordination with your bridal gown and veil.",
  },
  {
    timeAr: "قبل 4 ساعات",
    timeEn: "4 Hours Before",
    titleAr: "التجهيز والتعقيم الموقعي",
    titleEn: "On-Site Setup & Sterilization",
    descAr: "وصول أماني وفريقها إلى جناح الفندق أو القصر مع تجهيز إضاءة 4K وبروتوكول التعقيم الطبي.",
    descEn: "Amani & team arrive at your hotel suite or palace with 4K lighting and medical sterilization.",
  },
  {
    timeAr: "أثناء الجلسة",
    timeEn: "During Session",
    titleAr: "التأسيس والتثبيت الهيدروليكي",
    titleEn: "Prep & Hydraulic Setting",
    descAr: "تحضير طبي للبشرة، نحت ناعم للملامح، وتطبيق طبقات متزنة تقاوم التعرق والدموع.",
    descEn: "Clinical skin prep, soft sculptural contouring, and tear-resistant hydraulic setting.",
  },
  {
    timeAr: "لمسة الختام",
    timeEn: "Final Touch",
    titleAr: "حقيبة الرتوش وصور 4K",
    titleEn: "Touch-Up Kit & 4K Check",
    descAr: "مراجعة الإطلالة تحت فلاش الكاميرا وتسليم حقيبة الرتوش الملكية للحفاظ على التألق.",
    descEn: "Flash-test inspection and delivery of your complimentary luxury bridal touch-up kit.",
  },
];

const HYGIENE_PILLARS = [
  {
    icon: ShieldCheck,
    titleAr: "تعقيم طبي 100% (CIDESCO)",
    titleEn: "100% Medical Hygiene (CIDESCO)",
    descAr: "تعقيم كافة الفراشي والأدوات المعدنية بأجهزة الأوتوكلاف والمطهرات الطبية المعتمدة قبل كل جلسة.",
    descEn: "Every brush and stainless tool is sanitized with medical-grade disinfectants before every session.",
  },
  {
    icon: CheckCircle2,
    titleAr: "أدوات استخدام واحد",
    titleEn: "Single-Use Disposables",
    descAr: "فرش ماسكارا، إسفنجات دمج، وأدوات شفاه أحادية الاستخدام لكل عميلة على حدة دون استثناء.",
    descEn: "Fresh disposable mascara wands, sponges, and lip applicators dedicated strictly to one bride.",
  },
  {
    icon: Sparkles,
    titleAr: "مستحضرات أصلية 100%",
    titleEn: "100% Authentic Luxury",
    descAr: "اقتناء مباشر من بوتيكات Dior و Chanel و Tom Ford و Charlotte Tilbury لضمان سلامة البشرة.",
    descEn: "Sourced directly from Dior, Chanel, Tom Ford, and Charlotte Tilbury boutiques.",
  },
  {
    icon: Lock,
    titleAr: "سرية تامة وميثاق خصوصية",
    titleEn: "Strict NDA Privacy Charter",
    descAr: "التزام صارم بعدم التصوير أو النشر (Strict NDA) إلا بموافقة خطية صريحة من العروس.",
    descEn: "Zero photography or social posting without explicit written consent from the bride.",
  },
];

export function BridalTimelineHygiene() {
  const { t, dir } = useLanguage();
  return (
    <section
      dir={dir}
      aria-label={t("رحلة يوم الزفاف وميثاق التعقيم والخصوصية", "Bridal Timeline & Hygiene Charter")}
      className="py-20 bg-white border-t border-[#eedfe0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Part A: Bridal Day Timeline */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              The Royal Bridal Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              {t("رحلة تجهيزكِ خطوة بخطوة حتى لحظة الزفة", "Your Bridal Prep Journey Step by Step")}
            </h2>
            <p className="text-sm text-[#524345] mt-2">
              {t(
                "تخطيط زمني دقيق يضمن لكِ هدوء الأعصاب والاستمتاع بكل لحظة من يومكِ الكبير دون أي توتر.",
                "Meticulous timing designed to keep your wedding morning calm, effortless, and stress-free."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE_STAGES.map((stage, index) => (
              <div
                key={stage.timeEn}
                className="relative p-6 rounded-3xl bg-[#fff8f7] border border-[#eedfe0] hover:border-[#735c00]/50 transition-all flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4a1521] text-[#fed65b] text-[11px] font-bold">
                    <Clock className="h-3 w-3" />
                    <span>{t(stage.timeAr, stage.timeEn)}</span>
                  </span>
                  <span className="text-lg font-serif font-bold text-[#735c00]/40">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#2f020d] pt-1">
                  {t(stage.titleAr, stage.titleEn)}
                </h3>
                <p className="text-xs text-[#524345] leading-relaxed">
                  {t(stage.descAr, stage.descEn)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part B: 4-Pillar Hygiene & Privacy Guarantee */}
        <div className="rounded-3xl bg-[#2f020d] text-white p-8 sm:p-12 border border-[#735c00]/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#fed65b] mb-2">
                  <Award className="h-4 w-4" />
                  <span>{t("بروتوكول الأمان الطبي والخصوصية", "Medical Safety & Privacy Protocol")}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif">
                  {t("ميثاق التعقيم والخصوصية الملكي", "Royal Hygiene & Privacy Charter")}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#eedfe0] max-w-md">
                {t(
                  "نضع صحة بشرتكِ وخصوصية مناسبتكِ في مقدمة أولوياتنا بمعايير لا تقبل التنازل.",
                  "Your skin health and event privacy are non-negotiable standards at our atelier."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {HYGIENE_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.titleEn}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors space-y-2.5"
                  >
                    <div className="h-10 w-10 rounded-xl bg-[#fed65b] text-[#241a00] flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {t(pillar.titleAr, pillar.titleEn)}
                    </h4>
                    <p className="text-xs text-[#eedfe0] leading-relaxed">
                      {t(pillar.descAr, pillar.descEn)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
