'use client';

import { useEffect } from 'react';

import { supabase } from '@/config/supabase';
import { readUiSessionFromStorage } from '@/store/readUiSessionFromStorage';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { ensureDemoCoinsMinimum } from '@/services/demo/demoCoins';

/** One-time sync from legacy localStorage keys into Zustand after mount (client-only). */
export function UiSessionHydrator() {
  const hydrateUiSession = useUiSessionStore((s) => s.hydrateUiSession);
  const setDemoMode = useUiSessionStore((s) => s.setDemoMode);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const { demoMode } = readUiSessionFromStorage();
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      if (cancelled) return;

      const effectiveDemoMode = session?.user ? false : demoMode;
      if (effectiveDemoMode) {
        ensureDemoCoinsMinimum();
      }
      hydrateUiSession({ demoMode: effectiveDemoMode });
      if (session?.user && demoMode) {
        setDemoMode(false);
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [hydrateUiSession, setDemoMode]);

  return null;
}
