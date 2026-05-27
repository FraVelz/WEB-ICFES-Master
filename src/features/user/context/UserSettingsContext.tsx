'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useUserSettings, type UserSettingsContextValue } from '@/features/user/hooks/useUserSettings';

const UserSettingsContext = createContext<UserSettingsContextValue | null>(null);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const value = useUserSettings();
  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>;
}

export function useUserSettingsContext() {
  const ctx = useContext(UserSettingsContext);
  if (!ctx) {
    throw new Error('useUserSettingsContext must be used within UserSettingsProvider');
  }
  return ctx;
}
