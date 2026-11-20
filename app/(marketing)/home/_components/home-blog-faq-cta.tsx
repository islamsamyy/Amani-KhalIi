"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { FALLBACK_GALLERY_IMAGE, normalizeImageSrc } from "@/lib/image-upload";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Crown,
  HelpCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export function HomeBlogFaqCta() {
  const { blogPosts, faqs } = useAppStore();
  const { t, dir } = useLanguage();
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyMobileBar(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const latestPosts = blogPosts.filter((p) => p.published).slice(0, 3);
  const topFaqs = faqs.slice(0, 5);

  return (
    <>
      {/* 1. Live Editorial Beauty Journal */}
      <section
        dir={dir}
        aria-label={t("المدونة الملكية ونصائح الجمال", "Royal Beauty Journal")}
        className="py-20 bg-white border-b border-[#eedfe0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faeaeb] text-[#735c00] text-xs font-bold mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t("المدونة الملكية • Beauty Journal", "Royal Beauty Journal")}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d]">
                {t("أسرار العروس من دفتر أماني خليل", "Bridal Secrets from Amani Khalil's Journal")}
              </h2>
              <p className="text-sm text-[#524345] mt-2">
                {t(
                  "مقالات وإرشادات عملية للعناية بالبشرة واختيار الإطلالة المثالية ليوم زفافكِ.",
                  "Practical skincare guides and bridal artistry insights for your unforgettable wedding day."
                )}
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#4a1521] hover:text-[#2f020d] hover:underline shrink-0"
            >
              <span>
                {t(
                  `تصفح كافة المقالات (${blogPosts.filter((p) => p.published).length})`,
                  `Explore All Articles (${blogPosts.filter((p) => p.published).length})`
                )}
              </span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-3xl border border-[#eedfe0] bg-[#fff8f7] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#735c00]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#2f020d] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={normalizeImageSrc(post.coverImage) || FALLBACK_GALLERY_IMAGE}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_GALLERY_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge
                      variant="gold"
                      className="absolute top-3 start-3 text-[10px] font-bold shadow-md"
                    >
                      {post.categoryAr}
                    </Badge>
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-[#735c00] font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </span>
                      <span>•</span>
                      <span>{post.publishedAt}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#2f020d] group-hover:text-[#735c00] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#524345] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-3 border-t border-[#eedfe0]/70 flex items-center justify-between text-xs font-bold text-[#4a1521]">
                  <span>{t("اقرئي المقال كاملاً", "Read Full Article")}</span>
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Curated Pre-Booking FAQ Accordion */}
      <section
        dir={dir}
        aria-label={t("الأسئلة الشائعة قبل الحجز", "Frequently Asked Questions")}
        className="py-20 bg-[#fff8f7]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#eedfe0] text-[#735c00] text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t("إجابات واضحة قبل الحجز", "Clear Answers Before Booking")}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d]">
              {t("الأسئلة الأكثر شيوعاً بين عرائسنا", "Frequently Asked Questions")}
            </h2>
            <p className="text-sm text-[#524345] mt-2">
              {t(
                "كل ما تودين معرفته عن العربون، سياسة التأجيل، الماركات، وموعد البروفة.",
                "Everything you need to know about deposits, rescheduling policies, luxury brands, and trial sessions."
              )}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {topFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-sm sm:text-base font-bold text-[#2f020d] text-start">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#524345] leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4a1521] hover:underline"
            >
              <span>
                {t(`عرض جميع الأسئلة الشائعة (${faqs.length})`, `View All FAQs (${faqs.length})`)}
              </span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Final Royal Concierge CTA Banner */}
      <section
        dir={dir}
        aria-label={t("دعوة الحجز النهائية", "Final Booking Call to Action")}
        className="py-16 sm:py-20 bg-gradient-to-br from-[#2f020d] via-[#3a0d17] to-[#4a1521] text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#fed65b]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#fed65b]/40 text-xs font-bold text-[#fed65b]">
            <Crown className="h-3.5 w-3.5" />
            <span>
              {t(
                "نقبل عروساً واحدة فقط في اليوم — احجزي تاريخكِ مبكراً",
                "Strictly One Bride Per Day — Reserve Your Date Early"
              )}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
            {t("اجعلي ليلة زفافكِ لوحة ملكية لا تُنسى", "Make Your Wedding Night an Unforgettable Masterpiece")}
          </h2>

          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto leading-relaxed">
            {t(
              "ثبتي موعدكِ الآن بعربون 30% عبر بوابة الدفع الآمنة واستلمي عقدكِ الإلكتروني الموثق وفاتورتكِ الرسمية خلال ثوانٍ.",
              "Lock in your date now with a 30% deposit via secure checkout and receive your verified digital contract & invoice instantly."
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/book"
              className="h-13 px-8 rounded-full bg-[#fed65b] hover:bg-white text-[#241a00] text-sm font-bold flex items-center gap-2 shadow-xl transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span>{t("احجزي موعدكِ الآن", "Book Your Date Now")}</span>
            </Link>
            <a
              href="https://wa.me/966504655724"
              target="_blank"
              rel="noreferrer"
              className="h-13 px-7 rounded-full bg-white/10 hover:bg-[#25D366] border border-white/25 hover:border-[#25D366] text-white text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{t("استشارة فورية عبر واتساب", "Instant WhatsApp Consultation")}</span>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4 text-[11px] text-[#eedfe0]/80 flex-wrap">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-[#fed65b]" />
              {t("دبلوم CIDESCO السويسري", "CIDESCO Swiss Certified")}
            </span>
            <span>•</span>
            <span>{t("تغطية فنادق وقصور الرياض", "Riyadh Hotels & Palaces")}</span>
            <span>•</span>
            <span>{t("عقد رسمي وفاتورة فورية", "Verified Contract & Instant Invoice")}</span>
          </div>
        </div>
      </section>

      {/* 4. Mobile Sticky Conversion Bar */}
      {showStickyMobileBar && (
        <div
          dir={dir}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#fff8f7]/95 backdrop-blur-xl border-t border-[#d7c1c3] px-4 py-3 shadow-[0_-8px_24px_rgba(47,2,13,0.12)] flex items-center gap-2.5"
        >
          <Link
            href="/book"
            className="flex-1 h-11 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Calendar className="h-4 w-4 text-[#fed65b]" />
            <span>{t("احجزي موعدكِ الآن", "Book Now")}</span>
          </Link>
          <a
            href="https://wa.me/966504655724"
            target="_blank"
            rel="noreferrer"
            aria-label={t("تواصل واتساب", "WhatsApp")}
            className="h-11 px-4 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 text-[#128C7E] text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t("واتساب", "WhatsApp")}</span>
          </a>
        </div>
      )}
    </>
  );
}
