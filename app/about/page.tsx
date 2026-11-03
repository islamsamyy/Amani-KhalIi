import type { Metadata } from "next";
import { AboutClient } from "./_components/about-client";

export const metadata: Metadata = {
  title: "عن خبيرة التجميل أماني خليل والاعتمادات | About Amani Khalil",
  description:
    "تعرفي على الفلسفة الجمالية لخبيرة التجميل أماني خليل، اعتمادات CIDESCO الدولية، والمستحضرات العالمية المستخدمة.",
};

export default function AboutPage() {
  return <AboutClient />;
}
