'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PathNodeData } from '@/features/learning/roadmap/AreaPath';
import { useDashboardShellOptional } from '@/features/dashboard/shell';
import LearningSupabaseService from '@/services/supabase/LearningSupabaseService';

export function useLessonFromRoute(lessonId: string | undefined) {
  const shell = useDashboardShellOptional();
  const sections = shell?.sections ?? [];
  const [fetchedLesson, setFetchedLesson] = useState<PathNodeData | null>(null);
  const [loading, setLoading] = useState(Boolean(lessonId));
  const [error, setError] = useState<string | null>(null);

  const lessonFromSections = useMemo(() => {
    if (!lessonId) return null;
    for (const section of sections) {
      const node = section.nodes.find((n) => n.id === lessonId);
      if (node) return node;
    }
    return null;
  }, [sections, lessonId]);

  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      return;
    }

    if (lessonFromSections) {
      setFetchedLesson(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    void LearningSupabaseService.getLesson(lessonId)
      .then((row) => {
        if (!active) return;
        if (!row) {
          setFetchedLesson(null);
          setError('No encontramos esta lección.');
          return;
        }
        const data = row as Record<string, unknown>;
        const quiz = (data.quiz ?? {}) as Record<string, unknown>;
        const rawContent =
          data.content ??
          data.body ??
          (typeof data.content === 'object' && data.content
            ? (data.content as Record<string, unknown>).body
            : undefined);
        setFetchedLesson({
          ...data,
          id: String(data.id ?? lessonId),
          title: data.title as string | undefined,
          description: (data.description ?? data.summary) as string | undefined,
          content: typeof rawContent === 'string' ? rawContent : undefined,
          xp: (quiz.rewards as { xp?: number } | undefined)?.xp ?? (data.xp as number | undefined),
          coins: (quiz.rewards as { coins?: number } | undefined)?.coins ?? (data.coins as number | undefined),
          questions: data.questions,
          quiz: data.quiz,
          type: 'lesson',
        } as PathNodeData);
      })
      .catch(() => {
        if (!active) return;
        setFetchedLesson(null);
        setError('Error al cargar la lección.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lessonId, lessonFromSections]);

  return {
    lesson: lessonFromSections ?? fetchedLesson,
    loading,
    error,
  };
}
