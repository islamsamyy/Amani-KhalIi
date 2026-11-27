"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
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
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export function AdminOverviewClient() {
  const { t, dir, lang } = useLanguage();
  const {
    bookings,
    invoices,
    customers,
    gallery,
    updateBookingStatus,
    deleteBooking,
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
    t("الرياض GMT+3", "Riyadh GMT+3")
  );

  useEffect(() => {
    try {
      const formatted = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Riyadh",
      }).format(new Date());
      setCurrentDateStr(`${formatted} | ${lang === "en" ? "Riyadh GMT+3" : "الرياض GMT+3"}`);
    } catch {
      setCurrentDateStr(lang === "en" ? "Riyadh GMT+3" : "الرياض GMT+3");
    }
  }, [lang]);

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
      t(
        `تم إرسال تذكير سداد العربون للعميلة ${clientName} عبر الواتساب بنجاح 💬`,
        `Deposit reminder sent to ${clientName} via WhatsApp 💬`
      )
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
    toast.success(
      t(
        "تم حفظ الملاحظات وتحديثها في ملف العميلة بنجاح ✨",
        "Notes saved and updated in client profile ✨"
      )
    );
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
    <div dir={dir} className="lg:ps-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-8">
        {/* 1. Executive Greeting Bar */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#4a1521] via-[#2f020d] to-[#1b120e] text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed65b] text-[#241a00] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#735c00] animate-ping" />
                  <span>
                    {t(
                      `الأتيليه جاهز • مواعيد نشطة (${activeBookingsSorted.length})`,
                      `Atelier Ready • Active Bookings (${activeBookingsSorted.length})`
                    )}
                  </span>
                </span>
                <span className="text-xs text-[#eedfe0]">{currentDateStr}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif">
                {t("صباح الخير يا أجمل أماني ✨", "Good Morning, Beautiful Amani ✨")}
              </h1>
              <p className="text-xs sm:text-sm text-[#eedfe0] max-w-2xl leading-relaxed">
                {t("جدول المواعيد النشطة يضم", "Your active schedule has")}{" "}
                <strong className="text-[#fed65b]">
                  {activeBookingsSorted.length}{" "}
                  {t("جلسات مؤكدة وقادمة", "confirmed upcoming sessions")}
                </strong>{" "}
                {t("مرتبة حسب التاريخ، بالإضافة إلى", "sorted by date, plus")}{" "}
                <strong className="text-[#fed65b]">
                  {pendingBookings.length}{" "}
                  {t("طلبات بانتظار سداد العربون", "pending deposit requests")}
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
                <span>{t("إضافة باقة جديدة", "Add New Package")}</span>
              </Link>
              <Link
                href="/admin/bookings"
                className="h-11 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-2 border border-white/20 transition-all"
              >
                <span>{t("مراجعة الطلبات", "Review Requests")}</span>
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
                      ? t("تمت مزامنة البيانات المباشرة من Supabase بنجاح ✨", "Synced live data from Supabase ✨")
                      : t("تم تحديث البيانات بنجاح", "Data refreshed successfully")
                  );
                }}
                className="h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title={t("تحديث ومزامنة قاعدة البيانات", "Sync & Refresh Database")}
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
                {t("إجمالي التعاقدات النشطة", "Active Contracts Total")}
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {totalRevenue.toLocaleString("en-US")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">{t("ر.س", "SAR")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>{t("محدث تلقائياً من سجل الحجوزات", "Auto-synced from booking ledger")}</span>
            </div>
            <Progress value={capacityRate} className="h-2" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">
                {t("إجمالي الحجوزات المسجلة", "Total Registered Bookings")}
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {bookings.length}
              </span>
              <span className="text-xs text-[#524345]">{t("جلسة عرائس وسهرات", "bridal & soirée sessions")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-3">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {confirmedOrCompleted.length} {t("مؤكدة ومكتملة", "confirmed & completed")}
              </span>
            </div>
            <Progress value={confirmedRate} className="h-2" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">
                {t("العرابين والمبالغ المتبقية", "Deposits & Remaining Balances")}
              </span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
                <Crown className="h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <div>
                <span className="text-[#857374] block">{t("عرابين محصّلة:", "Deposits Collected:")}</span>
                <span className="text-lg font-bold text-[#2f020d]">
                  {totalDeposits.toLocaleString("en-US")} {t("ر.س", "SAR")}
                </span>
              </div>
              <div className="text-end">
                <span className="text-[#857374] block">{t("متبقٍ يوم المناسبة:", "Due on Event Day:")}</span>
                <span className="text-lg font-bold text-[#735c00]">
                  {totalRemaining.toLocaleString("en-US")} {t("ر.س", "SAR")}
                </span>
              </div>
            </div>
            <Progress value={depositRate} className="h-2 mt-4" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-[#fff0f1] p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#735c00]">
                {t("طلبات بانتظار العربون", "Awaiting Deposit")}
              </span>
              <Badge variant="gold" className="text-[10px]">
                {t("عاجل", "Urgent")}
              </Badge>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold font-serif text-[#2f020d]">
                  {pendingBookings.length}
                </span>
                <span className="text-xs text-[#524345]">{t("طلبات حجز وتثبيت", "pending booking requests")}</span>
              </div>
              <p className="text-[11px] text-[#524345]">
                {t("مرتبطة مباشرة بقاعدة البيانات والفواتير الرسمية", "Directly synced with database & official invoices")}
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-[#4a1521] hover:underline pt-3 inline-flex items-center gap-1"
            >
              <span>{t("فتح صندوق الاستقبال والفرز", "Open Inbox & Triage")}</span>
              <span>{lang === "en" ? "→" : "←"}</span>
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
                  {t(
                    `أحدث المواعيد النشطة (${activeBookingsSorted.length} موعد مرتبة بالتاريخ)`,
                    `Latest Active Sessions (${activeBookingsSorted.length} sorted by date)`
                  )}
                </h2>
              </div>
              <Badge variant="outline" className="text-[10px] bg-white">
                {t("فاصل انتقال 45 دقيقة ذكي", "Smart 45-min Travel Buffer")}
              </Badge>
            </div>

            {activeBookingsSorted.length === 0 ? (
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-8 text-center text-xs text-[#857374] space-y-2">
                <p>{t("لا توجد حجوزات نشطة حالياً في قاعدة البيانات.", "No active bookings in the database right now.")}</p>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1 text-[#735c00] font-bold hover:underline"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t("إضافة حجز جديد للبدء", "Add a new booking to start")}</span>
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
                                ? t("أتيليه", "Atelier")
                                : booking.locationType === "CLIENT_HOME"
                                  ? t("منزلي", "Home")
                                  : t("فندقي", "Hotel"))}
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
                                <span>{t("مكتملة الآن", "Completed")}</span>
                              </Badge>
                            ) : isConfirmed ? (
                              <Badge
                                variant="gold"
                                className="text-[10px] font-bold px-2.5 py-0.5 shadow-2xs shrink-0"
                              >
                                {t("مؤكد بالعربون", "Deposit Confirmed")}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-amber-50 text-amber-800 border-amber-300 font-bold px-2.5 py-0.5 shrink-0"
                              >
                                {t("بانتظار السداد", "Awaiting Payment")}
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
                              {booking.totalAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}
                            </span>
                            {booking.depositAmount > 0 && (
                              <span className="text-[10px] text-[#857374] font-normal">
                                ({t("عربون:", "Deposit:")} {booking.depositAmount.toLocaleString("en-US")} {t("ر.س", "SAR")})
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
                          <span>{t("تواصل مباشر", "WhatsApp")}</span>
                        </a>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenNotes(booking)}
                          className="rounded-full text-xs h-9 px-3.5 bg-white border-[#eedfe0] text-[#2f020d] hover:bg-[#fff0f1] font-semibold whitespace-nowrap"
                        >
                          {t("الملاحظات", "Notes")}
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
                          {isCompleted ? t("مكتمل ✓", "Completed ✓") : t("تم التوثيق", "Mark Complete")}
                        </Button>

                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                t(
                                  `هل أنتِ متأكدة من حذف حجز #${booking.ref.replace(/^#/, "")} نهائياً؟`,
                                  `Are you sure you want to permanently delete booking #${booking.ref.replace(/^#/, "")}?`
                                )
                              )
                            ) {
                              deleteBooking(booking.ref);
                            }
                          }}
                          title={t("حذف الحجز نهائياً", "Permanently delete booking")}
                          className="h-9 w-9 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
                                {t("فاصل التنقل وتجهيز الحقيبة الملكية:", "Travel & Royal Kit Prep Buffer:")}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-bold bg-white text-[#735c00] border-[#eedfe0] px-2"
                              >
                                {t("45 دقيقة", "45 mins")}
                              </Badge>
                            </div>
                            <p
                              className="text-[11px] text-[#524345] truncate mt-0.5"
                              title={`${t("من:", "From:")} ${booking.venue} → ${t("إلى:", "To:")} ${nextBooking.venue}`}
                            >
                              {t(
                                `المسار: من ${booking.venue.split("—")[0].trim()} ← إلى ${nextBooking.venue.split("—")[0].trim()}`,
                                `Route: From ${booking.venue.split("—")[0].trim()} → To ${nextBooking.venue.split("—")[0].trim()}`
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {t("حركة المرور: سلسة", "Traffic: Smooth")}
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
                  <span>
                    {t(
                      `تنبيهات العرابين المعلقة (${pendingBookings.length})`,
                      `Pending Deposit Alerts (${pendingBookings.length})`
                    )}
                  </span>
                </h3>
                {pendingBookings.length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
                )}
              </div>
              <p className="text-xs text-[#524345] leading-relaxed">
                {t(
                  "طلبات حجز بانتظار تحويل العربون لتثبيت الموعد رسمياً في الأجندة:",
                  "Booking requests awaiting deposit transfer to officially lock the date:"
                )}
              </p>

              {pendingBookings.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#f8fdf9] border border-emerald-200 text-center text-xs text-emerald-800">
                  {t(
                    "لا توجد طلبات معلقة بانتظار سداد العربون حالياً ✓",
                    "No pending deposit requests right now ✓"
                  )}
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
                        {t("معلق", "Pending")}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#524345] flex justify-between">
                      <span>{t("تاريخ المناسبة:", "Event Date:")} {hold.date}</span>
                      <span className="font-bold text-[#735c00]">
                        {t("العربون:", "Deposit:")} {hold.depositAmount.toLocaleString("en-US")} {t("ر.س", "SAR")}
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
                        <span>{t("تذكير واتساب سريع", "WhatsApp Reminder")}</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateBookingStatus(hold.ref, "CONFIRMED")
                        }
                        className="rounded-full text-[11px] h-8 bg-white text-[#2f020d] border border-[#eedfe0] font-bold"
                      >
                        {t("تثبيت يدوي", "Confirm")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateBookingStatus(hold.ref, "CANCELLED");
                          toast.success(
                            t(
                              "تم إفساح الموعد وإلغاء الحجز المعلق",
                              "Slot released and pending booking cancelled"
                            )
                          );
                        }}
                        className="rounded-full text-[11px] h-8 text-[#857374]"
                      >
                        {t("إفساح", "Release")}
                      </Button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              t(
                                `هل أنتِ متأكدة من حذف هذا الطلب المعلق #${hold.ref} نهائياً؟`,
                                `Are you sure you want to permanently delete pending request #${hold.ref}?`
                              )
                            )
                          ) {
                            deleteBooking(hold.ref);
                          }
                        }}
                        title={t("حذف الحجز نهائياً", "Permanently delete booking")}
                        className="h-8 w-8 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </Card>

            {/* Signature Look Spotlight */}
            {featuredLook && (
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-3">
                <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider block">
                  {t("إطلالة العروس الأكثر تميزاً من المعرض", "Signature Bridal Look Spotlight")}
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
          <DialogContent dir={dir} className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-start">
            {activeSessionBooking && (
              <>
                <DialogHeader className="text-start">
                  <DialogTitle className="text-lg font-bold text-[#2f020d]">
                    {t("ملاحظات الجلسة:", "Session Notes:")} {activeSessionBooking.clientName}
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
                            • <strong>{t("نوع البشرة:", "Skin Type:")}</strong> {cust.skinType} (
                            {cust.undertone})
                          </p>
                          <p>
                            • <strong>{t("المستحضرات المفضلة:", "Favorite Palette:")}</strong>{" "}
                            {cust.favoritePalette}
                          </p>
                          {cust.allergies && (
                            <p className="text-rose-700">
                              • <strong>{t("تنبيه تحسس:", "Allergy Alert:")}</strong> {cust.allergies}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-[#2f020d] block">
                          {t("ملاحظات خبيرة التجميل لملف العميلة:", "Makeup Artist Notes for Client Profile:")}
                        </label>
                        <textarea
                          rows={3}
                          value={activeCustomerNotesDraft}
                          onChange={(e) =>
                            setActiveCustomerNotesDraft(e.target.value)
                          }
                          className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                          placeholder={t(
                            "أدخلي تفاصيل الفاونديشن وتفضيلات المكياج...",
                            "Enter foundation shades and makeup preferences..."
                          )}
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
                    {t("إلغاء", "Cancel")}
                  </Button>
                  <Button
                    onClick={handleSaveCustomerNotes}
                    className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-1"
                  >
                    <Save className="w-3.5 h-3.5 text-[#fed65b]" />
                    <span>{t("حفظ الملاحظة", "Save Note")}</span>
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
