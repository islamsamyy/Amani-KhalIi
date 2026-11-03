"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  Send,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export function ContactClient() {
  const { areas } = useAppStore();

  // Consultation form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("باقة العروس الملكية VIP");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("area_hitin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم إرسال طلب استشارتكِ بنجاح ✨", {
      description: "سيتواصل معكِ فريق أماني خليل عبر الواتساب خلال أقل من ساعتين.",
    });
    setName("");
    setPhone("");
    setEventDate("");
    setMessage("");
  };

  const selectedArea = areas.find((a) => a.id === selectedAreaId) || areas[0];

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            تواصل مباشر • شفافية كاملة
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            تواصل والسياسات وشروط الحجز
          </h1>
          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            نسعد بالتواصل معكِ للإجابة عن كافة التساؤلات، وتوضيح سياسات تثبيت المواعيد والعربون لضمان حقوقكِ كاملة.
          </p>
        </div>
      </section>

      {/* 2. Direct Channels Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="https://wa.me/966501284492"
            target="_blank"
            rel="noreferrer"
            className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover:shadow-md hover:border-[#25D366] transition-all flex flex-col items-start gap-3 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors flex items-center justify-center font-bold">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="text-xs text-[#735c00] font-bold">واتساب رسمي مباشر</span>
            <h3 className="text-sm font-bold text-[#2f020d]">+966 50 128 4492</h3>
            <p className="text-[11px] text-[#524345]">رد فوري وتأكيد عقود الحجوزات</p>
          </a>

          <a
            href="tel:+966501284492"
            className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm hover:shadow-md hover:border-[#735c00] transition-all flex flex-col items-start gap-3 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-[#faeaeb] text-[#4a1521] group-hover:bg-[#4a1521] group-hover:text-white transition-colors flex items-center justify-center font-bold">
              <Phone className="h-6 w-6" />
            </div>
            <span className="text-xs text-[#735c00] font-bold">اتصال هاتفي</span>
            <h3 className="text-sm font-bold text-[#2f020d]">+966 50 128 4492</h3>
            <p className="text-[11px] text-[#524345]">من ١٠:٠٠ ص حتى ١٠:٠٠ م</p>
          </a>

          <div className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#faeaeb] text-[#735c00] flex items-center justify-center font-bold">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-xs text-[#735c00] font-bold">المقر والزيارات</span>
            <h3 className="text-sm font-bold text-[#2f020d]">الرياض، المملكة العربية السعودية</h3>
            <p className="text-[11px] text-[#524345]">أتيليه خاص بشمال الرياض + تغطية الفنادق</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#eedfe0] shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#faeaeb] text-[#4a1521] flex items-center justify-center font-bold">
              <Mail className="h-6 w-6" />
            </div>
            <span className="text-xs text-[#735c00] font-bold">البريد الرسمي</span>
            <h3 className="text-sm font-bold text-[#2f020d]">contact@amanikhalil.sa</h3>
            <p className="text-[11px] text-[#524345]">للشراكات والفعاليات الكبرى</p>
          </div>
        </div>
      </section>

      {/* 3. Form + Neighborhood Travel Estimator */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form (7 cols) */}
          <Card className="lg:col-span-7 rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-10 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">نموذج الاستشارة</span>
              <h2 className="text-2xl font-bold font-serif text-[#2f020d] mt-1">
                احصلي على استشارة مخصصة لمناسبتكِ
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">اسمكِ الكريم</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: منيرة بنت سعد"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">رقم الجوال (واتساب)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">الخدمة المطلوبة</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  >
                    <option value="باقة العروس الملكية VIP">باقة العروس الملكية VIP</option>
                    <option value="باقة الملكة والخطوبة الفاخرة">باقة الملكة والخطوبة</option>
                    <option value="مكياج السهرات والمناسبات VIP">مكياج سهرة VIP</option>
                    <option value="جلسة التجربة والاستشارة (Trial)">جلسة التجربة Trial</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">تاريخ المناسبة التقريبي</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">تفاصيل إضافية أو استفسارات:</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="مقر الحفل (فندق أو قصر)، عدد المرافقات إن وجد، أو أي متطلبات خاصة بالبشرة..."
                  className="w-full p-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00] leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4 text-[#fed65b]" />
                <span>إرسال طلب الاستشارة وسنتواصل معكِ فوراً</span>
              </Button>
            </form>
          </Card>

          {/* Riyadh Travel Fee Estimator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-3xl border border-[#eedfe0] bg-[#fff0f1] p-6 sm:p-8">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider block mb-2">
                حاسبة بدل التنقل بالرياض
              </span>
              <h3 className="text-lg font-bold text-[#2f020d] mb-4">
                تغطية الأحياء وبدل التنقل
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#524345] block mb-1.5">اختاري منطقتكِ بالرياض:</label>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => setSelectedAreaId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs font-semibold focus:outline-none focus:border-[#735c00]"
                  >
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nameAr} ({a.zone})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#eedfe0] space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[#524345]">
                    <span>المنطقة:</span>
                    <span className="font-bold text-[#2f020d]">{selectedArea.nameAr}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#524345]">
                    <span>بدل الانتقال لحجوزات السهرة:</span>
                    <span className="font-bold text-[#735c00]">
                      {selectedArea.travelFee === 0 ? "مجاناً بالكامل" : `${selectedArea.travelFee} ر.س`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#4a1521] font-bold pt-2 border-t border-[#eedfe0]">
                    <span>باقة العروس الملكية VIP:</span>
                    <span className="text-emerald-600">✓ مشمول ومجاني لكافة الأحياء</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="p-6 rounded-3xl bg-white border border-[#eedfe0] space-y-3">
              <h4 className="text-xs font-bold text-[#2f020d] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#735c00]" />
                <span>عقد إلكتروني موثق</span>
              </h4>
              <p className="text-xs text-[#524345] leading-relaxed">
                فور سداد عربون الحجز، يصلكِ إلكترونياً عقد حجز موثق ومفصل يحتوي على شروط الجلسة، رقم المرجع،
                والموعد المؤكد لضمان راحة بالكِ التامة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Official Policies Tabs */}
      <section className="py-16 bg-[#fff0f1] border-t border-[#eedfe0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
              الشفافية وحفظ الحقوق
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              السياسات والشروط المعتمدة
            </h2>
          </div>

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="bg-white p-1 rounded-full border border-[#eedfe0] flex flex-wrap justify-center gap-1 mb-8">
              <TabsTrigger value="deposit" className="rounded-full text-xs font-semibold px-4">
                تثبيت الموعد والعربون
              </TabsTrigger>
              <TabsTrigger value="reschedule" className="rounded-full text-xs font-semibold px-4">
                التأجيل وتعديل التاريخ
              </TabsTrigger>
              <TabsTrigger value="privacy" className="rounded-full text-xs font-semibold px-4">
                الخصوصية وسرية الصور
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit">
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 space-y-4 text-xs text-[#524345] leading-relaxed">
                <h3 className="text-base font-bold text-[#2f020d]">سياسة العربون والتثبيت الرسمي:</h3>
                <p>• يُعتبر الموعد مؤكداً ونهائياً فور سداد عربون ٣٠٪ من قيمة الباقة المختارة عبر قنوات الدفع المعتمدة (مدى، Apple Pay، أو تحويل بنكي رسمي).</p>
                <p>• نظراً لالتزامنا باستقبال عروس واحدة فقط يومياً، فإن التاريخ يُغلق فورياً في النظام ويُعتذر عن قبول أي طلبات أخرى لنفس اليوم.</p>
                <p>• العربون غير مسترد نقداً في حال الإلغاء، لكن يمكن تحويله بالكامل كرصيد دائن يُستخدم لأي خدمة أخرى خلال مدة تصل إلى ٦ أشهر كاملة.</p>
              </Card>
            </TabsContent>

            <TabsContent value="reschedule">
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 space-y-4 text-xs text-[#524345] leading-relaxed">
                <h3 className="text-base font-bold text-[#2f020d]">سياسة تغيير التاريخ والتأجيل:</h3>
                <p>• تقديراً للظروف الطارئة التي قد تواجه العروس، يُتاح تأجيل الموعد لمرة واحدة دون أي رسوم إضافية.</p>
                <p>• يُشترط إشعارنا قبل موعد المناسبة بـ ٢١ يوماً على الأقل لضمان إعادة ترتيب الجدول الزمني.</p>
                <p>• يخضع التاريخ الجديد البديل لمدى توفره في جدول المواعيد المعتمد لدى أماني خليل.</p>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 space-y-4 text-xs text-[#524345] leading-relaxed">
                <h3 className="text-base font-bold text-[#2f020d]">سرية وخصوصية الصور التامة:</h3>
                <p>• خصوصية العروس وسيدات الرياض خط أحمر والتزام مهني مطلق.</p>
                <p>• لا يتم تصوير أو نشر أي صورة أو مقطع فيديو لوجه العميلة على الإطلاق إلا بعد موافقة كتابية واضحة ومسبقة.</p>
                <p>• كافة صور المعرض المنشورة على هذا الموقع تم التقاطها ونشرها بإذن ورضا كامل من العميلات الكريمات.</p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

