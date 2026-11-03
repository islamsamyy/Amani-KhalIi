import type { Metadata } from "next";
import { AdminContentClient } from "./_components/admin-content-client";

export const metadata: Metadata = {
  title: "إدارة المحتوى والتقييمات والمعرض | أماني خليل - Admin Content",
  description:
    "إدارة محتوى موقع أماني خليل: اعتماد تقييمات العميلات، إدارة معرض الصور، وتحديث بنود العقد الرسمي.",
};

export default function AdminContentPage() {
  return <AdminContentClient />;
}
