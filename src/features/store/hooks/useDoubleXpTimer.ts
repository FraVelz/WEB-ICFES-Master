'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { getDoubleXpExpiresAt, DOUBLE_XP_CHANGE_EVENT } from '@/services/persistence/doubleXpPersistence';
import { getDoubleXpRemainingMs } from '@/features/store/constants/doubleXp';

export function useDoubleXpTimer() {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const coinsUserId = resolveCoinsUserId(user?.uid, demoMode);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);

  const loadExpiresAt = useCallback(async () => {
    if (!coinsUserId) {
      setExpiresAt(null);
      setRemainingMs(0);
      return;
    }
    const next = await getDoubleXpExpiresAt(coinsUserId);
    setExpiresAt(next);
    setRemainingMs(getDoubleXpRemainingMs(next));
  }, [coinsUserId]);

  useEffect(() => {
    void loadExpiresAt();
  }, [loadExpiresAt]);

  useEffect(() => {
    const onChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ expiresAt?: string | null }>).detail;
      if (detail && 'expiresAt' in detail) {
        setExpiresAt(detail.expiresAt ?? null);
        setRemainingMs(getDoubleXpRemainingMs(detail.expiresAt ?? null));
        return;
      }
      void loadExpiresAt();
    };

    window.addEventListener(DOUBLE_XP_CHANGE_EVENT, onChanged);
    return () => window.removeEventListener(DOUBLE_XP_CHANGE_EVENT, onChanged);
  }, [loadExpiresAt]);

  useEffect(() => {
    const tick = () => {
      setRemainingMs(getDoubleXpRemainingMs(expiresAt));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  return {
    expiresAt,
    remainingMs,
    isActive: remainingMs > 0,
    refresh: loadExpiresAt,
  };
}
