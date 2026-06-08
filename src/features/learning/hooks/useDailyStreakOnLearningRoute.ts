'use client';

import { useEffect } from 'react';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import {
  backfillStreakFromAttempts,
  getLocalDateString,
  getStreakScope,
  recordStreakToday,
  type StreakScope,
} from '@/services/streak';

function sessionGuardKey(scope: StreakScope, date: string): string {
  return `icfes_streak_recorded_${date}_${scope}`;
}

function hasRecordedToday(scope: StreakScope): boolean {
  if (typeof window === 'undefined') return true;
  const today = getLocalDateString();
  return sessionStorage.getItem(sessionGuardKey(scope, today)) === '1';
}

function markRecordedToday(scope: StreakScope): void {
  if (typeof window === 'undefined') return;
  const today = getLocalDateString();
  sessionStorage.setItem(sessionGuardKey(scope, today), '1');
}

/**
 * Registers one streak day when the user opens the learning roadmap (demo or account).
 */
export function useDailyStreakOnLearningRoute(): void {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const scope = getStreakScope(user?.uid, demoMode);

  useEffect(() => {
    if (!scope) return;
    if (hasRecordedToday(scope)) return;

    let cancelled = false;

    void (async () => {
      await backfillStreakFromAttempts(scope);
      if (cancelled) return;
      await recordStreakToday(scope);
      if (cancelled) return;
      markRecordedToday(scope);
    })();

    return () => {
      cancelled = true;
    };
  }, [scope]);
}
