"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { getLocalizedPackage } from "@/lib/package-i18n";
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
  const { t, dir, lang } = useLanguage();
  const { packages, togglePackageActive, updatePackage, deletePackage } = useAppStore();
  const [editingPkg, setEditingPkg] = useState<ServicePackage | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editDepositPercentage, setEditDepositPercentage] = useState(30);
  const [editDuration, setEditDuration] = useState("");
  const [editCategory, setEditCategory] = useState<ServicePackage["category"]>("bridal");
  const [editBadge, setEditBadge] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  const [editPopular, setEditPopular] = useState(false);
  const [editActive, setEditActive] = useState(true);

  const startEdit = (pkg: ServicePackage) => {
    setEditingPkg(pkg);
    setEditTitle(pkg.title);
    setEditTitleEn(pkg.titleEn || "");
    setEditPrice(pkg.price);
    setEditDepositPercentage(pkg.depositPercentage ?? 30);
    setEditDuration(pkg.duration);
    setEditCategory(pkg.category);
    setEditBadge(pkg.badge || "");
    setEditDesc(pkg.description);
    setEditFeatures((pkg.features || []).join("\n"));
    setEditPopular(Boolean(pkg.popular));
    setEditActive(Boolean(pkg.active));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    const parsedFeatures = editFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    updatePackage(editingPkg.id, {
      title: editTitle.trim(),
      titleEn: editTitleEn.trim() || editTitle.trim(),
      price: Number(editPrice),
      depositPercentage: Number(editDepositPercentage),
      duration: editDuration.trim(),
      category: editCategory,
      badge: editBadge.trim() || undefined,
      description: editDesc.trim(),
      features: parsedFeatures.length > 0 ? parsedFeatures : editingPkg.features,
      popular: editPopular,
      active: editActive,
    });
    setEditingPkg(null);
  };

  return (
    <div dir={dir} className="lg:ps-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[#2f020d]">
              {t("إدارة الخدمات والباقات الرسمية", "Services & Official Packages")}
            </h1>
            <p className="text-xs text-[#524345] mt-1">
              {t(
                "تعديل أسعار الباقات، تفعيل أو إيقاف العروض مؤقتاً، وإضافة باقات جديدة للموقع.",
                "Edit package pricing, pause or activate offers, and create new packages for the storefront."
              )}
            </p>
          </div>
          <Link
            href="/admin/services/new"
            className="h-11 px-5 rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#fed65b]" />
            <span>{t("إنشاء باقة خدمة جديدة", "Create New Package")}</span>
          </Link>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const locPkg = getLocalizedPackage(pkg, lang);
            return (
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
                      {pkg.active
                        ? t("نشطة بالموقع العام", "Active on Storefront")
                        : t("متوقفة مؤقتاً", "Paused")}
                    </Badge>
                    <span className="text-xs text-[#857374]">{locPkg.duration}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#2f020d] mb-1">{locPkg.title}</h3>
                  <p className="text-xs text-[#524345] leading-relaxed line-clamp-2 mb-4">
                    {locPkg.description}
                  </p>

                  <div className="flex items-baseline gap-2 pb-4 border-b border-[#eedfe0]">
                    <span className="text-2xl font-bold font-serif text-[#2f020d]">
                      {pkg.price.toLocaleString("en-US")}
                    </span>
                    <span className="text-xs font-bold text-[#735c00]">{t("ر.س", "SAR")}</span>
                    <span className="text-[11px] text-[#857374] ms-auto">
                      {t("العربون:", "Deposit:")} {pkg.depositPercentage}%
                    </span>
                  </div>

                  <ul className="space-y-1.5 pt-4 text-xs text-[#211a1b]">
                    {locPkg.features.slice(0, 3).map((f, i) => (
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
                    title={pkg.active ? t("إيقاف مؤقت", "Pause") : t("تفعيل الباقة", "Activate Package")}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {pkg.active ? "pause_circle" : "play_circle"}
                    </span>
                    <span className="hidden sm:inline">
                      {pkg.active ? t("إيقاف مؤقت", "Pause") : t("تفعيل", "Activate")}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(pkg)}
                      className="rounded-full text-xs h-9 bg-white"
                    >
                      <Edit className="h-3.5 w-3.5 ms-1 text-[#735c00]" />
                      <span>{t("تعديل", "Edit")}</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            t(
                              `هل أنتِ متأكدة من حذف باقة "${pkg.title}"؟`,
                              `Are you sure you want to delete package "${locPkg.title}"?`
                            )
                          )
                        ) {
                          deletePackage(pkg.id);
                        }
                      }}
                      className="h-9 w-9 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-colors cursor-pointer"
                      title={t("حذف الباقة", "Delete Package")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Edit Package Modal Dialog */}
        <Dialog open={editingPkg !== null} onOpenChange={(open) => !open && setEditingPkg(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-[#fff8f7] border border-[#d7c1c3] p-6 text-start rounded-3xl" dir={dir}>
            <DialogHeader className="text-start">
              <DialogTitle className="text-lg font-bold text-[#2f020d]">
                {t("تعديل بيانات وتفاصيل الباقة:", "Edit Package Details:")} {editingPkg ? getLocalizedPackage(editingPkg, lang).title : ""}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#524345]">
                {t(
                  "تحديث السعر الرسمي، نسبة العربون، تفاصيل المميزات، التصنيف، والوصف المعروض في الموقع العام.",
                  "Update official price, deposit percentage, features, category, and storefront description."
                )}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 my-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("اسم الباقة (عربي) *", "Package Name (Arabic) *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("اسم الباقة (English)", "Package Name (English)")}
                  </label>
                  <input
                    type="text"
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    placeholder="e.g. Royal Bridal VIP"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("السعر الرسمي (ر.س) *", "Official Price (SAR) *")}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("نسبة العربون (%) *", "Deposit (%) *")}
                  </label>
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
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("مدة الجلسة *", "Duration *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder={t("٤ إلى ٥ ساعات", "4–5 Hours")}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("التصنيف", "Category")}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ServicePackage["category"])}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  >
                    <option value="bridal">{t("عرائس ملكي (Bridal)", "Royal Bridal")}</option>
                    <option value="engagement">{t("عقد قران وملكة (Engagement)", "Engagement & Milkah")}</option>
                    <option value="evening">{t("سهرات ومناسبات (Evening)", "Evening & Occasions")}</option>
                    <option value="trial">{t("جلسات التجربة (Trial)", "Bridal Trial")}</option>
                    <option value="group">{t("مرافقات ومجموعات (Group)", "Companions & Groups")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2f020d] block mb-1">
                    {t("شارة الباقة (Badge)", "Package Badge")}
                  </label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    placeholder={t("مثال: الأكثر طلباً للعرائس", "e.g. Most Requested")}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">
                  {t("الوصف العام للباقة", "Package Description")}
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2f020d] block mb-1">
                  {t(
                    "المميزات والتفاصيل الملكية (كل ميزة في سطر منفصل)",
                    "Included Features (one per line)"
                  )}
                </label>
                <textarea
                  rows={4}
                  value={editFeatures}
                  onChange={(e) => setEditFeatures(e.target.value)}
                  placeholder={t(
                    "حضور حصري لعروس واحدة يومياً\nرموش Mink 3D مخصصة لمورفولوجيا العين\nحقيبة رتوش فاخرة هدية",
                    "Strictly one bride per day\nCustom 3D Mink lashes\nComplimentary luxury touch-up kit"
                  )}
                  className="w-full p-3 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00] font-sans leading-relaxed"
                />
                <span className="text-[11px] text-[#857374] block mt-0.5">
                  {t(
                    "اكتبي كل ميزة في سطر جديد وستظهر كعلامة صح ✓ في بطاقة الباقة.",
                    "Enter each feature on a new line to display as a ✓ bullet on the package card."
                  )}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-6 border-t border-[#eedfe0]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2f020d]">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="rounded text-[#2f020d] focus:ring-0"
                  />
                  <span>{t("تفعيل الباقة في الموقع العام للعميلات", "Active on Public Storefront")}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2f020d]">
                  <input
                    type="checkbox"
                    checked={editPopular}
                    onChange={(e) => setEditPopular(e.target.checked)}
                    className="rounded text-[#2f020d] focus:ring-0"
                  />
                  <span>{t("تمييز الباقة كأكثر طلباً", "Highlight as Most Requested")}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eedfe0]">
                <Button variant="outline" type="button" onClick={() => setEditingPkg(null)} className="rounded-full text-xs">
                  {t("إلغاء", "Cancel")}
                </Button>
                <Button type="submit" className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold px-6">
                  {t("حفظ التعديلات", "Save Changes")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

