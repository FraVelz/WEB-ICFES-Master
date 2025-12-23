import { useMemo } from 'react';

export const usePriceCalculation = (price, billingPeriod) => {
  return useMemo(() => {
    if (!price) return { basePrice: 0, finalPrice: '$0', savings: null, monthlyPrice: '$0' };
    
    const basePrice = parseInt(price.replace('$', '').replace(/\D/g, ''));
    
    if (billingPeriod === 'annual') {
      const monthlyTotal = basePrice * 12;
      const annualPrice = Math.round(monthlyTotal * 0.9);
      const savings = monthlyTotal - annualPrice;
      
      return {
        basePrice,
        finalPrice: `$${annualPrice.toLocaleString('es-CO')}`,
        savings: savings.toLocaleString('es-CO'),
        monthlyPrice: price
      };
    }
    
    return {
      basePrice,
      finalPrice: price,
      savings: null,
      monthlyPrice: price
    };
  }, [price, billingPeriod]);
};
