export const FALLBACK_GALLERY_IMAGE = "/gallery/IMG_5729.webp";

export interface StudioPresetImage {
  src: string;
  label: string;
}

export const STUDIO_PRESET_IMAGES: StudioPresetImage[] = [
  { src: "/gallery/IMG_5729.webp", label: "إطلالة عروس ملكي 1" },
  { src: "/gallery/IMG_5730.webp", label: "إطلالة عروس ملكي 2" },
  { src: "/gallery/IMG_5731.webp", label: "إطلالة سهرة فاخرة" },
  { src: "/gallery/IMG_5733.webp", label: "إطلالة ناعمة راقية" },
  { src: "/amani-client-bridal.jpg", label: "مكياج عروس أتيليه" },
  { src: "/amani-mirror-glam.jpg", label: "جلسة تجهيز ملكية" },
  { src: "/amani-studio-portrait.jpg", label: "بورتريه إطلالة فخمة" },
];

const MAX_RAW_FILE_BYTES = 15 * 1024 * 1024; // 15MB

export function normalizeImageSrc(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Handle relative paths like "gallery/IMG_5729.webp" or "./gallery/IMG_5729.webp"
  const cleaned = trimmed.replace(/^\.\//, "");
  if (cleaned.startsWith("/")) {
    return cleaned;
  }

  // Reject Windows/Mac local disk paths like C:\Users\... or file:///...
  if (/^[a-zA-Z]:\\/.test(cleaned) || cleaned.startsWith("file://")) {
    return "";
  }

  return `/${cleaned}`;
}

export function isUsableImageSrc(src: string): boolean {
  const normalized = normalizeImageSrc(src);
  if (!normalized) return false;
  return (
    normalized.startsWith("data:image/") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("http://") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("/")
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("تعذر قراءة ملف الصورة"));
      }
    };
    reader.onerror = () => reject(new Error("تعذر قراءة ملف الصورة"));
    reader.readAsDataURL(file);
  });
}

export async function compressImageFileToDataUrl(
  file: File,
  maxDimension = 1080,
  quality = 0.82
): Promise<string> {
  const isImageMime = file.type.startsWith("image/");
  const isImageExt = /\.(jpe?g|png|webp|gif|avif|heic|heif)$/i.test(file.name);

  if (!isImageMime && !isImageExt) {
    throw new Error("يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)");
  }

  if (file.size > MAX_RAW_FILE_BYTES) {
    throw new Error("حجم الصورة كبير جداً (الحد الأقصى 15 ميجابايت)");
  }

  const rawDataUrl = await readFileAsDataUrl(file);

  // In non-browser / headless test environments without full canvas image decoding, return raw data URL
  if (typeof window === "undefined" || typeof document === "undefined") {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(rawDataUrl);
          return;
        }

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL("image/jpeg", quality);
        if (compressed && compressed.startsWith("data:image/")) {
          resolve(compressed);
        } else {
          resolve(rawDataUrl);
        }
      } catch {
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}

export function downloadCsvFile(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent =
    "\uFEFF" +
    [headers.map(escapeCell).join(","), ...rows.map((r) => r.map(escapeCell).join(","))].join(
      "\r\n"
    );

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
