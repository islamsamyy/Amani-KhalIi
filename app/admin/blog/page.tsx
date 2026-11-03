import type { Metadata } from "next";
import { AdminBlogClient } from "./_components/admin-blog-client";

export const metadata: Metadata = {
  title: "إدارة المدونة والمقالات | لوحة التحكم أماني خليل",
  description:
    "لوحة تحكم إدارة المدونة الملكية: إضافة وتعديل المقالات، تفعيل النشر، وتمييز المقالات في الموقع.",
};

export default function AdminBlogPage() {
  return <AdminBlogClient />;
}

