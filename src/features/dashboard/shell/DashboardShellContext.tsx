'use client';

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useGamification } from '@/hooks/gamification';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { getStreakScope } from '@/services/streak';
import { getAreaInfo } from '@/shared/constants';
import { resolveDashboardShellSection } from './shellRoutes';
import { useDashboardShellLearning } from './useDashboardShellLearning';
import type { DashboardShellContextValue, DesktopModal } from './dashboardShellTypes';

const DashboardShellContext = createContext<DashboardShellContextValue | null>(null);

export function DashboardShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shellSection = resolveDashboardShellSection(pathname);
  const isLearningShell = shellSection === 'learning';

  const learning = useDashboardShellLearning(isLearningShell);
  const [desktopModal, setDesktopModal] = useState<DesktopModal>(null);

  const areaSelectorRef = useRef<HTMLButtonElement>(null);
  const streakButtonRef = useRef<HTMLButtonElement>(null);

  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const streakScope = getStreakScope(user?.uid, demoMode) ?? undefined;
  const {
    currentStreak = 0,
    longestStreak = 0,
    coins = 0,
    streak = [],
    loading: statsLoading,
  } = useGamification(streakScope);

  const currentAreaData = getAreaInfo(learning.currentArea);

  const streakData = useMemo(
    () => ({
      currentStreak,
      longestStreak,
      streakHistory: streak,
      isBadgeUnlocked: currentStreak >= 7,
      daysUntilBadge: Math.max(0, 7 - currentStreak),
    }),
    [currentStreak, longestStreak, streak]
  );

  const value = useMemo(
    (): DashboardShellContextValue => ({
      shellSection,
      isPhasesRoute: learning.isPhasesRoute,
      currentArea: learning.currentArea,
      setCurrentArea: learning.setCurrentArea,
      currentSectionId: learning.currentSectionId,
      setCurrentSectionId: learning.setCurrentSectionId,
      sections: learning.sections,
      pathLoading: learning.pathLoading,
      pathError: learning.pathError,
      currentAreaData,
      currentSection: learning.currentSection,
      currentSectionIndex: learning.currentSectionIndex,
      goToAdjacentSection: learning.goToAdjacentSection,
      currentStreak,
      coins,
      statsLoading,
      streakData,
      desktopModal,
      setDesktopModal,
      areaSelectorRef,
      streakButtonRef,
    }),
    [shellSection, learning, currentAreaData, currentStreak, coins, statsLoading, streakData, desktopModal]
  );

  return <DashboardShellContext.Provider value={value}>{children}</DashboardShellContext.Provider>;
}

export function useDashboardShell() {
  const ctx = useContext(DashboardShellContext);
  if (!ctx) {
    throw new Error('useDashboardShell debe usarse dentro de DashboardShellProvider');
  }
  return ctx;
}

export function useDashboardShellOptional() {
  return useContext(DashboardShellContext);
}
