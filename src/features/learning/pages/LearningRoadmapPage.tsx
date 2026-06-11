'use client';

import { LearningRoadmap } from '@/features/learning/components';
import { useDailyStreakOnLearningRoute } from '@/features/learning/hooks/useDailyStreakOnLearningRoute';
import { RoadmapUiProvider, useRoadmapUi } from '@/features/learning/context/RoadmapUiContext';
import { cn } from '@/utils/cn';
import { Suspense } from 'react';
import { LoadingState } from '@/shared/components/LoadingState';

const Component = () => {
  const { isActive } = useRoadmapUi();
  useDailyStreakOnLearningRoute();

  return (
    <div
      id="container-main"
      className={cn('relative min-h-0 p-0', isActive && 'h-screen overflow-hidden')}
    >
      <LearningRoadmap />
    </div>
  );
};

export const LearningRoadmapPage = () => {
  return (
    <RoadmapUiProvider>
      <Suspense fallback={<LoadingState label="Cargando ruta..." layout="section" />}>
        <Component />
      </Suspense>
    </RoadmapUiProvider>
  );
};
