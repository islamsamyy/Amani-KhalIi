import type { Metadata } from "next";
import { VipBridalClient } from "./_components/vip-bridal-client";

export const metadata: Metadata = {
  title: "باقة العروس الملكية الفاخرة | أماني خليل",
  description:
    "تفاصيل باقة العروس الملكية لخبيرة التجميل أماني خليل بالرياض: تفرغ كامل، تهيئة فاخرة للبشرة، رموش طبيعية متكاملة، وحقيبة رتوش هدية.",
};

export default function VipBridalPage() {
  return <VipBridalClient />;
}
