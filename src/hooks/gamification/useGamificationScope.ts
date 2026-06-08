'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { getStreakScope } from '@/services/streak';
import { useUiSessionStore } from '@/store/uiSessionStore';

/** Scope unificado para gamificación: usuario autenticado o `'demo'`. */
export function useGamificationScope() {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  return getStreakScope(user?.uid, demoMode) ?? undefined;
}
