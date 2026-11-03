export const DEFAULT_SUPABASE_URL =
  "https://lbcywxlfbdshflznapxf.supabase.co";

export const DEFAULT_PUBLISHABLE_KEY =
  "sb_publishable_BaJ0UreLJbEfRKHXdhgCvw_EbTAHvKZ";

export function isValidSupabaseKey(key?: string | null): boolean {
  if (!key) return false;
  const k = key.trim();
  // sbp_ tokens are personal access tokens (management API), not PostgREST/client keys
  if (k.startsWith("sbp_")) return false;
  if (
    k.startsWith("sb_publishable_") ||
    k.startsWith("sb_secret_") ||
    k.startsWith("eyJ")
  ) {
    return true;
  }
  return false;
}

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
      const rawStoredKey = localStorage.getItem("amani_supabase_key")?.trim();

      // If user pasted an sbp_ personal access token into localStorage, clear it
      if (rawStoredKey && rawStoredKey.startsWith("sbp_")) {
        localStorage.removeItem("amani_supabase_key");
      }

      const storedKey =
        rawStoredKey && isValidSupabaseKey(rawStoredKey) ? rawStoredKey : null;

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
