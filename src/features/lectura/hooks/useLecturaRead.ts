'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { syncAchievementsFromGameplay } from '@/services/achievements/achievementProgressService';
import { resolveCoinsUserId } from '@/services/demo/demoCoins';
import { STREAK_UPDATED_EVENT } from '@/services/streak';
import { useUiSessionStore } from '@/store/uiSessionStore';
import type { LecturaSectionId } from '../constants';
import {
  LECTURA_READ_CHANGE_EVENT,
  loadLecturaReadSections,
  saveLecturaReadSection,
} from '../services/lecturaReadPersistence';

function syncAchievementsAfterLecturaRead(scopeId: string): void {
  void syncAchievementsFromGameplay(scopeId).then(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STREAK_UPDATED_EVENT));
    }
  });
}

export function useLecturaRead() {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const scopeId = resolveCoinsUserId(user?.uid, demoMode);
  const [readSections, setReadSections] = useState<LecturaSectionId[]>([]);

  const refresh = useCallback(() => {
    setReadSections(loadLecturaReadSections(scopeId));
  }, [scopeId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ scopeId?: string }>).detail;
      if (detail?.scopeId && detail.scopeId !== scopeId) return;
      refresh();
    };
    window.addEventListener(LECTURA_READ_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LECTURA_READ_CHANGE_EVENT, onChange);
  }, [refresh, scopeId]);

  const isRead = useCallback(
    (sectionId: LecturaSectionId) => readSections.includes(sectionId),
    [readSections]
  );

  const markAsRead = useCallback(
    (sectionId: LecturaSectionId) => {
      if (!scopeId) return readSections;
      const alreadyRead = readSections.includes(sectionId);
      const next = saveLecturaReadSection(scopeId, sectionId);
      setReadSections(next);
      if (!alreadyRead) {
        syncAchievementsAfterLecturaRead(scopeId);
      }
      return next;
    },
    [readSections, scopeId]
  );

  return { readSections, isRead, markAsRead, scopeId };
}
