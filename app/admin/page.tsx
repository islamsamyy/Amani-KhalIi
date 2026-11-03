import type { Metadata } from "next";
import { AdminOverviewClient } from "./_components/admin-overview-client";

export const metadata: Metadata = {
  title: "لوحة التحكم | النظرة العامة والنشاط اليومي - أماني خليل",
  description:
    "لوحة الإدارة التنفيذية لأماني خليل: متابعة جلسات اليوم، إيرادات الشهر، تنبيهات العرابين المعلقة، وحالة المواعيد الفندقية.",
};

export default function AdminOverviewPage() {
  return <AdminOverviewClient />;
}
