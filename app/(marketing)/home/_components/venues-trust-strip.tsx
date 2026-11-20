"use client";

import React from "react";
import { Crown, MapPin } from "lucide-react";

const RIYADH_VENUES = [
  "The Ritz-Carlton Riyadh",
  "Four Seasons Kingdom Centre",
  "The St. Regis Riyadh",
  "Mandarin Oriental Al Faisaliah",
  "قاعة نيارة الملكية",
  "مطل البجيري • الدرعية",
];

export function VenuesTrustStrip() {
  return (
    <section
      aria-label="فنادق وقصور الرياض المعتمدة"
      className="w-full bg-white border-b border-[#eedfe0] py-6 sm:py-7"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#735c00] shrink-0">
            <Crown className="h-4 w-4 text-[#735c00]" />
            <span>نُخبة قصور وفنادق الرياض التي نتشرف بخدمة عرائسها:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-5 gap-y-2">
            {RIYADH_VENUES.map((venue, idx) => (
              <React.Fragment key={venue}>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-serif font-semibold text-[#2f020d] tracking-wide">
                  <MapPin className="h-3 w-3 text-[#735c00]/70 shrink-0" />
                  <span>{venue}</span>
                </span>
                {idx < RIYADH_VENUES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-block h-1.5 w-1.5 rotate-45 bg-[#fed65b] border border-[#735c00]/40"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
