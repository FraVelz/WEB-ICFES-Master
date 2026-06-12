'use client';

import { useParams } from 'next/navigation';
import { LoadingState } from '@/shared/components/LoadingState';
import { EmptyState } from '@/shared/components/EmptyState';
import { LessonRouteProvider, useLessonRoute } from '@/features/learning/context/LessonRouteContext';
import { LessonStepShell } from '@/features/learning/pages/LessonStepPage';

function LessonRouteGate({ children }: { children: React.ReactNode }) {
  const { lesson, loading, error } = useLessonRoute();

  if (loading) {
    return <LoadingState label="Cargando lección..." layout="section" />;
  }

  if (error || !lesson) {
    return (
      <EmptyState
        icon="exclamation-circle"
        title="Lección no disponible"
        description={error ?? 'No pudimos cargar esta lección.'}
        actionLabel="Volver a la ruta"
        actionHref="/ruta-aprendizaje/"
        className="mx-auto max-w-lg px-4 py-8"
      />
    );
  }

  return children;
}

export function LessonRouteLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const lessonId = typeof params.lessonId === 'string' ? params.lessonId : undefined;

  return (
    <LessonRouteProvider lessonId={lessonId}>
      <LessonRouteGate>
        <LessonStepShell />
        {children}
      </LessonRouteGate>
    </LessonRouteProvider>
  );
}
