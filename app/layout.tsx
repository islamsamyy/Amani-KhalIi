import type { Metadata } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/providers/app-store-provider";
import { InteractiveShell } from "@/components/interactive-shell";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "أماني خليل | خبيرة التجميل ومكياج العرائس بالرياض",
  description:
    "الموقع الرسمي لخبيرة التجميل أماني خليل - جلسات مكياج منزلية خاصة وفاخرة بالرياض للعرائس، السهرات، والمناسبات الملكية.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#fff8f7] text-[#211a1b] font-body-md antialiased min-h-screen"
      >
        <AppStoreProvider>
          <InteractiveShell>{children}</InteractiveShell>
          <Toaster />
        </AppStoreProvider>
      </body>
    </html>
  );
}
