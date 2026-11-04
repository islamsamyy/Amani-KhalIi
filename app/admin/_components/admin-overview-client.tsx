"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { BookingRecord, CustomerProfile } from "@/features/data/initial-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MessageCircle,
  Navigation,
  MapPin,
  TrendingUp,
  RefreshCw,
  Send,
  Hotel,
  Crown,
  Sparkles,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export function AdminOverviewClient() {
  const {
    bookings,
    invoices,
    customers,
    gallery,
    updateBookingStatus,
    updateCustomerNotes,
    refreshFromDatabase,
    isSupabaseConnected,
    isSyncing,
  } = useAppStore();

  const [activeSessionBooking, setActiveSessionBooking] =
    useState<BookingRecord | null>(null);
  const [activeCustomerNotesDraft, setActiveCustomerNotesDraft] =
    useState<string>("");
  const [currentDateStr, setCurrentDateStr] = useState<string>(
    "الرياض GMT+3"
  );

  useEffect(() => {
    try {
      const formatted = new Intl.DateTimeFormat("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Riyadh",
      }).format(new Date());
      setCurrentDateStr(`${formatted} | الرياض GMT+3`);
    } catch {
      setCurrentDateStr("الرياض GMT+3");
    }
  }, []);

  // Filter and sort active bookings chronologically
  const activeBookings = bookings.filter((b) => b.status !== "CANCELLED");
  const activeBookingsSorted = [...activeBookings].sort((a, b) => {
    const cmp = a.date.localeCompare(b.date);
    if (cmp !== 0) return cmp;
    return a.timeSlot.localeCompare(b.timeSlot);
  });

  const pendingBookings = bookings.filter(
    (b) => b.status === "PENDING_PAYMENT"
  );
  const confirmedOrCompleted = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "COMPLETED"
  );

  const totalRevenue = activeBookings.reduce(
    (sum, b) => sum + b.totalAmount,
    0
  );
  const totalDeposits = invoices.reduce(
    (sum, i) => sum + i.depositPaid,
    0
  );
  const totalRemaining = invoices.reduce(
    (sum, i) => sum + i.remainingBalance,
    0
  );

  // Dynamic progress rates
  const depositRate =
    totalRevenue > 0
      ? Math.min(100, Math.round((totalDeposits / totalRevenue) * 100))
      : 0;
  const confirmedRate =
    bookings.length > 0
      ? Math.min(
        100,
        Math.round((confirmedOrCompleted.length / bookings.length) * 100)
      )
      : 0;
  const capacityRate = Math.min(
    100,
    Math.round((activeBookingsSorted.length / Math.max(1, bookings.length)) * 100)
  );

  const featuredLook =
    gallery.find((g) => g.category === "bridal") || gallery[0];

  const sendWhatsAppReminder = (
    clientName: string,
    phone: string,
    depositAmount: number,
    ref: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `مرحباً بكِ عروستنا ${clientName} 🌸 نود تذكيركِ بلطف بسداد عربون الحجز بقيمة ${depositAmount.toLocaleString(
        "en-US"
      )} ر.س لتثبيت موعدكِ الملكي رسمياً #${ref}. أتيليه أماني خليل.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    toast.success(
      `تم إرسال تذكير سداد العربون للعميلة ${clientName} عبر الواتساب بنجاح 💬`
    );
  };

  const markSessionVerified = (ref: string) => {
    updateBookingStatus(ref, "COMPLETED");
  };

  const handleOpenNotes = (booking: BookingRecord) => {
    setActiveSessionBooking(booking);
    const matchedCustomer = customers.find(
      (c) =>
        c.phone === booking.phone ||
        c.name.trim() === booking.clientName.trim()
    );
    setActiveCustomerNotesDraft(
      matchedCustomer?.notes || booking.notes || ""
    );
  };

  const handleSaveCustomerNotes = () => {
    if (!activeSessionBooking) return;
    const matchedCustomer = customers.find(
      (c) =>
        c.phone === activeSessionBooking.phone ||
        c.name.trim() === activeSessionBooking.clientName.trim()
    );
    if (matchedCustomer) {
      updateCustomerNotes(matchedCustomer.id, activeCustomerNotesDraft);
    }
    toast.success("تم حفظ الملاحظات وتحديثها في ملف العميلة بنجاح ✨");
    setActiveSessionBooking(null);
  };

  const getMatchedCustomer = (booking: BookingRecord): CustomerProfile | null => {
    return (
      customers.find(
        (c) =>
          c.phone === booking.phone ||
          c.name.trim() === booking.clientName.trim()
      ) || null
    );
  };

  return (
    <div dir="rtl" className="lg:pr-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-8">
        {/* 1. Executive Greeting Bar */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#4a1521] via-[#2f020d] to-[#1b120e] text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed65b] text-[#241a00] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#735c00] animate-ping" />
                  <span>الأتيليه جاهز • مواعيد نشطة ({activeBookingsSorted.length})</span>
                </span>
                <span className="text-xs text-[#eedfe0]">{currentDateStr}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif">
                صباح الخير، أماني ✨
              </h1>
              <p className="text-xs sm:text-sm text-[#eedfe0] max-w-2xl leading-relaxed">
                جدول المواعيد النشطة يضم{" "}
                <strong className="text-[#fed65b]">
                  {activeBookingsSorted.length} جلسات مؤكدة وقادمة
                </strong>{" "}
                مرتبة حسب التاريخ، بالإضافة إلى{" "}
                <strong className="text-[#fed65b]">
                  {pendingBookings.length} طلبات بانتظار سداد العربون
                </strong>
                .
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href="/admin/services/new"
                className="h-11 px-5 rounded-full bg-[#fed65b] text-[#241a00] hover:bg-[#ffe088] font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>إضافة باقة جديدة</span>
              </Link>
              <Link
                href="/admin/bookings"
                className="h-11 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition-all"
              >
                <span>مراجعة الطلبات</span>
                <span className="px-2 py-0.5 rounded-full bg-[#fed65b] text-[#241a00] font-bold text-[10px]">
                  {pendingBookings.length}
                </span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await refreshFromDatabase();
                  toast.success(
                    isSupabaseConnected
                      ? "تمت مزامنة البيانات المباشرة من Supabase بنجاح ✨"
                      : "تم تحديث البيانات بنجاح"
                  );
                }}
                className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title="تحديث ومزامنة قاعدة البيانات"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 2. Vital KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">
                إجمالي التعاقدات النشطة
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {totalRevenue.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">ر.س</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>محدث تلقائياً من سجل الحجوزات</span>
            </div>
            <Progress value={capacityRate} className="h-2" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">
                إجمالي الحجوزات المسجلة
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {bookings.length}
              </span>
              <span className="text-xs text-[#524345]">جلسة عرائس وسهرات</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-3">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {confirmedOrCompleted.length} مؤكدة ومكتملة
              </span>
            </div>
            <Progress value={confirmedRate} className="h-2" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">
                العرابين والمبالغ المتبقية
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
                <Crown className="h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <div>
                <span className="text-[#857374] block">عرابين محصّلة:</span>
                <span className="text-lg font-bold text-[#2f020d]">
                  {totalDeposits.toLocaleString("en-US")} ر.س
                </span>
              </div>
              <div className="text-left">
                <span className="text-[#857374] block">متبقٍ يوم المناسبة:</span>
                <span className="text-lg font-bold text-[#735c00]">
                  {totalRemaining.toLocaleString("en-US")} ر.س
                </span>
              </div>
            </div>
            <Progress value={depositRate} className="h-2 mt-4" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-[#fff0f1] p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#735c00]">
                طلبات بانتظار العربون
              </span>
              <Badge variant="gold" className="text-[10px]">
                عاجل
              </Badge>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold font-serif text-[#2f020d]">
                  {pendingBookings.length}
                </span>
                <span className="text-xs text-[#524345]">طلبات حجز وتثبيت</span>
              </div>
              <p className="text-[11px] text-[#524345]">
                مرتبطة مباشرة بقاعدة البيانات والفواتير الرسمية
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-[#4a1521] hover:underline pt-3 inline-flex items-center gap-1"
            >
              <span>فتح صندوق الاستقبال والفرز</span>
              <span>←</span>
            </Link>
          </Card>
        </section>

        {/* 3. Schedule Timeline & Urgent Holds */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Latest Active Sessions (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#735c00]" />
                <h2 className="text-lg font-bold text-[#2f020d]">
                  أحدث المواعيد النشطة ({activeBookingsSorted.length} موعد مرتبة بالتاريخ)
                </h2>
              </div>
              <Badge variant="outline" className="text-[10px] bg-white">
                فاصل انتقال 45 دقيقة ذكي
              </Badge>
            </div>

            {activeBookingsSorted.length === 0 ? (
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-8 text-center text-xs text-[#857374] space-y-2">
                <p>لا توجد حجوزات نشطة حالياً في قاعدة البيانات.</p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1 text-[#735c00] font-bold hover:underline"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة حجز جديد للبدء</span>
                </Link>
              </Card>
            ) : (
              activeBookingsSorted.slice(0, 12).map((booking, idx) => {
                const nextBooking = activeBookingsSorted[idx + 1];
                const isSameDate = nextBooking && nextBooking.date === booking.date;
                const isCompleted = booking.status === "COMPLETED";
                const isConfirmed = booking.status === "CONFIRMED";
                const cleanPhone = booking.phone.replace(/[^0-9]/g, "");

                // Parse time and period cleanly (e.g. "عصراً (02:30 م)" -> time="02:30 م", period="عصراً")
                const timeMatch = booking.timeSlot.match(/\(([^)]+)\)/);
                const cleanTime = timeMatch ? timeMatch[1].trim() : booking.timeSlot.trim();
                const periodName = booking.timeSlot.replace(/\s*\([^)]*\)/, "").trim();

                return (
                  <React.Fragment key={booking.id}>
                    <Card
                      className={`rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all hover:shadow-md ${
                        isCompleted
                          ? "bg-white border border-[#eedfe0]"
                          : isConfirmed
                            ? "bg-[#fffbf7] border-2 border-[#735c00] shadow-md"
                            : "bg-white border border-[#eedfe0]"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        {/* Elegant, readable date & time badge */}
                        <div
                          className={`w-20 sm:w-24 py-3 px-2 rounded-2xl flex flex-col items-center justify-center text-center font-bold shrink-0 shadow-2xs border transition-all ${
                            isConfirmed
                              ? "bg-[#4a1521] text-white border-[#3d0e19]"
                              : isCompleted
                                ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                                : "bg-[#faeaeb] text-[#2f020d] border-[#eedfe0]"
                          }`}
                        >
                          <span
                            className={`text-[11px] font-bold font-mono tracking-wider ${
                              isConfirmed
                                ? "text-[#fed65b]"
                                : isCompleted
                                  ? "text-emerald-700"
                                  : "text-[#735c00]"
                            }`}
                          >
                            {booking.date.split("-").slice(1).join("/")}
                          </span>
                          <span
                            className="text-xs sm:text-sm font-bold font-mono tracking-tight my-0.5 whitespace-nowrap"
                            dir="ltr"
                          >
                            {cleanTime}
                          </span>
                          <span
                            className={`text-[10px] font-semibold truncate max-w-full ${
                              isConfirmed
                                ? "text-[#ffd9dd]"
                                : isCompleted
                                  ? "text-emerald-800"
                                  : "text-[#857374]"
                            }`}
                          >
                            {periodName ||
                              (booking.locationType === "STUDIO"
                                ? "أتيليه"
                                : booking.locationType === "CLIENT_HOME"
                                  ? "منزلي"
                                  : "فندقي")}
                          </span>
                        </div>

                        {/* Booking & Client Info */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-[#2f020d] tracking-tight truncate">
                              {booking.clientName}
                            </h3>
                            <span
                              dir="ltr"
                              className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#faeaeb] text-[#735c00] border border-[#eedfe0] select-all shrink-0"
                            >
                              #{booking.ref.replace(/^#/, "")}
                            </span>
                            {isCompleted ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 font-bold px-2.5 py-0.5 flex items-center gap-1 shrink-0"
                              >
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>مكتملة الآن</span>
                              </Badge>
                            ) : isConfirmed ? (
                              <Badge
                                variant="gold"
                                className="text-[10px] font-bold px-2.5 py-0.5 shadow-2xs shrink-0"
                              >
                                مؤكد بالعربون
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 font-bold px-2.5 py-0.5 shrink-0"
                              >
                                بانتظار السداد
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-[#524345] flex items-center gap-1.5 truncate">
                            {booking.locationType === "CLIENT_HOME" ? (
                              <MapPin className="h-3.5 w-3.5 text-[#735c00] shrink-0" />
                            ) : (
                              <Hotel className="h-3.5 w-3.5 text-[#735c00] shrink-0" />
                            )}
                            <span className="truncate">{booking.venue}</span>
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-[#735c00] font-semibold flex-wrap">
                            <span>{booking.packageName}</span>
                            <span className="text-[#d7c1c3]">•</span>
                            <span className="text-[#2f020d] font-bold font-mono">
                              {booking.totalAmount.toLocaleString("en-US")} ر.س
                            </span>
                            {booking.depositAmount > 0 && (
                              <span className="text-[10px] text-[#857374] font-normal">
                                (عربون: {booking.depositAmount.toLocaleString("en-US")} ر.س)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons (single line, no wrapping/dropping) */}
                      <div className="flex items-center gap-2 self-start xl:self-center shrink-0 flex-nowrap pt-2 xl:pt-0 border-t xl:border-0 border-[#eedfe0]">
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `مرحباً بكِ عروستنا ${booking.clientName} 🌸 نؤكد موعدكِ الملكي (${booking.packageName}) بتاريخ ${booking.date} في ${booking.venue}. رقم الحجز #${booking.ref}.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-9 px-3.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shadow-2xs"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>تواصل مباشر</span>
                        </a>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenNotes(booking)}
                          className="rounded-full text-xs h-9 px-3.5 bg-white border-[#eedfe0] text-[#2f020d] hover:bg-[#fff0f1] font-semibold whitespace-nowrap"
                        >
                          الملاحظات
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => markSessionVerified(booking.ref)}
                          className={`rounded-full text-xs font-bold h-9 px-3.5 transition-all whitespace-nowrap ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                              : "bg-[#faeaeb] text-[#2f020d] hover:bg-[#4a1521] hover:text-white border border-[#eedfe0]"
                          }`}
                        >
                          {isCompleted ? "مكتمل ✓" : "تم التوثيق"}
                        </Button>
                      </div>
                    </Card>

                    {/* Travel Buffer Notice if back-to-back on same date */}
                    {isSameDate && nextBooking && (
                      <div className="px-4 py-3 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] text-xs text-[#524345] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-xl bg-white border border-[#eedfe0] text-[#735c00] flex items-center justify-center shrink-0">
                            <Navigation className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#4a1521]">
                                فاصل التنقل وتجهيز الحقيبة الملكية:
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold bg-white text-[#735c00] border-[#eedfe0] px-2"
                              >
                                45 دقيقة
                              </Badge>
                            </div>
                            <p
                              className="text-[11px] text-[#524345] truncate mt-0.5"
                              title={`من: ${booking.venue} ← إلى: ${nextBooking.venue}`}
                            >
                              المسار: من {booking.venue.split("—")[0].trim()} ← إلى {nextBooking.venue.split("—")[0].trim()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            حركة المرور: سلسة
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>

          {/* Urgent Holds Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eedfe0]">
                <h3 className="text-sm font-bold text-[#ba1a1a] flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>تنبيهات العرابين المعلقة ({pendingBookings.length})</span>
                </h3>
                {pendingBookings.length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
                )}
              </div>
              <p className="text-xs text-[#524345] leading-relaxed">
                طلبات حجز بانتظار تحويل العربون لتثبيت الموعد رسمياً في الأجندة:
              </p>

              {pendingBookings.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#f8fdf9] border border-emerald-200 text-center text-xs text-emerald-800">
                  لا توجد طلبات معلقة بانتظار سداد العربون حالياً ✓
                </div>
              ) : (
                pendingBookings.map((hold) => (
                  <div
                    key={hold.id}
                    className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#2f020d]">
                        {hold.clientName}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-[#ffdad6] text-[#93000a] border-none font-bold"
                      >
                        معلق
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#524345] flex justify-between">
                      <span>تاريخ المناسبة: {hold.date}</span>
                      <span className="font-bold text-[#735c00]">
                        العربون: {hold.depositAmount.toLocaleString("en-US")} ر.س
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() =>
                          sendWhatsAppReminder(
                            hold.clientName,
                            hold.phone,
                            hold.depositAmount,
                            hold.ref
                          )
                        }
                        className="flex-1 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-[11px] h-8"
                      >
                        <Send className="h-3 w-3 ms-1" />
                        <span>تذكير واتساب سريع</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateBookingStatus(hold.ref, "CONFIRMED")
                        }
                        className="rounded-full text-[11px] h-8 bg-white text-[#2f020d] border border-[#eedfe0] font-bold"
                      >
                        تثبيت يدوي
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateBookingStatus(hold.ref, "CANCELLED");
                          toast.success("تم إفساح الموعد وإلغاء الحجز المعلق");
                        }}
                        className="rounded-full text-[11px] h-8 text-[#857374]"
                      >
                        إفساح
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </Card>

            {/* Signature Look Spotlight */}
            {featuredLook && (
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-3">
                <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider block">
                  إطلالة العروس الأكثر تميزاً من المعرض
                </span>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredLook.image}
                    alt={featuredLook.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="text-xs font-bold text-[#fed65b]">
                        {featuredLook.title}
                      </p>
                      <p className="text-[10px] text-[#ffd9dd]">
                        {featuredLook.clientType}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Customer & Session Notes Dialog */}
        <Dialog
          open={activeSessionBooking !== null}
          onOpenChange={(open) => !open && setActiveSessionBooking(null)}
        >
          <DialogContent className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
            {activeSessionBooking && (
              <>
                <DialogHeader className="text-right">
                  <DialogTitle className="text-lg font-bold text-[#2f020d]">
                    ملاحظات الجلسة: {activeSessionBooking.clientName}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#524345]">
                    {activeSessionBooking.packageName} • #{activeSessionBooking.ref}
                  </DialogDescription>
                </DialogHeader>

                {(() => {
                  const cust = getMatchedCustomer(activeSessionBooking);
                  return (
                    <div className="space-y-3 my-3 text-xs text-[#211a1b]">
                      {cust && (
                        <div className="p-3 bg-white rounded-xl border border-[#eedfe0] space-y-1.5">
                          <p>
                            • <strong>نوع البشرة:</strong> {cust.skinType} (
                            {cust.undertone})
                          </p>
                          <p>
                            • <strong>المستحضرات المفضلة:</strong>{" "}
                            {cust.favoritePalette}
                          </p>
                          {cust.allergies && (
                            <p className="text-rose-700">
                              • <strong>تنبيه تحسس:</strong> {cust.allergies}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#2f020d] block">
                          ملاحظات خبيرة التجميل لملف العميلة:
                        </label>
                        <textarea
                          rows={3}
                          value={activeCustomerNotesDraft}
                          onChange={(e) =>
                            setActiveCustomerNotesDraft(e.target.value)
                          }
                          className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                          placeholder="أدخلي تفاصيل الفاونديشن وتفضيلات المكياج..."
                        />
                      </div>
                    </div>
                  );
                })()}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveSessionBooking(null)}
                    className="rounded-full text-xs"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleSaveCustomerNotes}
                    className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-1"
                  >
                    <Save className="w-3.5 h-3.5 text-[#fed65b]" />
                    <span>حفظ الملاحظة</span>
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
