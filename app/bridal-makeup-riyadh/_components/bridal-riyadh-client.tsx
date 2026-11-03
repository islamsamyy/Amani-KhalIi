"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Crown,
  Calendar,
  Check,
  Sparkles,
  ShieldCheck,
  Building,
  MapPin,
  Clock,
  Heart,
  Hotel,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const VENUES = [
  { name: "فندق الريتز-كارلتون، الرياض", desc: "أجنحة العرائس الملكية وقاعات الاحتفالات الكبرى" },
  { name: "فندق فورسيزونز برج المملكة", desc: "قاعة باريس وأجنحة كبار الشخصيات" },
  { name: "قاعة نيارة الملكية", desc: "القصور والقاعات الفاخرة بطريق الملك فهد" },
  { name: "قصور الدرعية وحي السفارات", desc: "خدمة منزلية خاصة مع إضاءة استديو متنقلة" },
];

export function BridalRiyadhClient() {
  const router = useRouter();
  const { setSelectedPackageId } = useAppStore();
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedModalPackage, setSelectedModalPackage] = useState("باقة العروس الملكية VIP");

  const openPackageModal = (name: string) => {
    setSelectedModalPackage(name);
    setPackageModalOpen(true);
  };

  const handleProceedBooking = () => {
    setSelectedPackageId("vip-bridal");
    router.push("/book");
  };

  return (
    <main dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            خدمة فندقية ومنزلية فاخرة في الرياض
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            مكياج العرائس الفاخر بالرياض
          </h1>
          <p className="text-sm sm:text-lg text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            الإطلالة الملكية التي تستحقينها في ليلة العمر. تغطية شاملة لكافة أجنحة الفنادق والقصور الفاخرة
            بالعاصمة الرياض، مع تفرغ كامل لعروس واحدة فقط يومياً.
          </p>
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => openPackageModal("باقة العروس الملكية VIP")}
              className="h-12 px-8 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] font-bold text-sm shadow-xl cursor-pointer"
            >
              <Crown className="h-4 w-4 ms-2 text-[#735c00]" />
              <span>اختيار الباقة الملكية</span>
            </Button>
            <Link
              href="/gallery"
              className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center border border-white/20"
            >
              مشاهدة إطلالات عرائس الرياض
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Venue Coverage Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
            التغطية الميدانية في الرياض
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
            خدمة الأجنحة الفندقية والقصور الملكية
          </h2>
          <p className="text-sm text-[#524345] mt-2">
            نحضر إليكِ بكامل المعدات، وحقيبة إضاءة سينمائية تحول جناحكِ إلى استديو تجميل فائق الجودة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VENUES.map((v, i) => (
            <Card key={i} className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold mb-4">
                <Hotel className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-[#2f020d] mb-1">{v.name}</h3>
              <p className="text-xs text-[#524345] leading-relaxed">{v.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Bridal Preparation Checklist */}
      <section className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              دليل العروس الذهبي
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              جدول العناية بالبشرة قبل ليلة الزفاف
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm space-y-3">
              <Badge variant="gold" className="text-[10px]">قبل شهر إلى شهرين</Badge>
              <h3 className="text-base font-bold text-[#2f020d]">العناية الطبية العميقة</h3>
              <p className="text-xs text-[#524345] leading-relaxed">
                الابتعاد عن التقشير الكيميائي القوي، وتكثيف شرب الماء وجلسات الهيدرافيشل لتنظيف المسام.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm space-y-3">
              <Badge variant="gold" className="text-[10px]">قبل أسبوعين إلى ٤ أسابيع</Badge>
              <h3 className="text-base font-bold text-[#2f020d]">جلسة التجربة (Trial)</h3>
              <p className="text-xs text-[#524345] leading-relaxed">
                حجز جلسة بروفة في الأتيليه بشمال الرياض لاختبار ألوان الظلال والروج مع الفستان والمجوهرات.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm space-y-3">
              <Badge variant="gold" className="text-[10px]">يوم الزفاف</Badge>
              <h3 className="text-base font-bold text-[#2f020d]">الاسترخاء والتهيئة الكورية</h3>
              <p className="text-xs text-[#524345] leading-relaxed">
                تفرغ تام للجلسة الملكية، ترطيب كولاجين ومساج لمفاوي قبل الفاونديشن لثبات مذهل يدوم ١٨ ساعة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Localized Bridal FAQ Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
            استفسارات العرائس
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
            الأسئلة الشائعة لعرائس الرياض
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>هل يشمل الحجز الحضور لقاعات وفنادق خارج الرياض؟</AccordionTrigger>
            <AccordionContent>
              نغطي كامل مدينة الرياض وضواحيها (الدرعية، بنبان، العمارية). بالنسبة للمدن الأخرى بالمملكة، يتم التنسيق الخاص بناءً على جدول التفرغ وتغطية التذاكر والإقامة.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>ماذا تتضمن حقيبة الرتوش الهدية المرفقة مع باقة العروس؟</AccordionTrigger>
            <AccordionContent>
              حقيبة مخملية فاخرة تشمل أحمر الشفاه المطابق المستخدم في الجلسة، بودرة تثبيت مجهرية مضغوطة لمكافحة اللمعان، وإسفنجة رتوش مع مثبت شفاه بقيمة ٤٥٠ ر.س مجاناً.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>كيف يتم ضمان ثبات المكياج في حرارة ورطوبة القاعة؟</AccordionTrigger>
            <AccordionContent>
              نعتمد تقنية التثبيت الهيدروليكي المزدوج Hydra-Lock™ مع برايمرات سينمائية خاصة من Dior و Charlotte Tilbury تحبس الرطوبة وتمنع التعرق حتى ١٨ ساعة كاملة.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 text-center">
          <Button
            onClick={() => openPackageModal("باقة العروس الملكية VIP")}
            className="h-12 px-10 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-xl cursor-pointer"
          >
            اختيار باقة العروس الملكية وحجز الموعد 💍
          </Button>
        </div>
      </section>

      {/* Package Selection Dialog (tested in Test 5!) */}
      <Dialog open={packageModalOpen} onOpenChange={setPackageModalOpen}>
        <DialogContent className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold text-[#2f020d] flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#735c00]" />
              <span>تأكيد اختيار: {selectedModalPackage}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#524345]">
              سيتم نقلكِ مباشرة إلى تدفق الحجز الملكي لتحديد الموعد والمقر وسداد العربون بأمان.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] my-4 text-xs text-[#211a1b] space-y-2">
            <div className="flex justify-between items-center font-bold text-[#4a1521]">
              <span>السعر الرسمي للباقة:</span>
              <span>2,800 ر.س</span>
            </div>
            <div className="flex justify-between items-center text-[#735c00]">
              <span>العربون المطلوب للتثبيت (30%):</span>
              <span className="font-bold">840 ر.س</span>
            </div>
            <p className="text-[11px] text-[#524345] pt-1 border-t border-[#eedfe0]">
              يشمل التفرغ لعروس واحدة يومياً، الرموش ثلاثية الأبعاد، حقيبة الرتوش الهدية، والتنقل المجاني داخل الرياض.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPackageModalOpen(false)} className="rounded-full text-xs">
              إلغاء
            </Button>
            <Button
              onClick={handleProceedBooking}
              className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold px-6 cursor-pointer"
            >
              المتابعة لحجز الموعد ←
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </main>
  );
}
