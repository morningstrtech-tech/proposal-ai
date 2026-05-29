export type Plan = "FREE" | "PRO" | "ULTRA";

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 3,
  PRO: 5,
  ULTRA: Infinity,
};

export const PLAN_DETAILS: Record<
  Plan,
  {
    name: string;
    price: string;
    priceNote: string;
    features: string[];
    recommended?: boolean;
  }
> = {
  FREE: {
    name: "FREE",
    price: "Rp 0",
    priceNote: "Selamanya gratis",
    features: [
      "3x generate proposal",
      "6 tipe proposal",
      "Output standar",
      "Copy & Print",
    ],
  },
  PRO: {
    name: "PRO",
    price: "Rp 50.000",
    priceNote: "per bulan",
    features: [
      "5x generate proposal / bulan",
      "6 tipe proposal",
      "AI-powered output (Gemini)",
      "Priority processing",
      "Copy, Print & Export",
    ],
    recommended: true,
  },
  ULTRA: {
    name: "ULTRA",
    price: "Rp 125.000",
    priceNote: "per bulan",
    features: [
      "Unlimited generate proposal",
      "6 tipe proposal",
      "AI-powered output (Gemini)",
      "Priority processing",
      "Copy, Print & Export",
      "Custom branding",
      "API access",
    ],
  },
};

export function canGenerate(plan: Plan, currentCount: number): boolean {
  const limit = PLAN_LIMITS[plan];
  return currentCount < limit;
}

export function getRemainingGenerations(
  plan: Plan,
  currentCount: number
): number | "unlimited" {
  if (plan === "ULTRA") return "unlimited";
  return Math.max(0, PLAN_LIMITS[plan] - currentCount);
}
