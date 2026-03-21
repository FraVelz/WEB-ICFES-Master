'use client';

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';
import { LessonQuizModal } from './LessonQuizModal';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import {
  splitLessonContent,
  extractSectionTitle,
  stripFirstHeadingIfDuplicate,
} from '../../utils/splitLessonContent';
import { AREA_INFO } from '@/shared/constants';

const getAreaColor = (areaId: string) => {
  const info = AREA_INFO[areaId] || AREA_INFO['lectura-critica'];
  if (info.color.includes('blue')) return 'from-blue-500 to-blue-600';
  if (info.color.includes('green')) return 'from-green-500 to-green-600';
  if (info.color.includes('purple')) return 'from-purple-500 to-purple-600';
  if (info.color.includes('orange')) return 'from-orange-500 to-orange-600';
  if (info.color.includes('indigo')) return 'from-indigo-500 to-indigo-600';
  return 'from-blue-500 to-blue-600';
};

const getBubbleBorderColor = (areaId: string) => {
  const info = AREA_INFO[areaId] || AREA_INFO['lectura-critica'];
  if (info.color.includes('blue')) return 'border-blue-400/50';
  if (info.color.includes('green')) return 'border-green-400/50';
  if (info.color.includes('purple')) return 'border-purple-400/50';
  if (info.color.includes('orange')) return 'border-orange-400/50';
  if (info.color.includes('indigo')) return 'border-indigo-400/50';
  return 'border-blue-400/50';
};

export const LessonContentModal = ({
  isOpen,
  onClose,
  lesson,
  areaId = 'lectura-critica',
}) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const modalRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });

  const hasQuestions =
    lesson?.questions &&
    Array.isArray(lesson.questions) &&
    lesson.questions.length > 0;
  const hasQuiz = lesson?.quiz && typeof lesson.quiz === 'object';
  const canShowQuiz = hasQuestions || hasQuiz;

  const contentStr =
    typeof lesson?.content === 'string' ? lesson.content : '';
  const hasContent = contentStr.trim().length > 0;

  const sections = useMemo(
    () => splitLessonContent(contentStr),
    [contentStr]
  );

  const totalSteps = sections.length + (hasContent && canShowQuiz ? 1 : 0);
  const isExamStep =
    currentSection === sections.length && totalSteps > sections.length;
  const progress = totalSteps > 0 ? ((currentSection + 1) / totalSteps) * 100 : 0;

  const mascotDialogue = useMemo(() => {
    if (isExamStep) return '¿Listo para ponerte a prueba?';
    if (sections.length === 0) return lesson?.title || '';
    const sectionTitle = extractSectionTitle(sections[currentSection]);
    return sectionTitle || lesson?.title || '¡Vamos a aprender!';
  }, [isExamStep, sections, currentSection, lesson?.title]);

  const handleNext = () => {
    if (currentSection < totalSteps - 1) {
      setCurrentSection((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
    }
  };

  const resetSection = () => setCurrentSection(0);

  if (!isOpen || !lesson) return null;

  const mascotSrc = isExamStep
    ? '/avatars/celebrando-2.webp'
    : '/avatars/logo.webp';
  const gradientClass = getAreaColor(areaId);
  const bubbleBorder = getBubbleBorderColor(areaId);

  const contentToRender =
    sections.length > 0 && !isExamStep
      ? stripFirstHeadingIfDuplicate(
          sections[currentSection],
          mascotDialogue
        )
      : sections[currentSection] || '';

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-60 flex h-full w-full flex-col bg-slate-950"
    >
      {/* Header compacto */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3">
        <button
          onClick={onClose}
          className="-ml-1 flex min-w-[44px] cursor-pointer items-center gap-2 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <Icon name="arrow-left" className="text-lg" />
          <span className="hidden text-sm font-medium sm:inline">Salir</span>
        </button>
        <h2 className="flex-1 truncate px-2 text-center text-sm font-bold text-white sm:px-4 sm:text-base">
          {lesson.title}
        </h2>
        <div className="w-14 sm:w-20" />
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 shrink-0 bg-slate-800/80">
        <div
          className={`h-full bg-linear-to-r ${gradientClass} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Contenido principal */}
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto scroll-smooth">
        <div className="mx-auto max-w-2xl px-3 py-4 pb-28 sm:px-6 sm:py-6">
          {/* Bloque Duolingo: Mascota + globo de diálogo */}
          <div className="mb-6 flex flex-col items-center gap-4 sm:mb-8 sm:flex-row sm:items-flex-start sm:justify-center sm:gap-6">
            {/* Mascota con animación flotante tipo Duolingo */}
            <div
              className="shrink-0 sm:order-2"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <MascotaCircle
                src={mascotSrc}
                alt="Mascota"
                size="md"
                centered={false}
              />
            </div>

            {/* Globo de diálogo - la mascota "dice" el título o subtítulo */}
            <div className="relative w-full max-w-sm sm:order-1 sm:max-w-md sm:flex-1">
              {/* Cola del globo: móvil abajo, desktop derecha apuntando a mascota */}
              <div
                className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 -translate-y-px border-[10px] border-transparent border-t-slate-800 sm:left-full sm:right-auto sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:border-t-transparent sm:border-r-slate-800"
                aria-hidden
              />
              <div
                className={`rounded-2xl border-2 ${bubbleBorder} bg-slate-800/95 p-4 shadow-xl backdrop-blur-sm sm:p-5`}
              >
                <p className="text-center text-base font-semibold leading-relaxed text-white sm:text-left sm:text-lg">
                  {mascotDialogue}
                </p>
              </div>
            </div>
          </div>

          {/* Indicador de sección */}
          <div className="mb-4 flex justify-center sm:mb-6">
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isExamStep
                ? 'Examen'
                : `${currentSection + 1} de ${sections.length}`}
            </span>
          </div>

          {/* Contenido de la sección actual o bloque de examen */}
          {isExamStep ? (
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-4 sm:p-6 md:p-8">
              <p className="mb-4 text-slate-400 sm:mb-6">
                {canShowQuiz ? (
                  <>
                    Completa{' '}
                    {hasQuestions
                      ? `las ${lesson.questions.length} pregunta${lesson.questions.length > 1 ? 's' : ''}`
                      : 'el examen rápido'}
                    , para finalizar esta lección y ganar{' '}
                    <span className="font-bold text-blue-400">
                      {lesson.xp || lesson.quiz?.rewards?.xp || 10} XP
                    </span>{' '}
                    y{' '}
                    <span className="font-bold text-yellow-400">
                      {lesson.coins || lesson.quiz?.rewards?.coins || 5} monedas
                    </span>
                    .
                  </>
                ) : (
                  <>
                    Completa el examen rápido para finalizar esta lección y ganar{' '}
                    <span className="font-bold text-blue-400">
                      {lesson.xp || 10} XP
                    </span>{' '}
                    y{' '}
                    <span className="font-bold text-yellow-400">
                      {lesson.coins || 5} monedas
                    </span>
                    .
                  </>
                )}
              </p>
              <button
                onClick={() => setIsQuizOpen(true)}
                className={`w-full transform cursor-pointer rounded-xl bg-linear-to-r ${gradientClass} px-6 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[200px] sm:px-8 sm:py-4`}
              >
                Realizar Prueba
              </button>
            </div>
          ) : sections.length > 0 ? (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 sm:p-6 md:p-8">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="mb-3 mt-0 text-xl font-bold text-white sm:text-2xl md:text-3xl"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="mb-2 mt-4 border-b border-slate-700/60 pb-2 text-lg font-bold text-slate-100 sm:mt-6 sm:text-xl md:text-2xl"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="mb-2 mt-3 text-base font-bold text-slate-200 sm:mt-4 sm:text-lg"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-3 text-sm leading-relaxed text-slate-300 sm:mb-4 sm:text-base md:text-lg"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="mb-3 list-inside list-disc space-y-1.5 text-slate-300 sm:mb-4 sm:space-y-2"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="mb-3 list-inside list-decimal space-y-1.5 text-slate-300 sm:mb-4 sm:space-y-2"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-3 sm:ml-4" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="my-3 rounded-r-lg border-l-4 border-blue-500/80 bg-slate-800/50 py-2 pl-3 pr-3 text-slate-400 italic sm:my-4 sm:pl-4 sm:pr-4"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, className, children, ...props }) =>
                    inline ? (
                      <code
                        className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-pink-400 sm:text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <div className="my-3 overflow-x-auto rounded-lg border border-slate-700 bg-slate-800/80 p-3 sm:my-4 sm:p-4">
                        <code
                          className="font-mono text-xs text-slate-200 sm:text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      </div>
                    ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-400 underline decoration-blue-400/30 hover:text-blue-300 hover:decoration-blue-300"
                      {...props}
                    />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      className="my-3 h-auto max-w-full rounded-xl border border-slate-700 shadow-lg sm:my-4"
                      {...props}
                    />
                  ),
                }}
              >
                {contentToRender ||
                  '_No hay contenido disponible para esta lección._'}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 text-center sm:p-6">
              <p className="text-sm text-slate-400 sm:text-base">
                No hay contenido disponible para esta lección.
              </p>
              {canShowQuiz && (
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-500 sm:px-6 sm:py-3"
                >
                  Ir al examen
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navegación: Anterior / Siguiente - responsive */}
      <div className="fixed bottom-0 left-0 right-0 flex shrink-0 items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-950/95 px-3 py-3 backdrop-blur-md sm:gap-4 sm:px-4 sm:py-4">
        <button
          onClick={handlePrev}
          disabled={currentSection === 0}
          className="flex min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 font-medium text-slate-300 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-700/80 hover:text-white disabled:hover:bg-slate-800/80 disabled:hover:text-slate-300 sm:gap-2 sm:px-4 sm:py-3"
        >
          <Icon name="arrow-left" className="text-sm" />
          <span className="hidden text-sm sm:inline">Anterior</span>
        </button>
        <span className="text-xs text-slate-500 sm:text-sm">
          {currentSection + 1} / {totalSteps || 1}
        </span>
        <button
          onClick={handleNext}
          disabled={currentSection >= totalSteps - 1}
          className={`flex min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-linear-to-r ${gradientClass} px-3 py-2.5 font-medium text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-95 disabled:hover:opacity-40 sm:gap-2 sm:px-4 sm:py-3`}
        >
          <span className="hidden text-sm sm:inline">Siguiente</span>
          <Icon name="arrow-right" className="text-sm" />
        </button>
      </div>

      <LessonQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={() => {
          setIsQuizOpen(false);
          resetSection();
          onClose();
        }}
        questions={lesson.questions}
        quiz={lesson.quiz}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        lessonXp={lesson.xp}
        lessonCoins={lesson.coins}
      />
    </div>
  );
};
