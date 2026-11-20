"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import type { GalleryLook } from "@/features/data/initial-data";
import { AdminImageUploader } from "@/components/admin-image-uploader";
import { FALLBACK_GALLERY_IMAGE, normalizeImageSrc } from "@/lib/image-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  Search,
  Filter,
  MapPin,
  Calendar,
  Crown,
  Clock,
  ExternalLink,
  Pencil,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";

export function AdminContentClient() {
  const { t, dir } = useLanguage();
  const {
    reviews,
    toggleReviewApproval,
    toggleReviewFeatured,
    deleteReview,
    gallery,
    deleteGalleryLook,
    addGalleryLook,
    updateGalleryLook,
  } = useAppStore();

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingLookId, setEditingLookId] = useState<string | null>(null);
  const [lookTitle, setLookTitle] = useState("");
  const [lookCategory, setLookCategory] = useState<
    "bridal" | "evening" | "soft" | "engagement"
  >("bridal");
  const [lookCategoryAr, setLookCategoryAr] = useState("عرائس ملكي");
  const [lookImage, setLookImage] = useState(FALLBACK_GALLERY_IMAGE);
  const [isLookImageValid, setIsLookImageValid] = useState(true);
  const [lookClientType, setLookClientType] = useState(
    "عروس فندق الريتز-كارلتون"
  );
  const [lookTags, setLookTags] = useState("مكياج عروس, فخامة ملكية");
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>({});

  const resetLookForm = () => {
    setEditingLookId(null);
    setLookTitle("");
    setLookCategory("bridal");
    setLookCategoryAr("عرائس ملكي");
    setLookImage(FALLBACK_GALLERY_IMAGE);
    setIsLookImageValid(true);
    setLookClientType("عروس فندق الريتز-كارلتون");
    setLookTags("مكياج عروس, فخامة ملكية");
  };

  const handleOpenAddLook = () => {
    resetLookForm();
    setGalleryModalOpen(true);
  };

  const handleOpenEditLook = (look: GalleryLook) => {
    setEditingLookId(look.id);
    setLookTitle(look.title);
    setLookCategory(look.category);
    setLookCategoryAr(look.categoryAr);
    setLookImage(look.image);
    setIsLookImageValid(true);
    setLookClientType(look.clientType);
    setLookTags((look.styleTags || []).join(", "));
    setGalleryModalOpen(true);
  };

  const handleSaveLook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookTitle.trim()) {
      toast.error("يرجى إدخال عنوان الإطلالة");
      return;
    }
    const normalizedImg = normalizeImageSrc(lookImage);
    if (!normalizedImg || !isLookImageValid) {
      toast.error("يرجى رفع صورة صالحة أو اختيار صورة من ألبوم الأتيليه قبل الحفظ");
      return;
    }
    const tags = lookTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: lookTitle.trim(),
      category: lookCategory,
      categoryAr: lookCategoryAr,
      image: normalizedImg,
      clientType: lookClientType.trim() || "عميلة ملكية",
      styleTags: tags.length > 0 ? tags : ["إطلالة ملكية"],
    };

    if (editingLookId) {
      updateGalleryLook(editingLookId, payload);
      setBrokenImageIds((prev) => {
        const next = { ...prev };
        delete next[editingLookId];
        return next;
      });
    } else {
      addGalleryLook(payload);
    }

    setGalleryModalOpen(false);
    resetLookForm();
  };

  const handleCategoryChange = (val: "bridal" | "evening" | "soft" | "engagement") => {
    setLookCategory(val);
    switch (val) {
      case "bridal":
        setLookCategoryAr("عرائس ملكي");
        break;
      case "evening":
        setLookCategoryAr("سهرات ومناسبات");
        break;
      case "soft":
        setLookCategoryAr("ناعم وهادئ");
        break;
      case "engagement":
        setLookCategoryAr("خطوبة وملكة");
        break;
    }
  };
  const [contractClauses, setContractClauses] = useState(
    "١. يُعتبر العربون غير مسترد بعد تأكيد الحجز نظراً لتخصيص التاريخ لعروس واحدة.\n٢. يحق للعميلة تأجيل الموعد لمرة واحدة دون رسوم بشرط إشعار مسبق قبل ٢١ يوماً.\n٣. يُمنع تصوير أو نشر أي صورة أو مقطع دون موافقة خطية صريحة من العميلة.\n٤. تلتزم خبيرة التجميل بالحضور في التوقيت المحدد مع فريق العمل وأدوات التعقيم الطبي المعتمدة."
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("amani_contract_clauses_v1");
      if (saved && saved.trim()) {
        setContractClauses(saved);
      }
    } catch {}
  }, []);

  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"all" | "approved" | "pending">("all");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        r.clientName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.packageTitle.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.venue.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment.toLowerCase().includes(reviewSearch.toLowerCase());

      if (!matchSearch) return false;
      if (reviewFilter === "approved") return r.approved;
      if (reviewFilter === "pending") return !r.approved;
      return true;
    });
  }, [reviews, reviewSearch, reviewFilter]);

  const handleSaveContract = () => {
    try {
      localStorage.setItem("amani_contract_clauses_v1", contractClauses);
    } catch {}
    toast.success("تم تحديث وحفظ صياغة بنود العقد والسياسات الرسمية بنجاح ✨");
  };

  const approvedCount = reviews.filter((r) => r.approved).length;
  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div dir={dir} className="lg:ps-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#eedfe0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
                {t("لوحة إدارة المحتوى الرقمي", "Digital Content Management")}
              </span>
              <Badge variant="gold" className="text-[10px] px-2 py-0.5">
                {t("تحديث فوري", "Live Sync")}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2f020d] mt-1">
              {t("إدارة المحتوى والتقييمات والمعرض", "Content, Reviews & Gallery Management")}
            </h1>
            <p className="text-xs text-[#524345] mt-1 max-w-2xl leading-relaxed">
              {t(
                "اعتماد تقييمات العميلات الجديدة، حذف المراجعات غير اللائقة، إدارة إطلالات المعرض، وتحديث بنود عقد الحجز الإلكتروني الموثق.",
                "Approve client reviews, upload & edit portfolio gallery looks, and update verified digital contract clauses."
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/reviews"
              target="_blank"
              className="h-10 px-4 rounded-full border border-[#eedfe0] bg-white text-xs font-bold text-[#2f020d] flex items-center gap-1.5 hover:bg-[#faeaeb] transition-colors"
            >
              <span>{t("معاينة صفحة التقييمات العامة", "Preview Public Reviews")}</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#735c00]" />
            </Link>
          </div>
        </div>

        {/* 3 Main Tabs */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="bg-[#faeaeb] p-1.5 rounded-full flex flex-wrap gap-1.5 mb-6 border border-[#eedfe0]">
            <TabsTrigger
              value="reviews"
              className="rounded-full text-xs font-bold px-5 py-2 data-[state=active]:bg-[#4a1521] data-[state=active]:text-white transition-all"
            >
              <Star className="w-3.5 h-3.5 me-1.5 inline text-[#fed65b]" />
              <span>تقييمات العميلات ({reviews.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="rounded-full text-xs font-bold px-5 py-2 data-[state=active]:bg-[#4a1521] data-[state=active]:text-white transition-all"
            >
              <Camera className="w-3.5 h-3.5 me-1.5 inline text-[#fed65b]" />
              <span>معرض الصور ({gallery.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="contract"
              className="rounded-full text-xs font-bold px-5 py-2 data-[state=active]:bg-[#4a1521] data-[state=active]:text-white transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 me-1.5 inline text-[#fed65b]" />
              <span>بنود العقد والسياسات الرسمية</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Reviews Management */}
          <TabsContent value="reviews" className="space-y-5 animate-fade-in">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#eedfe0] shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#857374]" />
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder="بحث في اسم العميلة، الباقة، القاعة، أو نص التقييم..."
                  className="w-full h-10 pr-10 pl-4 rounded-xl bg-[#fff8f7] border border-[#eedfe0] text-xs text-[#211a1b] placeholder:text-[#857374] focus:outline-none focus:border-[#735c00] transition-colors"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    reviewFilter === "all"
                      ? "bg-[#2f020d] text-white shadow-sm"
                      : "bg-[#fff0f1] text-[#524345] hover:bg-[#faeaeb]"
                  }`}
                >
                  الكل ({reviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("approved")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    reviewFilter === "approved"
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  المعتمدة ({approvedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("pending")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    reviewFilter === "pending"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  قيد المراجعة ({pendingCount})
                </button>
              </div>
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#eedfe0] space-y-3">
                <Star className="w-10 h-10 text-[#eedfe0] mx-auto" />
                <h3 className="text-base font-bold text-[#2f020d]">لا توجد تقييمات مطابقة</h3>
                <p className="text-xs text-[#524345]">جربي البحث بكلمات أخرى أو تغيير الفلتر.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map((r) => (
                  <Card
                    key={r.id}
                    className="rounded-3xl border border-[#eedfe0] bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-[#faeaeb] border border-[#d7c1c3] text-[#4a1521] font-bold text-sm flex items-center justify-center shrink-0">
                            {r.clientName.trim().charAt(0) || "ع"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-[#2f020d] leading-tight">
                                {r.clientName}
                              </h3>
                              {r.approved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  معتمد
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                  <Clock className="w-3 h-3" />
                                  معلق
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#735c00] mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                {r.packageTitle}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-[#857374]">
                                <MapPin className="w-3 h-3" />
                                {r.venue}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 bg-[#fff8f7] px-2.5 py-1 rounded-full border border-[#eedfe0] shrink-0">
                          <span className="text-xs font-bold text-[#2f020d]">{r.rating}.0</span>
                          <div className="flex items-center text-amber-500">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Comment Box */}
                      <div className="p-3.5 rounded-2xl bg-[#fff8f7] border border-[#eedfe0]/70 text-xs text-[#524345] leading-relaxed relative">
                        <span className="text-base font-serif text-[#735c00] font-bold">&ldquo;</span>
                        <span className="px-1">{r.comment}</span>
                        <span className="text-base font-serif text-[#735c00] font-bold">&rdquo;</span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-[#eedfe0] flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant={r.approved ? "default" : "outline"}
                          onClick={() => toggleReviewApproval(r.id)}
                          className={`rounded-full text-xs h-8.5 px-3.5 font-bold transition-all ${
                            r.approved
                              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                              : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {r.approved ? "معتمد بالموقع ✓" : "اعتماد للنشر"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleReviewFeatured(r.id)}
                          className={`rounded-full text-xs h-8.5 px-3.5 font-bold transition-all ${
                            r.featured
                              ? "bg-[#fed65b] text-[#241a00] border-none shadow-sm"
                              : "border-[#735c00] text-[#735c00] hover:bg-[#faeaeb]"
                          }`}
                        >
                          {r.featured ? "★ مميز بالرئيسية" : "تمييز"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#857374] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {r.date}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("هل أنتِ متأكدة من رغبتكِ في حذف هذا التقييم نهائياً؟")) {
                              deleteReview(r.id);
                            }
                          }}
                          aria-label="حذف التقييم"
                          className="h-8.5 w-8.5 rounded-full text-[#ba1a1a] hover:bg-[#ffdad6]/60 flex items-center justify-center transition-colors cursor-pointer"
                          title="حذف التقييم نهائياً"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Gallery Management */}
          <TabsContent value="gallery" className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-white border border-[#eedfe0]">
              <div>
                <h3 className="text-sm font-bold text-[#2f020d]">إجمالي الإطلالات المنشورة في المعرض</h3>
                <p className="text-xs text-[#524345]">الصور المعروضة للزائرات في قسم معرض الأعمال وتطبيق الحجز ({gallery.length} إطلالة)</p>
              </div>
              <Button
                size="sm"
                onClick={handleOpenAddLook}
                className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold gap-1.5 px-5 shadow-sm cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#fed65b]" />
                <span>إضافة إطلالة جديدة</span>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => {
                const isBroken = Boolean(brokenImageIds[g.id]) || !normalizeImageSrc(g.image);
                return (
                  <div
                    key={g.id}
                    className="rounded-3xl overflow-hidden border border-[#eedfe0] bg-white shadow-sm hover:shadow-md transition-all space-y-2 pb-3 group relative"
                  >
                    <div className="aspect-[4/5] bg-[#faeaeb] overflow-hidden relative">
                      {isBroken ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center gap-2 bg-[#fff0f1]">
                          <ImageOff className="h-8 w-8 text-[#857374]" />
                          <p className="text-[11px] font-bold text-[#2f020d]">
                            الصورة غير متوفرة
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenEditLook(g)}
                            className="px-3 py-1 rounded-full bg-[#4a1521] text-white text-[10px] font-bold hover:bg-[#2f020d] transition-colors cursor-pointer"
                          >
                            رفع صورة بديلة
                          </button>
                        </div>
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={normalizeImageSrc(g.image)}
                          alt={g.title}
                          onError={() =>
                            setBrokenImageIds((prev) => ({ ...prev, [g.id]: true }))
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <Badge variant="gold" className="absolute top-2.5 start-2.5 text-[10px] font-bold shadow-md">
                        {g.categoryAr}
                      </Badge>
                      <div className="absolute top-2.5 end-2.5 flex items-center gap-1.5 z-10">
                        <button
                          type="button"
                          onClick={() => handleOpenEditLook(g)}
                          aria-label={`تعديل إطلالة ${g.title}`}
                          title="تعديل الإطلالة والصورة"
                          className="h-8 w-8 rounded-full bg-white/95 hover:bg-[#faeaeb] text-[#4a1521] border border-[#eedfe0] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`هل أنتِ متأكدة من حذف إطلالة "${g.title}" نهائياً من المعرض؟`)) {
                              deleteGalleryLook(g.id);
                            }
                          }}
                          aria-label={`حذف إطلالة ${g.title}`}
                          title="حذف الإطلالة نهائياً"
                          className="h-8 w-8 rounded-full bg-white/95 hover:bg-rose-50 text-rose-600 border border-[#eedfe0] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="px-3.5 pt-1 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#2f020d] truncate">{g.title}</h4>
                        <p className="text-[10px] text-[#857374] truncate mt-0.5">{g.clientType}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenEditLook(g)}
                        title="تعديل الإطلالة"
                        className="h-7 px-2.5 rounded-full bg-[#faeaeb] hover:bg-[#eedfe0] text-[#4a1521] text-[10px] font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>تعديل</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add / Edit Gallery Look Modal Dialog */}
            <Dialog
              open={galleryModalOpen}
              onOpenChange={(open) => {
                setGalleryModalOpen(open);
                if (!open) resetLookForm();
              }}
            >
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#fff8f7] border border-[#d7c1c3] p-6 text-right rounded-3xl" dir="rtl">
                <DialogHeader className="text-right">
                  <DialogTitle className="text-lg font-bold text-[#2f020d]">
                    {editingLookId
                      ? "تعديل الإطلالة وتحديث الصورة"
                      : "إضافة إطلالة ملكية جديدة للمعرض"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#524345]">
                    ارفعي صورة العمل مباشرة من جهازكِ أو اختاري من ألبوم الأتيليه ليتم عرضها بوضوح تام في المعرض وتطبيق الحجز.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSaveLook} className="space-y-4 my-2">
                  <AdminImageUploader
                    value={lookImage}
                    onChange={setLookImage}
                    onValidityChange={setIsLookImageValid}
                    label="صورة الإطلالة *"
                    aspectClassName="aspect-[4/3]"
                  />

                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1">عنوان الإطلالة *</label>
                    <input
                      type="text"
                      required
                      value={lookTitle}
                      onChange={(e) => setLookTitle(e.target.value)}
                      placeholder="مثال: مكياج العروس الملكي (Royal Glow)"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#2f020d] block mb-1">التصنيف</label>
                      <select
                        value={lookCategory}
                        onChange={(e) => handleCategoryChange(e.target.value as typeof lookCategory)}
                        className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                      >
                        <option value="bridal">عرائس ملكي (bridal)</option>
                        <option value="evening">سهرات ومناسبات (evening)</option>
                        <option value="soft">ناعم وهادئ (soft)</option>
                        <option value="engagement">خطوبة وملكة (engagement)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2f020d] block mb-1">وصف العروس / القاعة</label>
                      <input
                        type="text"
                        value={lookClientType}
                        onChange={(e) => setLookClientType(e.target.value)}
                        placeholder="عروس فندق الريتز-كارلتون"
                        className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2f020d] block mb-1">وسوم الإطلالة (مفصولة بفاصلة)</label>
                    <input
                      type="text"
                      value={lookTags}
                      onChange={(e) => setLookTags(e.target.value)}
                      placeholder="مكياج عروس, فخامة ملكية, رموش 3D"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs focus:outline-none focus:border-[#735c00]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#eedfe0]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setGalleryModalOpen(false);
                        resetLookForm();
                      }}
                      className="rounded-full text-xs"
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white text-xs font-bold px-6"
                    >
                      {editingLookId ? "حفظ التعديلات" : "نشر في المعرض"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab 3: Contract & Policies Editing */}
          <TabsContent value="contract" className="space-y-4 animate-fade-in">
            <Card className="rounded-3xl border border-[#eedfe0] bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#eedfe0] pb-4">
                <span className="text-xs font-bold text-[#735c00] uppercase tracking-wider">
                  العقود والسياسات الرسمية
                </span>
                <h3 className="text-lg font-bold font-serif text-[#2f020d] mt-1">
                  صياغة بنود العقد الإلكتروني الموثق
                </h3>
                <p className="text-xs text-[#524345] mt-1 leading-relaxed">
                  هذه البنود تظهر للعروس في الخطوة الرابعة من الحجز قبل السداد، وتُرفق تلقائياً في فاتورة وعقد الحجز الإلكتروني الرسمي المرسل عبر الواتساب والبريد.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2f020d] block">
                  نص البنود والشروط (كل بند في سطر مستقل):
                </label>
                <textarea
                  rows={9}
                  value={contractClauses}
                  onChange={(e) => setContractClauses(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-[#eedfe0] bg-[#fff8f7] text-xs leading-relaxed text-[#211a1b] focus:outline-none focus:bg-white focus:border-[#735c00] transition-colors"
                />
                <p className="text-[11px] text-[#857374] text-left">
                  عدد الأحرف: {contractClauses.length}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#eedfe0]">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  صياغة معتمدة وقانونية
                </span>
                <Button
                  onClick={handleSaveContract}
                  className="rounded-full bg-[#4a1521] hover:bg-[#2f020d] text-white font-bold text-xs gap-1.5 px-6 shadow-md"
                >
                  <Save className="h-4 w-4 text-[#fed65b]" />
                  <span>تحديث وحفظ بنود العقد</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
