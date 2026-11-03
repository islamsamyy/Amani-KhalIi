"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Save,
  ShieldCheck,
  MapPin,
  Clock,
  MessageCircle,
  Building,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export function AdminSettingsClient() {
  const { areas } = useAppStore();

  const [atelierName, setAtelierName] = useState(
    "أتيليه أماني خليل — Haute Beauté"
  );
  const [atelierPhone, setAtelierPhone] = useState("+966 50 128 4492");
  const [depositPct, setDepositPct] = useState(30);
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(2);
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    "مرحباً بكِ في أماني خليل. تم استلام طلب حجزكِ الملكي بنجاح، ومرفق لكِ العقد الموثق والفاتورة الرسمية."
  );

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("amani_admin_settings_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.atelierName) setAtelierName(parsed.atelierName);
        if (parsed.atelierPhone) setAtelierPhone(parsed.atelierPhone);
        if (parsed.depositPct) setDepositPct(parsed.depositPct);
        if (parsed.maxSessionsPerDay) setMaxSessionsPerDay(parsed.maxSessionsPerDay);
        if (parsed.whatsappTemplate) setWhatsappTemplate(parsed.whatsappTemplate);
      }
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "amani_admin_settings_v1",
        JSON.stringify({
          atelierName,
          atelierPhone,
          depositPct,
          maxSessionsPerDay,
          whatsappTemplate,
        })
      );
    } catch {}
    toast.success("تم حفظ إعدادات النظام والصلاحيات بنجاح في قاعدة البيانات المحلية ✨");
  };

  return (
    <div dir="rtl" className="lg:pr-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">إعدادات النظام والصلاحيات</h1>
            <p className="text-xs text-[#524345] mt-1">
              ضبط سياسات الحجز، نسب العرابين، صلاحيات الفريق، وقوالب إشعارات الواتساب الرسمية.
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-1.5 shadow-md px-6 self-start sm:self-auto cursor-pointer"
          >
            <Save className="h-4 w-4 text-[#fed65b]" />
            <span>حفظ كافة التغييرات</span>
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-[#faeaeb] p-1 rounded-full flex flex-wrap gap-1 mb-6">
            <TabsTrigger value="general" className="rounded-full text-xs font-semibold px-4">
              بيانات الأتيليه وساعات العمل
            </TabsTrigger>
            <TabsTrigger value="booking_rules" className="rounded-full text-xs font-semibold px-4">
              العربون وقواعد الحجز
            </TabsTrigger>
            <TabsTrigger value="areas" className="rounded-full text-xs font-semibold px-4">
              تغطية أحياء الرياض
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="rounded-full text-xs font-semibold px-4">
              قوالب الواتساب والصلاحيات
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: General Info */}
          <TabsContent value="general">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-[#2f020d]">بيانات العمل الرسمية</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">اسم الأتيليه / العلامة</label>
                  <input
                    type="text"
                    value={atelierName}
                    onChange={(e) => setAtelierName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">رقم الواتساب المعتمد</label>
                  <input
                    type="text"
                    value={atelierPhone}
                    onChange={(e) => setAtelierPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">الحد الأقصى للجلسات اليومية لكل خبيرة</label>
                  <input
                    type="number"
                    value={maxSessionsPerDay}
                    onChange={(e) => setMaxSessionsPerDay(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                  <span className="text-[11px] text-[#857374] block mt-1">تفرغ تام: جلستان كحد أقصى لضمان راحة العرائس وجودة الدمج.</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">فاصل التنقل التلقائي بين المواعيد</label>
                  <input
                    type="text"
                    disabled
                    value="٤٥ دقيقة (محسوبة ذكياً)"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-gray-50 text-xs text-[#524345]"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 2: Booking & Deposit Rules */}
          <TabsContent value="booking_rules">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-[#2f020d]">قواعد العربون وتثبيت التواريخ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">نسبة العربون الافتراضية (%)</label>
                  <input
                    type="number"
                    value={depositPct}
                    onChange={(e) => setDepositPct(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                  <span className="text-[11px] text-[#735c00] block mt-1">النسبة المعتمدة: ٣٠٪ من إجمالي الباقة والخدمات.</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">مهلة تحويل العربون قبل إفساح الموعد</label>
                  <input
                    type="text"
                    disabled
                    value="١٢ ساعة تلقائياً"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-gray-50 text-xs text-[#524345]"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Tab 3: Areas & Fees */}
          <TabsContent value="areas">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#2f020d]">أحياء الرياض المعتمدة وبدل التنقل</h3>
              <div className="space-y-3">
                {areas.map((area) => (
                  <div key={area.id} className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-[#2f020d]">{area.nameAr}</h4>
                      <span className="text-[11px] text-[#857374]">{area.zone}</span>
                    </div>
                    <Badge variant="gold" className="text-xs">
                      {area.travelFee === 0 ? "مجاني مشمول" : `+${area.travelFee} ر.س`}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab 4: WhatsApp & Roles */}
          <TabsContent value="whatsapp">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#2f020d]">قالب رسالة تأكيد الحجز (WhatsApp)</h3>
                <p className="text-xs text-[#524345]">يتم إرسال هذا النص فورياً للعروس عند سداد العربون وتأكيد الحجز.</p>
              </div>

              <textarea
                rows={4}
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                className="w-full p-4 rounded-2xl border border-[#eedfe0] bg-[#fff8f7] text-xs focus:outline-none focus:border-[#735c00] leading-relaxed"
              />

              <div className="pt-4 border-t border-[#eedfe0] space-y-3">
                <h4 className="text-xs font-bold text-[#2f020d]">أذونات وصلاحيات الفريق:</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fff0f1]">
                    <span>صلاحية المالك الكاملة (أماني خليل - Owner)</span>
                    <Badge variant="gold" className="text-[10px]">كافة الصلاحيات</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fff0f1]">
                    <span>صلاحية المنسقة (إدارة المواعيد وتذكير العميلات فقط)</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

