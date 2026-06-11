'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MASCOT_IMAGES } from '@/assets';
import { gsap } from '@/lib/gsap';
import { LessonMascotBubble } from './LessonMascotBubble';
import { LessonQuizPanel } from './lessonQuiz/LessonQuizPanel';
import type { LessonQuizModalProps } from './lessonQuiz/quizTypes';
import { splitLessonContent, extractSectionTitle, stripFirstHeadingIfDuplicate } from '../utils/splitLessonContent';
import {
  getAdjacentLessonStepHrefs,
  getLessonStepHref,
  getLessonStepLabel,
  parseLessonStepSlug,
} from '../utils/lessonRoutes';
import { getAreaInfo } from '@/shared/constants';
import { getRoadmapHref } from '../data/competencyPhases';
import { isSafeHref } from '@/shared/utils/safeHref';

const getAreaColor = (areaId: string) => {
  const color = getAreaInfo(areaId).color ?? '';
  if (color.includes('blue')) return 'from-blue-500 to-blue-600';
  if (color.includes('green')) return 'from-green-500 to-green-600';
  if (color.includes('purple')) return 'from-purple-500 to-purple-600';
  if (color.includes('orange')) return 'from-orange-500 to-orange-600';
  if (color.includes('indigo')) return 'from-indigo-500 to-indigo-600';
  return 'from-blue-500 to-blue-600';
};

const getBubbleBorderColor = (areaId: string) => {
  const color = getAreaInfo(areaId).color ?? '';
  if (color.includes('blue')) return 'border-blue-400/50';
  if (color.includes('green')) return 'border-green-400/50';
  if (color.includes('purple')) return 'border-purple-400/50';
  if (color.includes('orange')) return 'border-orange-400/50';
  if (color.includes('indigo')) return 'border-indigo-400/50';
  return 'border-blue-400/50';
};

export type LessonContentViewProps = {
  lesson: {
    id?: string;
    title?: string;
    content?: string;
    quiz?: unknown;
    questions?: unknown[];
    xp?: number;
    coins?: number;
    rewards?: { xp?: number; coins?: number };
  };
  areaId?: string;
  stepSlug: string;
  exitHref?: string;
};

export function LessonContentView({
  lesson,
  areaId = 'lectura-critica',
  stepSlug,
  exitHref,
}: LessonContentViewProps) {
  const router = useRouter();
  const stepContentRef = useRef<HTMLDivElement>(null);
  const lessonId = lesson.id ?? '';

  const hasQuestions = lesson?.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0;
  const hasQuiz = lesson?.quiz && typeof lesson.quiz === 'object';
  const canShowQuiz = Boolean(hasQuestions || hasQuiz);

  const contentStr = typeof lesson?.content === 'string' ? lesson.content : '';
  const sections = useMemo(() => splitLessonContent(contentStr), [contentStr]);

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

  const mascotSrc = MASCOT_IMAGES.logo;
  const gradientClass = getAreaColor(areaId);
  const bubbleBorder = getBubbleBorderColor(areaId);
  const sectionInnerClass = 'mx-auto w-full max-w-6xl px-3 sm:px-4';
  const backHref = exitHref ?? getRoadmapHref();

  const contentToRender =
    sections.length > 0 && !showQuiz
      ? stripFirstHeadingIfDuplicate(sections[currentSection], mascotDialogue)
      : (sections[currentSection] ?? '');

  const { prev: prevHref, next: nextHref } = parsedStep
    ? getAdjacentLessonStepHrefs(lessonId, parsedStep, sections.length, canShowQuiz)
    : { prev: null, next: null };

  const stepLabel = parsedStep
    ? getLessonStepLabel(parsedStep, sections.length, canShowQuiz)
    : '1 / 1';

  useEffect(() => {
    const el = stepContentRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' });
  }, [stepSlug]);

  const quizProps = {
    questions: Array.isArray(lesson?.questions)
      ? (lesson.questions as LessonQuizModalProps['questions'])
      : undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-slate-950">
      <div className="shrink-0 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
        <div className={cn(sectionInnerClass, 'flex items-center justify-between py-2.5 sm:py-3')}>
          <Link
            href={backHref}
            className={cn(
              '-ml-1 flex min-w-[44px] cursor-pointer items-center gap-2 rounded-xl p-2 text-slate-400',
              'transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
            )}
          >
            <Icon name="arrow-left" className="text-lg" />
            <span className="hidden text-sm font-medium sm:inline">Salir</span>
          </Link>
          <h2 className="flex-1 truncate px-2 text-center text-sm font-bold text-white sm:px-4 sm:text-base">
            {lesson.title}
          </h2>
          <div className="w-14 sm:w-20" />
        </div>
      </div>

      <div className="h-1.5 shrink-0 bg-slate-800/80">
        <div
          className={cn('h-full bg-linear-to-r transition-all duration-300 ease-out', gradientClass)}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        ref={stepContentRef}
        className={cn(
          'min-h-0 flex-1',
          showQuiz ? 'flex flex-col overflow-hidden' : 'overflow-x-hidden overflow-y-auto overscroll-contain scroll-smooth'
        )}
      >
        {showQuiz ? (
          <LessonQuizPanel
            active={showQuiz}
            variant="inline"
            bubbleBorder={bubbleBorder}
            contentClassName={cn(sectionInnerClass, 'py-4 sm:py-6')}
            footerInnerClassName={cn(sectionInnerClass, 'py-3 sm:py-4')}
            onCancel={() => {
              if (sections.length > 0) {
                router.push(getLessonStepHref(lessonId, sections.length));
              } else {
                router.push(backHref);
              }
            }}
            onComplete={() => {
              router.push(backHref);
            }}
            {...quizProps}
          />
        ) : (
          <div className={cn(sectionInnerClass, 'py-4 sm:py-6')}>
            <LessonMascotBubble
              className="mb-6 sm:mb-8"
              text={mascotDialogue}
              mascotSrc={mascotSrc}
              bubbleBorder={bubbleBorder}
            />

            <div className="mb-4 flex justify-center sm:mb-6">
              <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {sections.length > 0 ? `${currentSection + 1} de ${sections.length}` : 'Lección'}
              </span>
            </div>

            {sections.length > 0 ? (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 sm:p-6 md:p-8">
                <ReactMarkdown
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    h1: ({ ...props }) => (
                      <h1 className="mt-0 mb-3 text-xl font-bold text-white sm:text-2xl md:text-3xl" {...props} />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="mt-4 mb-2 border-b border-slate-700/60 pb-2 text-lg font-bold text-slate-100 sm:mt-6 sm:text-xl md:text-2xl"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3 className="mt-3 mb-2 text-base font-bold text-slate-200 sm:mt-4 sm:text-lg" {...props} />
                    ),
                    p: ({ ...props }) => (
                      <p
                        className="mb-3 text-sm leading-relaxed text-slate-300 sm:mb-4 sm:text-base md:text-lg"
                        {...props}
                      />
                    ),
                    ul: ({ ...props }) => (
                      <ul
                        className="mb-3 list-inside list-disc space-y-1.5 text-slate-300 sm:mb-4 sm:space-y-2"
                        {...props}
                      />
                    ),
                    ol: ({ ...props }) => (
                      <ol
                        className="mb-3 list-inside list-decimal space-y-1.5 text-slate-300 sm:mb-4 sm:space-y-2"
                        {...props}
                      />
                    ),
                    li: ({ ...props }) => <li className="ml-3 sm:ml-4" {...props} />,
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className={cn(
                          'my-3 rounded-r-lg border-l-4 border-blue-500/80 bg-slate-800/50 py-2 pr-3 pl-3',
                          'text-slate-400 italic sm:my-4 sm:pr-4 sm:pl-4'
                        )}
                        {...props}
                      />
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className?.includes('language-');
                      const content = Array.isArray(children) ? children.join('') : (children ?? '');
                      return isInline ? (
                        <code
                          className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-pink-400 sm:text-sm"
                          {...props}
                        >
                          {content}
                        </code>
                      ) : (
                        <div className="my-3 overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/80 p-3 sm:my-4 sm:p-4">
                          <code className={cn('font-mono text-xs text-slate-200 sm:text-sm', className)} {...props}>
                            {content}
                          </code>
                        </div>
                      );
                    },
                    a: ({ href, children, ...props }) =>
                      isSafeHref(href) ? (
                        <a
                          href={href}
                          className="focus-visible:ring-app-accent rounded-sm text-blue-400 underline decoration-blue-400/30 hover:text-blue-300 hover:decoration-blue-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
                          rel="noopener noreferrer"
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          {...props}
                        >
                          {children}
                        </a>
                      ) : (
                        <span className="text-slate-400">{children}</span>
                      ),
                    img: ({ alt, ...rest }) => (
                      // eslint-disable-next-line @next/next/no-img-element -- markdown lesson assets have unknown dimensions
                      <img
                        alt={typeof alt === 'string' ? alt : ''}
                        className="my-3 h-auto max-w-full rounded-xl border border-slate-700 shadow-lg sm:my-4"
                        {...rest}
                      />
                    ),
                  }}
                >
                  {String(contentToRender || '_No hay contenido disponible para esta lección._')}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 text-center sm:p-6">
                <p className="text-sm text-slate-400 sm:text-base">No hay contenido disponible para esta lección.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {!showQuiz && (
        <div className="shrink-0 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
          <div
            className={cn(sectionInnerClass, 'flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-4')}
          >
            {prevHref ? (
              <Link
                href={prevHref}
                className={cn(
                  'flex min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border',
                  'border-slate-700 bg-slate-800/80 px-3 py-2.5 font-medium text-slate-300 transition-all',
                  'hover:bg-slate-700/80 hover:text-white sm:gap-2 sm:px-4 sm:py-3',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-slate-950'
                )}
              >
                <Icon name="arrow-left" className="text-sm" />
                <span className="hidden text-sm sm:inline">Anterior</span>
              </Link>
            ) : (
              <span className="min-w-[44px]" />
            )}
            <span className="text-xs text-slate-500 sm:text-sm">{stepLabel}</span>
            {nextHref ? (
              <Link
                href={nextHref}
                className={cn(
                  'flex min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-linear-to-r px-3 py-2.5 font-medium text-white shadow-lg transition-all hover:opacity-95 sm:gap-2 sm:px-4 sm:py-3',
                  'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-slate-950',
                  gradientClass
                )}
              >
                <span className="hidden text-sm sm:inline">Siguiente</span>
                <Icon name="arrow-right" className="text-sm" />
              </Link>
            ) : (
              <span className="min-w-[44px]" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
