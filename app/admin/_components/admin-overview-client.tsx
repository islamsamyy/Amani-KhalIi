"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
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
  LayoutDashboard,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MessageCircle,
  Navigation,
  FileText,
  MapPin,
  TrendingUp,
  RefreshCw,
  Send,
  Hotel,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

export function AdminOverviewClient() {
  const {
    bookings,
    invoices,
    updateBookingStatus,
    refreshFromDatabase,
    isSupabaseConnected,
    isSyncing,
  } = useAppStore();
  const [activeSessionNoteModal, setActiveSessionNoteModal] = useState<string | null>(null);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING_PAYMENT");
  const totalRevenue = bookings
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const totalDeposits = invoices.reduce((sum, i) => sum + i.depositPaid, 0);
  const totalRemaining = invoices.reduce((sum, i) => sum + i.remainingBalance, 0);

  const sendWhatsAppReminder = (clientName: string, phone: string) => {
    toast.success(`تم إرسال تذكير سداد العربون للعميلة ${clientName} عبر الواتساب بنجاح 💬`);
  };

  const markSessionVerified = (ref: string) => {
    updateBookingStatus(ref, "COMPLETED");
  };

  return (
    <div dir="rtl" className="lg:pe-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-8">
        {/* 1. Executive Greeting Bar */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#4a1521] via-[#2f020d] to-[#1b120e] text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed65b] text-[#241a00] text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#735c00] animate-ping" />
                  <span>الأتيليه جاهز • موسم الخريف 2025</span>
                </span>
                <span className="text-xs text-[#eedfe0]">
                  الخميس، 9 أكتوبر 2025 | الرياض GMT+3 (10:15 صباحاً)
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif">
                صباح الخير، أماني ✨
              </h1>
              <p className="text-xs sm:text-sm text-[#eedfe0] max-w-2xl leading-relaxed">
                جدول اليوم مكتمل الطاقة التشغيلية: <strong className="text-[#fed65b]">جلستان تجهيز عرائس (2/2)</strong> في الأجنحة الفندقية، بالإضافة إلى جلسة استشارة تجريبية مغلقة بالأتيليه.
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
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </section>

        {/* 2. Vital KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">إجمالي التعاقدات النشطة</span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold font-serif text-[#2f020d]">
                {totalRevenue.toLocaleString("ar-SA")}
              </span>
              <span className="text-xs font-bold text-[#735c00]">ر.س</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mb-3">
              <TrendingUp className="h-4 w-4" />
              <span>محدث تلقائياً من سجل الحجوزات</span>
            </div>
            <Progress value={84} className="h-2" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">إجمالي الحجوزات المسجلة</span>
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
              <span>{bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED").length} مؤكدة ومكتملة</span>
            </div>
            <Progress value={98} className="h-2" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#524345]">العرابين والمبالغ المتبقية</span>
              <div className="h-10 w-10 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
                <Crown className="h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-between items-baseline mb-2 text-xs">
              <div>
                <span className="text-[#857374] block">عرابين محصّلة:</span>
                <span className="text-lg font-bold text-[#2f020d]">
                  {totalDeposits.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
              <div className="text-left">
                <span className="text-[#857374] block">متبقٍ يوم المناسبة:</span>
                <span className="text-lg font-bold text-[#735c00]">
                  {totalRemaining.toLocaleString("ar-SA")} ر.س
                </span>
              </div>
            </div>
            <Progress value={65} className="h-2 mt-4" />
          </Card>

          <Card className="rounded-3xl border border-[#eedfe0] bg-[#fff0f1] p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#735c00]">طلبات بانتظار العربون</span>
              <Badge variant="gold" className="text-[10px]">عاجل</Badge>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold font-serif text-[#2f020d]">{pendingBookings.length}</span>
                <span className="text-xs text-[#524345]">طلبات حجز وتثبيت</span>
              </div>
              <p className="text-[11px] text-[#524345]">مرتبطة مباشرة بجدول الحجوزات والفواتير</p>
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
          {/* Today's Schedule (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#735c00]" />
                <h2 className="text-lg font-bold text-[#2f020d]">جلسات ومواعيد اليوم (3 مواعيد)</h2>
              </div>
              <Badge variant="outline" className="text-[10px] bg-white">
                فواصل انتقال ذكية 45 دقيقة
              </Badge>
            </div>

            {/* Session 1 */}
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#faeaeb] text-[#2f020d] flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] text-[#857374]">الصباح</span>
                  <span className="text-base font-serif">11:00</span>
                  <span className="text-[9px] text-[#735c00]">أتيليه</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#2f020d]">نورة بنت مساعد آل سعود</h3>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                      مكتملة الآن
                    </Badge>
                  </div>
                  <p className="text-xs text-[#524345] flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#735c00]" />
                    <span>أتيليه أماني خليل الخاص — جناح الاستشارات رقم 1</span>
                  </p>
                  <p className="text-[11px] text-[#735c00] mt-1">جلسة استشارة وتجربة مكياج (Trial)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveSessionNoteModal("نورة بنت مساعد آل سعود")}
                  className="rounded-full text-xs"
                >
                  الملاحظات
                </Button>
                <Button
                  size="sm"
                  onClick={() => markSessionVerified("AK-2025-4819")}
                  className="rounded-full bg-[#faeaeb] text-[#2f020d] hover:bg-[#eedfe0] text-xs font-bold"
                >
                  تم التوثيق
                </Button>
              </div>
            </Card>

            {/* Travel Buffer Notice */}
            <div className="px-5 py-2.5 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] text-xs text-[#524345] flex items-center justify-between">
              <span className="font-semibold text-[#735c00]">
                🚗 فاصل التنقل وتجهيز الحقيبة الملكية: 45 دقيقة (من الأتيليه إلى فندق الريتز-كارلتون)
              </span>
              <span className="text-[11px] text-[#857374]">حركة المرور: سلسة</span>
            </div>

            {/* Session 2: Royal Bridal Prep */}
            <Card className="rounded-3xl border-2 border-[#735c00] bg-[#fff8f7] p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#4a1521] text-white flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] text-[#fed65b]">عصراً</span>
                  <span className="text-base font-serif">02:30</span>
                  <span className="text-[9px] text-[#ffd9dd]">فندقي</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#2f020d]">العروس: سارة الفهيد</h3>
                    <Badge variant="gold" className="text-[10px]">
                      باقة العروس الملكية VIP
                    </Badge>
                  </div>
                  <p className="text-xs text-[#524345] flex items-center gap-1">
                    <Hotel className="h-3.5 w-3.5 text-[#735c00]" />
                    <span>فندق الريتز-كارلتون، الرياض — الجناح الملكي 412</span>
                  </p>
                  <p className="text-[11px] text-[#4a1521] font-semibold mt-1">
                    فريق المساعدات: مروة (شعر) + هالة (رتوش مرافقة)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href="https://wa.me/966551234567"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 px-4 rounded-full bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>تواصل مباشر</span>
                </a>
                <Button
                  size="sm"
                  onClick={() => toast.success("جارٍ فتح مسار الملاحة للجناح الملكي")}
                  className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-1"
                >
                  <Navigation className="h-3.5 w-3.5 text-[#fed65b]" />
                  <span>الملاحة للجناح</span>
                </Button>
              </div>
            </Card>

            {/* Travel Buffer Notice 2 */}
            <div className="px-5 py-2.5 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] text-xs text-[#524345] flex items-center justify-between">
              <span className="font-semibold text-[#735c00]">
                🚗 فاصل التنقل الفندقي: 45 دقيقة (من الريتز-كارلتون إلى فندق فورسيزونز برج المملكة)
              </span>
              <span className="text-[11px] text-amber-700">ذروة مرورية مسائية متوقعة</span>
            </div>

            {/* Session 3 */}
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#faeaeb] text-[#2f020d] flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] text-[#857374]">مساءً</span>
                  <span className="text-base font-serif">06:45</span>
                  <span className="text-[9px] text-[#735c00]">فندقي</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#2f020d]">سمو الأميرة ريم بن فهد</h3>
                    <Badge variant="outline" className="text-[10px] bg-[#faeaeb]">
                      مكياج سهرة VIP ملكي
                    </Badge>
                  </div>
                  <p className="text-xs text-[#524345] flex items-center gap-1">
                    <Hotel className="h-3.5 w-3.5 text-[#735c00]" />
                    <span>فندق فورسيزونز، برج المملكة — قاعة كبار الشخصيات</span>
                  </p>
                  <p className="text-[11px] text-[#735c00] mt-1">بانتظار وصول الفريق</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("تم إرسال إشعار للمنسقة")}
                  className="rounded-full text-xs"
                >
                  المنسقة
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveSessionNoteModal("سمو الأميرة ريم بن فهد")}
                  className="rounded-full text-xs font-bold"
                >
                  تفاصيل الإطلالة
                </Button>
              </div>
            </Card>
          </div>

          {/* Urgent Holds Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eedfe0]">
                <h3 className="text-sm font-bold text-[#ba1a1a] flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>تنبيهات العرابين المعلقة</span>
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
              </div>
              <p className="text-xs text-[#524345] leading-relaxed">
                حجوزات بانتظار تحويل العربون خلال الـ 12 ساعة القادمة قبل إتاحة الموعد تلقائياً لقائمة الانتظار:
              </p>

              {/* Hold Item 1 */}
              <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#2f020d]">العنود الشمري</span>
                  <Badge variant="outline" className="text-[10px] bg-[#ffdad6] text-[#93000a] border-none font-bold">
                    باقي 3 ساعات
                  </Badge>
                </div>
                <div className="text-[11px] text-[#524345] flex justify-between">
                  <span>تاريخ العرس: 28 نوفمبر 2025</span>
                  <span className="font-bold text-[#735c00]">العربون: 1,080 ر.س</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => sendWhatsAppReminder("العنود الشمري", "0561122334")}
                    className="flex-1 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-[11px] h-8"
                  >
                    <Send className="h-3 w-3 ms-1" />
                    <span>تذكير واتساب سريع</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success("تم إفساح الموعد وإلغاء الحجز المعلق")}
                    className="rounded-full text-[11px] h-8 text-[#857374]"
                  >
                    إفساح
                  </Button>
                </div>
              </div>

              {/* Hold Item 2 */}
              <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#2f020d]">د. رزان المقرن</span>
                  <Badge variant="outline" className="text-[10px] bg-[#ffe088] text-[#241a00] border-none font-bold">
                    باقي 7 ساعات
                  </Badge>
                </div>
                <div className="text-[11px] text-[#524345] flex justify-between">
                  <span>تاريخ المناسبة: 12 ديسمبر 2025</span>
                  <span className="font-bold text-[#735c00]">العربون: 420 ر.س</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => sendWhatsAppReminder("د. رزان المقرن", "0559988776")}
                    className="flex-1 rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] text-[#2f020d] text-[11px] h-8 font-bold"
                  >
                    <MessageCircle className="h-3 w-3 ms-1 text-[#735c00]" />
                    <span>إرسال إشعار الدفع</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus("AK-2025-1992", "CONFIRMED")}
                    className="rounded-full text-[11px] h-8 bg-white text-[#2f020d] border border-[#eedfe0] font-bold"
                  >
                    تثبيت يدوي
                  </Button>
                </div>
              </div>
            </Card>

            {/* Signature Look Spotlight */}
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-3">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider block">
                إطلالة العروس الأكثر تميزاً هذا الأسبوع
              </span>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBsAGcs_awev92ZT2Mi6dY05VdBYQcCp-1Rf3SyuGFcSlRMD7Xu1bQ5ToymWmKy55wAfmdv17GExTP1qCaSNdhNMgrLkhBmHJy-SroDXt_nljfrgMWsxhW9j7CFapkyPhw28yOSjKJ0PHJLUgdTk6jfXXyqoHiejneKWotopn52bA_7X0IogtOStcGbYH21Zq6aQ5pNHJc5rHDn73aDMKCXwbsiDDqYfAsfHcRxLQ"
                  alt="Bride Signature Look"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <p className="text-xs font-bold text-[#fed65b]">مكياج الملكي الناعم (Signature Glow)</p>
                    <p className="text-[10px] text-[#ffd9dd]">العروس ديما — قصر الثقافة</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Notes Dialog */}
        <Dialog
          open={activeSessionNoteModal !== null}
          onOpenChange={(open) => !open && setActiveSessionNoteModal(null)}
        >
          <DialogContent className="max-w-md bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
            <DialogHeader className="text-right">
              <DialogTitle className="text-lg font-bold text-[#2f020d]">
                ملاحظات الجلسة: {activeSessionNoteModal}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#524345]">
                تفاصيل درجات الفاونديشن وتفضيلات الملامح المسجلة في ملف العميلة.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-3 text-xs text-[#211a1b]">
              <p>• <strong>البشرة:</strong> مهيأة بسيروم الكولاجين والترطيب المزدوج.</p>
              <p>• <strong>الفاونديشن:</strong> Dior Backstage درجتي 2W + 2.5N مدمجة.</p>
              <p>• <strong>العيون:</strong> آيلاينر كلاسيكي مجنح مع رموش Mink خفيفة 12mm.</p>
              <p>• <strong>الشفاه:</strong> Charlotte Tilbury Pillow Talk Medium مع كونتور نيود.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => {
                  toast.success("تم حفظ الملاحظات وتحديثها في ملف العميلة");
                  setActiveSessionNoteModal(null);
                }}
                className="rounded-full bg-[#4a1521] text-white text-xs font-bold"
              >
                إغلاق وحفظ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

