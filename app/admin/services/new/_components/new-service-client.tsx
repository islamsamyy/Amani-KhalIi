"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Check,
  Crown,
  Clock,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export function NewServiceClient() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const { addPackage } = useAppStore();

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [price, setPrice] = useState<number>(1200);
  const [depositPercentage, setDepositPercentage] = useState<number>(30);
  const [duration, setDuration] = useState("ساعتان ونصف");
  const [category, setCategory] = useState<"bridal" | "engagement" | "evening" | "trial" | "group">("evening");
  const [description, setDescription] = useState("");
  const [feature1, setFeature1] = useState("مستحضرات أصلية 100% مقاومة للتعرق");
  const [feature2, setFeature2] = useState("رموش طبيعية ثلاثية الأبعاد");
  const [feature3, setFeature3] = useState("خدمة منزلية أو فندقية بالرياض");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("يرجى إدخال اسم الباقة الرسمي");
      return;
    }

    addPackage({
      title: title.trim(),
      titleEn: titleEn.trim() || title.trim(),
      price: Number(price),
      depositPercentage: Number(depositPercentage),
      duration: duration.trim(),
      category,
      active: true,
      description: description.trim() || "جلسة مكياج فاخرة بإشراف خبيرة التجميل أماني خليل.",
      features: [feature1, feature2, feature3].filter(Boolean),
    });

    router.push("/admin/services");
  };

  return (
    <div dir={dir} className="lg:ps-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="h-10 w-10 rounded-full bg-white border border-[#eedfe0] flex items-center justify-center text-[#2f020d] hover:bg-[#faeaeb] transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">نافذة إضافة باقة جديدة</h1>
            <p className="text-xs text-[#524345]">تحديد المسمى الرسمي، السعر، نسبة العربون، ونشرها فورياً في الموقع العام.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form (7 cols) */}
          <Card className="lg:col-span-7 rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">اسم الباقة (عربي)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: باقة الملكة والخطوبة الفاخرة"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">اسم الباقة (English)</label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Royal Engagement Package"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">السعر الرسمي (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">نسبة العربون (%)</label>
                  <input
                    type="number"
                    value={depositPercentage}
                    onChange={(e) => setDepositPercentage(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">مدة الجلسة</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="ساعتان ونصف"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">التصنيف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                >
                  <option value="bridal">عرائس ملكي (Bridal)</option>
                  <option value="engagement">عقد قران وملكة (Engagement)</option>
                  <option value="evening">سهرات ومناسبات (Evening)</option>
                  <option value="trial">جلسات التجربة (Trial)</option>
                  <option value="group">مرافقات ومجموعات (Group)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">الوصف العام للباقة</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتبي وصفاً جذاباً يوضح تفاصيل الإطلالة والمستحضرات..."
                  className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                />
              </div>

              {/* Features list */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-[#2f020d] block">أبرز المميزات المشمولة في الباقة:</label>
                <input
                  type="text"
                  value={feature1}
                  onChange={(e) => setFeature1(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs"
                />
                <input
                  type="text"
                  value={feature2}
                  onChange={(e) => setFeature2(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs"
                />
                <input
                  type="text"
                  value={feature3}
                  onChange={(e) => setFeature3(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#eedfe0]">
                <Link
                  href="/admin/services"
                  className="h-11 px-6 rounded-full border border-[#eedfe0] bg-white hover:bg-[#faeaeb] text-xs font-bold flex items-center"
                >
                  إلغاء
                </Link>
                <Button
                  type="submit"
                  className="h-11 px-8 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4 text-[#fed65b]" />
                  <span>حفظ ونشر الباقة فورياً</span>
                </Button>
              </div>
            </form>
          </Card>

          {/* Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider block">
              معاينة الباقة كما ستظهر للعميلات بالموقع
            </span>
            <Card className="rounded-3xl border border-[#735c00] bg-white p-6 sm:p-8 shadow-md space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="gold" className="text-[10px]">
                  باقة جديدة
                </Badge>
                <span className="text-xs text-[#857374]">{duration || "ساعتان"}</span>
              </div>
              <h3 className="text-xl font-bold text-[#2f020d]">{title || "اسم الباقة المقترحة"}</h3>
              <p className="text-xs text-[#524345] leading-relaxed">
                {description || "وصف الإطلالة والمستحضرات العالمية المستخدمة."}
              </p>
              <div className="flex items-baseline gap-2 pb-4 border-b border-[#eedfe0]">
                <span className="text-3xl font-bold font-serif text-[#2f020d]">
                  {Number(price || 0).toLocaleString("ar-SA")}
                </span>
                <span className="text-xs font-bold text-[#735c00]">ر.س</span>
                <span className="text-[11px] text-[#857374] ms-auto">
                  عربون ({depositPercentage}%): {Math.round(((price || 0) * (depositPercentage || 30)) / 100).toLocaleString("ar-SA")} ر.س
                </span>
              </div>

              <ul className="space-y-2 text-xs text-[#211a1b]">
                {[feature1, feature2, feature3].filter(Boolean).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#735c00] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

