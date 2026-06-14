'use client';

import { useMemo } from 'react';
import { splitLessonContent, extractSectionTitle, stripFirstHeadingIfDuplicate } from '../utils/splitLessonContent';
import { getAdjacentLessonStepHrefs, getLessonStepLabel, parseLessonStepSlug } from '../utils/lessonRoutes';
import { prepareLessonBody } from './lessonMarkdownUtils';
import type { LessonQuizModalProps } from './lessonQuiz/quizTypes';
import type { LessonVisual } from './lessonVisualTypes';
import { parseLessonVisuals } from './lessonVisualTypes';

export type LessonContentLesson = {
  id?: string;
  title?: string;
  content?: string;
  visuals?: LessonVisual[];
  quiz?: unknown;
  questions?: unknown[];
  xp?: number;
  coins?: number;
  rewards?: { xp?: number; coins?: number };
};

export function useLessonContentStep(lesson: LessonContentLesson, stepSlug: string) {
  const lessonId = lesson.id ?? '';

  const hasQuestions = lesson?.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0;
  const hasQuiz = lesson?.quiz && typeof lesson.quiz === 'object';
  const canShowQuiz = Boolean(hasQuestions || hasQuiz);

  const preparedLesson = useMemo(() => {
    const contentStr = typeof lesson?.content === 'string' ? lesson.content : '';
    const baseVisuals = parseLessonVisuals(lesson?.visuals);
    return prepareLessonBody(contentStr, baseVisuals);
  }, [lesson?.content, lesson?.visuals]);

  const sections = useMemo(() => splitLessonContent(preparedLesson.content), [preparedLesson.content]);

  const parsedStep = useMemo(
    () => parseLessonStepSlug(stepSlug, sections.length, canShowQuiz),
    [stepSlug, sections.length, canShowQuiz]
  );

  const showQuiz = parsedStep?.kind === 'examen';
  const currentSection = parsedStep?.kind === 'content' ? parsedStep.index : sections.length;
  const totalSteps = sections.length + (canShowQuiz ? 1 : 0);
  const progress = totalSteps > 0 ? ((showQuiz ? totalSteps : currentSection + 1) / totalSteps) * 100 : 0;

  const mascotDialogue = useMemo(() => {
    if (showQuiz) return lesson?.title || 'Examen';
    if (sections.length === 0) return lesson?.title || '';
    const sectionTitle = extractSectionTitle(sections[currentSection]);
    return sectionTitle || lesson?.title || '¡Vamos a aprender!';
  }, [showQuiz, sections, currentSection, lesson?.title]);

  const contentToRender =
    sections.length > 0 && !showQuiz
      ? stripFirstHeadingIfDuplicate(sections[currentSection], mascotDialogue)
      : (sections[currentSection] ?? '');

  const { prev: prevHref, next: nextHref } = parsedStep
    ? getAdjacentLessonStepHrefs(lessonId, parsedStep, sections.length, canShowQuiz)
    : { prev: null, next: null };

  const stepLabel = parsedStep ? getLessonStepLabel(parsedStep, sections.length, canShowQuiz) : '1 / 1';

  const quizProps = {
    questions: Array.isArray(lesson?.questions) ? (lesson.questions as LessonQuizModalProps['questions']) : undefined,
    quiz:
      lesson?.quiz && typeof lesson.quiz === 'object'
        ? ({
            ...(lesson.quiz as object),
            questions: lesson.questions,
            rewards: lesson.rewards,
          } as LessonQuizModalProps['quiz'])
        : undefined,
    lessonId: lesson?.id,
    lessonTitle: lesson?.title,
    lessonXp: lesson?.xp,
    lessonCoins: lesson?.coins,
  };

  return {
    lessonId,
    sections,
    showQuiz,
    currentSection,
    progress,
    mascotDialogue,
    contentToRender,
    visuals: preparedLesson.visuals,
    prevHref,
    nextHref,
    stepLabel,
    quizProps,
  };
}
