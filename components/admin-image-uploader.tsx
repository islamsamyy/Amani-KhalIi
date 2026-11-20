"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  compressImageFileToDataUrl,
  normalizeImageSrc,
  STUDIO_PRESET_IMAGES,
} from "@/lib/image-upload";

interface AdminImageUploaderProps {
  value: string;
  onChange: (nextSrc: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  label?: string;
  aspectClassName?: string;
}

export function AdminImageUploader({
  value,
  onChange,
  onValidityChange,
  label = "صورة العمل / الغلاف",
  aspectClassName = "aspect-[4/3]",
}: AdminImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"upload" | "studio" | "url">("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [urlInput, setUrlInput] = useState(
    value.startsWith("data:") ? "" : value
  );

  const normalizedValue = normalizeImageSrc(value);

  useEffect(() => {
    setPreviewError(false);
    if (!value.startsWith("data:")) {
      setUrlInput(value);
    }
  }, [value]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(Boolean(normalizedValue) && !previewError);
    }
  }, [normalizedValue, previewError, onValidityChange]);

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      setPreviewError(false);
      onChange(dataUrl);
      toast.success("تم رفع وتجهيز الصورة بنجاح ✨");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "تعذر معالجة الصورة المختارة";
      toast.error(message);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    void handleFileSelected(file);
  };

  const handleUrlChange = (raw: string) => {
    setUrlInput(raw);
    const normalized = normalizeImageSrc(raw);
    setPreviewError(false);
    onChange(normalized || raw.trim());
  };

  return (
    <div className="space-y-3" dir="rtl">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="text-xs font-bold text-[#2f020d]">{label}</label>
        <div className="flex items-center gap-1 bg-[#faeaeb] p-0.5 rounded-full border border-[#eedfe0]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              mode === "upload"
                ? "bg-[#4a1521] text-white shadow-sm"
                : "text-[#524345] hover:text-[#2f020d]"
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>رفع صورة</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("studio")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              mode === "studio"
                ? "bg-[#4a1521] text-white shadow-sm"
                : "text-[#524345] hover:text-[#2f020d]"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>ألبوم الأتيليه</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              mode === "url"
                ? "bg-[#4a1521] text-white shadow-sm"
                : "text-[#524345] hover:text-[#2f020d]"
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>رابط صورة</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div
        className={`relative w-full max-h-52 ${aspectClassName} rounded-2xl overflow-hidden border border-[#eedfe0] bg-[#faeaeb]/60 flex items-center justify-center`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2 text-[#4a1521]">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs font-bold">جارٍ تجهيز وضغط الصورة...</span>
          </div>
        ) : normalizedValue && !previewError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={normalizedValue}
              alt="معاينة الصورة"
              onLoad={() => setPreviewError(false)}
              onError={() => setPreviewError(true)}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-700/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <CheckCircle2 className="h-3 w-3" />
              صورة صالحة وجاهزة
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-1.5">
            {previewError ? (
              <>
                <AlertTriangle className="h-6 w-6 text-rose-600" />
                <p className="text-xs font-bold text-rose-700">
                  تعذر تحميل الصورة من المسار أو الرابط الحالي
                </p>
                <p className="text-[11px] text-[#524345]">
                  ارفعي الصورة مباشرة من جهازكِ أو اختاري صورة من ألبوم الأتيليه
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="h-6 w-6 text-[#857374]" />
                <p className="text-xs font-bold text-[#524345]">
                  لم يتم اختيار صورة بعد
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mode 1: Direct File Upload */}
      {mode === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`rounded-2xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-[#4a1521] bg-[#faeaeb]"
              : "border-[#d7c1c3] bg-white hover:border-[#735c00] hover:bg-[#fff8f7]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="رفع صورة من الجهاز"
            onChange={(e) => void handleFileSelected(e.target.files?.[0])}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-9 w-9 rounded-full bg-[#faeaeb] text-[#4a1521] flex items-center justify-center">
              <Upload className="h-4 w-4" />
            </div>
            <p className="text-xs font-bold text-[#2f020d]">
              اضغطي لاختيار صورة من جهازكِ أو اسحبيها هنا
            </p>
            <p className="text-[10px] text-[#857374]">
              يدعم JPG, PNG, WEBP — يتم ضغطها وتجهيزها تلقائياً للعرض الفوري
            </p>
          </div>
        </div>
      )}

      {/* Mode 2: Studio Preset Picker */}
      {mode === "studio" && (
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
          {STUDIO_PRESET_IMAGES.map((preset) => {
            const isSelected = normalizedValue === preset.src;
            return (
              <button
                key={preset.src}
                type="button"
                onClick={() => {
                  setPreviewError(false);
                  onChange(preset.src);
                }}
                title={preset.label}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#4a1521] ring-2 ring-[#fed65b]"
                    : "border-[#eedfe0] hover:border-[#735c00]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.src}
                  alt={preset.label}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Mode 3: Direct Image URL */}
      {mode === "url" && (
        <div className="space-y-1.5">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/photo.jpg أو /gallery/IMG_5729.webp"
            dir="ltr"
            className="w-full h-10 px-3.5 rounded-xl border border-[#eedfe0] bg-white text-xs text-left focus:outline-none focus:border-[#735c00]"
          />
          <p className="text-[10px] text-[#857374]">
            تأكدي أن الرابط ينتهي بملف صورة مباشر وتظهر معاينته أعلاه قبل الحفظ.
          </p>
        </div>
      )}
    </div>
  );
}
