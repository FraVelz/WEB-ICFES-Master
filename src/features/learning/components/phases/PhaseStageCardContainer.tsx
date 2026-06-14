'use client';

import { useMemo } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { isDemoUserId } from '@/services/demo/demoCoins';
import type { CompetencyPhase } from '@/features/learning/data/competencyPhases';
import { getPhaseSkipExamHref } from '@/features/learning/data/competencyPhases';
import type { PhaseCardStatus } from '@/features/learning/data/phaseProgressUtils';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import { PhaseStageCard } from './PhaseStageCard';
import { usePhaseSkipAvailability } from '@/features/learning/phaseSkip/usePhaseSkipAvailability';

type PhaseStageCardContainerProps = {
  phase: CompetencyPhase;
  status: PhaseCardStatus;
  progressPercent: number;
  section?: PathSection;
  areaId: string;
  areaFocus?: string;
  skippedByExam: boolean;
  performanceLevels?: string;
};

export function PhaseStageCardContainer({
  phase,
  status,
  progressPercent,
  section,
  areaId,
  areaFocus,
  skippedByExam,
  performanceLevels,
}: PhaseStageCardContainerProps) {
  const { user } = useAuth();
  const lessonIds = useMemo(() => section?.nodes.map((node) => node.id) ?? [], [section?.nodes]);
  const { availability, loading, canStart } = usePhaseSkipAvailability(lessonIds);
  const requiresAuth = !user || isDemoUserId(user.uid);

  return (
    <PhaseStageCard
      phase={phase}
      status={status}
      progressPercent={progressPercent}
      lessonCount={section?.nodes.length ?? 0}
      areaFocus={areaFocus}
      sectionId={phase.sectionId}
      areaId={areaId}
      skipExamHref={getPhaseSkipExamHref(areaId, phase.sectionId)}
      skippedByExam={skippedByExam}
      performanceLevels={performanceLevels}
      phaseSkipCanStart={canStart}
      phaseSkipTotalQuestions={availability?.totalQuestions}
      phaseSkipAvailabilityLoading={loading}
      phaseSkipRequiresAuth={requiresAuth}
    />
  );
}
