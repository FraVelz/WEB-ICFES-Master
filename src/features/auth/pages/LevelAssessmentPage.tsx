'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LevelAssessment } from '@/features/auth/components/LevelAssessment/LevelAssessment';
import type { LevelAssessmentContext } from '@/features/auth/types/skillLevel';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoadingState } from '@/shared/components/LoadingState';
import {
  getAssessmentOptionsFromContext,
  resolveLevelAssessmentRedirect,
} from '@/services/persistence/skillLevelPersistence';
import { useUiSessionStore } from '@/store/uiSessionStore';

export const LevelAssessmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoMode = useUiSessionStore((s) => s.demoMode);
  const hydrated = useUiSessionStore((s) => s.hydrated);
  const { user, loading: authLoading } = useAuth();
  const [ready, setReady] = useState(false);

  const rawContext = searchParams.get('context');
  const context: LevelAssessmentContext = rawContext === 'account' ? 'account' : 'demo';

  useEffect(() => {
    if (!hydrated || authLoading) return;

    let cancelled = false;
    const scopeOptions = getAssessmentOptionsFromContext(context, demoMode, user?.uid);

    void resolveLevelAssessmentRedirect(scopeOptions, user?.uid).then((redirect) => {
      if (cancelled) return;
      if (redirect) {
        router.replace(redirect);
        return;
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading, context, demoMode, hydrated, router, user?.uid]);

  if (!ready) {
    return <LoadingState label="Verificando evaluación..." layout="page" />;
  }

  return <LevelAssessment context={context} />;
};
