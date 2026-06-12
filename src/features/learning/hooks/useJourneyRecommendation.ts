'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import type { SkillLevel } from '@/features/auth/types/skillLevel';
import {
  SKILL_LEVEL_RECOMMENDATION_COPY,
  SKILL_LEVEL_RECOMMENDED_STEP,
  getJourneyStepById,
  type JourneyStepId,
} from '@/features/learning/data/routeTo500';
import {
  getAssessmentScope,
  getAssessmentScopeForSession,
  loadPersistedSkillLevel,
} from '@/services/persistence/skillLevelPersistence';
import { useUiSessionStore } from '@/store/uiSessionStore';

type JourneyRecommendation = {
  level: SkillLevel | null;
  stepId: JourneyStepId | null;
  message: string | null;
  loading: boolean;
};

export function useJourneyRecommendation(): JourneyRecommendation {
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const [level, setLevel] = useState<SkillLevel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const scopeOptions = getAssessmentScopeForSession(demoMode, user?.uid);
    const scope = getAssessmentScope(scopeOptions);

    void loadPersistedSkillLevel(scope, user?.uid).then((stored) => {
      if (cancelled) return;
      setLevel(stored);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [demoMode, user?.uid]);

  const stepId = level ? SKILL_LEVEL_RECOMMENDED_STEP[level] : null;
  const message = level ? SKILL_LEVEL_RECOMMENDATION_COPY[level] : null;

  if (stepId && !getJourneyStepById(stepId)) {
    return { level, stepId: null, message: null, loading };
  }

  return { level, stepId, message, loading };
}
