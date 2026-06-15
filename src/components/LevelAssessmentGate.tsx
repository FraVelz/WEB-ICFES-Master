'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/context/AuthContext';
import { buildLevelAssessmentUrl, LEVEL_ASSESSMENT_PATH } from '@/features/auth/constants/skillLevelRoutes';
import {
  getAssessmentScope,
  getAssessmentScopeForSession,
  hasCompletedLevelAssessment,
} from '@/services/persistence/skillLevelPersistence';
import { isLevelAssessmentSnoozed } from '@/features/auth/utils/levelAssessmentSnooze';
import { useUiSessionStore } from '@/store/uiSessionStore';

/** Redirige a la evaluación inicial si el usuario demo o cuenta nueva aún no la completó. */
export function LevelAssessmentGate() {
  const router = useRouter();
  const pathname = usePathname();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const hydrated = useUiSessionStore((s) => s.hydrated);
  const { user, loading } = useAuth();
  const checkVersionRef = useRef(0);

  useEffect(() => {
    if (!hydrated || loading) return;
    if (pathname === LEVEL_ASSESSMENT_PATH) return;

    const hasAccess = demoMode || !!user;
    if (!hasAccess) return;

    const scopeOptions = getAssessmentScopeForSession(demoMode, user?.uid);
    const scope = getAssessmentScope(scopeOptions);
    const context = scopeOptions.demoMode && !user ? 'demo' : 'account';
    const checkVersion = ++checkVersionRef.current;

    void hasCompletedLevelAssessment(scope, user?.uid).then((done) => {
      if (checkVersion !== checkVersionRef.current || done) return;
      if (isLevelAssessmentSnoozed(scope)) return;
      router.replace(buildLevelAssessmentUrl(context));
    });
  }, [demoMode, hydrated, loading, pathname, router, user]);

  return null;
}
