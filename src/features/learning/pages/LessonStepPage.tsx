'use client';

import { useEffect, useMemo } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useDashboardShellOptional } from '@/features/dashboard/shell';
import { useLessonRoute } from '@/features/learning/context/LessonRouteContext';
import { phaseToSectionId, normalizeLessonPhase } from '@/features/learning/constants/learningPhases';
import { LessonContentView } from '@/features/learning/roadmap/LessonContentView';
import { splitLessonContent } from '@/features/learning/utils/splitLessonContent';
import {
  getLessonStartHref,
  getLessonStepSlugFromPathname,
  resolveLessonAreaId,
  parseLessonStepSlug,
} from '@/features/learning/utils/lessonRoutes';
import { getRoadmapHref } from '@/features/learning/data/competencyPhases';

/** Vista persistente de la lección; el paso se lee de la URL sin remontar toda la página. */
export function LessonStepShell() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const shell = useDashboardShellOptional();
  const { lesson, loading } = useLessonRoute();

  const lessonId = typeof params.lessonId === 'string' ? params.lessonId : (lesson?.id ?? '');
  const stepSlug = getLessonStepSlugFromPathname(pathname, lessonId) ?? '1';

  const contentStr = typeof lesson?.content === 'string' ? lesson.content : '';
  const sections = useMemo(() => splitLessonContent(contentStr), [contentStr]);
  const hasQuestions = lesson?.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0;
  const hasQuiz = Boolean(hasQuestions || (lesson?.quiz && typeof lesson.quiz === 'object'));
  const hasContent = sections.length > 0;

  useEffect(() => {
    if (loading || !lesson || !lessonId) return;
    const parsed = parseLessonStepSlug(stepSlug, sections.length, hasQuiz);
    if (!parsed) {
      router.replace(getLessonStartHref(lessonId, { hasContent, hasQuiz }));
    }
  }, [loading, lesson, lessonId, stepSlug, sections.length, hasQuiz, hasContent, router]);

  if (loading || !lesson) {
    return null;
  }

  const lessonArea = resolveLessonAreaId(lessonId, lesson);
  const lessonPhase = normalizeLessonPhase(lesson.phase);
  const sectionId = shell?.currentSectionId ?? phaseToSectionId(lessonPhase);

  return (
    <LessonContentView
      lesson={lesson}
      areaId={lessonArea}
      stepSlug={stepSlug}
      exitHref={getRoadmapHref(sectionId, lessonArea)}
    />
  );
}

/** @deprecated Usar LessonStepShell vía LessonRouteLayout */
export function LessonStepPage({ lessonId, stepSlug }: { lessonId: string; stepSlug: string }) {
  void lessonId;
  void stepSlug;
  return null;
}
