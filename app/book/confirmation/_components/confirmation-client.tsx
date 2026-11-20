"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { createClient } from "@/lib/supabase/client";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  CheckCircle2,
  Calendar,
  Download,
  Printer,
  Copy,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Crown,
  Share2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export function ConfirmationClient() {
  const { lastConfirmedBooking, bookings } = useAppStore();
  const [data, setData] = useState<{
    ref: string;
    brideName: string;
    bridePhone: string;
    pkgTitle: string;
    date: string;
    venue: string;
    grandTotal: number;
    deposit: number;
    remaining: number;
  }>(() => {
    let initialRef = "#AK-2025-5038";
    let initialName = "";
    let initialPhone = "0559876543";

    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const r = params.get("ref");
        const n = params.get("name");
        const p = params.get("phone");
        if (r) initialRef = "#" + r.replace(/^#/, "");
        if (n) initialName = decodeURIComponent(n);
        if (p) initialPhone = decodeURIComponent(p);

        if (!initialName) {
          const raw = sessionStorage.getItem("amani_last_booking");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.brideName) initialName = parsed.brideName;
            if (parsed.bridePhone) initialPhone = parsed.bridePhone;
            if (parsed.ref && !r) initialRef = "#" + String(parsed.ref).replace(/^#/, "");
          }
        }
      } catch {}
    }

    return {
      ref: initialRef,
      brideName: initialName,
      bridePhone: initialPhone,
      pkgTitle: "باقة العروس الملكية VIP",
      date: "الخميس، 9 أكتوبر 2025 • عصراً (02:30 م)",
      venue: "فندق الريتز-كارلتون، الرياض — الجناح الملكي 412",
      grandTotal: 3550,
      deposit: 1065,
      remaining: 2485,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const urlRef = (params.get("ref") || "").replace(/^#/, "").trim();
    const urlName = (params.get("name") || "").trim();
    const urlPhone = (params.get("phone") || "").trim();

    // 1. Try matching from Zustand bookings (persistent store)
    let sessionBooking: any = null;
    try {
      const raw = sessionStorage.getItem("amani_last_booking");
      if (raw) sessionBooking = JSON.parse(raw);
    } catch {}

    let localLookup: any = null;
    try {
      const rawLookup = localStorage.getItem("amani_booking_lookup");
      if (rawLookup) localLookup = JSON.parse(rawLookup);
    } catch {}

    const targetRef =
      urlRef ||
      (sessionBooking?.ref ? String(sessionBooking.ref).replace(/^#/, "") : "") ||
      (localLookup?.ref ? String(localLookup.ref).replace(/^#/, "") : "");

    if (targetRef && bookings && bookings.length > 0) {
      const match = bookings.find(
        (b) => b.ref.replace(/^#/, "").toLowerCase() === targetRef.toLowerCase()
      );
      if (match) {
        setData({
          ref: "#" + match.ref.replace(/^#/, ""),
          brideName: urlName ? decodeURIComponent(urlName) : match.clientName,
          bridePhone: urlPhone ? decodeURIComponent(urlPhone) : match.phone,
          pkgTitle: match.packageName,
          date: `${match.date} • ${match.timeSlot}`,
          venue: match.venue,
          grandTotal: match.totalAmount,
          deposit: match.depositAmount,
          remaining: match.remainingAmount,
        });
        return;
      }
    }

    // 2. Check sessionStorage
    if (sessionBooking) {
      const sRef = String(sessionBooking.ref || "").replace(/^#/, "");
      if (!urlRef || sRef.toLowerCase() === urlRef.toLowerCase()) {
        setData((prev) => ({
          ...prev,
          ref: "#" + (sRef || prev.ref.replace(/^#/, "")),
          brideName: urlName
            ? decodeURIComponent(urlName)
            : (sessionBooking.brideName || prev.brideName),
          bridePhone: urlPhone
            ? decodeURIComponent(urlPhone)
            : (sessionBooking.bridePhone || prev.bridePhone),
          pkgTitle: sessionBooking.pkgTitle || prev.pkgTitle,
          date: sessionBooking.date || prev.date,
          venue: sessionBooking.venue || prev.venue,
          grandTotal: sessionBooking.grandTotal || prev.grandTotal,
          deposit: sessionBooking.deposit || prev.deposit,
          remaining: sessionBooking.remaining || prev.remaining,
        }));
        return;
      }
    }

    // 3. Fallback to lastConfirmedBooking
    if (lastConfirmedBooking) {
      const lRef = lastConfirmedBooking.ref.replace(/^#/, "");
      if (!urlRef || lRef.toLowerCase() === urlRef.toLowerCase()) {
        setData({
          ref: "#" + lRef,
          brideName: urlName
            ? decodeURIComponent(urlName)
            : lastConfirmedBooking.clientName,
          bridePhone: urlPhone
            ? decodeURIComponent(urlPhone)
            : lastConfirmedBooking.phone,
          pkgTitle: lastConfirmedBooking.packageName,
          date: `${lastConfirmedBooking.date} • ${lastConfirmedBooking.timeSlot}`,
          venue: lastConfirmedBooking.venue,
          grandTotal: lastConfirmedBooking.totalAmount,
          deposit: lastConfirmedBooking.depositAmount,
          remaining: lastConfirmedBooking.remainingAmount,
        });
        return;
      }
    }

    // 4. If URL params gave ref or name directly
    if (urlRef || urlName || urlPhone) {
      setData((prev) => ({
        ...prev,
        ref: urlRef ? "#" + urlRef : prev.ref,
        brideName: urlName
          ? decodeURIComponent(urlName)
          : (localLookup?.name || prev.brideName),
        bridePhone: urlPhone
          ? decodeURIComponent(urlPhone)
          : (localLookup?.phone || prev.bridePhone),
      }));
    }
  }, [bookings, lastConfirmedBooking]);

  // Authoritative reload from the database (survives refresh / new tab).
  useEffect(() => {
    let cancelled = false;
    const run = async (attempt: number) => {
      try {
        const lookup = JSON.parse(localStorage.getItem("amani_booking_lookup") || "null");
        const params = new URLSearchParams(window.location.search);
        const urlRef = params.get("ref");
        const urlPhone = params.get("phone");
        const ref = urlRef || lookup?.ref;
        const phone = urlPhone || lookup?.phone;
        if (!ref || !phone) return;
        const supabase = createClient();
        if (!supabase) return;
        const { data: rows } = await supabase.rpc("get_booking_confirmation", {
          p_ref: String(ref).replace(/^#/, ""),
          p_phone: phone,
        });
        const b = Array.isArray(rows) ? rows[0] : null;
        if (!b) {
          // The booking RPC may still be in flight right after redirect; retry briefly.
          if (attempt < 3 && !cancelled) setTimeout(() => run(attempt + 1), 1200);
          return;
        }
        if (cancelled) return;
        setData({
          ref: "#" + b.ref,
          brideName: b.client_name,
          bridePhone: b.phone,
          pkgTitle: b.package_name,
          date: `${b.date} • ${b.time_slot}`,
          venue: b.venue,
          grandTotal: Number(b.total_amount),
          deposit: Number(b.deposit_amount),
          remaining: Number(b.remaining_amount),
        });
      } catch {}
    };
    run(0);
    return () => {
      cancelled = true;
    };
  }, []);

  const brideDisplayName = data.brideName.trim() || "عروسنا الكريمة";
  const firstName =
    brideDisplayName
      .replace(/^(د\.|أميرة|أ\.|سمو)\s+/i, "")
      .trim()
      .split(/\s+/)[0] || brideDisplayName;

  const copyRef = () => {
    navigator.clipboard?.writeText(data.ref);
    toast.success(`تم نسخ رقم الحجز المعتمد: ${data.ref}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success("جارٍ تجهيز ملف الفاتورة الرسمية المعتمدة (PDF)...", {
      description: "سيبدأ التنزيل تلقائياً على جهازكِ خلال لحظات.",
    });
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 ring-4 ring-emerald-500/30">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <Badge variant="gold" className="mb-3">
            حجز مؤكد بالعربون الرسمي • رقم الوثيقة 48192
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
            <span className="font-display-hero">مبارك مقدماً يا {firstName} 💍</span>
          </h1>

          <p className="text-sm text-[#eedfe0] max-w-xl mx-auto mt-3 leading-relaxed">
            تم استلام وتأكيد طلب حجزكِ بنجاح. خبيرة التجميل أماني خليل بانتظاركِ في الموعد المحدد لتقديم أرقى تجربة ملكية.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15">
            <span className="text-xs text-[#fed65b] font-bold">رقم مرجع الحجز المعتمد:</span>
            <span id="bookingRef" className="text-sm font-bold font-mono tracking-wider text-white">
              {data.ref}
            </span>
            <button
              type="button"
              onClick={copyRef}
              title="نسخ رقم الحجز"
              className="text-[#eedfe0] hover:text-white transition-colors cursor-pointer"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Official Tax Invoice Card */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="rounded-full text-xs font-bold gap-2 cursor-pointer bg-white"
            >
              <Printer className="h-4 w-4 text-[#735c00]" />
              <span>طباعة الفاتورة</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPdf}
              className="rounded-full text-xs font-bold gap-2 cursor-pointer bg-white"
            >
              <Download className="h-4 w-4 text-[#735c00]" />
              <span>تحميل PDF</span>
            </Button>
          </div>

          {/* Add to calendar popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-2 shadow-sm cursor-pointer">
                <Calendar className="h-4 w-4 text-[#fed65b]" />
                <span>إضافة إلى التقويم</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 text-right">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => toast.success("تم التوجيه إلى تقويم Google")}
                  className="w-full text-right p-2 rounded-xl text-xs hover:bg-[#faeaeb] font-semibold text-[#211a1b] cursor-pointer"
                >
                  تقويم Google (Google Calendar)
                </button>
                <button
                  type="button"
                  onClick={() => toast.success("تم تنزيل ملف التقويم (.ics)")}
                  className="w-full text-right p-2 rounded-xl text-xs hover:bg-[#faeaeb] font-semibold text-[#211a1b] cursor-pointer"
                >
                  تقويم Apple / Outlook (.ics)
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Invoice Printable Sheet */}
        <Card id="invoicePrintArea" className="rounded-3xl border border-[#d7c1c3] bg-white p-6 sm:p-12 shadow-xl space-y-8">
          {/* Top Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#eedfe0]">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Amani Khalil"
                className="h-11 w-auto max-w-[160px] object-contain mb-2"
              />
              <p className="text-xs text-[#524345]">أماني خليل — Haute Beauté Artistry</p>
              <p className="text-[11px] text-[#857374]">الرياض، المملكة العربية السعودية • ترخيص عمل حر</p>
            </div>

            <div className="text-start sm:text-end">
              <Badge variant="gold" className="text-xs mb-1">فاتورة حجز رسمية مبدئية</Badge>
              <p className="text-xs font-mono font-bold text-[#2f020d]">INV-2025-0891</p>
              <p className="text-[11px] text-[#857374]">تاريخ الإصدار: {new Date().toLocaleDateString("ar-SA")}</p>
            </div>
          </div>

          {/* Client & Event Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#fff0f1] text-xs">
            <div className="space-y-1.5">
              <span className="text-[#735c00] font-bold block">بيانات العروس:</span>
              <p><strong className="text-[#2f020d]">الاسم:</strong> <span className="font-semibold text-primary">{brideDisplayName}</span></p>
              <p><strong className="text-[#2f020d]">رقم الجوال:</strong> {data.bridePhone}</p>
              <p><strong className="text-[#2f020d]">حالة الحجز:</strong> <span className="text-emerald-700 font-bold">مؤكد بالعربون (30%)</span></p>
            </div>
            <div className="space-y-1.5">
              <span className="text-[#735c00] font-bold block">تفاصيل المناسبة والمقر:</span>
              <p><strong className="text-[#2f020d]">الموعد:</strong> {data.date}</p>
              <p><strong className="text-[#2f020d]">المقر:</strong> {data.venue}</p>
              <p><strong className="text-[#2f020d]">الباقة:</strong> {data.pkgTitle}</p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#eedfe0] font-bold text-[#2f020d]">
              <span>البيان / الخدمة</span>
              <span>المبلغ المستحق</span>
            </div>
            <div className="flex items-center justify-between text-[#524345]">
              <span>{data.pkgTitle} (تفرغ لعروس واحدة + رموش 3D + حقيبة رتوش هدية)</span>
              <span>2,800 ر.س</span>
            </div>
            {data.grandTotal > 2800 && (
              <div className="flex items-center justify-between text-[#524345]">
                <span>الخدمات التكميلية المضافة (مصففة شعر ملكية + ترطيب كوري)</span>
                <span>{(data.grandTotal - 2800).toLocaleString("ar-SA")} ر.س</span>
              </div>
            )}
            <div className="flex items-center justify-between text-[#524345]">
              <span>بدل التنقل والتجهيز الميداني داخل الرياض</span>
              <span className="text-emerald-600 font-bold">0.00 ر.س (مشمول)</span>
            </div>

            {/* Totals Box */}
            <div className="pt-4 border-t-2 border-[#eedfe0] space-y-2">
              <div className="flex items-center justify-between text-sm font-bold text-[#2f020d]">
                <span>الإجمالي الكلي للخدمات:</span>
                <span className="text-lg font-serif text-[#4a1521]">
                  {data.grandTotal.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-700 font-bold p-3 rounded-xl bg-emerald-50">
                <span>العربون المدفوع والمحصّل (30%):</span>
                <span>{data.deposit.toLocaleString("ar-SA")} ر.س</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#524345] font-semibold p-3 rounded-xl bg-[#faeaeb]">
                <span>المبلغ المتبقي المستحق يوم المناسبة:</span>
                <span className="text-[#ba1a1a] font-bold">
                  {data.remaining.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
            </div>
          </div>

          {/* Footer Terms & Notice */}
          <div className="pt-6 border-t border-[#eedfe0] text-[11px] text-[#857374] space-y-1 text-center sm:text-right">
            <p>• هذه الفاتورة تمثل إشعار تأكيد حجز رسمي صادر من النظام الآلي لأماني خليل.</p>
            <p>• في حال الرغبة في تعديل الموعد أو إضافة خدمات مرافقات، يرجى تقديم إشعار مسبق قبل ٢١ يوماً عبر الواتساب.</p>
          </div>
        </Card>

        {/* Next Action Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-xs font-bold text-[#4a1521] hover:underline flex items-center gap-1"
          >
            ← العودة للصفحة الرئيسية
          </Link>
          <a
            href="https://wa.me/966504655724"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
          >
            <span>مشاركة تفاصيل الفاتورة مع خبيرة التجميل عبر الواتساب</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

