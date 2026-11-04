import type { Metadata } from "next";
import { ConfirmationClient } from "./_components/confirmation-client";

export const metadata: Metadata = {
  title: "تأكيد الحجز والفاتورة الرسمية | أماني خليل",
  description:
    "تفاصيل تأكيد الحجز الرسمي، الفاتورة الإلكترونية المعتمدة، وتحميل مستند الحجز لخبيرة التجميل أماني خليل بالرياض.",
};

export default function BookingConfirmationPage() {
  return <ConfirmationClient />;
}
