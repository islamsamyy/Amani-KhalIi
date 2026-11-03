"use client";

import React, { useState } from "react";
import { useAppStore } from "@/providers/app-store-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FolderKanban,
  Star,
  CheckCircle2,
  Sparkles,
  Camera,
  Plus,
  ShieldCheck,
  Save,
  Check,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export function AdminContentClient() {
  const { reviews, toggleReviewApproval, toggleReviewFeatured, gallery } = useAppStore();
  const [contractClauses, setContractClauses] = useState(
    "١. يُعتبر العربون غير مسترد بعد تأكيد الحجز نظراً لتخصيص التاريخ لعروس واحدة.\n٢. يحق للعميلة تأجيل الموعد لمرة واحدة دون رسوم بشرط إشعار مسبق قبل ٢١ يوماً.\n٣. يُمنع تصوير أو نشر أي صورة أو مقطع دون موافقة خطية صريحة من العميلة."
  );

  const handleSaveContract = () => {
    toast.success("تم تحديث صياغة بنود العقد والسياسات بنجاح ✨");
  };

  return (
    <div dir="rtl" className="lg:pe-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">إدارة المحتوى والتقييمات والمعرض</h1>
            <p className="text-xs text-[#524345] mt-1">
              اعتماد تقييمات العميلات الجديدة، إدارة صور المعرض، وتحديث بنود عقد الحجز الإلكتروني.
            </p>
          </div>
        </div>

        {/* 3 Main Tabs */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="bg-[#faeaeb] p-1 rounded-full flex flex-wrap gap-1 mb-6">
            <TabsTrigger value="reviews" className="rounded-full text-xs font-semibold px-4">
              تقييمات العميلات ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-full text-xs font-semibold px-4">
              معرض الصور ({gallery.length})
            </TabsTrigger>
            <TabsTrigger value="contract" className="rounded-full text-xs font-semibold px-4">
              بنود العقد والسياسات
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Reviews Management */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <Card key={r.id} className="rounded-3xl border border-[#eedfe0] bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#2f020d]">{r.clientName}</h3>
                      <p className="text-[10px] text-[#735c00]">{r.packageTitle} • {r.venue}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#524345] leading-relaxed italic bg-[#fff8f7] p-3 rounded-2xl border border-[#eedfe0]/60">
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#eedfe0]">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={r.approved ? "default" : "outline"}
                        onClick={() => toggleReviewApproval(r.id)}
                        className={`rounded-full text-[11px] h-8 ${
                          r.approved ? "bg-emerald-700 hover:bg-emerald-800 text-white" : ""
                        }`}
                      >
                        {r.approved ? "معتمد بالموقع ✓" : "اعتماد التقييم"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleReviewFeatured(r.id)}
                        className={`rounded-full text-[11px] h-8 ${
                          r.featured ? "bg-[#fed65b] text-[#241a00] border-none font-bold" : ""
                        }`}
                      >
                        {r.featured ? "مميز بالرئيسية ★" : "تمييز"}
                      </Button>
                    </div>
                    <span className="text-[10px] text-[#857374]">{r.date}</span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Gallery Management */}
          <TabsContent value="gallery" className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#524345]">إجمالي الإطلالات المنشورة: {gallery.length}</span>
              <Button
                size="sm"
                onClick={() => toast.success("تم فتح نموذج رفع إطلالة جديدة")}
                className="rounded-full bg-[#4a1521] text-white text-xs font-bold gap-1"
              >
                <Plus className="h-3.5 w-3.5 text-[#fed65b]" />
                <span>إضافة صورة جديدة</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="rounded-2xl overflow-hidden border border-[#eedfe0] bg-white shadow-sm space-y-2 pb-3">
                  <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                    <Badge variant="gold" className="absolute top-2 start-2 text-[9px]">
                      {g.categoryAr}
                    </Badge>
                  </div>
                  <div className="px-3">
                    <h4 className="text-xs font-bold text-[#2f020d] truncate">{g.title}</h4>
                    <p className="text-[10px] text-[#857374] truncate">{g.clientType}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Tab 3: Contract & Policies Editing */}
          <TabsContent value="contract" className="space-y-4">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#2f020d]">صياغة بنود العقد الإلكتروني الموثق</h3>
                <p className="text-xs text-[#524345]">هذه البنود تظهر للعروس قبل السداد وتُرفق تلقائياً في عقد الحجز المرسل عبر الواتساب.</p>
              </div>

              <textarea
                rows={8}
                value={contractClauses}
                onChange={(e) => setContractClauses(e.target.value)}
                className="w-full p-4 rounded-2xl border border-[#eedfe0] bg-[#fff8f7] text-xs focus:outline-none focus:border-[#735c00] leading-relaxed"
              />

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSaveContract}
                  className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs gap-1.5 px-6"
                >
                  <Save className="h-4 w-4 text-[#fed65b]" />
                  <span>تحديث صياغة بنود العقد</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

