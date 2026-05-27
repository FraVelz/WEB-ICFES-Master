'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useDonation } from './useDonation';

type DonationContextValue = ReturnType<typeof useDonation>;

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const value = useDonation();
  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

export function useDonationContext() {
  const ctx = useContext(DonationContext);
  if (!ctx) {
    throw new Error('useDonationContext must be used within DonationProvider');
  }
  return ctx;
}
