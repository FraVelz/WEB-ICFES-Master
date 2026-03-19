'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/shared/components/Icon';
import { LessonQuizModal } from './LessonQuizModal';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

export const LessonContentModal = ({ isOpen, onClose, lesson }) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const modalRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });

  // Normalizar preguntas: puede venir como questions (array) o quiz (objeto único)
  const hasQuestions =
    lesson?.questions &&
    Array.isArray(lesson.questions) &&
    lesson.questions.length > 0;
  const hasQuiz = lesson?.quiz && typeof lesson.quiz === 'object';
  const canShowQuiz = hasQuestions || hasQuiz;

  if (!isOpen || !lesson) return null;

  // Extraer contenido como string (evitar error si content es objeto)
  const contentStr = typeof lesson.content === 'string' ? lesson.content : '';
  const hasContent = contentStr.trim().length > 0;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-60 flex h-full w-full flex-col bg-slate-950"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center border-b border-slate-800 bg-slate-900/95 p-4 backdrop-blur-md">
        <button
          onClick={onClose}
          className="-ml-2 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <Icon name="arrow-left" className="text-lg" />
        </button>
        <h2 className="ml-3 flex-1 truncate text-lg font-bold text-white">
          {lesson.title}
        </h2>
      </div>

      {/* Content - Scrollable */}
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto scroll-smooth p-5 sm:p-8">
        <div className="mx-auto max-w-3xl pb-32">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="mt-8 mb-6 text-3xl font-bold text-white"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="mt-8 mb-4 border-b border-slate-800 pb-2 text-2xl font-bold text-blue-400"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="mt-6 mb-3 text-xl font-bold text-green-400"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="mb-4 text-lg leading-relaxed text-slate-300"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="mb-4 list-inside list-disc space-y-2 text-slate-300"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="mb-4 list-inside list-decimal space-y-2 text-slate-300"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => <li className="ml-4" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="my-4 rounded-r-lg border-l-4 border-blue-500 bg-slate-900/50 p-4 pl-4 text-slate-400 italic"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                return inline ? (
                  <code
                    className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-pink-400"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="my-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4">
                    <code
                      className="font-mono text-sm text-slate-200"
                      {...props}
                    >
                      {children}
                    </code>
                  </div>
                );
              },
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-400 underline decoration-blue-400/30 hover:text-blue-300 hover:decoration-blue-300"
                  {...props}
                />
              ),
              img: ({ node, ...props }) => (
                <img
                  className="my-6 h-auto max-w-full rounded-xl border border-slate-800 shadow-lg"
                  {...props}
                />
              ),
            }}
          >
            {contentStr || '_No hay contenido disponible para esta lección._'}
          </ReactMarkdown>

          {/* Quiz Section - Siempre mostrar si hay contenido */}
          {hasContent && (
            <div className="mt-12 border-t border-slate-800 pt-8">
              <h3 className="mb-4 text-xl font-bold text-white">
                ¿Listo para ponerte a prueba?
              </h3>
              <p className="mb-6 text-slate-400">
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
                    Completa el examen rápido para finalizar esta lección y
                    ganar{' '}
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
                className="w-full transform cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-8 py-4 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] sm:w-auto"
              >
                Realizar Prueba
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal - Fuera del contenedor de contenido para que funcione como overlay */}
      <LessonQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onComplete={() => {
          setIsQuizOpen(false);
          onClose(); // Cerrar también el modal de contenido
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
