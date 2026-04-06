'use client';

import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import { AreaPath } from './AreaPath';
import { LessonAreaLinks } from './LessonAreaLinks';
import { LessonPreview } from './LessonPreview';
import { LessonContentModal } from './LessonContentModal';
import { SecondaryHeader } from '../SecondaryHeader';
import { AREA_INFO } from '@/shared/constants';
import { useLearningPath } from '../../hooks/useLearningPath';
import { AnimatedOnMount } from '@/shared/components/AnimatedOnMount';

/**
 * Componente principal de la Ruta de Aprendizaje
 * Muestra el camino visual de progreso para el área seleccionada.
 * Ahora incluye el Header Secundario internamente.
 */
import type { PathNodeData } from './AreaPath';

export const LearningRoadmap = ({ initialArea = 'lectura-critica' }: { initialArea?: string }) => {
  const [currentArea, setCurrentArea] = useState(initialArea);
  const [selectedLesson, setSelectedLesson] = useState<PathNodeData | null>(null);
  const [viewingLesson, setViewingLesson] = useState<PathNodeData | null>(null);

  const currentAreaData =
    (AREA_INFO as Record<string, { name?: string; color?: string }>)[currentArea] ||
    (AREA_INFO as Record<string, { name?: string; color?: string }>)['lectura-critica'];

  // Hook para obtener datos de gamificación
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
    <div className={cn('relative flex flex-col bg-slate-950', viewingLesson ? 'h-dvh overflow-hidden' : 'min-h-dvh')}>
      {/* Header Secundario Sticky - Ahora parte del componente */}
      <div className="sticky top-0 z-50">
        <SecondaryHeader currentArea={currentArea} onAreaChange={setCurrentArea} />
      </div>

      <div className="relative flex-1 px-4 pt-8 pb-24">
        {/* Título del Área (Contexto) */}
        <AnimatedOnMount className="mb-8 text-center" duration={0.7} y={16}>
          <h2 className={cn('bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent', currentAreaData.color)}>
            {currentAreaData.name}
          </h2>
          <p className="mt-2 text-sm font-medium tracking-wide text-slate-400 uppercase">Ruta de Aprendizaje</p>
        </AnimatedOnMount>

        <LessonAreaLinks roadmapAreaId={currentArea} />

        {/* Estado de Carga y Error */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
        )}

        {error && <div className="py-10 text-center text-red-400">{error}</div>}

        {/* Camino Visual */}
        {!loading && !error && (
          <AreaPath areaId={currentArea} onNodeClick={handleNodeClick} colorClass={colorClass} sections={sections} />
        )}

        {/* Modal de Previsualización */}
        <LessonPreview
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
          onStart={handleStartLesson}
        />

        {/* Modal de Contenido de Lección */}
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
