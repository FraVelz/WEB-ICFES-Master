'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useDashboardShell } from '@/features/dashboard/shell';
import { getLessonStartHref } from '@/features/learning/utils/lessonRoutes';
import { splitLessonContent } from '@/features/learning/utils/splitLessonContent';

import { AreaPath } from './AreaPath';

const LessonPreview = dynamic(() => import('./LessonPreview').then((m) => ({ default: m.LessonPreview })), {
  ssr: false,
});

import { LoadingState } from '@/shared/components/LoadingState';

import type { PathNodeData } from './AreaPath';

export const LearningRoadmap = () => {
  const router = useRouter();
  const {
    currentArea,
    currentSectionId,
    sections,
    pathLoading: loading,
    pathError,
    currentAreaData,
  } = useDashboardShell();

  const [selectedLesson, setSelectedLesson] = useState<PathNodeData | null>(null);

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

  const handleStartLesson = (
    lesson?: PathNodeData | { id?: string; content?: string; questions?: unknown[]; quiz?: unknown } | null
  ) => {
    setSelectedLesson(null);
    if (!lesson?.id) return;

    const contentStr = typeof lesson.content === 'string' ? lesson.content : '';
    const sections = splitLessonContent(contentStr);
    const hasContent = sections.length > 0;
    const hasQuestions = lesson.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0;
    const hasQuiz = Boolean(hasQuestions || (lesson.quiz && typeof lesson.quiz === 'object'));

    router.push(getLessonStartHref(lesson.id, { hasContent, hasQuiz }));
  };

  return (
    <div className="relative min-h-0">
      {loading && <LoadingState label="Cargando ruta..." layout="section" />}

      {!loading && pathError && (
        <div
          role="alert"
          className="mx-auto mb-6 max-w-md rounded-2xl border border-red-500/30 bg-red-950/30 px-4 py-5 text-center"
        >
          <p className="text-sm font-semibold text-red-200">{pathError}</p>
          <p className="text-on-surface-muted mt-2 text-xs">
            Comprueba tu conexión o recarga la página. Si persiste, revisa la configuración de Supabase.
          </p>
        </div>
      )}

      {!loading && !pathError && activeSections.length === 0 && (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/40 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-white">No hay lecciones en esta fase</p>
          <p className="text-on-surface-muted mt-2 text-xs">
            Prueba otra área o fase, o vuelve más tarde cuando se publique contenido nuevo.
          </p>
        </div>
      )}

      {!loading && !pathError && activeSections.length > 0 && (
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
    </div>
  );
};
