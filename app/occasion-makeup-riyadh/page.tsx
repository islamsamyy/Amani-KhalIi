import type { Metadata } from "next";
import { OccasionRiyadhClient } from "./_components/occasion-riyadh-client";

export const metadata: Metadata = {
  title: "مكياج السهرات والمناسبات بالرياض | أماني خليل",
  description:
    "مكياج سهرات ومناسبات فاخر بالرياض لخبيرة التجميل أماني خليل. إطلالات عقد القران، حفلات التخرج، وخصومات خاصة للمجموعات وأهل العروس.",
};

export default function OccasionMakeupRiyadhPage() {
  return <OccasionRiyadhClient />;
}
