import type { ServicePackage, AddOnItem } from "@/features/data/initial-data";
import type { AppLanguage } from "@/providers/language-provider";

interface PackageEnTranslation {
  title: string;
  duration: string;
  badge?: string;
  description: string;
  features: string[];
}

const PACKAGE_EN_MAP: Record<string, PackageEnTranslation> = {
  "vip-bridal": {
    title: "Royal Bridal VIP Package",
    duration: "4–5 Hours Exclusive Dedication",
    badge: "Most Requested by Brides",
    description:
      "Includes on-site visits to all Riyadh 5-star hotels & wedding palaces, custom 3D Mink lashes, pre-makeup luxury skin prep, and a complimentary bridal touch-up kit (worth 450 SAR).",
    features: [
      "Strictly one bride per day for undivided royal attention",
      "Intensive Korean skin prep & lymphatic facial massage before foundation",
      "Tear-resistant 4K hydraulic setting lasting up to 18 hours",
      "Complimentary luxury touch-up kit (lipstick & setting powder)",
      "Custom lightweight 3D Mink lashes tailored to your eye shape",
      "Complimentary travel across all Riyadh hotels, palaces & districts",
    ],
  },
  "milkah-engagement": {
    title: "Luxury Engagement & Milkah",
    duration: "2.5 Hours",
    badge: "Soft Royal Glam",
    description:
      "Soft royal glam calibrated for venue lighting and 4K photography, with luxury lashes and sweat-resistant 16-hour setting.",
    features: [
      "Weightless velvet coverage highlighting natural radiance without shine",
      "Harmonized eye look matching your gown and jewelry tones",
      "Luxury natural lashes adding depth on 4K video and photos",
      "Deep hydrating prep with Fix+ for long-wear finish",
      "On-location service at your hotel suite or residence in Riyadh",
    ],
  },
  "evening-vip": {
    title: "Evening VIP Glam",
    duration: "1.5 Hours",
    badge: "For Elite Guests",
    description:
      "Full evening glam with editorial contouring, soft harmonized shades matching your gown, and multi-layered natural lashes.",
    features: [
      "Sculpted radiant face contour using Dior Backstage techniques",
      "Bronze or soft smoky eye palette customized to your preference",
      "Advanced heat-resistant setting lasting all night",
      "100% authentic luxury cosmetics gentle on sensitive skin",
    ],
  },
  "soft-glam": {
    title: "Soft Glam & Natural Glow",
    duration: "1 Hour 15 Min",
    description:
      "Refined no-makeup luxury glow highlighting fresh skin with subtle illumination and long-wearing natural lip tones.",
    features: [
      "Luminous lightweight complexion evenness",
      "Natural feather-stroke brow & eye definition",
      "Long-wear nude gloss and lipstick matched to your undertone",
    ],
  },
  "bridal-trial": {
    title: "Bridal Trial & Consultation",
    duration: "2 Full Hours",
    description:
      "Private atelier session to test eye shapes, foundation shades, and harmonize your complete bridal look with your dress and veil.",
    features: [
      "Test lip and foundation shades under multiple lighting setups",
      "Detailed personal beauty profile documenting your exact products",
      "Expert consultation matching hair styling and gown neckline",
    ],
  },
  "companions-group": {
    title: "Bridal Companions & Family",
    duration: "1 Hour per Guest",
    description:
      "Refined soirée glam for the bride's family and companions with the same luxury hygiene standards and group savings.",
    features: [
      "Cohesive, elevated looks tailored for each companion",
      "Additional 10% group discount when booking 3+ companions with the bride",
      "Sweat-resistant luxury international cosmetics",
    ],
  },
};

const ADDON_EN_MAP: Record<string, { title: string; description: string }> = {
  addon_hair: {
    title: "Royal Bridal Hairstylist",
    description:
      "Complete bridal hairstyling by a senior specialist alongside your makeup session.",
  },
  addon_facial: {
    title: "Glass Skin Korean Hydrating Facial",
    description:
      "Deep pre-makeup skin prep with collagen, hyaluronic acid & lymphatic massage.",
  },
  addon_hall_escort: {
    title: "Venue Escort & Zaffa Touch-Ups",
    description:
      "Personal suite attendance for final touch-ups, lip refresh, and veil placement before Zaffa.",
  },
  addon_body_glow: {
    title: "Neck & Décolleté Body Glow",
    description:
      "Transfer-proof velvet skin evening and luminous glow for neck & shoulders.",
  },
  addon_escort: {
    title: "Additional Guest Makeup (Sister / Mother)",
    description:
      "Full evening glam for one companion during the bride's preparation session.",
  },
};

export function getLocalizedPackage(pkg: ServicePackage, lang: AppLanguage) {
  if (lang !== "en") {
    return {
      title: pkg.title,
      duration: pkg.duration,
      badge: pkg.badge,
      description: pkg.description,
      features: pkg.features,
    };
  }
  const tr = PACKAGE_EN_MAP[pkg.id];
  if (tr) {
    return tr;
  }
  return {
    title: pkg.titleEn || pkg.title,
    duration: pkg.duration,
    badge: pkg.badge,
    description: pkg.description,
    features: pkg.features,
  };
}

export function getLocalizedAddon(addon: AddOnItem, lang: AppLanguage) {
  if (lang !== "en") {
    return {
      title: addon.title,
      description: addon.description,
    };
  }
  const tr = ADDON_EN_MAP[addon.id];
  return tr || { title: addon.title, description: addon.description };
}
