"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles,
  Calendar,
  Check,
  Star,
  Users,
  ShieldCheck,
  Heart,
  Gem,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export function OccasionRiyadhClient() {
  const router = useRouter();
  const { setSelectedPackageId } = useAppStore();

  // Group discount calculator state
  const [ladiesCount, setLadiesCount] = useState<number>(3);
  const [occasionType, setOccasionType] = useState<"evening" | "milkah">("evening");

  const basePricePerPerson = occasionType === "evening" ? 850 : 1400;
  const rawSubtotal = ladiesCount * basePricePerPerson;
  const discountRate = ladiesCount >= 3 ? 0.1 : 0;
  const discountAmount = Math.round(rawSubtotal * discountRate);
  const finalGroupTotal = rawSubtotal - discountAmount;
  const groupDeposit = Math.round(finalGroupTotal * 0.3);

  const handleBookOccasion = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    router.push("/book");
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            إطلالات النخبة لحفلات السهرة والمناسبات الكبرى
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            مكياج السهرات والمناسبات بالرياض
          </h1>
          <p className="text-sm sm:text-lg text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            تألقي بإطلالة ساحرة تناسب أرقى حفلات الزفاف، عقد القران، وحفلات التخرج الفاخرة.
            خدمة منزلية وفندقية بالرياض مع توفير خصومات خاصة للمجموعات وأهل العروس.
          </p>
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleBookOccasion("evening-vip")}
              className="h-12 px-8 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] font-bold text-sm shadow-xl cursor-pointer"
            >
              <Calendar className="h-4 w-4 ms-2 text-[#735c00]" />
              <span>احجزي مكياج السهرة (850 ر.س)</span>
            </Button>
            <Link
              href="/gallery"
              className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center border border-white/20"
            >
              معرض إطلالات السهرة
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Occasion Packages */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
            باقات مناسبات السهرة
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
            خيارات تناسب كافة أنواع الحفلات
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <Badge variant="gold" className="text-[10px] mb-3">عقد القران والملكة</Badge>
              <h3 className="text-xl font-bold text-[#2f020d] mb-1">باقة الملكة والخطوبة</h3>
              <p className="text-xs text-[#524345] mb-4 leading-relaxed">
                إطلالة ملكية ناعمة مصممة لأضواء الحفل وتصوير الـ 4K مع رموش فاخرة وثبات ١٦ ساعة.
              </p>
              <div className="text-3xl font-bold font-serif text-[#2f020d] pb-4 border-b border-[#eedfe0] mb-4">
                1,400 <span className="text-xs font-normal text-[#735c00]">ر.س</span>
              </div>
              <ul className="space-y-2 text-xs text-[#211a1b] mb-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>مدة الجلسة: ساعتان ونصف</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>رموش طبيعية متعددة الطبقات</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>خدمة منزلية أو فندقية بالرياض</span></li>
              </ul>
            </div>
            <Button
              onClick={() => handleBookOccasion("milkah-engagement")}
              className="w-full rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] text-[#2f020d] font-bold text-xs"
            >
              حجز باقة الملكة
            </Button>
          </Card>

          <Card className="rounded-3xl border-2 border-[#735c00] bg-[#fff8f7] p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="bg-[#4a1521] text-white text-center py-1 text-[11px] font-bold -mx-8 -mt-8 mb-6">
              ★ الباقة الأكثر طلباً للسهرات
            </div>
            <div>
              <Badge variant="gold" className="text-[10px] mb-3">حفلات الزفاف والملتقيات</Badge>
              <h3 className="text-xl font-bold text-[#2f020d] mb-1">مكياج السهرات VIP</h3>
              <p className="text-xs text-[#524345] mb-4 leading-relaxed">
                مكياج سهرة كامل مع كونتورينغ سينمائي يبرز الملامح وألوان ناعمة متناسقة مع فستان السهرة.
              </p>
              <div className="text-3xl font-bold font-serif text-[#2f020d] pb-4 border-b border-[#eedfe0] mb-4">
                850 <span className="text-xs font-normal text-[#735c00]">ر.س</span>
              </div>
              <ul className="space-y-2 text-xs text-[#211a1b] mb-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>مدة الجلسة: ساعة ونصف</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>تركيب رموش طبيعية Mink</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>مستحضرات Dior و Charlotte Tilbury</span></li>
              </ul>
            </div>
            <Button
              onClick={() => handleBookOccasion("evening-vip")}
              className="w-full rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-md"
            >
              حجز مكياج سهرة VIP
            </Button>
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-8 shadow-sm flex flex-col justify-between">
            <div>
              <Badge variant="gold" className="text-[10px] mb-3">اللوك الناعم الأنيق</Badge>
              <h3 className="text-xl font-bold text-[#2f020d] mb-1">مكياج ناعم وطبيعي</h3>
              <p className="text-xs text-[#524345] mb-4 leading-relaxed">
                إطلالة بأسلوب اللامكياج الفاخر (Soft Glam) تبرز نضارة البشرة مع لمسات إضاءة خافتة وأحمر شفاه نيود.
              </p>
              <div className="text-3xl font-bold font-serif text-[#2f020d] pb-4 border-b border-[#eedfe0] mb-4">
                650 <span className="text-xs font-normal text-[#735c00]">ر.س</span>
              </div>
              <ul className="space-y-2 text-xs text-[#211a1b] mb-6">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>مدة الجلسة: ساعة وربع</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>توحيد خفيف وإشراقة طبيعية</span></li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#735c00]" /> <span>مثالي لمناسبات التخرج والعشاء</span></li>
              </ul>
            </div>
            <Button
              onClick={() => handleBookOccasion("soft-glam")}
              className="w-full rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] text-[#2f020d] font-bold text-xs"
            >
              حجز مكياج ناعم
            </Button>
          </Card>
        </div>
      </section>

      {/* 3. Interactive Group & Family Booking Calculator */}
      <section className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>حاسبة حجوزات المجموعات</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              حجز عائلي أو مجموعات المرافقات
            </h2>
            <p className="text-sm text-[#524345] mt-2">
              احصلي على خصم تلقائي بقيمة ١٠٪ عند حجز ٣ سيدات فأكثر في نفس الموقع والموعد
            </p>
          </div>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-10 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-2">نوع المناسبة المطلوبة:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOccasionType("evening")}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      occasionType === "evening"
                        ? "border-[#4a1521] bg-[#fff0f1] text-[#4a1521] ring-2 ring-[#4a1521]"
                        : "border-[#eedfe0] text-[#524345] hover:bg-[#fff8f7]"
                    }`}
                  >
                    مكياج سهرة VIP (850 ر.س / سيدة)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOccasionType("milkah")}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-xs cursor-pointer transition-all ${
                      occasionType === "milkah"
                        ? "border-[#4a1521] bg-[#fff0f1] text-[#4a1521] ring-2 ring-[#4a1521]"
                        : "border-[#eedfe0] text-[#524345] hover:bg-[#fff8f7]"
                    }`}
                  >
                    باقة الخطوبة والملكة (1,400 ر.س / سيدة)
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-[#2f020d]">عدد السيدات المطلوبة:</label>
                  <span className="text-sm font-bold text-[#735c00]">{ladiesCount} سيدات</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLadiesCount(num)}
                      className={`flex-1 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-all ${
                        ladiesCount === num
                          ? "bg-[#4a1521] text-white shadow-md"
                          : "bg-[#faeaeb] text-[#2f020d] hover:bg-[#eedfe0]"
                      }`}
                    >
                      {num} {num >= 3 && num === ladiesCount ? "★ خصم" : ""}
                    </button>
                  ))}
                </div>
                {ladiesCount >= 3 && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-2">
                    ✓ تهانينا! مؤهلة لخصم المجموعات الذهبي (١٠٪ خصم تلقائي).
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#524345]">
                  <span>المبلغ قبل الخصم:</span>
                  <span>{rawSubtotal.toLocaleString("ar-SA")} ر.س</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold">
                    <span>خصم المجموعات (١٠٪):</span>
                    <span>-{discountAmount.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline font-bold text-base text-[#2f020d] pt-2 border-t border-[#eedfe0]">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-xl font-serif text-[#735c00]">
                    {finalGroupTotal.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#735c00] font-semibold">
                  <span>العربون المطلوب لتأكيد الموعد (30%):</span>
                  <span>{groupDeposit.toLocaleString("ar-SA")} ر.س</span>
                </div>
              </div>

              <Button
                onClick={() => handleBookOccasion(occasionType === "evening" ? "evening-vip" : "milkah-engagement")}
                className="w-full h-12 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                تأكيد حجز المجموعة لـ {ladiesCount} سيدات 💍
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

