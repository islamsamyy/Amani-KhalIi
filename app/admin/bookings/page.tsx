import type { Metadata } from "next";
import { AdminBookingsClient } from "./_components/admin-bookings-client";

export const metadata: Metadata = {
  title: "لوحة التحكم | إدارة الحجوزات والمواعيد - أماني خليل",
  description:
    "جدول إدارة حجوزات ومواعيد العرائس والسهرات لخبيرة التجميل أماني خليل بالرياض مع فحص فوري للفواتير وتحديث الحالات.",
};

export default function AdminBookingsPage() {
  return <AdminBookingsClient />;
}
