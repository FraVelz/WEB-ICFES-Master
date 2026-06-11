'use client';

import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

import { AreaPath } from './AreaPath';
import { LessonAreaLinks } from './LessonAreaLinks';
import { SecondaryHeader } from '../shell/SecondaryHeader';
import { pickDefaultSectionId } from '../shell/SecondaryHeader/sectionStageUtils';

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

/**
 * Ruta de aprendizaje con navegación secundaria tipo Duolingo:
 * stats + selector de área arriba, banner de etapa debajo, camino de lecciones en el centro.
 */
import type { PathNodeData } from './AreaPath';

export const LearningRoadmap = ({ initialArea = 'lectura-critica' }: { initialArea?: string }) => {
  const [currentArea, setCurrentArea] = useState(initialArea);
  const [currentSectionId, setCurrentSectionId] = useState<string | undefined>();
  const [selectedLesson, setSelectedLesson] = useState<PathNodeData | null>(null);
  const [viewingLesson, setViewingLesson] = useState<PathNodeData | null>(null);

  const currentAreaData = getAreaInfo(currentArea);
  const { sections, loading, error } = useLearningPath(currentArea);

  const areaColorClass = currentAreaData?.color ?? 'from-blue-500 to-blue-600';

  const getColorClass = (gradient: string) => {
    if (gradient.includes('blue')) return 'bg-blue-500';
    if (gradient.includes('green')) return 'bg-green-500';
    if (gradient.includes('purple')) return 'bg-purple-500';
    if (gradient.includes('orange')) return 'bg-orange-500';
    if (gradient.includes('pink')) return 'bg-pink-500';
    if (gradient.includes('indigo')) return 'bg-indigo-500';
    return 'bg-slate-500';
  };

  const colorClass = getColorClass(areaColorClass);

  const activeSections = useMemo(() => {
    if (!currentSectionId) return sections;
    const active = sections.find((s) => s.id === currentSectionId);
    return active ? [active] : sections;
  }, [sections, currentSectionId]);

  useEffect(() => {
    setCurrentSectionId(pickDefaultSectionId(sections));
  }, [currentArea, sections]);

  const handleAreaChange = (area: string) => {
    setCurrentArea(area);
    setCurrentSectionId(undefined);
  };

  const handleNodeClick = (node: PathNodeData) => {
    setSelectedLesson(node);
  };

  const handleStartLesson = (lesson?: PathNodeData | { id?: string } | null) => {
    setSelectedLesson(null);
    setViewingLesson(lesson as PathNodeData | null);
  };

  return (
    <div className={cn('bg-surface relative flex flex-col', viewingLesson ? 'h-dvh overflow-hidden' : 'min-h-dvh')}>
      <div className="sticky top-0 z-50">
        <SecondaryHeader
          currentArea={currentArea}
          onAreaChange={handleAreaChange}
          sections={sections}
          currentSectionId={currentSectionId}
          onSectionChange={setCurrentSectionId}
          areaColorClass={areaColorClass}
        />
      </div>

      <div className="relative flex-1 px-0 pt-4 pb-24 lg:pb-8">
        <LessonAreaLinks roadmapAreaId={currentArea} className="mb-6" />

        {loading && <LoadingState label="Cargando ruta..." layout="section" />}

        {error && <div className="py-10 text-center text-red-400">{error}</div>}

        {!loading && !error && (
          <AreaPath
            areaId={currentArea}
            onNodeClick={handleNodeClick}
            colorClass={colorClass}
            sections={activeSections}
            hideSectionHeader
          />
        )}

        <LessonPreview
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
          onStart={handleStartLesson}
        />

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
