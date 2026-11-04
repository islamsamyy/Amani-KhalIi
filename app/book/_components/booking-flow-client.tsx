"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Crown,
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Building,
  Hotel,
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export function BookingFlowClient() {
  const router = useRouter();
  const {
    packages,
    addons,
    areas,
    blockedDates,
    selectedPackageId,
    setSelectedPackageId,
    createBooking,
  } = useAppStore();

  const [step, setStep] = useState(1);

  // Form selections
  const [selectedPkgId, setSelectedPkgId] = useState(selectedPackageId || "vip-bridal");
  const [selectedDate, setSelectedDate] = useState("2025-10-18");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("عصراً (02:00 م)");
  const [locationType, setLocationType] = useState<"HOTEL_HALL" | "CLIENT_HOME" | "STUDIO">("HOTEL_HALL");
  const [venueName, setVenueName] = useState("فندق الريتز-كارلتون، الرياض");
  const [selectedAreaId, setSelectedAreaId] = useState("area_hotels_vip");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    "addon_hair",
    "addon_facial",
  ]);
  const [skinType, setSkinType] = useState("جافة");
  const [allergyNotes, setAllergyNotes] = useState("");
  const [brideName, setBrideName] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Apple Pay" | "mada" | "تحويل بنكي">("Apple Pay");
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Sync selectedPackageId if changed from store
  useEffect(() => {
    if (selectedPackageId) {
      setSelectedPkgId(selectedPackageId);
    }
  }, [selectedPackageId]);

  const pkg = packages.find((p) => p.id === selectedPkgId) || packages[0];
  const area = areas.find((a) => a.id === selectedAreaId) || areas[0];

  // Pricing calculations
  const basePrice = pkg.price;
  const isVipBridal = pkg.id === "vip-bridal";
  const travelFee = isVipBridal || locationType === "STUDIO" ? 0 : area.travelFee;

  let addonsTotal = 0;
  for (const aid of selectedAddonIds) {
    const item = addons.find((a) => a.id === aid);
    if (item) addonsTotal += item.price;
  }

  const grandTotal = basePrice + addonsTotal + travelFee;
  // Display-only estimate; the database recomputes the authoritative price in create_booking().
  const depositTotal = Math.round((grandTotal * (pkg.depositPercentage ?? 30)) / 100);
  const remainingTotal = grandTotal - depositTotal;

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const finalName = brideName.trim() || (document.getElementById("bride-name") as HTMLInputElement)?.value?.trim() || "العنود بنت خالد";
    const finalPhone = bridePhone.trim() || (document.getElementById("bride-phone") as HTMLInputElement)?.value?.trim() || "0559876543";

    if (!finalName) {
      toast.error("يرجى إدخال اسم العروس الكريم لتأكيد الحجز");
      return;
    }
    if (!finalPhone) {
      toast.error("يرجى إدخال رقم الجوال المعتمد للتواصل واستلام العقد");
      return;
    }

    const booking = createBooking({
      clientName: finalName,
      phone: finalPhone,
      packageId: pkg.id,
      packageName: pkg.title,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      locationType,
      venue: venueName || "الرياض — خدمة ملكية خاصة",
      areaId: selectedAreaId,
      totalAmount: grandTotal,
      depositAmount: depositTotal,
      remainingAmount: remainingTotal,
      status: "CONFIRMED",
      addonIds: selectedAddonIds,
      notes: `نوع البشرة: ${skinType}. ملاحظات: ${allergyNotes}`,
      paymentMethod,
      skinType,
    });

    // Also set sessionStorage for cross-page persistence
    try {
      sessionStorage.setItem(
        "amani_last_booking",
        JSON.stringify({
          ref: booking.ref,
          brideName: finalName,
          bridePhone: finalPhone,
          pkgTitle: pkg.title,
          date: `${selectedDate} • ${selectedTimeSlot}`,
          venue: venueName,
          grandTotal,
          deposit: depositTotal,
          remaining: remainingTotal,
        })
      );
    } catch {}
    try {
      // Persist ref + phone + name so the confirmation page can reload the booking.
      localStorage.setItem(
        "amani_booking_lookup",
        JSON.stringify({ ref: booking.ref, phone: finalPhone, name: finalName })
      );
    } catch {}

    toast.success("تم استقبال طلب حجزكِ الملكي بنجاح 💍", {
      description: "جارٍ نقلكِ إلى صفحة تأكيد الحجز والفاتورة الرسمية...",
    });

    setTimeout(() => {
      router.push(
        `/book/confirmation?ref=${encodeURIComponent(booking.ref)}&name=${encodeURIComponent(finalName)}&phone=${encodeURIComponent(finalPhone)}`
      );
    }, 800);
  };

  // Expose window.submitBooking for automated test compatibility
  useEffect(() => {
    // @ts-expect-error test compatibility
    window.submitBooking = handleSubmit;
  });

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <Badge variant="gold" className="mb-3">
            حجز محمي ومعتمد • ترخيص وثيقة عمل حر
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
            حجز موعدكِ الفاخر | خطوتكِ الأولى نحو إطلالة لا تُنسى
          </h1>
          <p className="text-xs sm:text-sm text-[#eedfe0] max-w-xl mx-auto mt-2 leading-relaxed">
            تجربة حجز سلسة وشفافة تضمن لكِ تثبيت موعدكِ بدقة وسرية تامة مع خبيرة التجميل أماني خليل في الرياض.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-[#eedfe0]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#fed65b]" />
              <span>عروس واحدة يومياً للتفرغ التام</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#fed65b]" />
              <span>مستحضرات عالمية فاخرة ١٠٠٪</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-[#fed65b]" />
              <span>ضمان سرية وخصوصية الصور ١٠٠٪</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Stepper Wizard Bar */}
      <section className="bg-white border-b border-[#eedfe0] sticky top-20 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3">
          <div className="grid grid-cols-4 text-center text-xs font-bold">
            {[
              { s: 1, title: "اختيار الباقة الملكية", sub: "الخطوة ١" },
              { s: 2, title: "الموعد ومقر الخدمة", sub: "الخطوة ٢" },
              { s: 3, title: "الإضافات واستمارة البشرة", sub: "الخطوة ٣" },
              { s: 4, title: "الدفع وتأكيد الحجز", sub: "الخطوة ٤" },
            ].map((st) => (
              <button
                key={st.s}
                type="button"
                onClick={() => setStep(st.s)}
                className={`py-2 px-1 rounded-2xl transition-all cursor-pointer ${
                  step === st.s
                    ? "bg-[#4a1521] text-white shadow-sm"
                    : step > st.s
                    ? "text-[#735c00] hover:bg-[#faeaeb]"
                    : "text-[#857374] hover:bg-[#fff8f7]"
                }`}
              >
                <span className="text-[10px] block opacity-80">{st.sub}</span>
                <span className="text-xs truncate block">{st.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main Wizard Grid (8 cols Steps + 4 cols Sticky Summary) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Wizard Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Package Selection */}
            <div className={step === 1 ? "block" : "hidden"}>
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">الخطوة ١ من ٤</span>
                  <h2 className="text-xl font-bold text-[#2f020d] mt-1">اختاري باقة الجمال الملكية</h2>
                  <p className="text-xs text-[#524345]">اختاري الباقة المناسبة لمناسبتكِ؛ يمكن إضافة خدمات أخرى في الخطوة التالية.</p>
                </div>

                <div className="space-y-4">
                  {packages.map((p) => {
                    const isSelected = selectedPkgId === p.id;
                    return (
                      <label
                        key={p.id}
                        onClick={() => setSelectedPkgId(p.id)}
                        className={`p-6 rounded-3xl border cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isSelected
                            ? "border-2 border-[#4a1521] bg-[#fff0f1] ring-1 ring-[#4a1521] shadow-md"
                            : "border-[#eedfe0] hover:bg-[#fff8f7]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="package_selection"
                            data-title={p.title}
                            value={p.price}
                            checked={isSelected}
                            onChange={() => setSelectedPkgId(p.id)}
                            className="mt-1 text-[#4a1521] focus:ring-[#735c00]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#2f020d]">{p.title}</h3>
                              {p.popular && (
                                <Badge variant="gold" className="text-[10px]">الأكثر طلباً</Badge>
                              )}
                            </div>
                            <p className="text-xs text-[#524345] mt-1 leading-relaxed max-w-lg">
                              {p.description}
                            </p>
                            <span className="text-[11px] text-[#735c00] font-semibold mt-2 block">
                              مدة الجلسة: {p.duration}
                            </span>
                          </div>
                        </div>

                        <div className="text-start sm:text-end shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#eedfe0]">
                          <span className="text-2xl font-bold font-serif text-[#2f020d]">
                            {p.price.toLocaleString("ar-SA")}
                          </span>
                          <span className="text-xs font-bold text-[#735c00] ms-1">ر.س</span>
                          <span className="text-[11px] text-[#857374] block mt-0.5">
                            عربون الحجز: {Math.round(p.price * 0.3).toLocaleString("ar-SA")} ر.س
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-11 px-8 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs"
                  >
                    <span>المتابعة للموعد والمكان</span>
                    <ArrowLeft className="h-4 w-4 ms-2" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Step 2: Date, Time & Location */}
            <div className={step === 2 ? "block" : "hidden"}>
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">الخطوة ٢ من ٤</span>
                  <h2 className="text-xl font-bold text-[#2f020d] mt-1">تحديد الموعد ومقر الخدمة</h2>
                  <p className="text-xs text-[#524345]">اختاري تاريخ المناسبة ومقر إقامة الجلسة بالرياض.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1.5">تاريخ المناسبة</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    />
                    {blockedDates.includes(selectedDate) && (
                      <p className="text-[11px] text-[#ba1a1a] font-bold mt-1">
                        ⚠ عذراً، هذا التاريخ محجوز بالكامل أو في فترة إجازة.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1.5">الفترة الزمنية المفضلة</label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    >
                      <option value="عصراً (02:00 م)">عصراً (02:00 م) — موعد تجهيز العرائس المعتمد</option>
                      <option value="صباحاً (11:00 ص)">صباحاً (11:00 ص) — جلسات الأتيليه والبروفة</option>
                      <option value="مساءً (06:00 م)">مساءً (06:00 م) — إطلالات السهرة والحفل</option>
                    </select>
                  </div>
                </div>

                {/* Location Type */}
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-2">مقر الجلسة المطلوب:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "HOTEL_HALL", label: "فندق أو قاعة أفراح", icon: Hotel },
                      { id: "CLIENT_HOME", label: "منزل العروس بالرياض", icon: Building },
                      { id: "STUDIO", label: "الأتيليه الخاص بأماني", icon: Crown },
                    ].map((loc) => {
                      const Icon = loc.icon;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setLocationType(loc.id as typeof locationType)}
                          className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                            locationType === loc.id
                              ? "border-[#4a1521] bg-[#fff0f1] text-[#4a1521] ring-2 ring-[#4a1521]"
                              : "border-[#eedfe0] text-[#524345] hover:bg-[#fff8f7]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-bold">{loc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1.5">اسم الفندق / القاعة أو الحي</label>
                    <input
                      id="venue-name"
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="مثال: فندق الريتز-كارلتون، الجناح الملكي"
                      className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1.5">منطقة الحي بالرياض (لحساب بدل التنقل)</label>
                    <select
                      value={selectedAreaId}
                      onChange={(e) => setSelectedAreaId(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    >
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nameAr} ({a.travelFee === 0 ? "بدل مجاني" : `+${a.travelFee} ر.س`})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(1)} className="rounded-full">
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    className="h-11 px-8 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs"
                  >
                    <span>المتابعة للإضافات</span>
                    <ArrowLeft className="h-4 w-4 ms-2" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Step 3: Add-ons & Skin Assessment */}
            <div className={step === 3 ? "block" : "hidden"}>
              <Card id="step-3-card" className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">الخطوة ٣ من ٤</span>
                  <h2 className="text-xl font-bold text-[#2f020d] mt-1">الخدمات التكميلية واستمارة البشرة</h2>
                  <p className="text-xs text-[#524345]">يمكنكِ إضافة خدمات مساندة لراحتكِ التامة بيوم المناسبة.</p>
                </div>

                <div className="space-y-3">
                  {addons.map((ad) => {
                    const isChecked = selectedAddonIds.includes(ad.id);
                    return (
                      <label
                        key={ad.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          isChecked
                            ? "border-[#735c00] bg-[#fff8f7] ring-1 ring-[#735c00]"
                            : "border-[#eedfe0] hover:bg-[#fff8f7]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name={ad.id}
                            value={ad.price}
                            checked={isChecked}
                            onChange={() => toggleAddon(ad.id)}
                            className="h-4 w-4 rounded text-[#4a1521] focus:ring-[#735c00]"
                          />
                          <div>
                            <span className="font-bold text-xs text-[#2f020d] block">{ad.title}</span>
                            <span className="text-[11px] text-[#524345]">{ad.description}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#735c00] shrink-0">
                          +{ad.price.toLocaleString("ar-SA")} ر.س
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Skin Profile Form */}
                <div className="p-4 rounded-2xl bg-[#fff0f1] border border-[#eedfe0] space-y-3">
                  <h4 className="text-xs font-bold text-[#4a1521]">استمارة البشرة السريعة:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-[#524345] block mb-1">نوع البشرة</label>
                      <select
                        value={skinType}
                        onChange={(e) => setSkinType(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-[#eedfe0] bg-white text-xs"
                      >
                        <option value="جافة">بشرة جافة (تحتاج ترطيب مضاعف)</option>
                        <option value="مختلطة">بشرة مختلطة</option>
                        <option value="دهنية">بشرة دهنية (تحتاج بودرة مات سينمائية)</option>
                        <option value="حساسة">بشرة حساسة ومعرضة للاحمرار</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#524345] block mb-1">ملاحظات أو تحسس سابق (اختياري)</label>
                      <input
                        type="text"
                        value={allergyNotes}
                        onChange={(e) => setAllergyNotes(e.target.value)}
                        placeholder="مثال: تحسس من صمغ رموش معين..."
                        className="w-full h-10 px-3 rounded-xl border border-[#eedfe0] bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(2)} className="rounded-full">
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    className="h-11 px-8 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs"
                  >
                    <span>المتابعة لبيانات الحجز والدفع</span>
                    <ArrowLeft className="h-4 w-4 ms-2" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Step 4: Bride Details & Payment */}
            <div className={step === 4 ? "block" : "hidden"}>
              <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">الخطوة ٤ من ٤</span>
                  <h2 className="text-xl font-bold text-[#2f020d] mt-1">بيانات العروس وتأكيد العربون</h2>
                  <p className="text-xs text-[#524345]">أدخلي بيانات التواصل لتوليد العقد الموثق والفاتورة الرسمية.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1.5">اسم العروس الكريم (ثنائي أو ثلاثي)</label>
                    <input
                      id="bride-name"
                      type="text"
                      required
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="مثال: العنود بنت خالد"
                      className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1.5">رقم الجوال (لاستلام العقد والواتساب)</label>
                    <input
                      id="bride-phone"
                      type="tel"
                      required
                      value={bridePhone}
                      onChange={(e) => setBridePhone(e.target.value)}
                      placeholder="0559876543"
                      className="w-full h-11 px-4 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-2">طريقة سداد العربون المعتمدة:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "Apple Pay", label: "Apple Pay", badge: "فوري وآمن" },
                      { id: "mada", label: "بطاقة مدى", badge: "البنوك السعودية" },
                      { id: "تحويل بنكي", label: "تحويل بنكي رسمي", badge: "مصرف الراجحي" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as typeof paymentMethod)}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? "border-[#4a1521] bg-[#fff0f1] text-[#4a1521] ring-2 ring-[#4a1521]"
                            : "border-[#eedfe0] text-[#524345] hover:bg-[#fff8f7]"
                        }`}
                      >
                        <span className="font-bold text-xs block">{m.label}</span>
                        <span className="text-[10px] text-[#735c00]">{m.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consent checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-[#524345] cursor-pointer pt-2">
                  <input
                    id="terms-agree"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded text-[#4a1521] focus:ring-[#735c00]"
                  />
                  <span>
                    أوافق على <Link href="/contact" className="text-[#4a1521] underline font-bold">شروط الحجز وسياسة العربون وسرية الصور</Link> الخاصة بأماني خليل.
                  </span>
                </label>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" type="button" onClick={() => setStep(3)} className="rounded-full">
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="h-12 px-10 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs shadow-xl cursor-pointer"
                  >
                    تأكيد الحجز وسداد العربون (30%) 💍
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Sticky Summary Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-36">
            <Card className="rounded-3xl border border-[#d7c1c3] bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="text-xs font-bold text-[#fed65b] flex items-center gap-1.5">
                  <Crown className="h-4 w-4" />
                  <span>ملخص حجزكِ الملكي</span>
                </span>
                <Badge variant="gold" className="text-[10px]">
                  VIP Live
                </Badge>
              </div>

              {/* Portrait Preview */}
              <div className="aspect-[16/10] rounded-2xl overflow-hidden relative shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBsAGcs_awev92ZT2Mi6dY05VdBYQcCp-1Rf3SyuGFcSlRMD7Xu1bQ5ToymWmKy55wAfmdv17GExTP1qCaSNdhNMgrLkhBmHJy-SroDXt_nljfrgMWsxhW9j7CFapkyPhw28yOSjKJ0PHJLUgdTk6jfXXyqoHiejneKWotopn52bA_7X0IogtOStcGbYH21Zq6aQ5pNHJc5rHDn73aDMKCXwbsiDDqYfAsfHcRxLQ"
                  alt="Amani Khalil Look"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-white">إطلالة ملكية حصرية لا تتكرر</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#eedfe0]">
                <div className="flex justify-between items-center">
                  <span>الباقة المختارة:</span>
                  <span className="font-bold text-white">{pkg.title}</span>
                </div>
                <div id="summary-date" className="flex justify-between items-center">
                  <span>الموعد المحدد:</span>
                  <span className="font-bold text-white">{selectedDate} ({selectedTimeSlot})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>مقر الجلسة:</span>
                  <span className="font-bold text-white truncate max-w-[170px]">{venueName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>سعر الباقة الأساسي:</span>
                  <span className="font-bold text-white">{basePrice.toLocaleString("ar-SA")} ر.س</span>
                </div>
                {selectedAddonIds.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span>إجمالي الإضافات ({selectedAddonIds.length}):</span>
                    <span className="font-bold text-[#fed65b]">+{addonsTotal.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>رسوم التنقل:</span>
                  <span className={travelFee === 0 ? "text-emerald-400 font-bold" : "text-white"}>
                    {travelFee === 0 ? "مجاني مشمول" : `+${travelFee.toLocaleString("ar-SA")} ر.س`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">الإجمالي الكلي:</span>
                  <span id="summary-grand-total" className="text-2xl font-bold font-serif text-[#fed65b]">
                    {grandTotal.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-[#ffd9dd]">
                  <span>العربون المطلوب (30%):</span>
                  <span id="summary-deposit-total" className="text-base font-bold text-white">
                    {depositTotal.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] text-white/60">
                  <span>المتبقي يوم المناسبة:</span>
                  <span>{remainingTotal.toLocaleString("ar-SA")} ر.س</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 text-[11px] text-[#eedfe0] leading-relaxed">
                ✓ يشمل التفرغ التام لعروس واحدة يومياً، الرموش ثلاثية الأبعاد، وحقيبة الرتوش الهدية.
              </div>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
