import type { Metadata } from "next";
import { GalleryClient } from "./_components/gallery-client";

export const metadata: Metadata = {
  title: "معرض الأعمال والإطلالات الملكية | أماني خليل - Gallery",
  description:
    "استعرضي ألبوم صور مكياج العرائس والسهرات الفاخرة لخبيرة التجميل أماني خليل بالرياض مع عارض الصور التفاعلي.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
