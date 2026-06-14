'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LevelAssessment } from '@/features/auth/components/LevelAssessment/LevelAssessment';
import type { LevelAssessmentContext } from '@/features/auth/types/skillLevel';
import { useAuth } from '@/features/auth/context/AuthContext';
import { OnboardingPageSkeleton } from '@/shared/components/PageSkeletons';
import {
  getAssessmentOptionsFromContext,
  getAssessmentScopeForSession,
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
  const checkVersionRef = useRef(0);

  const rawContext = searchParams.get('context');
  const context: LevelAssessmentContext =
    rawContext === 'account' || (rawContext !== 'demo' && !!user) ? 'account' : 'demo';

  useEffect(() => {
    if (!hydrated || authLoading) return;

    const checkVersion = ++checkVersionRef.current;
    const scopeOptions =
      context === 'account'
        ? getAssessmentScopeForSession(demoMode, user?.uid)
        : getAssessmentOptionsFromContext(context, demoMode, user?.uid);

    void resolveLevelAssessmentRedirect(scopeOptions, user?.uid).then((redirect) => {
      if (checkVersion !== checkVersionRef.current) return;
      if (redirect) {
        router.replace(redirect);
        return;
      }
      setReady(true);
    });
  }, [authLoading, context, demoMode, hydrated, router, user?.uid]);

  if (!ready) {
    return <OnboardingPageSkeleton />;
  }

  return <LevelAssessment context={context} />;
};
