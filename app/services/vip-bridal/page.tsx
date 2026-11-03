import type { Metadata } from "next";
import { VipBridalClient } from "./_components/vip-bridal-client";

export const metadata: Metadata = {
  title: "باقة العروس الملكية VIP | أماني خليل - Bridal VIP Package",
  description:
    "تفاصيل باقة العروس الملكية VIP لخبيرة التجميل أماني خليل بالرياض: تفرغ كامل، تهيئة كورية للبشرة، رموش Mink 3D، وحقيبة رتوش هدية.",
};

export default function VipBridalPage() {
  return <VipBridalClient />;
}
