'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/context/AuthContext';
import { buildLevelAssessmentUrl, LEVEL_ASSESSMENT_PATH } from '@/features/auth/constants/skillLevelRoutes';
import { getAssessmentScope, hasCompletedLevelAssessment } from '@/services/persistence/skillLevelPersistence';
import { useUiSessionStore } from '@/store/uiSessionStore';

/** Redirige a la evaluación inicial si el usuario demo o cuenta nueva aún no la completó. */
export function LevelAssessmentGate() {
  const router = useRouter();
  const pathname = usePathname();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const hydrated = useUiSessionStore((s) => s.hydrated);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!hydrated || loading) return;
    if (pathname === LEVEL_ASSESSMENT_PATH) return;

    const hasAccess = demoMode || !!user;
    if (!hasAccess) return;

    let cancelled = false;

    const scope = getAssessmentScope({ demoMode, userId: user?.uid });

    void hasCompletedLevelAssessment(scope, user?.uid).then((done) => {
      if (cancelled || done) return;
      const context = demoMode && !user ? 'demo' : 'account';
      router.replace(buildLevelAssessmentUrl(context));
    });

    return () => {
      cancelled = true;
    };
  }, [demoMode, hydrated, loading, pathname, router, user]);

  return null;
}
