import type { Metadata } from "next";
import { ContactClient } from "./_components/contact-client";

export const metadata: Metadata = {
  title: "تواصل والسياسات وشروط الحجز | أماني خليل - Contact & Policies",
  description:
    "تواصل مع خبيرة التجميل أماني خليل بالرياض، احصلي على استشارة مخصصة، واطلعي على سياسات العربون والتثبيت وسرية الصور.",
};

export default function ContactPage() {
  return <ContactClient />;
}
