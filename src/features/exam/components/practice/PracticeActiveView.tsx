'use client';

import { useCallback, useState } from 'react';
import { cn } from '@/utils/cn';
import { AnswerSheet, EXAM_SIDEBAR_STICKY_CLASS } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamShell } from '@/features/exam/components/fullExam/FullExamShell';
import { PracticeExamHeader } from './PracticeExamHeader';
import { PracticeQuestionCard } from './PracticeQuestionCard';
import { PracticeMobileAnswerSheet } from './PracticeMobileAnswerSheet';
import { PhaseSkipNotice } from './PhaseSkipNotice';
import { usePracticeExamKeyboard } from '@/features/exam/hooks/usePracticeExamKeyboard';
import { getQuestionRenderWindow } from '@/features/exam/utils/questionRenderWindow';

type PracticeActiveViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  showResults: boolean;
  timeRemaining: number | null;
  timeColor: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  showAnswerSheetMobile: boolean;
  setShowAnswerSheetMobile: (open: boolean) => void;
  phaseSkipPhaseTitle?: string;
  phaseSkipPassPercent?: number;
  exitHref?: string;
  onAnswer: (questionId: string, answer: string) => void;
  onScrollToQuestion: (index: number) => void;
  onFinish: () => void;
};

export function PracticeActiveView({
  areaInfo,
  examConfig,
  questions,
  answers,
  showResults,
  timeRemaining,
  timeColor,
  mobileMenuOpen,
  setMobileMenuOpen,
  showAnswerSheetMobile,
  setShowAnswerSheetMobile,
  phaseSkipPhaseTitle,
  phaseSkipPassPercent,
  exitHref,
  onAnswer,
  onScrollToQuestion,
  onFinish,
}: PracticeActiveViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(() => new Set());

  const handleQuestionClick = useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return;
      setCurrentQuestion(index);
      onScrollToQuestion(index);
      // After state update, scroll the mounted card into view on next frame.
      requestAnimationFrame(() => {
        document.getElementById(`question-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [onScrollToQuestion, questions.length]
  );

  const handleToggleFlag = useCallback((questionId: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }, []);

  usePracticeExamKeyboard({
    enabled: !showResults && !showAnswerSheetMobile && !mobileMenuOpen,
    questions,
    currentQuestion,
    answers,
    onAnswer,
    onFocusQuestion: handleQuestionClick,
    onToggleFlag: handleToggleFlag,
  });

  const renderWindow = getQuestionRenderWindow(currentQuestion, questions.length);
  const showPhaseSkipNotice = phaseSkipPassPercent != null;

  return (
    <FullExamShell>
      <PracticeExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle={`Pregunta ${currentQuestion + 1} de ${questions.length} · Atajos: 1–4, N/P, F`}
        exitHref={exitHref}
        timeRemaining={timeRemaining}
        timeColor={timeColor}
        showTimer={examConfig.useTimer}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onShowAnswerSheet={() => {
          setShowAnswerSheetMobile(true);
          setMobileMenuOpen(false);
        }}
      />

      <div className="mx-auto max-w-7xl px-3 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 sm:pb-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-4">
          <div className="space-y-4 sm:space-y-6 xl:col-span-3">
            {renderWindow.indices.map((index) => {
              const question = questions[index];
              if (!question) return null;
              return (
                <PracticeQuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  answer={answers[question.id]}
                  showResults={showResults}
                  examConfig={examConfig}
                  onAnswer={onAnswer}
                />
              );
            })}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 sm:pt-8">
              <button
                type="button"
                onClick={() => handleQuestionClick(currentQuestion - 1)}
                disabled={currentQuestion <= 0}
                className={cn(
                  'rounded-xl border px-5 py-3 text-sm font-semibold transition-colors',
                  'border-surface-border bg-surface-overlay text-on-surface',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                Anterior (P)
              </button>
              <button
                type="button"
                onClick={() => handleQuestionClick(currentQuestion + 1)}
                disabled={currentQuestion >= questions.length - 1}
                className={cn(
                  'rounded-xl border px-5 py-3 text-sm font-semibold transition-colors',
                  'border-surface-border bg-surface-overlay text-on-surface',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
                )}
              >
                Siguiente (N)
              </button>
              <button
                type="button"
                onClick={onFinish}
                className={cn(
                  'w-full max-w-md rounded-xl bg-linear-to-r from-green-500 to-emerald-500 px-6 py-3.5',
                  'text-base font-bold text-white sm:w-auto sm:px-12 sm:py-4 sm:text-lg',
                  'transition-all duration-300 hover:from-green-600 hover:to-emerald-600',
                  'cursor-pointer hover:shadow-lg hover:shadow-green-500/50',
                  'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                  'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
                )}
              >
                Finalizar Examen
              </button>
            </div>
          </div>

          <div className="hidden xl:block">
            <div className={cn(EXAM_SIDEBAR_STICKY_CLASS, 'space-y-4')}>
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={currentQuestion}
                onQuestionClick={handleQuestionClick}
                questions={questions}
                flaggedIds={flaggedIds}
              />
              {showPhaseSkipNotice && (
                <PhaseSkipNotice phaseTitle={phaseSkipPhaseTitle} passPercent={phaseSkipPassPercent} />
              )}
            </div>
          </div>
        </div>
      </div>

      <PracticeMobileAnswerSheet
        isOpen={showAnswerSheetMobile}
        questions={questions}
        answers={answers}
        currentQuestion={currentQuestion}
        flaggedIds={flaggedIds}
        phaseSkipPhaseTitle={phaseSkipPhaseTitle}
        phaseSkipPassPercent={phaseSkipPassPercent}
        onClose={() => setShowAnswerSheetMobile(false)}
        onScrollToQuestion={handleQuestionClick}
      />
    </FullExamShell>
  );
}
