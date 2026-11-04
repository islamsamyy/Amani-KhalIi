import type { Metadata } from "next";
import { ServicesClient } from "./_components/services-client";

export const metadata: Metadata = {
  title: "باقات الخدمات والأسعار الرسمية | أماني خليل",
  description:
    "استكشفي باقات المكياج الرسمية لخبيرة التجميل أماني خليل بالرياض مع حاسبة الإضافات التفاعلية ومقارنة شاملة للخدمات.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
