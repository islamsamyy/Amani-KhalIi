import type { Metadata } from "next";
import { BookingFlowClient } from "./_components/booking-flow-client";

export const metadata: Metadata = {
  title: "حجز موعد ملكي | أماني خليل - Luxury Booking Flow",
  description:
    "احجزي موعدكِ الفاخر مع خبيرة التجميل أماني خليل بالرياض. 4 خطوات سهلة مع حاسبة فورية للعربون 30% وتثبيت العقد الموثق.",
};

export default function BookPage() {
  return <BookingFlowClient />;
}
