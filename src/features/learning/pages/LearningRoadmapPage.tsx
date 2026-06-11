'use client';

import { LearningRoadmap } from '@/features/learning/components';
import { useDailyStreakOnLearningRoute } from '@/features/learning/hooks/useDailyStreakOnLearningRoute';
import { Suspense } from 'react';
import { LoadingState } from '@/shared/components/LoadingState';

const Component = () => {
  useDailyStreakOnLearningRoute();

  return (
    <div id="container-main" className="relative min-h-0 p-0">
      <LearningRoadmap />
    </div>
  );
};

export const LearningRoadmapPage = () => {
  return (
    <Suspense fallback={<LoadingState label="Cargando ruta..." layout="section" />}>
      <Component />
    </Suspense>
  );
};
