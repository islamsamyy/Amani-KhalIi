import type { Metadata } from "next";
import { AdminCalendarClient } from "./_components/admin-calendar-client";

export const metadata: Metadata = {
  title: "تقويم الزفاف وإشغال المواعيد | أماني خليل - Wedding Calendar",
  description:
    "التقويم التفاعلي لمواعيد وحجوزات العرائس وجدول الإشغال اليومي لخبيرة التجميل أماني خليل بالرياض.",
};

export default function AdminCalendarPage() {
  return <AdminCalendarClient />;
}
