'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useMyLeague } from './useMyLeague';

export type LeagueContextValue = ReturnType<typeof useMyLeague>;

const LeagueContext = createContext<LeagueContextValue | null>(null);

export function LeagueProvider({ children }: { children: ReactNode }) {
  const value = useMyLeague();
  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}

export function useLeagueContext(): LeagueContextValue {
  const ctx = useContext(LeagueContext);
  if (!ctx) {
    throw new Error('useLeagueContext debe usarse dentro de LeagueProvider');
  }
  return ctx;
}

export function useLeagueContextOptional(): LeagueContextValue | null {
  return useContext(LeagueContext);
}
