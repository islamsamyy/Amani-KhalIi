"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { BlogPost } from "@/features/data/initial-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Crown,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminImageUploader } from "@/components/admin-image-uploader";
import { FALLBACK_GALLERY_IMAGE, normalizeImageSrc } from "@/lib/image-upload";

export function AdminBlogClient() {
  const { t, dir } = useLanguage();
  const {
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    toggleBlogPublished,
    toggleBlogFeatured,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState<BlogPost["category"]>("bridal-tips");
  const [formCategoryAr, setFormCategoryAr] = useState("نصائح العرائس");
  const [formAuthor, setFormAuthor] = useState("أماني خليل");
  const [formAuthorRole, setFormAuthorRole] = useState(
    "خبيرة تجميل معتمدة دولياً دبلوم CIDESCO"
  );
  const [formReadTime, setFormReadTime] = useState("4 دقائق");
  const [formCoverImage, setFormCoverImage] = useState(FALLBACK_GALLERY_IMAGE);
  const [isCoverValid, setIsCoverValid] = useState(true);
  const [formTags, setFormTags] = useState("عروس الرياض, تجهيز العروس, مكياج زفاف");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);

  const resetForm = () => {
    setEditingPostId(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent("");
    setFormCategory("bridal-tips");
    setFormCategoryAr("نصائح العرائس");
    setFormAuthor("أماني خليل");
    setFormAuthorRole("خبيرة تجميل معتمدة دولياً دبلوم CIDESCO");
    setFormReadTime("4 دقائق");
    setFormCoverImage("/gallery/IMG_5729.webp");
    setFormTags("عروس الرياض, مكياج زفاف");
    setFormFeatured(false);
    setFormPublished(true);
  };

  const handleOpenAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormCategory(post.category);
    setFormCategoryAr(post.categoryAr);
    setFormAuthor(post.author);
    setFormAuthorRole(post.authorRole);
    setFormReadTime(post.readTime);
    setFormCoverImage(post.coverImage);
    setFormTags(post.tags.join(", "));
    setFormFeatured(!!post.featured);
    setFormPublished(post.published);
    setDialogOpen(true);
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^\u0621-\u064A\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingPostId) {
      setFormSlug(generateSlugFromTitle(val));
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as BlogPost["category"];
    setFormCategory(val);
    switch (val) {
      case "bridal-tips":
        setFormCategoryAr("نصائح العرائس");
        break;
      case "tutorials":
        setFormCategoryAr("دروس وتقنيات");
        break;
      case "trends":
        setFormCategoryAr("صيحات الموضة");
        break;
      case "skincare":
        setFormCategoryAr("العناية والتأسيس");
        break;
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error(t("يرجى إدخال عنوان المقال", "Please enter the article title"));
      return;
    }

    const normalizedCover = normalizeImageSrc(formCoverImage);
    if (!normalizedCover || !isCoverValid) {
      toast.error(
        t(
          "يرجى رفع صورة غلاف صالحة أو اختيار صورة من ألبوم الأتيليه",
          "Please upload a valid cover image or choose one from the Atelier album"
        )
      );
      return;
    }

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title: formTitle.trim(),
      slug: formSlug.trim() || `post-${Date.now()}`,
      excerpt: formExcerpt.trim(),
      content: formContent.trim(),
      category: formCategory,
      categoryAr: formCategoryAr,
      author: formAuthor.trim(),
      authorRole: formAuthorRole.trim(),
      readTime: formReadTime.trim(),
      publishedAt: new Date().toISOString().split("T")[0],
      coverImage: normalizedCover || FALLBACK_GALLERY_IMAGE,
      featured: formFeatured,
      published: formPublished,
      tags: tagsArray.length > 0 ? tagsArray : ["مكياج"],
    };

    if (editingPostId) {
      updateBlogPost(editingPostId, postData);
    } else {
      addBlogPost(postData);
    }

    setDialogOpen(false);
    resetForm();
  };

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCat =
      selectedCategory === "all" || post.category === selectedCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const haystack = (
      post.title +
      " " +
      post.categoryAr +
      " " +
      post.author
    ).toLowerCase();
    return haystack.includes(query);
  });

  return (
    <div dir={dir} className="lg:ps-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-[#2f020d]">
                {t("إدارة المدونة والمقالات الملكية", "Royal Blog & Journal Management")}
              </h1>
              <Badge className="bg-[#735c00] text-[#fed65b] border-none text-[10px]">
                {blogPosts.length} {t("مقالات", "articles")}
              </Badge>
            </div>
            <p className="text-xs text-[#524345] mt-1">
              {t(
                "إضافة وتعديل مقالات الجمال والعرائس، التحكم بالنشر، والظهور في الموقع العام.",
                "Create and edit beauty & bridal articles, control publishing, and manage featured posts."
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/blog" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-[#eedfe0] gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t("معاينة المدونة الحية", "Preview Live Journal")}
              </Button>
            </Link>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="rounded-full bg-[#2f020d] hover:bg-[#4a1521] text-white text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("إضافة مقال جديد", "Add New Article")}
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#eedfe0]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#524345]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("بحث في عنوان المقال أو التصنيف...", "Search by article title or category...")}
              className="ps-10 rounded-full text-xs border-[#eedfe0] bg-[#fff8f7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {[
              { id: "all", label: t("الكل", "All") },
              { id: "bridal-tips", label: t("نصائح العرائس", "Bridal Tips") },
              { id: "tutorials", label: t("دروس وتقنيات", "Tutorials") },
              { id: "trends", label: t("صيحات الموضة", "Trends") },
              { id: "skincare", label: t("العناية والتأسيس", "Skincare & Prep") },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-[#2f020d] text-white"
                    : "bg-[#fff8f7] text-[#524345] hover:bg-[#faeaeb]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="rounded-3xl border border-[#eedfe0] bg-white overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-[#2f020d] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={normalizeImageSrc(post.coverImage) || FALLBACK_GALLERY_IMAGE}
                    alt={post.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_GALLERY_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 start-3 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {post.categoryAr}
                    </span>
                    {post.featured && (
                      <span className="bg-[#fed65b] text-[#241a00] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        {t("مميز", "Featured")}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 end-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        post.published
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {post.published ? t("منشور بالموقع", "Published") : t("مسودة", "Draft")}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#524345]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#735c00]" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#2f020d] line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#524345] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-[#fff0f1] text-[#735c00] px-2 py-0.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls Footer */}
              <div className="p-4 pt-2 border-t border-[#eedfe0] bg-[#fff8f7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleBlogPublished(post.id)}
                    className="h-8 w-8 p-0 rounded-full border-[#eedfe0]"
                    title={post.published ? t("إلغاء النشر (تحويل لمسودة)", "Unpublish (Move to Draft)") : t("نشر المقال", "Publish Article")}
                  >
                    {post.published ? (
                      <Eye className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleBlogFeatured(post.id)}
                    className={`h-8 w-8 p-0 rounded-full border-[#eedfe0] ${
                      post.featured ? "bg-[#fed65b] text-[#241a00]" : ""
                    }`}
                    title={post.featured ? t("إلغاء التمييز", "Remove Featured") : t("تمييز في الواجهة", "Feature on Homepage")}
                  >
                    <Crown className="h-3.5 w-3.5" />
                  </Button>

                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-full border-[#eedfe0]"
                      title={t("معاينة المقال", "Preview Article")}
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#524345]" />
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenEdit(post)}
                    className="h-8 px-3 rounded-full border-[#eedfe0] text-xs font-semibold"
                  >
                    <Edit3 className="h-3.5 w-3.5 me-1 text-[#735c00]" />
                    {t("تعديل", "Edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm(t("هل أنت متأكدة من حذف هذا المقال نهائياً؟", "Are you sure you want to permanently delete this article?"))) {
                        deleteBlogPost(post.id);
                      }
                    }}
                    className="h-8 w-8 p-0 rounded-full border-[#eedfe0] text-red-600 hover:bg-red-50"
                    title={t("حذف المقال", "Delete Article")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add/Edit Modal Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl" dir={dir}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-serif text-[#2f020d]">
                {editingPostId
                  ? t("تعديل بيانات المقال", "Edit Article")
                  : t("كتابة مقال ملكي جديد", "Write New Royal Article")}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#524345]">
                {t(
                  "أدخلي محتوى المقال والتفاصيل الملحقة لعرضها لعميلات وزائرات الموقع.",
                  "Enter article content and details to publish for website visitors."
                )}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2f020d]">
                  {t("عنوان المقال *", "Article Title *")}
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t("مثال: جدول العناية بالبشرة قبل الزفاف بـ 3 أشهر", "e.g. 3-Month Pre-Wedding Bridal Skincare Timeline")}
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">
                    {t("الرابط الدائم (Slug)", "URL Slug")}
                  </label>
                  <Input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="riyadh-bride-skincare"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">
                    {t("التصنيف", "Category")}
                  </label>
                  <select
                    value={formCategory}
                    onChange={handleCategorySelect}
                    className="w-full text-xs rounded-md border border-[#eedfe0] bg-white px-3 py-2 text-[#211a1b]"
                  >
                    <option value="bridal-tips">{t("نصائح العرائس (bridal-tips)", "Bridal Tips")}</option>
                    <option value="tutorials">{t("دروس وتقنيات (tutorials)", "Tutorials")}</option>
                    <option value="trends">{t("صيحات الموضة (trends)", "Trends")}</option>
                    <option value="skincare">{t("العناية والتأسيس (skincare)", "Skincare & Prep")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2f020d]">
                  {t("مقدمة المقال (Excerpt)", "Article Excerpt")}
                </label>
                <textarea
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  rows={2}
                  placeholder={t("ملخص المقال المشوق الذي يظهر في بطاقات التصفح...", "Engaging summary shown on article cards...")}
                  className="w-full text-xs rounded-md border border-[#eedfe0] bg-white p-2.5 text-[#211a1b] leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2f020d]">
                  {t(
                    "نص المقال الكامل (يدعم عناوين ### وقوائم * ومقاطع الفقرات)",
                    "Full Article Content (supports ### headings, * lists, and paragraphs)"
                  )}
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={7}
                  placeholder={t("اكتبي نص المقال هنا...", "Write article content here...")}
                  className="w-full text-xs rounded-md border border-[#eedfe0] bg-white p-2.5 text-[#211a1b] leading-relaxed font-sans"
                />
              </div>

              <AdminImageUploader
                value={formCoverImage}
                onChange={setFormCoverImage}
                onValidityChange={setIsCoverValid}
                label={t("صورة غلاف المقال *", "Article Cover Image *")}
                aspectClassName="aspect-[16/9]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">
                    {t("وقت القراءة", "Read Time")}
                  </label>
                  <Input
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder={t("4 دقائق", "4 min read")}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">
                    {t("الوسوم (مفصولة بفاصلة)", "Tags (comma-separated)")}
                  </label>
                  <Input
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder={t("عروس, مكياج, ثبات", "bride, makeup, long-wear")}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-6 border-t border-[#eedfe0]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2f020d]">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="rounded text-[#2f020d] focus:ring-0"
                  />
                  <span>{t("نشر المقال فوراً بالموقع", "Publish Immediately")}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2f020d]">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-[#2f020d] focus:ring-0"
                  />
                  <span>{t("تمييز المقال في الواجهة الرئيسية", "Feature on Homepage")}</span>
                </label>
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-full text-xs"
                >
                  {t("إلغاء", "Cancel")}
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-[#2f020d] hover:bg-[#4a1521] text-white text-xs px-6"
                >
                  {editingPostId
                    ? t("حفظ التعديلات", "Save Changes")
                    : t("نشر المقال", "Publish Article")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

