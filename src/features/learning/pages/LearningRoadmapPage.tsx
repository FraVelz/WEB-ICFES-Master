'use client';

import { LearningRoadmap } from '@/features/learning/components';
import { ChatAssistant } from '@/features/learning/shell/ChatAssistant/ChatAssistant';
import { useDailyStreakOnLearningRoute } from '@/features/learning/hooks/useDailyStreakOnLearningRoute';

import { RoadmapUiProvider, useRoadmapUi } from '@/features/learning/context/RoadmapUiContext';
import { cn } from '@/utils/cn';

const Component = () => {
  const { isActive } = useRoadmapUi();
  useDailyStreakOnLearningRoute();

  return (
    <div
      id="container-main"
      className={cn(
        'min-h-dvh bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 p-0 lg:relative',
        isActive && 'h-screen overflow-hidden'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <LearningRoadmap />
      </div>
    </div>
  );
};

export const LearningRoadmapPage = () => {
  return (
    <>
      <RoadmapUiProvider>
        <Component />
      </RoadmapUiProvider>

      <ChatAssistant />
    </>
  );
};
