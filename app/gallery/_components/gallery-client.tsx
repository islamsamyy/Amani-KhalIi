"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/providers/app-store-provider";
import { useLanguage } from "@/providers/language-provider";
import { FALLBACK_GALLERY_IMAGE, normalizeImageSrc } from "@/lib/image-upload";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Camera,
  Calendar,
  ZoomIn,
  Crown,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export function GalleryClient() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const { gallery, setSelectedPackageId } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredLooks = gallery.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const currentLook = lightboxIndex !== null ? filteredLooks[lightboxIndex] : null;

  const nextLook = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredLooks.length);
    }
  };

  const prevLook = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredLooks.length) % filteredLooks.length);
    }
  };

  const handleBookLook = () => {
    setSelectedPackageId("vip-bridal");
    router.push("/book");
  };

  return (
    <div dir={dir} className="w-full min-h-screen bg-[#fff8f7] text-[#211a1b] pt-20">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#2f020d] to-[#4a1521] text-white py-16 lg:py-24">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#735c00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center">
          <Badge variant="gold" className="mb-4">
            {t("ألبوم الصور الموثقة • Haute Beauté", "Verified Lookbook • Haute Beauté")}
          </Badge>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
            {t("معرض الأعمال والإطلالات الملكية", "Royal Portfolio & Looks Gallery")}
          </h1>
          <p className="text-sm sm:text-base text-[#eedfe0] max-w-2xl mx-auto mt-4 leading-relaxed">
            {t(
              "مجموعة مختارة من إطلالات العرائس والسهرات الموثقة بعدسة احترافية وتحت إضاءة القاعات، تجسد دقة الدمج، نضارة البشرة، وفخامة اللمسات الملكية.",
              "A curated selection of authentic bridal and soirée looks captured under real venue lighting—showcasing luminous skin and royal precision."
            )}
          </p>
        </div>
      </section>

      {/* 2. Gallery Filter & Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center mb-12">
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full max-w-xl mx-auto flex flex-col items-center"
          >
            <TabsList className="bg-[#faeaeb] p-1.5 rounded-full flex flex-wrap justify-center gap-1">
              <TabsTrigger value="all" className="rounded-full text-xs font-semibold px-4">
                كافة الإطلالات ({gallery.length})
              </TabsTrigger>
              <TabsTrigger value="bridal" className="rounded-full text-xs font-semibold px-4">
                عرائس ملكي
              </TabsTrigger>
              <TabsTrigger value="evening" className="rounded-full text-xs font-semibold px-4">
                سهرة فخم
              </TabsTrigger>
              <TabsTrigger value="engagement" className="rounded-full text-xs font-semibold px-4">
                خطوبة وملكة
              </TabsTrigger>
              <TabsTrigger value="soft" className="rounded-full text-xs font-semibold px-4">
                ناعم وطبيعي
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLooks.map((look, index) => (
            <Card
              key={look.id}
              onClick={() => setLightboxIndex(index)}
              className="group overflow-hidden rounded-3xl border border-[#eedfe0] bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#faeaeb]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={normalizeImageSrc(look.image) || FALLBACK_GALLERY_IMAGE}
                  alt={look.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_GALLERY_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f020d]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs text-[#fed65b] font-bold">{look.categoryAr}</p>
                    <h3 className="text-base font-bold">{look.title}</h3>
                    <p className="text-[11px] text-[#ffd9dd]">{look.clientType}</p>
                  </div>
                </div>
                <div className="absolute top-4 start-4">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur-md text-[#2f020d] text-[10px] font-bold">
                    {look.categoryAr}
                  </Badge>
                </div>
                <div className="absolute top-4 end-4 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2f020d] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-bold text-[#2f020d] mb-1">{look.title}</h3>
                <p className="text-xs text-[#524345] mb-3">{look.clientType}</p>
                <div className="flex flex-wrap gap-1.5">
                  {look.styleTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#faeaeb] text-[#735c00] font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Lightbox Dialog */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-3xl bg-[#2f020d] text-white border border-[#735c00]/40 p-6 text-right">
          {currentLook && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <Badge variant="gold" className="text-[10px] mb-1">
                    {currentLook.categoryAr}
                  </Badge>
                  <DialogTitle className="text-lg font-bold text-white">
                    {currentLook.title}
                  </DialogTitle>
                  <p className="text-xs text-[#eedfe0]">{currentLook.clientType}</p>
                </div>
              </div>

              <div className="relative aspect-[4/5] sm:aspect-[16/11] max-h-[460px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentLook.image}
                  alt={currentLook.title}
                  className="w-full h-full object-contain"
                />

                {/* Nav buttons */}
                <button
                  type="button"
                  onClick={prevLook}
                  className="absolute start-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={nextLook}
                  className="absolute end-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-2">
                  {currentLook.styleTags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="border-white/20 text-[#fed65b] text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <Button
                  onClick={handleBookLook}
                  className="h-11 px-8 rounded-full bg-white text-[#2f020d] hover:bg-[#fed65b] font-bold text-xs shadow-lg cursor-pointer"
                >
                  <Calendar className="h-4 w-4 ms-2 text-[#735c00]" />
                  <span>احجزي هذا اللوك الآن 💍</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}

