"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  Droplets,
  Eye,
  ArrowLeft,
  Crown,
  Building,
} from "lucide-react";

const BRAND_SHOWCASE = [
  {
    name: "Dior Backstage",
    category: "الفاونديشن والكونتور",
    desc: "تركيبات فائقة النعومة ومقاومة للحرارة تمنح البشرة تغطية سينمائية غير مرئية وطبيعية 100%.",
    stars: "مستورد أصلي",
  },
  {
    name: "Charlotte Tilbury",
    category: "الإضاءة والشفاه",
    desc: "أيقونة النضارة العالمية ومجموعات Pillow Talk و Hollywood Flawless Filter لإشراقة ملكية أخاذة.",
    stars: "المفضل للعرائس",
  },
  {
    name: "Tom Ford Beauty",
    category: "ظلال العيون والكونسيلر",
    desc: "أصباغ مجهرية متطورة توفر كونتورينغ منحوت بدقة ثلاثية الأبعاد دون أي تكتل في خطوط التعبير.",
    stars: "فخامة سينمائية",
  },
  {
    name: "NARS Cosmetics",
    category: "البلاشر وتثبيت البشرة",
    desc: "تدرجات ألوان وردية دافئة تتناغم بشكل ساحر مع درجات البشرة العربية والإضاءة الفندقية.",
    stars: "ثبات هيدروليكي",
  },
];

// Authentic Studio Photos of Makeup Artist Amani Khalil
const AMANI_ABOUT_PHOTOS = [
  {
    src: "/amani-1.jpg",
    title: "البورتريه الملكي المعتمد — الفستان الزمردي",
    tag: "البورتريه الرسمي",
  },
  {
    src: "/amani-hero.jpg",
    title: "استوديو التجهيز الملكي السينمائي — الفستان البرغندي",
    tag: "الاستوديو الملكي",
  },
  {
    src: "/amani-2.jpg",
    title: "كواليس انتقاء فراشي الدمج الاحترافية",
    tag: "فراشي الدمج",
  },
  {
    src: "/amani-3.jpg",
    title: "تنسيق باليتات الظلال والفاونديشن العالمي",
    tag: "تجهيز المستحضرات",
  },
];

export function AboutClient() {
  const { t, dir } = useLanguage();
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(AMANI_ABOUT_PHOTOS[0].src);

  return (
    <div dir={dir} className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            {t("الفلسفة الجمالية والاعتمادات الرسمية", "Artistic Philosophy & Official Credentials")}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
            {t("عن خبيرة التجميل أماني خليل", "About Makeup Artist Amani Khalil")}
          </h1>
          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            {t(
              "رحلة شغف واحتراف دامت لأكثر من 10 سنوات في إبراز سحر الملامح الطبيعية وصناعة إطلالات ليلة العمر لعرائس وسيدات النخبة في الرياض.",
              "Over 10 years of passion and Swiss-certified mastery crafting timeless bridal and VIP soirée looks across Riyadh."
            )}
          </p>
        </div>
      </section>

      {/* 2. Biography & Philosophy Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Portrait Image of Makeup Artist Amani Khalil */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-[#2f020d] group">
              <Image
                src={selectedPhoto}
                alt="خبيرة التجميل أماني خليل"
                fill
                priority
                unoptimized={true}
                className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700 animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f020d]/80 via-transparent to-transparent pointer-events-none" />

              {/* Verified Artist Badge */}
              <div className="absolute bottom-4 inset-x-4 z-10 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#fed65b] flex items-center gap-1.5">
                    <span>أماني خليل</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                  </p>
                  <p className="text-xs text-[#eedfe0]">خبيرة التجميل والمكياج السينمائي</p>
                </div>
                <Badge variant="gold" className="text-[10px] font-bold px-2.5 py-1">
                  معتمدة CIDESCO
                </Badge>
              </div>
            </div>

            {/* Interactive Photo Strip: All 4 authentic studio looks */}
            <div className="mt-4 flex items-center justify-center gap-2.5 z-20">
              {AMANI_ABOUT_PHOTOS.map((photo) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setSelectedPhoto(photo.src)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-105 ${
                    selectedPhoto === photo.src
                      ? "border-[#fed65b] ring-2 ring-[#fed65b]/50 shadow-lg scale-105"
                      : "border-white/60 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={photo.title}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    unoptimized={true}
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>

            <div className="mt-4 bg-white px-5 py-3 rounded-2xl shadow-xl border border-[#eedfe0] flex items-center gap-3 w-full max-w-[420px]">
              <div className="h-10 w-10 rounded-full bg-[#fed65b] text-[#241a00] flex items-center justify-center font-bold shrink-0">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2f020d]">أماني خليل — Haute Beauté</p>
                <p className="text-[11px] text-[#735c00]">عروس واحدة فقط يومياً للتفرغ الملكي التام</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              فلسفتنا في فن الجمال
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] leading-snug">
              المكياج الحقيقي ليس قناعاً يُخفي، بل نور يُبرز تفاصيلكِ الأجمل
            </h2>
            <p className="text-sm text-[#524345] leading-relaxed">
              تؤمن أماني خليل بأن كل امرأة تمتلك سحراً فريداً في تفاصيل ملامحها. لذا لا نتبع القوالب الجاهزة أو التغيير
              الشاذ للوجه، بل نعتمد دراسة دقيقة لمورفولوجيا العين، شكل الوجنتين، ونوع البشرة، لنبتكر إطلالة متناغمة تعكس
              شخصيتكِ وتزيدكِ ثقة وتألقاً.
            </p>
            <p className="text-sm text-[#524345] leading-relaxed">
              نكرس يومنا كاملاً لعروس واحدة فقط، لنمنحكِ الراحة التامة دون أي عجلة زمنية، مع توفير أرقى درجات الضيافة
              والعناية التجهيزية قبل تطبيق المكياج.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0]">
                <h4 className="text-sm font-bold text-[#2f020d] mb-1">تفرغ ملكي كامل</h4>
                <p className="text-xs text-[#524345]">نستقبل حجزاً واحداً رئيسياً باليوم لنضمن لكِ راحة البال والاهتمام بكافة التفاصيل.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0]">
                <h4 className="text-sm font-bold text-[#2f020d] mb-1">تعقيم طبي متقدم</h4>
                <p className="text-xs text-[#524345]">تعقيم ثلاثي للفرش والأدوات بمحاليل طبية وأشعة UV وأدوات استخدام واحد.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => setCertModalOpen(true)}
                variant="outline"
                className="rounded-full text-xs font-bold bg-white text-[#2f020d] border-[#735c00] hover:bg-[#faeaeb]"
              >
                <Award className="h-4 w-4 ms-2 text-[#735c00]" />
                <span>معاينة شهادة CIDESCO</span>
              </Button>
              <Link
                href="/book"
                className="h-10 px-6 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Calendar className="h-3.5 w-3.5 text-[#fed65b]" />
                <span>احجزي موعدكِ الآن</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Luxury Brands Showcase */}
      <section className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              أصالة وجودة لا تقبل المساومة
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              المستحضرات العالمية المستخدمة
            </h2>
            <p className="text-sm text-[#524345] mt-2">
              ننتقي مستحضراتنا حصرياً من أشهر دور التجميل العالمية التي تعتمدها كبرى منصات الموضة والأفلام السينمائية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRAND_SHOWCASE.map((brand, i) => (
              <Card key={i} className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <Badge variant="gold" className="text-[10px] mb-3">
                  {brand.stars}
                </Badge>
                <h3 className="text-lg font-bold text-[#2f020d] mb-1">{brand.name}</h3>
                <p className="text-xs text-[#735c00] font-semibold mb-3">{brand.category}</p>
                <p className="text-xs text-[#524345] leading-relaxed">{brand.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CIDESCO Dialog Modal */}
      <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
        <DialogContent className="max-w-2xl bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold text-[#2f020d] flex items-center gap-2">
              <Award className="h-6 w-6 text-[#735c00]" />
              <span>شهادة الاعتماد الدولي الرسمي CIDESCO</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#524345]">
              الأكاديمية الدولية للتجميل • الرياض (سجل معتمد وموثق)
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 rounded-3xl overflow-hidden border-2 border-[#fed65b]/50 shadow-xl bg-gradient-to-b from-[#fffcf2] via-white to-[#fff8f7] p-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#fed65b]/20 border border-[#fed65b] text-[#735c00] flex items-center justify-center mb-3">
              <ShieldCheck className="w-8 h-8 text-[#735c00]" />
            </div>
            <span className="text-[10px] tracking-[0.25em] text-[#735c00] uppercase font-bold block">
              Comité International d&apos;Esthétique et de Cosmétologie — Zürich
            </span>
            <h3 className="text-lg font-serif font-bold text-[#2f020d] mt-1.5">
              شهادة الدبلوم السويسري المعتمد CIDESCO
            </h3>
            <p className="text-xs text-[#524345] mt-1">
              أعلى اعتماد دولي تخصصي في مورفولوجيا الوجه والمكياج السينمائي والعرائسي المتقدم
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-white border border-[#eedfe0] shadow-sm text-xs text-[#4a1521] text-right space-y-2.5">
              <div className="flex justify-between items-center border-b border-[#eedfe0] pb-2">
                <span className="text-[#857374]">اسم الحاصلة على الشهادة:</span>
                <span className="font-bold text-[#2f020d]">أماني خليل (Amani Khalil)</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#eedfe0] pb-2">
                <span className="text-[#857374]">الاعتماد والتسجيل:</span>
                <span className="font-bold text-emerald-700">CIDESCO Section Switzerland</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#eedfe0] pb-2">
                <span className="text-[#857374]">رقم القيد والتوثيق:</span>
                <span className="font-mono font-bold text-[#735c00]">CH-84920-RYD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#857374]">نطاق الخدمة بالرياض:</span>
                <span className="font-bold text-[#2f020d]">خدمة فندقية ومنزلية معتمدة VIP</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}

