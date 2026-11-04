import type { Metadata } from "next";
import { NewServiceClient } from "./_components/new-service-client";

export const metadata: Metadata = {
  title: "إضافة باقة جديدة | أماني خليل",
  description:
    "نموذج إنشاء وإضافة باقة خدمة جديدة وتحديد نسبة العربون وتفعيلها في موقع أماني خليل.",
};

export default function NewServicePage() {
  return <NewServiceClient />;
}
