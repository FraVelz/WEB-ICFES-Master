'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/utils/prefersReducedMotion';
import { getRoadmapHref } from '../data/competencyPhases';
import { getLessonStepHref } from '../utils/lessonRoutes';
import { LessonContentFooter, type LessonNavDirection } from './LessonContentFooter';
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
const STEP_EXIT_MS = 0.14;
const STEP_ENTER_MS = 0.18;

export function LessonContentView({ lesson, areaId = 'lectura-critica', stepSlug, exitHref }: LessonContentViewProps) {
  const router = useRouter();
  const stepContentRef = useRef<HTMLDivElement>(null);
  const transitionDirectionRef = useRef<LessonNavDirection | null>(null);
  const isAnimatingRef = useRef(false);
  const isFirstStepRef = useRef(true);
  const [navigating, setNavigating] = useState(false);
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
    visuals,
    prevHref,
    nextHref,
    stepLabel,
    quizProps,
  } = useLessonContentStep(lesson, stepSlug);

  useEffect(() => {
    if (prevHref) router.prefetch(prevHref);
    if (nextHref) router.prefetch(nextHref);
  }, [prevHref, nextHref, router]);

  const animateStepEnter = useCallback(() => {
    const el = stepContentRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      transitionDirectionRef.current = null;
      return;
    }

    const direction = transitionDirectionRef.current;
    const xIn = direction === 'next' ? 28 : direction === 'prev' ? -28 : 0;

    gsap.fromTo(
      el,
      { opacity: 0, x: xIn, y: direction ? 0 : 14 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: direction ? STEP_ENTER_MS : 0.22,
        ease: 'power2.out',
        clearProps: 'transform',
      }
    );

    transitionDirectionRef.current = null;
  }, []);

  useEffect(() => {
    if (isFirstStepRef.current) {
      isFirstStepRef.current = false;
      animateStepEnter();
      return;
    }
    stepContentRef.current?.scrollTo({ top: 0 });
    animateStepEnter();
  }, [stepSlug, animateStepEnter]);

  const handleNavigate = useCallback(
    (href: string, direction: LessonNavDirection) => {
      const el = stepContentRef.current;
      if (!el || isAnimatingRef.current) return;

      isAnimatingRef.current = true;
      setNavigating(true);
      transitionDirectionRef.current = direction;

      if (prefersReducedMotion()) {
        router.push(href);
        isAnimatingRef.current = false;
        setNavigating(false);
        return;
      }

      const xOut = direction === 'next' ? -28 : 28;

      gsap.to(el, {
        opacity: 0,
        x: xOut,
        duration: STEP_EXIT_MS,
        ease: 'power2.in',
        onComplete: () => {
          router.push(href);
          isAnimatingRef.current = false;
          setNavigating(false);
        },
      });
    },
    [router]
  );

  return (
    <div className="bg-surface-via fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden">
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
          'min-h-0 flex-1 will-change-transform',
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
            visuals={visuals}
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
          onNavigate={handleNavigate}
          navigating={navigating}
        />
      )}
    </div>
  );
}
