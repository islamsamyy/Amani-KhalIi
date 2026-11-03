import type { Metadata } from "next";
import { NewServiceClient } from "./_components/new-service-client";

export const metadata: Metadata = {
  title: "نافذة إضافة باقة جديدة | أماني خليل - Add Service Package Modal",
  description:
    "نموذج إنشاء وإضافة باقة خدمة جديدة وتحديد نسبة العربون وتفعيلها في موقع أماني خليل.",
};

export default function NewServicePage() {
  return <NewServiceClient />;
}
