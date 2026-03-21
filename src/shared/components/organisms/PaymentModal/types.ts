export interface PlanItem {
  id?: string;
  name?: string;
  price: number | string;
  features?: string[];
}

export interface UserPlanData {
  planType?: string;
  planName?: string;
  status?: string;
  price?: number;
  billingPeriod?: string;
  features?: string[];
  purchaseDate?: Date;
  nextBillingDate?: Date | string | number | { toDate?: () => Date } | null;
  originalPrice?: number | string;
}

export interface PriceCalculation {
  basePrice: number;
  finalPrice: string;
  savings: string | null;
  monthlyPrice: string;
}
