import type { Metadata } from "next";
import { HomeClient } from "./(marketing)/home/home-client";

export const metadata: Metadata = {
  title: "أماني خليل | خبيرة التجميل ومكياج العرائس بالرياض - Amani Khalil",
  description:
    "الموقع الرسمي لخبيرة التجميل أماني خليل - جلسات مكياج منزلية خاصة وفاخرة بالرياض للعرائس، السهرات، والمناسبات الملكية.",
};

export default function HomePage() {
  return <HomeClient />;
}
