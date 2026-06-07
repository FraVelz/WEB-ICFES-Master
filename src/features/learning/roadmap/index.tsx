'use client';

import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { AreaPath } from './AreaPath';
import { LessonAreaLinks } from './LessonAreaLinks';
import { SecondaryHeader } from '../shell/SecondaryHeader';

const LessonPreview = dynamic(() => import('./LessonPreview').then((m) => ({ default: m.LessonPreview })), {
  ssr: false,
});
const LessonContentModal = dynamic(
  () => import('./LessonContentModal').then((m) => ({ default: m.LessonContentModal })),
  { ssr: false }
);

import { getAreaInfo } from '@/shared/constants';
import { LoadingState } from '@/shared/components/LoadingState';
import { useLearningPath } from '../hooks/useLearningPath';
import { AnimatedOnMount } from '@/features/learning/AnimatedOnMount';

/**
 * Learning roadmap page: visual path for the selected area (includes SecondaryHeader).
 */
import type { PathNodeData } from './AreaPath';

export const LearningRoadmap = ({ initialArea = 'lectura-critica' }: { initialArea?: string }) => {
  const [currentArea, setCurrentArea] = useState(initialArea);
  const [selectedLesson, setSelectedLesson] = useState<PathNodeData | null>(null);
  const [viewingLesson, setViewingLesson] = useState<PathNodeData | null>(null);

  const currentAreaData = getAreaInfo(currentArea);

  // Roadmap sections + loading state
  const { sections, loading, error } = useLearningPath(currentArea);

  const getColorClass = (gradient: string) => {
    if (gradient.includes('blue')) return 'bg-blue-500';
    if (gradient.includes('green')) return 'bg-green-500';
    if (gradient.includes('purple')) return 'bg-purple-500';
    if (gradient.includes('orange')) return 'bg-orange-500';
    if (gradient.includes('pink')) return 'bg-pink-500';
    if (gradient.includes('indigo')) return 'bg-indigo-500';
    return 'bg-slate-500';
  };

  const colorClass = getColorClass(currentAreaData?.color ?? 'from-blue-500 to-blue-600');

  const handleNodeClick = (node: PathNodeData) => {
    setSelectedLesson(node);
  };

  const handleStartLesson = (lesson?: PathNodeData | { id?: string } | null) => {
    setSelectedLesson(null);
    setViewingLesson(lesson as PathNodeData | null);
  };

  return (
    <div className={cn('bg-surface relative flex flex-col', viewingLesson ? 'h-dvh overflow-hidden' : 'min-h-dvh')}>
      {/* Sticky secondary header */}
      <div className="sticky top-0 z-50">
        <SecondaryHeader currentArea={currentArea} onAreaChange={setCurrentArea} />
      </div>

      <div className="relative flex-1 px-4 pt-8 pb-24">
        {/* Area title */}
        <AnimatedOnMount className="mb-8 text-center" duration={0.7} y={16}>
          <h2 className={cn('bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent', currentAreaData.color)}>
            {currentAreaData.name}
          </h2>
          <p className="text-on-surface-muted mt-2 text-sm font-medium tracking-wide uppercase">Ruta de Aprendizaje</p>
        </AnimatedOnMount>

        <LessonAreaLinks roadmapAreaId={currentArea} />

        {/* Loading / error */}
        {loading && <LoadingState label="Cargando ruta..." layout="section" />}

        {error && <div className="py-10 text-center text-red-400">{error}</div>}

        {/* Visual path */}
        {!loading && !error && (
          <AreaPath areaId={currentArea} onNodeClick={handleNodeClick} colorClass={colorClass} sections={sections} />
        )}

        {/* Lesson preview modal */}
        <LessonPreview
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
          onStart={handleStartLesson}
        />

        {/* Lesson content modal */}
        <LessonContentModal
          isOpen={!!viewingLesson}
          onClose={() => setViewingLesson(null)}
          lesson={viewingLesson}
          areaId={currentArea}
        />
      </div>
    </div>
  );
};
