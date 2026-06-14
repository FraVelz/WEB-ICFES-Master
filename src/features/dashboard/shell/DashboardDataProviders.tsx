'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { GamificationProvider } from '@/hooks/gamification/GamificationContext';
import { LeagueProvider } from '@/hooks/gamification/LeagueContext';
import { getStreakScope } from '@/services/streak';
import { useUiSessionStore } from '@/store/uiSessionStore';

export function DashboardDataProviders({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;

  return (
    <GamificationProvider scope={streakScope}>
      <LeagueProvider>{children}</LeagueProvider>
    </GamificationProvider>
  );
}
