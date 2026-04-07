'use client';

import { LearningRoadmap } from '@/features/learning/components';
import { ChatAssistant } from '@/features/learning/components/ChatAssistant/ChatAssistant';

import { StoreProvider, useIsActiveStore } from '@/features/learning/hooks/context-isActiveStore';
import { cn } from '@/utils/cn';

const Component = () => {
  const { isActive } = useIsActiveStore();

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
/**
 * Página de Ruta de Aprendizaje
 * Muestra la ruta estructurada por áreas y niveles
 */
export const LearningRoadmapPage = () => {
  return (
    <>
      <StoreProvider>
        <Component />
      </StoreProvider>

      <ChatAssistant />
    </>
  );
};
