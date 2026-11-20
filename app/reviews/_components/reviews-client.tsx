"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Star,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Plus,
  Heart,
  Sparkles,
} from "lucide-react";

export function ReviewsClient() {
  const { t, dir } = useLanguage();
  const { reviews, addReview } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [packageTitle, setPackageTitle] = useState("باقة العروس الملكية VIP");
  const [rating, setRating] = useState(5);
  const [venue, setVenue] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    addReview({
      clientName: clientName.trim(),
      packageTitle,
      rating,
      date: "الآن",
      venue: venue.trim() || "الرياض",
      comment: comment.trim(),
    });

    setClientName("");
    setVenue("");
    setComment("");
    setModalOpen(false);
  };

  return (
    <div dir={dir} className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            {t("شهادات موثقة من واقع حجوزات حقيقية", "Verified Testimonials from Real Bookings")}
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            {t("آراء وتقييمات العميلات", "Client Reviews & Testimonials")}
          </h1>
          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            {t(
              "كلمات من القلب تعكس تجارب عرائسنا وسيدات الرياض، وما لمسنه من رقي في التعامل وثبات أسطوري في المكياج.",
              "Heartfelt words from our Riyadh brides reflecting refined hospitality and 18-hour makeup longevity."
            )}
          </p>
          <div className="pt-8">
            <Button
              onClick={() => setModalOpen(true)}
              className="h-12 px-8 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] font-bold text-sm shadow-xl cursor-pointer"
            >
              <Plus className="h-4 w-4 me-2 text-[#735c00]" />
              <span>{t("شاركينا تجربتكِ وتقييمكِ", "Share Your Review")}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Rating Summary Overview */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Score (4 cols) */}
            <div className="md:col-span-4 text-center md:border-l md:border-[#eedfe0] md:pe-8">
              <span className="text-5xl sm:text-6xl font-bold font-serif text-[#2f020d]">٤.٩</span>
              <div className="flex items-center justify-center gap-1 text-amber-500 my-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#524345]">بناءً على أكثر من ٤٠٠ تقييم موثق</p>
              <Badge variant="gold" className="mt-3 text-[10px]">
                رضا العميلات 99.4%
              </Badge>
            </div>

            {/* Breakdown (8 cols) */}
            <div className="md:col-span-8 space-y-3">
              {[
                { label: "٥ نجوم", pct: 96 },
                { label: "٤ نجوم", pct: 4 },
                { label: "٣ نجوم", pct: 0 },
                { label: "نجمتان", pct: 0 },
                { label: "نجمة واحدة", pct: 0 },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-semibold text-[#524345] shrink-0">{row.label}</span>
                  <Progress value={row.pct} className="h-2 flex-1" />
                  <span className="w-10 text-end font-bold text-[#2f020d]">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Testimonials Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <Card
              key={rev.id}
              className="p-6 sm:p-8 rounded-3xl border border-[#eedfe0] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#857374]">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#211a1b] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#eedfe0] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2f020d]">{rev.clientName}</h4>
                  <p className="text-[11px] text-[#735c00]">{rev.packageTitle}</p>
                  <p className="text-[10px] text-[#857374]">{rev.venue}</p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-[#fff8f7] text-emerald-700 border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 ms-1" />
                  <span>موثق</span>
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Add Review Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold text-[#2f020d] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#735c00]" />
              <span>مشاركة تجربتكِ مع أماني خليل</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#524345]">
              رأيكِ الكريم يسعدنا ويساعد العرائس الأخريات في اختيار الإطلالة المثالية.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 my-2">
            <div>
              <label className="text-xs font-bold text-[#2f020d] block mb-1.5">تقييمكِ الإجمالي:</label>
              <div className="flex items-center gap-2 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star className={`h-6 w-6 ${s <= rating ? "fill-current" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2f020d] block mb-1">اسمكِ الكريم (أو العروس):</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="مثال: العروس منيرة السالم"
                className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">نوع الباقة:</label>
                <select
                  value={packageTitle}
                  onChange={(e) => setPackageTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                >
                  <option value="باقة العروس الملكية VIP">باقة العروس الملكية VIP</option>
                  <option value="باقة الملكة والخطوبة الفاخرة">باقة الملكة والخطوبة</option>
                  <option value="مكياج السهرات والمناسبات VIP">مكياج سهرة VIP</option>
                  <option value="مكياج ناعم وطبيعي">مكياج ناعم</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">مكان الجلسة (اختياري):</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="مثال: فندق الريتز"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#2f020d] block mb-1">تفاصيل تجربتكِ ورأيكِ:</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتبي لنا عن تعامل أماني، ثبات المكياج، إضاءة القاعة، وتجربتكِ العامة..."
                className="w-full p-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00] leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setModalOpen(false)} className="rounded-full text-xs">
                إلغاء
              </Button>
              <Button type="submit" className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs px-6 cursor-pointer">
                إرسال ونشر التقييم ✨
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}

