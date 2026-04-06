import { useMemo } from 'react';

export const usePriceCalculation = (price: number | string | undefined, billingPeriod: string) => {
  return useMemo(() => {
    if (price === undefined || price === null || price === 'Gratis')
      return {
        basePrice: 0,
        finalPrice: '$0',
        savings: null,
        monthlyPrice: '$0',
      };

    const numPrice =
      typeof price === 'number' ? price : parseInt(String(price).replace('$', '').replace(/\D/g, ''), 10);
    const basePrice = isNaN(numPrice) ? 0 : numPrice;

    if (billingPeriod === 'annual') {
      const monthlyTotal = basePrice * 12;
      const annualPrice = Math.round(monthlyTotal * 0.9);
      const savings = monthlyTotal - annualPrice;

      return {
        basePrice,
        finalPrice: `$${annualPrice.toLocaleString('es-CO')}`,
        savings: savings.toLocaleString('es-CO'),
        monthlyPrice: typeof price === 'number' ? `$${price.toLocaleString('es-CO')}` : String(price),
      };
    }

    return {
      basePrice,
      finalPrice: typeof price === 'number' ? `$${price.toLocaleString('es-CO')}` : String(price),
      savings: null,
      monthlyPrice: typeof price === 'number' ? `$${price.toLocaleString('es-CO')}` : String(price),
    };
  }, [price, billingPeriod]);
};
