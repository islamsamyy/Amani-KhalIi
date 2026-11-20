"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  X,
  Diamond,
  Sparkles,
  Hotel,
  ShieldCheck,
  Calendar,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export function FaqClient() {
  const { t, dir } = useLanguage();
  const { faqs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;
    const haystack = (
      faq.question +
      " " +
      faq.answer +
      " " +
      faq.keywords.join(" ")
    ).toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div dir={dir} className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            {t("دليلكِ الشامل والإجابات الرسمية", "Complete Guide & Official Answers")}
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            {t("الأسئلة الشائعة", "Frequently Asked Questions")}
          </h1>
          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            {t(
              "كل ما تودين معرفته لضمان إطلالة استثنائية: إجابات واضحة وشفافة حول باقات العرائس الملكية، سياسات تثبيت المواعيد، التغطية الفندقية بالرياض، ونوعية المستحضرات العالمية.",
              "Clear, transparent answers about our royal bridal packages, deposit policies, Riyadh hotel coverage, and luxury cosmetics."
            )}
          </p>

          {/* Live Search Input */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#857374] pointer-events-none" />
            <input
              id="faq-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن سؤالكِ (مثلاً: العربون، الحضور للقاعة، البشرة الحساسة، مستحضرات)..."
              className="w-full h-12 ps-12 pe-10 rounded-full bg-white text-[#211a1b] text-xs sm:text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-[#fed65b] border-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#eedfe0] hover:bg-[#d7c1c3] flex items-center justify-center text-[#2f020d] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section className="py-8 bg-[#fff0f1] border-b border-[#eedfe0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap justify-center gap-2">
          {[
            { id: "all", label: "كافة الأسئلة", count: faqs.length },
            { id: "bridal", label: "حجوزات العرائس وتأكيد الموعد", count: faqs.filter((f) => f.category === "bridal").length },
            { id: "products", label: "المستحضرات وثبات المكياج", count: faqs.filter((f) => f.category === "products").length },
            { id: "location", label: "الزيارات الخارجية والفنادق", count: faqs.filter((f) => f.category === "location").length },
            { id: "trial", label: "جلسات التجربة Trial", count: faqs.filter((f) => f.category === "trial").length },
            { id: "policies", label: "التعديل والإلغاء والسياسات", count: faqs.filter((f) => f.category === "policies").length },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? "bg-[#4a1521] text-white shadow-sm"
                  : "bg-white text-[#524345] hover:bg-[#faeaeb] border border-[#eedfe0]"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === cat.id ? "bg-white/20 text-white" : "bg-[#faeaeb] text-[#735c00]"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Accordion QA List */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <HelpCircle className="h-12 w-12 text-[#857374] mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-[#2f020d]">لم نجد أي سؤال يطابق بحثكِ</h3>
            <p className="text-xs text-[#524345]">
              جربي البحث بكلمات أخرى أو تواصلي معنا مباشرة عبر الواتساب للإجابة الفورية.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              variant="outline"
              className="rounded-full text-xs"
            >
              إعادة ضبط البحث
            </Button>
          </div>
        ) : (
          <Accordion type="single" collapsible defaultValue={filteredFaqs[0]?.id} className="space-y-4">
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="faq-item rounded-3xl border border-[#eedfe0] bg-white px-6 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <AccordionTrigger className="faq-toggle py-5 text-start font-bold text-sm sm:text-base text-[#2f020d] hover:text-[#4a1521]">
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="faq-answer pb-6 text-xs sm:text-sm text-[#524345] leading-relaxed">
                  <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0]/60 space-y-2">
                    <p>{faq.answer}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#735c00]">
                      <span className="font-semibold">التصنيف: {faq.categoryAr}</span>
                      <Link href="/book" className="font-bold underline hover:text-[#4a1521]">
                        احجزي جلستكِ الآن ←
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* WhatsApp direct assist banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#2f020d] to-[#4a1521] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-right">
            <h3 className="text-lg font-bold text-white">لديكِ استفسار خاص لم تجدي إجابته؟</h3>
            <p className="text-xs text-[#eedfe0]">أماني خليل وفريق المنسقات جاهزون للإجابة الفورية على مدار اليوم.</p>
          </div>
          <a
            href="https://wa.me/966504655724"
            target="_blank"
            rel="noreferrer"
            className="h-11 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 shadow-lg shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            <span>محادثة واتساب فورية</span>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

