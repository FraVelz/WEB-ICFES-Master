'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/features/auth/context/AuthContext';
import { LEVEL_ASSESSMENT_PATH } from '@/features/auth/constants/skillLevelRoutes';
import type { LevelAssessmentContext } from '@/features/auth/types/skillLevel';
import { LevelAssessmentBanner } from '@/features/auth/components/LevelAssessmentBanner';
import {
  getAssessmentScope,
  getAssessmentScopeForSession,
  hasCompletedLevelAssessment,
} from '@/services/persistence/skillLevelPersistence';
import { isLevelAssessmentSnoozed } from '@/features/auth/utils/levelAssessmentSnooze';
import { useUiSessionStore } from '@/store/uiSessionStore';

type PendingAssessment = {
  context: LevelAssessmentContext;
  scope: string;
};

/** Muestra un aviso no intrusivo cuando falta la evaluación inicial (sin redirección forzada). */
export function LevelAssessmentGate() {
  const pathname = usePathname();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const hydrated = useUiSessionStore((s) => s.hydrated);
  const { user, loading } = useAuth();
  const checkVersionRef = useRef(0);
  const [pending, setPending] = useState<PendingAssessment | null>(null);

  useEffect(() => {
    if (!hydrated || loading) return;
    if (pathname === LEVEL_ASSESSMENT_PATH) {
      setPending(null);
      return;
    }

    const hasAccess = demoMode || !!user;
    if (!hasAccess) {
      setPending(null);
      return;
    }

    const scopeOptions = getAssessmentScopeForSession(demoMode, user?.uid);
    const scope = getAssessmentScope(scopeOptions);
    const context: LevelAssessmentContext = scopeOptions.demoMode && !user ? 'demo' : 'account';
    const checkVersion = ++checkVersionRef.current;

    void hasCompletedLevelAssessment(scope, user?.uid).then((done) => {
      if (checkVersion !== checkVersionRef.current) return;
      if (done || isLevelAssessmentSnoozed(scope)) {
        setPending(null);
        return;
      }
      setPending({ context, scope });
    });
  }, [demoMode, hydrated, loading, pathname, user]);

  if (!pending) return null;

  return (
    <LevelAssessmentBanner
      context={pending.context}
      scope={pending.scope}
      onDismiss={() => setPending(null)}
    />
  );
}
