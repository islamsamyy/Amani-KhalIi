import type { Metadata } from "next";
import { BridalRiyadhClient } from "./_components/bridal-riyadh-client";

export const metadata: Metadata = {
  title: "مكياج العرائس الفاخر بالرياض | أماني خليل - Bridal Makeup Riyadh",
  description:
    "مكياج عرائس ملكي فاخر بالرياض لخبيرة التجميل أماني خليل. زيارات خارجية لأجنحة فنادق الريتز-كارلتون، فورسيزونز وقصور الأفراح مع تفرغ لعروس واحدة يومياً.",
};

export default function BridalMakeupRiyadhPage() {
  return <BridalRiyadhClient />;
}
