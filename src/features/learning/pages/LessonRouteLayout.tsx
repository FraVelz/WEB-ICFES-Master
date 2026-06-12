'use client';

import { useParams } from 'next/navigation';
import { cn } from '@/utils/cn';
import { LoadingState } from '@/shared/components/LoadingState';
import { LessonRouteProvider, useLessonRoute } from '@/features/learning/context/LessonRouteContext';
import { LessonStepShell } from '@/features/learning/pages/LessonStepPage';

function LessonRouteGate({ children }: { children: React.ReactNode }) {
  const { lesson, loading, error } = useLessonRoute();

  if (loading) {
    return <LoadingState label="Cargando lección..." layout="section" />;
  }

  if (error || !lesson) {
    return (
      <div
        className={cn(
          'mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-950/20 px-4 py-6',
          'text-center text-sm text-red-200'
        )}
      >
        {error ?? 'Lección no disponible.'}
      </div>
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
