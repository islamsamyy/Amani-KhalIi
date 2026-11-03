"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Crown,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Heart,
  ArrowUpLeft,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      dir="rtl"
      className="bg-[#2f020d] text-white pt-16 pb-12 border-t border-[#4a1521] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4a1521]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#735c00]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="h-10 sm:h-12 w-auto relative">
                <Image
                  src="/logo.png"
                  alt="أماني خليل - خبيرة التجميل"
                  width={140}
                  height={50}
                  unoptimized={true}
                  className="h-10 sm:h-12 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            <p className="text-sm text-[#eedfe0] leading-relaxed max-w-sm">
              الموقع الرسمي لخبيرة التجميل المعتمدة دولياً <span className="text-[#fed65b] font-semibold">أماني خليل</span>.
              جلسات مكياج منزلية وفندقية خاصة بالرياض للعرائس، السهرات، والمناسبات الملكية.
            </p>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#fed65b]">
              <ShieldCheck className="h-4 w-4" />
              <span>معتمدة دولياً دبلوم CIDESCO للتجميل والمكياج السينمائي</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-[#735c00] text-white flex items-center justify-center transition-colors"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/966501284492"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="h-10 w-10 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="tel:+966501284492"
                aria-label="Phone"
                className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fed65b] mb-4 flex items-center gap-1.5">
              <Crown className="h-4 w-4" />
              <span>الباقات والخدمات</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#eedfe0]">
              <li>
                <Link href="/services/vip-bridal" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>باقة العروس الملكية VIP</span>
                </Link>
              </li>
              <li>
                <Link href="/bridal-makeup-riyadh" className="hover:text-white transition-colors">
                  مكياج العرائس الفاخر بالرياض
                </Link>
              </li>
              <li>
                <Link href="/occasion-makeup-riyadh" className="hover:text-white transition-colors">
                  مكياج السهرات والملكة
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  كافة الباقات والأسعار الرسمية
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#fed65b] font-bold transition-colors">
                  حجز موعد ملكي فوري
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Discovery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fed65b] mb-4 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span>الاستكشاف والتوثيق</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#eedfe0]">
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  معرض الأعمال والإطلالات
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  آراء وتقييمات العميلات
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  عن أماني خليل والاعتمادات
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#fed65b] font-semibold transition-colors">
                  المدونة الملكية وأسرار الجمال
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تواصل والسياسات وشروط الحجز
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Coverage */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fed65b] mb-4 flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>التغطية والتواصل</span>
            </h4>
            <div className="space-y-3 text-xs text-[#eedfe0]">
              <p className="leading-relaxed">
                مدينة الرياض، المملكة العربية السعودية. خدمة فندقية في أجنحة القصور وفنادق 5 نجوم ومنازل العرائس.
              </p>
              <div className="pt-2 flex flex-col gap-1.5">
                <a
                  href="https://wa.me/966501284492"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#fed65b] hover:underline font-bold"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>+966 50 128 4492 (واتساب)</span>
                </a>
                <Link
                  href="/admin/login"
                  className="text-white/60 hover:text-white text-[11px] pt-2 inline-flex items-center gap-1"
                >
                  <span>بوابة الدخول الإداري</span>
                  <ArrowUpLeft className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} أماني خليل — Haute Beauté Artistry. كافة الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              شروط الحجز والعربون
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#fed65b]">
              <span>صُمم بفخامة في الرياض</span>
              <Heart className="h-3 w-3 fill-current" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
