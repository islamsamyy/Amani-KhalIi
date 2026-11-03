"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
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

export function AdminBlogClient() {
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
  const [formCoverImage, setFormCoverImage] = useState("/gallery/IMG_5729.webp");
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
      toast.error("يرجى إدخال عنوان المقال");
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
      coverImage: formCoverImage.trim() || "/gallery/IMG_5729.webp",
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
    <div dir="rtl" className="lg:pr-72 transition-all duration-300">
      <main className="w-full pt-24 px-4 sm:px-6 lg:px-10 pb-16 bg-[#fff8f7] min-h-screen space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-[#2f020d]">
                إدارة المدونة والمقالات الملكية
              </h1>
              <Badge className="bg-[#735c00] text-[#fed65b] border-none text-[10px]">
                {blogPosts.length} مقالات
              </Badge>
            </div>
            <p className="text-xs text-[#524345] mt-1">
              إضافة وتعديل مقالات الجمال والعرائس، التحكم بالنشر، والظهور في الموقع العام.
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
                معاينة المدونة الحية
              </Button>
            </Link>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="rounded-full bg-[#2f020d] hover:bg-[#4a1521] text-white text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              إضافة مقال جديد
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#eedfe0]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#524345]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في عنوان المقال أو التصنيف..."
              className="pr-10 rounded-full text-xs border-[#eedfe0] bg-[#fff8f7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {[
              { id: "all", label: "الكل" },
              { id: "bridal-tips", label: "نصائح العرائس" },
              { id: "tutorials", label: "دروس وتقنيات" },
              { id: "trends", label: "صيحات الموضة" },
              { id: "skincare", label: "العناية والتأسيس" },
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
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {post.categoryAr}
                    </span>
                    {post.featured && (
                      <span className="bg-[#fed65b] text-[#241a00] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        مميز
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        post.published
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {post.published ? "منشور بالموقع" : "مسودة"}
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
                    title={post.published ? "إلغاء النشر (تحويل لمسودة)" : "نشر المقال"}
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
                    title={post.featured ? "إلغاء التمييز" : "تمييز في الواجهة"}
                  >
                    <Crown className="h-3.5 w-3.5" />
                  </Button>

                  <Link href={`/blog/${post.slug}`} target="_blank">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 rounded-full border-[#eedfe0]"
                      title="معاينة المقال"
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
                    <Edit3 className="h-3.5 w-3.5 ml-1 text-[#735c00]" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm("هل أنت متأكدة من حذف هذا المقال نهائياً؟")) {
                        deleteBlogPost(post.id);
                      }
                    }}
                    className="h-8 w-8 p-0 rounded-full border-[#eedfe0] text-red-600 hover:bg-red-50"
                    title="حذف المقال"
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-serif text-[#2f020d]">
                {editingPostId ? "تعديل بيانات المقال" : "كتابة مقال ملكي جديد"}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#524345]">
                أدخلي محتوى المقال والتفاصيل الملحقة لعرضها لعميلات وزائرات الموقع.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2f020d]">عنوان المقال *</label>
                <Input
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="مثال: جدول العناية بالبشرة قبل الزفاف بـ 3 أشهر"
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">الرابط الدائم (Slug)</label>
                  <Input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="riyadh-bride-skincare"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">التصنيف</label>
                  <select
                    value={formCategory}
                    onChange={handleCategorySelect}
                    className="w-full text-xs rounded-md border border-[#eedfe0] bg-white px-3 py-2 text-[#211a1b]"
                  >
                    <option value="bridal-tips">نصائح العرائس (bridal-tips)</option>
                    <option value="tutorials">دروس وتقنيات (tutorials)</option>
                    <option value="trends">صيحات الموضة (trends)</option>
                    <option value="skincare">العناية والتأسيس (skincare)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2f020d]">مقدمة المقال (Excerpt)</label>
                <textarea
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  rows={2}
                  placeholder="ملخص المقال المشوق الذي يظهر في بطاقات التصفح..."
                  className="w-full text-xs rounded-md border border-[#eedfe0] bg-white p-2.5 text-[#211a1b] leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2f020d]">
                  نص المقال الكامل (يدعم عناوين ### وقوائم * ومقاطع الفقرات)
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={7}
                  placeholder="اكتبي نص المقال هنا..."
                  className="w-full text-xs rounded-md border border-[#eedfe0] bg-white p-2.5 text-[#211a1b] leading-relaxed font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">وقت القراءة</label>
                  <Input
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    placeholder="4 دقائق"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">رابط صورة الغلاف</label>
                  <Input
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="/gallery/IMG_5729.webp"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#2f020d]">الوسوم (مفصولة بفاصلة)</label>
                  <Input
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="عروس, مكياج, ثبات"
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
                  <span>نشر المقال فوراً بالموقع</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2f020d]">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-[#2f020d] focus:ring-0"
                  />
                  <span>تمييز المقال في الواجهة الرئيسية</span>
                </label>
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-full text-xs"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-[#2f020d] hover:bg-[#4a1521] text-white text-xs px-6"
                >
                  {editingPostId ? "حفظ التعديلات" : "نشر المقال"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

