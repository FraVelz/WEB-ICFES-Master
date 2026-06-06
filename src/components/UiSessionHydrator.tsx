'use client';

import { useEffect } from 'react';

import { hydrateUiSession } from '@/store/slices/uiSessionSlice';
import { readUiSessionFromStorage } from '@/store/readUiSessionFromStorage';
import { useAppDispatch } from '@/store/hooks';
import { ensureDemoCoinsMinimum } from '@/services/demo/demoCoins';

/** One-time sync from legacy localStorage keys into Redux after mount (client-only). */
export function UiSessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { demoMode, selectedPlan, fromPricingScrollPending } = readUiSessionFromStorage();
    if (demoMode) {
      ensureDemoCoinsMinimum();
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
