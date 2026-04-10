'use client';

import { useEffect } from 'react';

import { hydrateUiSession } from '@/store/slices/uiSessionSlice';
import type { UiPlan } from '@/store/types/uiPlan';
import { useAppDispatch } from '@/store/hooks';

/** One-time sync from legacy localStorage keys into Redux after mount (client-only). */
export function UiSessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const demoMode = localStorage.getItem('demoMode') === 'true';

    let selectedPlan: UiPlan | null = null;
    try {
      const raw = localStorage.getItem('selectedPlan');
      if (raw) selectedPlan = JSON.parse(raw) as UiPlan;
    } catch {
      selectedPlan = null;
    }

    const fromPricingScrollPending = !!localStorage.getItem('fromPricing');
    if (fromPricingScrollPending) {
      localStorage.removeItem('fromPricing');
    }

    dispatch(
      hydrateUiSession({
        demoMode,
        selectedPlan,
        fromPricingScrollPending,
      })
    );
  }, [dispatch]);

  return null;
}
