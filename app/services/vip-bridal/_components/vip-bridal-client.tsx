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
  Crown,
  Calendar,
  Check,
  Sparkles,
  ShieldCheck,
  Star,
  Gift,
  Heart,
  Clock,
  MapPin,
  Eye,
  CheckCircle2,
} from "lucide-react";

const STAGES = [
  {
    step: "١",
    title: "الاستشارة الفنية وفحص البشرة",
    duration: "٢٠ دقيقة",
    desc: "دراسة نوع البشرة، مراجعة إضاءة القاعة، فستان الزفاف وتسريحة الشعر لاختيار ألوان الإطلالة بدقة.",
  },
  {
    step: "٢",
    title: "التهيئة الكورية والمساج اللمفاوي",
    duration: "٣٠ دقيقة",
    desc: "ترطيب عميق بكولاجين فاخر وسيرومات الهيالورونيك مع مساج حجري مبرد لنحت الفك وإزالة أي انتفاخ.",
  },
  {
    step: "٣",
    title: "الفاونديشن وتقنية Hydra-Lock™",
    duration: "٤٠ دقيقة",
    desc: "دمج احترافي لدرجات Dior Backstage مع تثبيت هيدروليكي مزدوج مقاوم للرطوبة وتصوير الـ 4K.",
  },
  {
    step: "٤",
    title: "رسمة العين ورموش Mink 3D",
    duration: "٤٥ دقيقة",
    desc: "نحت الجفن بدرجات برونزية أو نيود ساحرة مع تركيب رموش Mink شعرة بشعرة بما يلائم فتحة العين.",
  },
  {
    step: "٥",
    title: "نحت الشفاه والبودرة الحريرية",
    duration: "٢٥ دقيقة",
    desc: "تحديد الشفاه بثبات فائق مع إضاءة خافتة على عظام الخد وتثبيت نهائي مضاد للتعرق.",
  },
  {
    step: "٦",
    title: "تثبيت الطرحة وتسليم حقيبة الرتوش",
    duration: "٢٠ دقيقة",
    desc: "مراجعة كاملة تحت أضواء الاستديو، المساعدة في تثبيت الطرحة، وتسليم هدية حقيبة الرتوش الفاخرة للعروس.",
  },
];

const BRIDAL_LOOKS = [
  {
    id: "royal_glow",
    title: "اللوك الملكي الكلاسيكي (Signature Royal)",
    desc: "إطلالة فخمة تجمع بين العيون اللوزية المحددة بدقة والبشرة المخملية المضيئة مع شفاه نيود كلاسيكية.",
  },
  {
    id: "soft_romantic",
    title: "اللوك الرومانسي الناعم (Soft Glam)",
    desc: "لمسات حالمة بدرجات الوردي والدرّاقي مع رموش طبيعية خفيفة وشفايف ممتلئة مفعمة بالحيوية.",
  },
  {
    id: "dewy_glass",
    title: "لوك البشرة الزجاجية (Glass Skin Bridal)",
    desc: "إشراقة كورية نضرة تركز على نقاء البشرة وانعكاس الضوء النقي مع ظلال برونزية شفافة.",
  },
];

export function VipBridalClient() {
  const router = useRouter();
  const { setSelectedPackageId } = useAppStore();
  const [selectedLook, setSelectedLook] = useState("royal_glow");

  const handleBookVip = () => {
    setSelectedPackageId("vip-bridal");
    router.push("/book");
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            الباقة الأيقونية الأكثر طلباً للعرائس
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            باقة العروس الملكية VIP
          </h1>
          <p className="text-sm sm:text-lg text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            تجربة تجهيز استثنائية متكاملة لليلة العمر، تشمل التفرغ الحصري لعروس واحدة يومياً،
            أفخم المستحضرات العالمية، وحقيبة رتوش ملكية هدية.
          </p>
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleBookVip}
              className="h-12 px-8 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] font-bold text-sm shadow-xl cursor-pointer"
            >
              <Calendar className="h-4 w-4 ms-2 text-[#735c00]" />
              <span>احجزي باقة العروس الملكية (2,800 ر.س)</span>
            </Button>
            <Link
              href="/contact"
              className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center border border-white/20"
            >
              استفسار عبر الواتساب
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#eedfe0] shadow-sm flex flex-col items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
              <Crown className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-[#2f020d]">عروس واحدة فقط يومياً</h3>
            <p className="text-xs text-[#524345] leading-relaxed">
              تفرغ أماني خليل التام لكِ وحدكِ طوال اليوم، دون أي ارتباط بحجوزات أخرى، لنمنحكِ هدوء الأعصاب والعناية الملكية المستحقة.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#eedfe0] shadow-sm flex flex-col items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-[#2f020d]">ثبات ١٨ ساعة Hydra-Lock™</h3>
            <p className="text-xs text-[#524345] leading-relaxed">
              تقنية تثبيت هيدروليكية مبتكرة تقاوم حرارة أضواء القاعات والدموع وتصوير الـ 4K فائق الدقة دون لمعان أو أكسدة للون.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#eedfe0] shadow-sm flex flex-col items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
              <Gift className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-[#2f020d]">حقيبة رتوش ملكية هدية</h3>
            <p className="text-xs text-[#524345] leading-relaxed">
              حقيبة مخملية فاخرة تحتوي على أحمر الشفاه المطابق، بودرة التثبيت المجهرية، وإسفنجة رتوش هدية مجانية بقيمة ٤٥٠ ر.س.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Preparation Timeline Stages */}
      <section className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">مراحل الجلسة</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              جدول التجهيز الملكي (٤ - ٥ ساعات)
            </h2>
            <p className="text-sm text-[#524345] mt-2">
              خطوات هندسية دقيقة تضمن لكِ إطلالة ساحرة وثباتاً أسطورياً طوال ليلتكِ الكبرى
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STAGES.map((st) => (
              <div
                key={st.step}
                className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm flex items-start gap-4"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#faeaeb] text-[#4a1521] font-serif font-bold text-xl flex items-center justify-center shrink-0">
                  {st.step}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#2f020d]">{st.title}</h3>
                    <Badge variant="outline" className="text-[10px] bg-[#fff8f7]">
                      {st.duration}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#524345] leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Bridal Look Style Selector */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">أنماط الإطلالة</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
            اختاري ستايل مكياجكِ المفضل
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRIDAL_LOOKS.map((look) => (
            <div
              key={look.id}
              onClick={() => setSelectedLook(look.id)}
              className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                selectedLook === look.id
                  ? "border-[#4a1521] bg-[#fff0f1] ring-2 ring-[#4a1521] shadow-md"
                  : "border-[#eedfe0] bg-white hover:bg-[#fff8f7]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#2f020d]">{look.title}</h3>
                  {selectedLook === look.id && (
                    <CheckCircle2 className="h-5 w-5 text-[#4a1521]" />
                  )}
                </div>
                <p className="text-xs text-[#524345] leading-relaxed">{look.desc}</p>
              </div>
              <Badge variant="gold" className="text-[10px] self-start">
                متاح ومخصص لكِ
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={handleBookVip}
            className="h-12 px-10 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-xl cursor-pointer"
          >
            تثبيت باقة العروس الملكية VIP (عربون ٣٠٪) 💍
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

