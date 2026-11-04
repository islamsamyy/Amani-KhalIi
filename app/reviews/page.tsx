import type { Metadata } from "next";
import { ReviewsClient } from "./_components/reviews-client";

export const metadata: Metadata = {
  title: "آراء وتقييمات العميلات | أماني خليل",
  description:
    "تقييمات وتجارب موثقة من عرائس وسيدات الرياض حول جلسات المكياج الفاخرة مع خبيرة التجميل أماني خليل.",
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
