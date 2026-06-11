'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/shared/components/LoadingState';
import { useDashboardShellOptional } from '@/features/dashboard/shell';
import { phaseToSectionId, normalizeLessonPhase } from '@/features/learning/constants/learningPhases';
import { LessonContentView } from '@/features/learning/roadmap/LessonContentView';
import { useLessonFromRoute } from '@/features/learning/hooks/useLessonFromRoute';
import { splitLessonContent } from '@/features/learning/utils/splitLessonContent';
import {
  getLessonStartHref,
  normalizeRoadmapAreaId,
  parseLessonStepSlug,
} from '@/features/learning/utils/lessonRoutes';
import { getRoadmapHref } from '@/features/learning/data/competencyPhases';

type LessonStepPageProps = {
  lessonId: string;
  stepSlug: string;
};

export function LessonStepPage({ lessonId, stepSlug }: LessonStepPageProps) {
  const router = useRouter();
  const shell = useDashboardShellOptional();
  const { lesson, loading, error } = useLessonFromRoute(lessonId);

  const contentStr = typeof lesson?.content === 'string' ? lesson.content : '';
  const sections = useMemo(() => splitLessonContent(contentStr), [contentStr]);
  const hasQuestions = lesson?.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0;
  const hasQuiz = Boolean(hasQuestions || (lesson?.quiz && typeof lesson.quiz === 'object'));
  const hasContent = sections.length > 0;

  useEffect(() => {
    if (loading || !lesson) return;
    const parsed = parseLessonStepSlug(stepSlug, sections.length, hasQuiz);
    if (!parsed) {
      router.replace(getLessonStartHref(lessonId, { hasContent, hasQuiz }));
    }
  }, [loading, lesson, lessonId, stepSlug, sections.length, hasQuiz, hasContent, router]);

  if (loading) {
    return <LoadingState label="Cargando lección..." layout="section" />;
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-950/20 px-4 py-6 text-center text-sm text-red-200">
        {error ?? 'Lección no disponible.'}
      </div>
    );
  }

  const lessonArea = normalizeRoadmapAreaId(
    typeof lesson.area === 'string' ? lesson.area : undefined
  );
  const lessonPhase = normalizeLessonPhase(lesson.phase);
  const sectionId = shell?.currentSectionId ?? phaseToSectionId(lessonPhase);

  return (
    <LessonContentView
      lesson={lesson}
      areaId={shell?.currentArea ?? lessonArea}
      stepSlug={stepSlug}
      exitHref={getRoadmapHref(sectionId)}
    />
  );
}
