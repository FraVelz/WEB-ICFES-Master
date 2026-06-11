'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getPhaseSkips,
  PHASE_SKIP_UPDATED_EVENT,
  type PhaseSkipRecord,
} from '@/services/persistence/phaseSkipPersistence';

export function usePhaseSkips(areaId?: string) {
  const [skips, setSkips] = useState<PhaseSkipRecord[]>(() => (typeof window === 'undefined' ? [] : getPhaseSkips()));

  useEffect(() => {
    const refresh = () => setSkips(getPhaseSkips());
    window.addEventListener(PHASE_SKIP_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PHASE_SKIP_UPDATED_EVENT, refresh);
  }, []);

  const skippedSectionIds = useMemo(() => {
    if (!areaId) return new Set<string>();
    return new Set(skips.filter((s) => s.areaId === areaId).map((s) => s.sectionId));
  }, [skips, areaId]);

  return { skips, skippedSectionIds };
}
