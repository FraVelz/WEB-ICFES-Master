'use client';

import { createContext, useContext } from 'react';
import type { PathNodeData } from '@/features/learning/roadmap/AreaPath';
import { useLessonFromRoute } from '@/features/learning/hooks/useLessonFromRoute';

type LessonRouteContextValue = {
  lesson: PathNodeData | null;
  loading: boolean;
  error: string | null;
};

const LessonRouteContext = createContext<LessonRouteContextValue | null>(null);

export function LessonRouteProvider({
  lessonId,
  children,
}: {
  lessonId: string | undefined;
  children: React.ReactNode;
}) {
  const value = useLessonFromRoute(lessonId);
  return <LessonRouteContext.Provider value={value}>{children}</LessonRouteContext.Provider>;
}

export function useLessonRoute() {
  const context = useContext(LessonRouteContext);
  if (!context) {
    throw new Error('useLessonRoute debe usarse dentro de LessonRouteProvider');
  }
  return context;
}
