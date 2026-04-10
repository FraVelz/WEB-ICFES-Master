/** Plan card shape used by pricing / payment (serializable for Redux + localStorage). */
export interface UiPlan {
  popular?: boolean;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  cta: string;
  features: string[];
  [key: string]: unknown;
}
