"use client";

import React from "react";
import { AnimatedCounter } from "@/components/animated-counter";
import { useLanguage } from "@/providers/language-provider";
import { Sparkles, Crown, Award, ShieldCheck } from "lucide-react";

interface LuxuryCountersInteractiveProps {
  onBookNow?: () => void;
}

export function LuxuryCountersAndInteractive(_props: LuxuryCountersInteractiveProps) {
  const { t, dir } = useLanguage();

  return (
    <section
      dir={dir}
      aria-label={t("إحصائيات الأتيليه", "Atelier Impact Counters")}
      className="py-14 bg-[#fff0f1] border-b border-[#eedfe0] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Animated Luxury Counters Grid */}
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
      </div>
    </section>
  );
}
