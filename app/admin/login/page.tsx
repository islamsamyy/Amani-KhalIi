import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminLoginClient } from "./_components/admin-login-client";

export const metadata: Metadata = {
  title: "تسجيل الدخول الإداري | أماني خليل",
  description: "بوابة الإدارة المركزية والتحكم الملكي لأتيليه خبيرة التجميل أماني خليل بالرياض.",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff8f7]" />}>
      <AdminLoginClient />
    </Suspense>
  );
}
