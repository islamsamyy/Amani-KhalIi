"use client";

import React from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { MapPin, Car, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RiyadhCoverageSectionProps {
  onSelectArea: (areaId: string, areaName: string) => void;
}

export function RiyadhCoverageSection({ onSelectArea }: RiyadhCoverageSectionProps) {
  const { areas } = useAppStore();
  const { t, dir } = useLanguage();

  return (
    <section
      dir={dir}
      aria-label={t("نطاق التغطية في الرياض", "Riyadh Concierge Coverage")}
      className="py-20 bg-[#fff0f1] border-t border-[#eedfe0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              Riyadh Concierge Coverage
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-1.5">
              {t(
                "خدمة التجهيز في مقركِ بجميع أحياء وفنادق الرياض",
                "On-Location Concierge Across Riyadh Hotels & Districts"
              )}
            </h2>
            <p className="text-sm text-[#524345] mt-2 max-w-2xl">
              {t(
                "نصل إليكِ بكامل تجهيزات الاستوديو والإضاءة السينمائية أينما كانت مناسبتكِ، مع وضوح تام لرسوم التنقل لكل نطاق.",
                "We bring our complete 4K studio lighting and luxury kit directly to your suite or residence with transparent travel rates."
              )}
            </p>
          </div>
          <Badge variant="outline" className="bg-white border-[#d7c1c3] text-[#4a1521] text-xs px-4 py-1.5 self-start md:self-auto">
            {t("تغطية شاملة لمدينة الرياض والدرعية", "Full Riyadh & Diriyah Coverage")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map((area) => {
            const isFree = area.travelFee === 0;
            const displayAreaName = t(area.nameAr, area.nameEn);
            return (
              <div
                key={area.id}
                className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover:border-[#735c00]/60 hover:shadow-md transition-all flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-[#735c00]" />
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
                        isFree
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-[#faeaeb] text-[#4a1521] border border-[#eedfe0]"
                      }`}
                    >
                      {isFree ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{t("مشمول مجاناً", "Complimentary")}</span>
                        </>
                      ) : (
                        <>
                          <Car className="h-3.5 w-3.5 text-[#735c00]" />
                          <span>+{area.travelFee.toLocaleString("en-US")} {t("ر.س", "SAR")}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#735c00] bg-[#faeaeb] px-2 py-0.5 rounded-full">
                        {area.zone}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#2f020d]">{displayAreaName}</h3>
                    <p className="text-xs text-[#524345] mt-1">
                      {t(
                        "تجهيز فندقي ومنزلي متكامل مع حقيبة الإضاءة السينمائية 4K.",
                        "Complete hotel suite & home setup with 4K cinematic lighting."
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSelectArea(area.id, displayAreaName)}
                  className="w-full h-10 rounded-full border-[#d7c1c3] bg-[#fff8f7] hover:bg-[#4a1521] hover:text-white hover:border-[#4a1521] text-[#2f020d] text-xs font-bold transition-all cursor-pointer"
                >
                  <span>{t("احجزي في هذا النطاق", "Book in This Zone")}</span>
                  <ArrowLeft className="h-3.5 w-3.5 ms-1.5" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
