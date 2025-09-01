// Pricing configuration with automatic date-based switching
export interface PricingTier {
  name: string;
  setupPrice: number;
  originalSetupPrice: number;
  monthlyPrice: number;
  originalMonthlyPrice: number;
  features: string[];
}

export interface PricingConfig {
  discountEndDate: Date;
  basicTier: PricingTier;
  premiumTier: PricingTier;
}

// Set discount to end in 1 week from now
const oneWeekFromNow = new Date();
oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

export const pricingConfig: PricingConfig = {
  discountEndDate: oneWeekFromNow,
  
  basicTier: {
    name: "Basic Static Website",
    setupPrice: 50,           // Current discounted price
    originalSetupPrice: 100,  // Original price to show crossed out
    monthlyPrice: 10,         // Current discounted price
    originalMonthlyPrice: 20, // Original price after discount ends
    features: [
      "Professional static website",
      "Mobile responsive design", 
      "Basic SEO optimization",
      "Domain setup assistance",
      "Email support"
    ]
  },
  
  premiumTier: {
    name: "Premium Static Website",
    setupPrice: 150,          // Current discounted price
    originalSetupPrice: 300,  // Original price to show crossed out
    monthlyPrice: 10,         // Current discounted price
    originalMonthlyPrice: 20, // Original price after discount ends
    features: [
      "Advanced static website with animations",
      "Custom design & branding",
      "Advanced SEO & performance optimization",
      "Content management system",
      "Priority email & phone support",
      "Social media integration"
    ]
  }
};

// Helper function to check if discount period is active
export function isDiscountActive(): boolean {
  return new Date() < pricingConfig.discountEndDate;
}

// Helper function to get current pricing for a tier
export function getCurrentPricing(tier: 'basic' | 'premium'): {
  setupPrice: number;
  monthlyPrice: number;
  originalSetupPrice?: number;
  originalMonthlyPrice?: number;
  isDiscounted: boolean;
} {
  const isDiscounted = isDiscountActive();
  const tierConfig = tier === 'basic' ? pricingConfig.basicTier : pricingConfig.premiumTier;
  
  if (isDiscounted) {
    return {
      setupPrice: tierConfig.setupPrice,
      monthlyPrice: tierConfig.monthlyPrice,
      originalSetupPrice: tierConfig.originalSetupPrice,
      originalMonthlyPrice: tierConfig.originalMonthlyPrice !== tierConfig.monthlyPrice ? tierConfig.originalMonthlyPrice : undefined,
      isDiscounted: true
    };
  } else {
    return {
      setupPrice: tierConfig.originalSetupPrice,
      monthlyPrice: tierConfig.originalMonthlyPrice,
      isDiscounted: false
    };
  }
}

// Format discount end date for display
export function getDiscountEndDateFormatted(): string {
  return pricingConfig.discountEndDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  });
}