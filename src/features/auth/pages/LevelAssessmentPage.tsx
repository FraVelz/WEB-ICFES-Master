'use client';

import { useSearchParams } from 'next/navigation';
import { LevelAssessment } from '@/features/auth/components/LevelAssessment/LevelAssessment';
import type { LevelAssessmentContext } from '@/features/auth/types/skillLevel';

export const LevelAssessmentPage = () => {
  const searchParams = useSearchParams();
  const rawContext = searchParams.get('context');
  const context: LevelAssessmentContext = rawContext === 'account' ? 'account' : 'demo';

  return <LevelAssessment context={context} />;
};
