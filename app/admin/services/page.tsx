import type { Metadata } from "next";
import { AdminServicesClient } from "./_components/admin-services-client";

export const metadata: Metadata = {
  title: "إدارة الخدمات والباقات الرسمية | أماني خليل - Admin Services",
  description:
    "لوحة إدارة باقات وخدمات المكياج الرسمية: تعديل الأسعار، تفعيل وإيقاف العروض، وإضافة باقات جديدة.",
};

export default function AdminServicesPage() {
  return <AdminServicesClient />;
}
