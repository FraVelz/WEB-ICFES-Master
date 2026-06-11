'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { gsap } from '@/lib/gsap';
import { getRoadmapHref } from '../data/competencyPhases';
import { getLessonStepHref } from '../utils/lessonRoutes';
import { LessonContentFooter } from './LessonContentFooter';
import { LessonContentHeader } from './LessonContentHeader';
import { LessonContentSection } from './LessonContentSection';
import { LessonQuizPanel } from './lessonQuiz/LessonQuizPanel';
import { getAreaColor, getBubbleBorderColor } from './lessonContentColors';
import { useLessonContentStep, type LessonContentLesson } from './useLessonContentStep';

export type LessonContentViewProps = {
  lesson: LessonContentLesson;
  areaId?: string;
  stepSlug: string;
  exitHref?: string;
};

const SECTION_INNER = 'mx-auto w-full max-w-6xl px-3 sm:px-4';

export function LessonContentView({
  lesson,
  areaId = 'lectura-critica',
  stepSlug,
  exitHref,
}: LessonContentViewProps) {
  const router = useRouter();
  const stepContentRef = useRef<HTMLDivElement>(null);
  const backHref = exitHref ?? getRoadmapHref();
  const gradientClass = getAreaColor(areaId);
  const bubbleBorder = getBubbleBorderColor(areaId);

  const {
    lessonId,
    sections,
    showQuiz,
    currentSection,
    progress,
    mascotDialogue,
    contentToRender,
    prevHref,
    nextHref,
    stepLabel,
    quizProps,
  } = useLessonContentStep(lesson, stepSlug);

  useEffect(() => {
    const el = stepContentRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
  }, [stepSlug]);

  return (
    <div className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-slate-950">
      <LessonContentHeader
        title={lesson.title}
        backHref={backHref}
        progress={progress}
        gradientClass={gradientClass}
        sectionInnerClass={SECTION_INNER}
      />

      <div
        ref={stepContentRef}
        className={cn(
          'min-h-0 flex-1',
          showQuiz
            ? 'flex flex-col overflow-hidden'
            : 'overflow-x-hidden overflow-y-auto overscroll-contain scroll-smooth'
        )}
      >
        {showQuiz ? (
          <LessonQuizPanel
            active={showQuiz}
            variant="inline"
            bubbleBorder={bubbleBorder}
            contentClassName={cn(SECTION_INNER, 'py-4 sm:py-6')}
            footerInnerClassName={cn(SECTION_INNER, 'py-3 sm:py-4')}
            onCancel={() => {
              if (sections.length > 0) {
                router.push(getLessonStepHref(lessonId, sections.length));
              } else {
                router.push(backHref);
              }
            }}
            onComplete={() => router.push(backHref)}
            {...quizProps}
          />
        ) : (
          <LessonContentSection
            sectionsCount={sections.length}
            currentSection={currentSection}
            mascotDialogue={mascotDialogue}
            bubbleBorder={bubbleBorder}
            contentToRender={contentToRender}
            sectionInnerClass={SECTION_INNER}
          />
        )}
      </div>

      {!showQuiz && (
        <LessonContentFooter
          prevHref={prevHref}
          nextHref={nextHref}
          stepLabel={stepLabel}
          gradientClass={gradientClass}
          sectionInnerClass={SECTION_INNER}
        />
      )}
    </div>
  );
}
