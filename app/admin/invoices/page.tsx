import type { Metadata } from "next";
import { AdminInvoicesClient } from "./_components/admin-invoices-client";

export const metadata: Metadata = {
  title: "سجل الفواتير والمدفوعات الرسمية | أماني خليل",
  description:
    "متابعة سجل الفواتير، العرابين المحصلة، والمبالغ المستحقة يوم المناسبة مع تقارير مالية وضريبية رسمية.",
};

export default function AdminInvoicesPage() {
  return <AdminInvoicesClient />;
}
