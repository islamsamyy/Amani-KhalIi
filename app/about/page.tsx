import type { Metadata } from "next";
import { AboutClient } from "./_components/about-client";

export const metadata: Metadata = {
  title: "عن خبيرة التجميل أماني خليل والاعتمادات الرسمية",
  description:
    "تعرفي على الفلسفة الجمالية لخبيرة التجميل أماني خليل، اعتماداتها وشهاداتها الدولية المعتمدة، والمستحضرات العالمية المستخدمة.",
};

export default function AboutPage() {
  return <AboutClient />;
}
