export const DEFAULT_SUPABASE_URL =
  "https://lbcywxlfbdshflznapxf.supabase.co";

export const DEFAULT_PUBLISHABLE_KEY =
  "sb_publishable_BaJ0UreLJbEfRKHXdhgCvw_EbTAHvKZ";

export function getSupabaseConfig() {
  const envUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
  const envKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_PUBLISHABLE_KEY;

  if (typeof window !== "undefined") {
    try {
      const storedUrl = localStorage.getItem("amani_supabase_url")?.trim();
      const storedKey = localStorage.getItem("amani_supabase_key")?.trim();
      const finalUrl =
        storedUrl && !storedUrl.includes("YOUR_PROJECT_REF")
          ? storedUrl
          : envUrl;
      const finalKey = storedKey || envKey;
      return {
        url: finalUrl,
        key: finalKey,
        isConfigured: Boolean(finalUrl) && Boolean(finalKey),
      };
    } catch {
      // ignore storage errors
    }
  }

  return {
    url: envUrl,
    key: envKey,
    isConfigured: Boolean(envUrl) && Boolean(envKey),
  };
}
