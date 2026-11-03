"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Crown,
  Calendar,
  Check,
  Sparkles,
  Calculator,
  ShieldCheck,
  Star,
  Plus,
} from "lucide-react";

export function ServicesClient() {
  const router = useRouter();
  const { packages, addons, setSelectedPackageId } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calculator state
  const [calcPackageId, setCalcPackageId] = useState<string>("vip-bridal");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    "addon_hair",
  ]);

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    router.push("/book");
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const filteredPackages = packages.filter((pkg) => {
    if (!pkg.active) return false;
    if (selectedCategory === "all") return true;
    return pkg.category === selectedCategory;
  });

  // Calculate calculator totals
  const calcPkg =
    packages.find((p) => p.id === calcPackageId) || packages[0];
  const addonsTotal = selectedAddonIds.reduce((sum, aid) => {
    const item = addons.find((a) => a.id === aid);
    return sum + (item ? item.price : 0);
  }, 0);
  const calcGrandTotal = calcPkg.price + addonsTotal;
  const calcDeposit = Math.round(calcGrandTotal * 0.3);
  const calcRemaining = calcGrandTotal - calcDeposit;

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            الأسعار الرسمية المعتمدة لعام 2025
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight">
            باقات الخدمات والأسعار الرسمية
          </h1>
          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            خيارات متنوعة مصممة لتلبية تطلعاتكِ، من جلسات العرائس الملكية الكبرى وحتى إطلالات السهرات والملكة،
            مع شفافية تامة في الأسعار وحاسبة الإضافات التفاعلية.
          </p>
        </div>
      </section>

      {/* 2. Packages Grid & Category Filter */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center mb-12">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full max-w-2xl mx-auto flex flex-col items-center"
          >
            <TabsList className="bg-[#faeaeb] p-1.5 rounded-full flex flex-wrap justify-center gap-1">
              <TabsTrigger value="all" className="rounded-full text-xs font-semibold px-4">
                كافة الباقات ({packages.filter((p) => p.active).length})
              </TabsTrigger>
              <TabsTrigger value="bridal" className="rounded-full text-xs font-semibold px-4">
                عرائس VIP
              </TabsTrigger>
              <TabsTrigger value="engagement" className="rounded-full text-xs font-semibold px-4">
                ملكة وخطوبة
              </TabsTrigger>
              <TabsTrigger value="evening" className="rounded-full text-xs font-semibold px-4">
                سهرات ومناسبات
              </TabsTrigger>
              <TabsTrigger value="trial" className="rounded-full text-xs font-semibold px-4">
                جلسات التجربة
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-3xl transition-all duration-300 ${
                pkg.popular
                  ? "border-2 border-[#735c00] shadow-[0_12px_32px_rgba(74,21,33,0.12)] bg-[#fff8f7]"
                  : "border border-[#eedfe0] bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {pkg.popular && (
                <div className="bg-[#4a1521] text-white text-center py-1.5 text-xs font-bold">
                  ★ الأكثر طلباً للعرائس
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#735c00] bg-[#faeaeb] px-3 py-1 rounded-full">
                    {pkg.duration}
                  </span>
                  <span className="text-xs text-[#857374]">عربون: 30%</span>
                </div>

                <h3 className="text-xl font-bold text-[#2f020d] mb-2">{pkg.title}</h3>
                <p className="text-xs text-[#524345] leading-relaxed mb-6">{pkg.description}</p>

                <div className="flex items-baseline gap-2 pb-6 border-b border-[#eedfe0]">
                  <span className="text-3xl sm:text-4xl font-bold font-serif text-[#2f020d]">
                    {pkg.price.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-sm font-bold text-[#735c00]">ر.س</span>
                </div>

                <ul className="space-y-3 pt-6 mb-8">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-[#211a1b]">
                      <Check className="h-4 w-4 text-[#735c00] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0 sm:p-8 sm:pt-0 flex flex-col gap-2">
                <Button
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`w-full h-12 rounded-full text-xs font-bold shadow-md cursor-pointer ${
                    pkg.popular
                      ? "bg-[#4a1521] hover:bg-[#2f020d] text-white"
                      : "bg-[#faeaeb] hover:bg-[#eedfe0] text-[#2f020d]"
                  }`}
                >
                  <Calendar className="h-4 w-4 ms-2 text-[#fed65b]" />
                  <span>اختيار هذه الباقة والحجز</span>
                </Button>
                {pkg.id === "vip-bridal" && (
                  <Link
                    href="/services/vip-bridal"
                    className="text-center text-[11px] font-semibold text-[#735c00] hover:underline py-1"
                  >
                    استكشاف تفاصيل الباقة الملكية كاملة ←
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Interactive Add-ons & Total Price Calculator */}
      <section className="py-20 bg-[#fff0f1] border-y border-[#eedfe0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Calculator className="h-4 w-4" />
              <span>الحاسبة التفاعلية</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
              احسبي تكلفة إطلالتكِ والإضافات
            </h2>
            <p className="text-sm text-[#524345] mt-2">
              اختاري الباقة والخدمات الإضافية لمعرفة الإجمالي ومبلغ العربون المطلوب فورياً
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Options Selection (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#eedfe0] shadow-sm space-y-6">
              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-2">١. اختاري الباقة الرئيسية:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCalcPackageId(p.id)}
                      className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                        calcPackageId === p.id
                          ? "border-[#4a1521] bg-[#fff0f1] ring-2 ring-[#4a1521]"
                          : "border-[#eedfe0] hover:bg-[#fff8f7]"
                      }`}
                    >
                      <span className="font-bold text-xs text-[#2f020d] block truncate">{p.title}</span>
                      <span className="text-xs font-bold text-[#735c00]">{p.price.toLocaleString("ar-SA")} ر.س</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-2">٢. اختاري الإضافات التكميلية:</label>
                <div className="space-y-2.5">
                  {addons.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? "border-[#735c00] bg-[#fff8f7] ring-1 ring-[#735c00]"
                            : "border-[#eedfe0] hover:bg-[#fff8f7]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={isChecked}
                            onCheckedChange={() => toggleAddon(addon.id)}
                          />
                          <div>
                            <span className="font-bold text-xs text-[#2f020d] block">{addon.title}</span>
                            <span className="text-[11px] text-[#524345]">{addon.description}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#735c00] shrink-0">
                          +{addon.price.toLocaleString("ar-SA")} ر.س
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Financial Summary (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <span className="text-xs text-[#fed65b] font-bold">ملخص الحسبة المباشرة</span>
                <Badge variant="gold" className="text-[10px]">
                  عربون 30% فقط
                </Badge>
              </div>

              <div className="space-y-3 text-xs text-[#eedfe0]">
                <div className="flex justify-between items-center">
                  <span>سعر الباقة ({calcPkg.title}):</span>
                  <span className="font-bold text-white">{calcPkg.price.toLocaleString("ar-SA")} ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>إجمالي الإضافات المختارة ({selectedAddonIds.length}):</span>
                  <span className="font-bold text-white">+{addonsTotal.toLocaleString("ar-SA")} ر.س</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>رسوم التنقل بالرياض:</span>
                  <span className="text-emerald-400 font-bold">مجاناً (مشمول)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">الإجمالي الكلي:</span>
                  <span className="text-2xl font-bold font-serif text-[#fed65b]">
                    {calcGrandTotal.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-[#ffd9dd]">
                  <span>العربون المطلوب للتأكيد (30%):</span>
                  <span className="font-bold text-white text-base">
                    {calcDeposit.toLocaleString("ar-SA")} ر.س
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] text-white/60">
                  <span>المبلغ المتبقي يوم المناسبة:</span>
                  <span>{calcRemaining.toLocaleString("ar-SA")} ر.س</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectPackage(calcPkg.id)}
                className="w-full h-12 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] font-bold text-xs shadow-lg cursor-pointer"
              >
                تثبيت هذا الموعد وحجز الإطلالة 💍
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">مقارنة شاملة</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2f020d] mt-2">
            مقارنة مميزات الباقات
          </h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">الميزة / الخدمة</TableHead>
              <TableHead>باقة العروس VIP</TableHead>
              <TableHead>الملكة والخطوبة</TableHead>
              <TableHead>مكياج السهرات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">السعر الرسمي</TableCell>
              <TableCell className="font-bold text-[#735c00]">2,800 ر.س</TableCell>
              <TableCell className="font-bold">1,400 ر.س</TableCell>
              <TableCell className="font-bold">850 ر.س</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>تفرغ كامل لعروس واحدة باليوم</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ نعم حصرياً</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ نعم</TableCell>
              <TableCell className="text-[#857374]">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>حقيبة رتوش ملكية متكاملة هدية</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ مجاناً (بقيمة 450 ر.س)</TableCell>
              <TableCell className="text-[#857374]">—</TableCell>
              <TableCell className="text-[#857374]">—</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>تهيئة كورية للبشرة (Glass Skin)</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ مشمول</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ ترطيب مكثف</TableCell>
              <TableCell>ترطيب أساسي</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>نوع الرموش المرفقة</TableCell>
              <TableCell className="font-bold">Mink ثلاثية الأبعاد</TableCell>
              <TableCell>طبيعية فاخرة</TableCell>
              <TableCell>طبيعية خفيفة</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>تغطية التنقل لكافة أحياء وفنادق الرياض</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ مجاناً بالكامل</TableCell>
              <TableCell className="text-emerald-600 font-bold">✓ مجاناً</TableCell>
              <TableCell>بحسب الحي</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <SiteFooter />
    </div>
  );
}

