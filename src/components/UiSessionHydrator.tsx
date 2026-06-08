'use client';

import { useEffect } from 'react';

import { readUiSessionFromStorage } from '@/store/readUiSessionFromStorage';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { ensureDemoCoinsMinimum } from '@/services/demo/demoCoins';

/** One-time sync from legacy localStorage keys into Zustand after mount (client-only). */
export function UiSessionHydrator() {
  const hydrateUiSession = useUiSessionStore((s) => s.hydrateUiSession);

  useEffect(() => {
    const { demoMode, selectedPlan, fromPricingScrollPending } = readUiSessionFromStorage();
    if (demoMode) {
      ensureDemoCoinsMinimum();
    }
    hydrateUiSession({
      demoMode,
      selectedPlan,
      fromPricingScrollPending,
    });
  }, [hydrateUiSession]);

  return null;
}
