import type { Metadata } from "next";
import { FaqClient } from "./_components/faq-client";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | أماني خليل - FAQ",
  description:
    "إجابات واضحة وشفافة حول باقات مكياج العرائس الملكية، سياسات تثبيت المواعيد، التغطية الفندقية بالرياض، ونوعية المستحضرات العالمية الفاخرة.",
};

export default function FaqPage() {
  return <FaqClient />;
}
