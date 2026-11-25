import type { Metadata } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/providers/app-store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { InteractiveShell } from "@/components/interactive-shell";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("amani_theme_v1");if(t==="dark"||(!t&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}else{document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-theme","light");document.documentElement.style.colorScheme="light";}var l=localStorage.getItem("amani_lang_v1");if(l==="en"){document.documentElement.lang="en";document.documentElement.dir="ltr";}}catch(e){}})();`;

export const metadata: Metadata = {
  title: "أماني خليل | خبيرة التجميل ومكياج العرائس بالرياض",
  description:
    "الموقع الرسمي لخبيرة التجميل أماني خليل - جلسات مكياج منزلية خاصة وفاخرة بالرياض للعرائس، السهرات، والمناسبات الملكية.",
  icons: {
    icon: [{ url: "/site-icon.png", type: "image/png" }],
    shortcut: ["/site-icon.png"],
    apple: [{ url: "/site-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
        className="bg-[#fff8f7] text-[#211a1b] font-body-md antialiased min-h-screen transition-colors duration-300"
      >
        <LanguageProvider>
          <ThemeProvider>
            <AppStoreProvider>
              <InteractiveShell>{children}</InteractiveShell>
              <Toaster />
            </AppStoreProvider>
          </ThemeProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
