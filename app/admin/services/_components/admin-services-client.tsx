"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { ServicePackage } from "@/features/data/initial-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Check,
  Crown,
  Clock,
  Eye,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export function AdminServicesClient() {
  const { packages, togglePackageActive, updatePackage, deletePackage } = useAppStore();
  const [editingPkg, setEditingPkg] = useState<ServicePackage | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editDepositPercentage, setEditDepositPercentage] = useState(30);
  const [editDuration, setEditDuration] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const startEdit = (pkg: ServicePackage) => {
    setEditingPkg(pkg);
    setEditTitle(pkg.title);
    setEditPrice(pkg.price);
    setEditDepositPercentage(pkg.depositPercentage ?? 30);
    setEditDuration(pkg.duration);
    setEditDesc(pkg.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    updatePackage(editingPkg.id, {
      title: editTitle,
      price: Number(editPrice),
      depositPercentage: Number(editDepositPercentage),
      duration: editDuration,
      description: editDesc,
    });
    setEditingPkg(null);
  };

  return (
    <div dir="rtl" className="lg:pr-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">إدارة الخدمات والباقات الرسمية</h1>
            <p className="text-xs text-[#524345] mt-1">
              تعديل أسعار الباقات، تفعيل أو إيقاف العروض مؤقتاً، وإضافة باقات جديدة للموقع.
            </p>
          </div>
          <Link
            href="/admin/services/new"
            className="h-11 px-5 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#fed65b]" />
            <span>إنشاء باقة خدمة جديدة</span>
          </Link>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`rounded-3xl border flex flex-col justify-between overflow-hidden shadow-sm transition-all ${
                pkg.active
                  ? "bg-white border-[#eedfe0]"
                  : "bg-gray-50 border-gray-200 opacity-75"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={pkg.active ? "gold" : "outline"} className="text-[10px]">
                    {pkg.active ? "نشطة بالموقع العام" : "متوقفة مؤقتاً"}
                  </Badge>
                  <span className="text-xs text-[#857374]">{pkg.duration}</span>
                </div>

                <h3 className="text-base font-bold text-[#2f020d] mb-1">{pkg.title}</h3>
                <p className="text-xs text-[#524345] leading-relaxed line-clamp-2 mb-4">
                  {pkg.description}
                </p>

                <div className="flex items-baseline gap-2 pb-4 border-b border-[#eedfe0]">
                  <span className="text-2xl font-bold font-serif text-[#2f020d]">
                    {pkg.price.toLocaleString("ar-SA")}
                  </span>
                  <span className="text-xs font-bold text-[#735c00]">ر.س</span>
                  <span className="text-[11px] text-[#857374] ms-auto">العربون: {pkg.depositPercentage}%</span>
                </div>

                <ul className="space-y-1.5 pt-4 text-xs text-[#211a1b]">
                  {pkg.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] text-[#524345]">
                      <Check className="h-3.5 w-3.5 text-[#735c00] shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-[#fff0f1]/70 border-t border-[#eedfe0] flex items-center justify-between gap-2">
                {/* Pause/Resume Toggle Button with material symbol for test compatibility */}
                <button
                  type="button"
                  onClick={() => togglePackageActive(pkg.id)}
                  className={`h-9 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    pkg.active
                      ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                      : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                  }`}
                  title={pkg.active ? "إيقاف مؤقت" : "تفعيل الباقة"}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {pkg.active ? "pause_circle" : "play_circle"}
                  </span>
                  <span className="hidden sm:inline">{pkg.active ? "إيقاف مؤقت" : "تفعيل"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(pkg)}
                    className="rounded-full text-xs h-9 bg-white"
                  >
                    <Edit className="h-3.5 w-3.5 ms-1 text-[#735c00]" />
                    <span>تعديل</span>
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل أنتِ متأكدة من حذف باقة "${pkg.title}"؟`)) {
                        deletePackage(pkg.id);
                      }
                    }}
                    className="h-9 w-9 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-colors cursor-pointer"
                    title="حذف الباقة"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Package Modal Dialog */}
        <Dialog open={editingPkg !== null} onOpenChange={(open) => !open && setEditingPkg(null)}>
          <DialogContent className="max-w-lg bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right">
            <DialogHeader className="text-right">
              <DialogTitle className="text-lg font-bold text-[#2f020d]">
                تعديل بيانات الباقة: {editingPkg?.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#524345]">
                تحديث السعر والمدة والوصف الرسمي المنشور في الموقع العام.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 my-2">
              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">اسم الباقة</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">نسبة العربون (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={editDepositPercentage}
                    onChange={(e) => setEditDepositPercentage(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">مدة الجلسة</label>
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">الوصف المختصر</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setEditingPkg(null)} className="rounded-full text-xs">
                  إلغاء
                </Button>
                <Button type="submit" className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold px-6">
                  حفظ التعديلات
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

