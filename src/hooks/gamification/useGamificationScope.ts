'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { getStreakScope } from '@/services/streak';
import { useAppSelector } from '@/store/hooks';

/** Scope unificado para gamificación: usuario autenticado o `'demo'`. */
export function useGamificationScope() {
  const { user } = useAuth();
  const demoMode = useAppSelector((state) => state.uiSession.demoMode);
  return getStreakScope(user?.uid, demoMode) ?? undefined;
}
