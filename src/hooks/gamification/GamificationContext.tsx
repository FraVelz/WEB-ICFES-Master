'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useGamification } from './useGamification';
import type { StreakScope } from '@/services/streak';

export type GamificationContextValue = ReturnType<typeof useGamification>;

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ scope, children }: { scope: StreakScope | undefined; children: ReactNode }) {
  const value = useGamification(scope);
  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamificationContext(): GamificationContextValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error('useGamificationContext debe usarse dentro de GamificationProvider');
  }
  return ctx;
}

export function useGamificationContextOptional(): GamificationContextValue | null {
  return useContext(GamificationContext);
}
