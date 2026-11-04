import type { Metadata } from "next";
import { AdminCustomersClient } from "./_components/admin-customers-client";

export const metadata: Metadata = {
  title: "سجل العميلات وتتبع التفضيلات | أماني خليل",
  description:
    "سجل عميلات أماني خليل: متابعة ملفات العرائس، نوع البشرة، التفضيلات الجمالية، والملاحظات الشخصية.",
};

export default function AdminCustomersPage() {
  return <AdminCustomersClient />;
}
