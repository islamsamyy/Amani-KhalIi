import type { Metadata } from "next";
import { AdminSettingsClient } from "./_components/admin-settings-client";

export const metadata: Metadata = {
  title: "إعدادات النظام والصلاحيات | لوحة تحكم أماني خليل",
  description: "ضبط إعدادات الأتيليه، صلاحيات الطاقم، قوالب الواتساب، والسياسات الرسمية.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}
