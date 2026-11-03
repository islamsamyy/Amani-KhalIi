export interface PricingInput {
  basePrice: number;
  addonIds: string[];
  addonsCatalog: { id: string; price: number }[];
  locationType?: "HOTEL_HALL" | "CLIENT_HOME" | "STUDIO";
  areaFee?: number;
  isVipBridal?: boolean;
  companionsCount?: number;
  depositPercentage?: number; // default 30
}

export interface PricingBreakdown {
  basePrice: number;
  addonsTotal: number;
  travelFee: number;
  groupDiscount: number;
  grandTotal: number;
  depositAmount: number;
  remainingAmount: number;
  depositPercentage: number;
}

export function calculateBookingPricing(input: PricingInput): PricingBreakdown {
  const depositPct = input.depositPercentage ?? 30;
  const basePrice = Math.max(0, input.basePrice);

  let addonsTotal = 0;
  for (const aid of input.addonIds) {
    const item = input.addonsCatalog.find((a) => a.id === aid);
    if (item) addonsTotal += item.price;
  }

  // Travel fee: 0 for VIP bridal or Studio; otherwise specified areaFee or 0
  let travelFee = 0;
  if (!input.isVipBridal && input.locationType !== "STUDIO") {
    travelFee = Math.max(0, input.areaFee ?? 0);
  }

  // Group discount: 10% off companions if count >= 3
  let groupDiscount = 0;
  if ((input.companionsCount ?? 0) >= 3) {
    groupDiscount = Math.round(addonsTotal * 0.1);
  }

  const grandTotal = Math.max(0, basePrice + addonsTotal + travelFee - groupDiscount);
  const depositAmount = Math.round((grandTotal * depositPct) / 100);
  const remainingAmount = Math.max(0, grandTotal - depositAmount);

  return {
    basePrice,
    addonsTotal,
    travelFee,
    groupDiscount,
    grandTotal,
    depositAmount,
    remainingAmount,
    depositPercentage: depositPct,
  };
}

export function formatSar(amount: number): string {
  return new Intl.NumberFormat("ar-SA").format(amount) + " ر.س";
}

