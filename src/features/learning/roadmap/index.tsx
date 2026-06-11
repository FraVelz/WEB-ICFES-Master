'use client';

import { cn } from '@/utils/cn';
import dynamic from 'next/dynamic';
import React, { useMemo, useState } from 'react';
import { useDashboardShell } from '@/features/dashboard/shell';

import { AreaPath } from './AreaPath';

const LessonPreview = dynamic(() => import('./LessonPreview').then((m) => ({ default: m.LessonPreview })), {
  ssr: false,
});
const LessonContentModal = dynamic(
  () => import('./LessonContentModal').then((m) => ({ default: m.LessonContentModal })),
  { ssr: false }
);

import { LoadingState } from '@/shared/components/LoadingState';

/**
 * Camino de lecciones (columna central). Header, stats y aside viven en DashboardShell.
 */
import type { PathNodeData } from './AreaPath';

export const LearningRoadmap = () => {
  const {
    currentArea,
    currentSectionId,
    sections,
    pathLoading: loading,
    currentAreaData,
  } = useDashboardShell();

  const [selectedLesson, setSelectedLesson] = useState<PathNodeData | null>(null);
  const [viewingLesson, setViewingLesson] = useState<PathNodeData | null>(null);

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

  const handleNodeClick = (node: PathNodeData) => {
    setSelectedLesson(node);
  };

  const handleStartLesson = (lesson?: PathNodeData | { id?: string } | null) => {
    setSelectedLesson(null);
    setViewingLesson(lesson as PathNodeData | null);
  };

  return (
    <div className={cn('relative', viewingLesson ? 'h-dvh overflow-hidden' : 'min-h-0')}>
      {loading && <LoadingState label="Cargando ruta..." layout="section" />}

      {!loading && (
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
  );
};
