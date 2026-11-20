"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  User,
  Search,
  ArrowLeft,
  Crown,
  Heart,
  Share2,
  Tag,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "all", label: "جميع المقالات" },
  { id: "bridal-tips", label: "نصائح العرائس" },
  { id: "tutorials", label: "دروس وتقنيات" },
  { id: "trends", label: "صيحات الموضة" },
  { id: "skincare", label: "العناية والتأسيس" },
];

export function BlogClient() {
  const { t, dir } = useLanguage();
  const { blogPosts } = useAppStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const publishedPosts = blogPosts.filter((post) => post.published);

  const filteredPosts = publishedPosts.filter((post) => {
    const matchesCat =
      activeCategory === "all" || post.category === activeCategory;
    if (!matchesCat) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    const haystack = (
      post.title +
      " " +
      post.excerpt +
      " " +
      post.categoryAr +
      " " +
      post.tags.join(" ")
    ).toLowerCase();
    return haystack.includes(query);
  });

  const featuredPost =
    publishedPosts.find((p) => p.featured) || publishedPosts[0];

  const handleShare = (postTitle: string, slug: string) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/blog/${slug}`;
      if (navigator.share) {
        navigator.share({ title: postTitle, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط المقال بنجاح 📋");
      }
    }
  };

  return (
    <div dir={dir} className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] via-[#430816] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#a33d59]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge
            variant="gold"
            className="mb-4 bg-[#735c00]/40 text-[#fed65b] border border-[#fed65b]/30 px-3.5 py-1 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 me-1.5" />
            {t("المدونة الملكية • Luxury Beauty Blog", "Royal Beauty Journal • Luxury Blog")}
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            {t(
              "أسرار الجمال، نصائح العرائس، وفنون الإطلالة الملكية",
              "Beauty Secrets, Bridal Guides & Royal Artistry"
            )}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto leading-relaxed">
            {t(
              "مقالات حصرية مستوحاة من خبرة دبلوم CIDESCO الدولي وسنوات من إعداد أجمل عرائس الرياض. دليلكِ الشامل لبشرة مشرقة ومكياج زفاف متألق يدوم.",
              "Exclusive articles inspired by international CIDESCO expertise and years of styling Riyadh's most luminous brides."
            )}
          </p>

          {/* Quick Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#eedfe0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن موضوع: فاونديشن، عروس، ثبات، تجهيز..."
              className="w-full pr-10 pl-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-[#eedfe0]/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#fed65b]"
            />
          </div>
        </div>
      </section>

      {/* 2. Featured Article Banner (Only on "All" and when no search query) */}
      {featuredPost && activeCategory === "all" && !searchQuery.trim() && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-10 relative z-20">
          <Card className="overflow-hidden border border-[#eedfe0] bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[340px] bg-[#2f020d] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-[#735c00] text-[#fed65b] font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5" />
                  مقال مميز
                </div>
              </div>

              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#735c00] font-medium mb-3">
                    <span className="bg-[#faeaeb] text-[#2f020d] px-3 py-1 rounded-full font-bold">
                      {featuredPost.categoryAr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readTime}
                    </span>
                    <span className="flex items-center gap-1 text-[#524345]">
                      <Calendar className="h-3.5 w-3.5" />
                      {featuredPost.publishedAt}
                    </span>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`}>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#2f020d] hover:text-[#735c00] transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-xs sm:text-sm text-[#524345] leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {featuredPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] bg-[#fff0f1] text-[#735c00] px-2.5 py-0.5 rounded-full border border-[#eedfe0]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#eedfe0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#faeaeb] flex items-center justify-center text-[#2f020d] font-bold text-xs">
                      أخ
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2f020d]">
                        {featuredPost.author}
                      </p>
                      <p className="text-[10px] text-[#524345]">
                        {featuredPost.authorRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare(featuredPost.title, featuredPost.slug)}
                      className="p-2 rounded-full hover:bg-[#faeaeb] text-[#524345] transition-colors"
                      title="مشاركة المقال"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button
                        size="sm"
                        className="rounded-full bg-[#2f020d] hover:bg-[#4a1521] text-white text-xs px-4"
                      >
                        قراءة المقال
                        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* 3. Category Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#eedfe0] pb-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-[#2f020d] text-white shadow-sm"
                    : "bg-white text-[#524345] border border-[#eedfe0] hover:bg-[#fff0f1]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#524345] font-medium">
            عدد المقالات: {filteredPosts.length}
          </span>
        </div>

        {/* 4. Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#eedfe0] my-8 p-6">
            <BookOpen className="h-10 w-10 text-[#735c00] mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-[#2f020d]">لا توجد مقالات مطابقة</h3>
            <p className="text-xs text-[#524345] mt-1 max-w-sm mx-auto">
              لم نعثر على نتائج مطابقة لبحثكِ. جربي كلمات مفتاحية أخرى أو تصفحي جميع الأقسام.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-full text-xs border-[#eedfe0]"
            >
              عرض جميع المقالات
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden rounded-3xl border border-[#eedfe0] bg-white flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#2f020d] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {post.categoryAr}
                    </div>
                    {post.featured && (
                      <div className="absolute top-3 left-3 bg-[#fed65b] text-[#241a00] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Crown className="h-3 w-3" />
                        VIP
                      </div>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 text-[11px] text-[#524345] mb-2.5">
                      <span className="flex items-center gap-1 text-[#735c00] font-medium">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{post.publishedAt}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#2f020d] group-hover:text-[#735c00] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="mt-2.5 text-xs text-[#524345] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1">
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

                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#eedfe0]/60 flex items-center justify-between">
                  <div className="text-[11px] text-[#2f020d] font-semibold flex items-center gap-1.5">
                    <User className="h-3 w-3 text-[#735c00]" />
                    {post.author}
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-xs text-[#2f020d] hover:text-[#735c00] hover:bg-[#fff0f1] px-3 font-bold"
                    >
                      قراءة
                      <ArrowLeft className="mr-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 5. Booking CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#2f020d] via-[#430816] to-[#735c00] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Badge
              variant="gold"
              className="bg-[#fed65b]/20 text-[#fed65b] border-none px-3 py-1 text-xs"
            >
              استشارة وتجهيز ملكي خاص
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              هل اقترب موعد زفافكِ أو مناسبتكِ في الرياض؟
            </h2>
            <p className="text-xs sm:text-sm text-[#eedfe0] leading-relaxed">
              احجزي موعدكِ الآن لتثبيت التاريخ في جدول المواعيد الرسمي واستمتعي
              بجلسة مكياج فاخرة في جناحكِ الفندقي أو قصركِ مع أماني خليل.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
              <Link href="/book">
                <Button className="rounded-full bg-[#fed65b] hover:bg-[#fed65b]/90 text-[#241a00] font-bold text-xs sm:text-sm px-6 py-5 shadow-lg">
                  <Crown className="ml-1.5 h-4 w-4" />
                  حجز موعد ملكي فوري
                </Button>
              </Link>
              <a
                href="https://wa.me/966504655724"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-white/30 text-white hover:bg-white/10 text-xs sm:text-sm px-5 py-5"
                >
                  <MessageCircle className="ml-1.5 h-4 w-4" />
                  استشارة واتساب سريعة
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

