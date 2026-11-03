"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Crown,
  Sparkles,
  BookOpen,
  MessageCircle,
  Tag,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export function BlogPostClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { blogPosts } = useAppStore();
  const [copied, setCopied] = useState(false);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] pt-32 pb-20 text-center px-4">
        <div className="max-w-md mx-auto space-y-4">
          <BookOpen className="h-12 w-12 text-[#735c00] mx-auto opacity-70" />
          <h1 className="text-2xl font-serif font-bold text-[#2f020d]">المقال غير متوفر أو تم نقله</h1>
          <p className="text-xs text-[#524345]">
            نعتذر، لم نتمكن من العثور على المقال المطلوب. ربما تم تعديل الرابط أو إلغاء نشره.
          </p>
          <Link href="/blog">
            <Button className="rounded-full bg-[#2f020d] text-white text-xs px-5">
              العودة إلى المدونة الملكية
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.published)
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: post.title, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("تم نسخ رابط المقال للمشاركة ✨");
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div dir="rtl" className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Article Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] via-[#430816] to-[#4a1521] text-white py-14 lg:py-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Link
              href="/blog"
              className="inline-flex items-center text-xs text-[#fed65b] hover:underline"
            >
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
              العودة للمدونة
            </Link>
            <span className="text-white/40">•</span>
            <span className="bg-[#735c00]/40 text-[#fed65b] text-xs px-3 py-0.5 rounded-full border border-[#fed65b]/20 font-bold">
              {post.categoryAr}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-[#eedfe0] max-w-2xl mx-auto leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#eedfe0] flex-wrap">
            <span className="font-semibold text-white">{post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#fed65b]">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Article Featured Image & Body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 pb-16">
        <Card className="rounded-3xl overflow-hidden border border-[#eedfe0] bg-white shadow-xl p-6 sm:p-10">
          <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#2f020d] mb-8 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Social Share & Meta bar */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#eedfe0] flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-[#faeaeb] text-[#2f020d] flex items-center justify-center font-bold text-sm">
                أخ
              </div>
              <div>
                <p className="text-xs font-bold text-[#2f020d]">{post.author}</p>
                <p className="text-[10px] text-[#524345]">{post.authorRole}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-xs border-[#eedfe0] gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? "تم النسخ" : "مشاركة المقال"}
            </Button>
          </div>

          {/* Body Content */}
          <div className="prose prose-sm sm:prose max-w-none text-[#211a1b] leading-relaxed space-y-4 font-sans">
            {post.content.split("\n\n").map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-lg sm:text-xl font-bold font-serif text-[#2f020d] mt-6 mb-2"
                  >
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("#### ")) {
                return (
                  <h4
                    key={idx}
                    className="text-base font-bold text-[#735c00] mt-4 mb-1"
                  >
                    {trimmed.replace("#### ", "")}
                  </h4>
                );
              }
              if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                const items = trimmed.split("\n");
                return (
                  <ul key={idx} className="list-disc pr-6 space-y-1.5 text-xs sm:text-sm text-[#524345]">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^[*|-]\s+/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-xs sm:text-sm text-[#524345] leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-[#eedfe0] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#2f020d] flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-[#735c00]" />
              الكلمات المفتاحية:
            </span>
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-xs bg-[#fff0f1] text-[#735c00] border border-[#eedfe0] px-3 py-1 rounded-full font-medium"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Author Callout Card */}
          <div className="mt-8 rounded-2xl bg-[#fff0f1] p-6 border border-[#eedfe0] flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="h-16 w-16 rounded-full bg-[#2f020d] text-[#fed65b] flex items-center justify-center font-bold text-xl shrink-0">
              <Crown className="h-8 w-8" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-bold text-[#2f020d]">
                كتبت بواسطة: {post.author}
              </h4>
              <p className="text-xs text-[#524345] leading-relaxed">
                خبيرة تجميل معتمدة دولياً ومؤسسة علامة أماني خليل للتجميل الفاخر. متخصصة في تجهيز عرائس الرياض وإطلالات السهرات الملكية.
              </p>
            </div>
            <Link href="/book">
              <Button size="sm" className="rounded-full bg-[#2f020d] hover:bg-[#4a1521] text-white text-xs px-4 whitespace-nowrap">
                حجز موعد مع أماني
              </Button>
            </Link>
          </div>
        </Card>
      </article>

      {/* 3. Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-serif text-[#2f020d] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#735c00]" />
              مقالات أخرى قد تهمكِ
            </h3>
            <Link href="/blog" className="text-xs text-[#735c00] font-bold hover:underline">
              عرض كل المقالات ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedPosts.map((rel) => (
              <Card
                key={rel.id}
                className="rounded-2xl border border-[#eedfe0] bg-white overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-[#2f020d] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-[#735c00] font-bold block mb-1">
                      {rel.categoryAr}
                    </span>
                    <Link href={`/blog/${rel.slug}`}>
                      <h4 className="text-xs font-bold text-[#2f020d] group-hover:text-[#735c00] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </Link>
                  </div>
                </div>
                <div className="p-4 pt-0 text-[10px] text-[#524345] flex items-center justify-between">
                  <span>{rel.readTime}</span>
                  <Link href={`/blog/${rel.slug}`} className="text-[#2f020d] font-bold hover:underline">
                    قراءة
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

