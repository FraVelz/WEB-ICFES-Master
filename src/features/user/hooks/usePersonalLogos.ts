'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { getPersonalLogos, PERSONAL_LOGOS_CHANGE_EVENT, type PersonalLogosChangeDetail } from '@/services/persistence';
import type { PersonalLogo } from '@/features/user/types/personalLogo.types';

export function usePersonalLogos() {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const userId = resolveCoinsUserId(user?.uid, demoMode);
  const [logos, setLogos] = useState<PersonalLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const loadGeneration = useRef(0);

  const load = useCallback(async () => {
    if (!userId) {
      setLogos([]);
      setLoading(false);
      return;
    }
    const generation = ++loadGeneration.current;
    setLoading(true);
    try {
      const next = await getPersonalLogos(userId);
      if (generation === loadGeneration.current) {
        setLogos(next);
      }
    } finally {
      if (generation === loadGeneration.current) {
        setLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onChanged = (event: Event) => {
      const detail = (event as CustomEvent<PersonalLogosChangeDetail>).detail;
      if (detail?.logos) {
        loadGeneration.current += 1;
        setLogos(detail.logos);
        return;
      }
      void load();
    };
    window.addEventListener(PERSONAL_LOGOS_CHANGE_EVENT, onChanged);
    return () => window.removeEventListener(PERSONAL_LOGOS_CHANGE_EVENT, onChanged);
  }, [load]);

  return { logos, loading, refresh: load, userId };
}
