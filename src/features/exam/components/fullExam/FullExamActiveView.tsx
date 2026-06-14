'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { AnswerSheet, EXAM_SIDEBAR_STICKY_CLASS } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamHeader } from './FullExamHeader';
import { FullExamShell } from './FullExamShell';
import { FullExamMobileAnswerSheet } from './FullExamMobileAnswerSheet';
import { FullExamAnswerSheetFab } from './FullExamAnswerSheetFab';
import { FullExamQuestionCard } from './FullExamQuestionCard';
import { PhaseSkipNotice } from '@/features/exam/components/practice/PhaseSkipNotice';

type FullExamActiveViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  timeRemaining: number | null;
  timeColor: string;
  exitHref?: string;
  headerSubtitle?: string;
  phaseSkipPhaseTitle?: string;
  phaseSkipPassPercent?: number;
  onAnswer: (questionId: string, answer: string) => void;
  onScrollToQuestion: (index: number) => void;
  onFinish: () => void;
};

export function FullExamActiveView({
  areaInfo,
  examConfig,
  questions,
  answers,
  timeRemaining,
  timeColor,
  exitHref,
  headerSubtitle,
  phaseSkipPhaseTitle,
  phaseSkipPassPercent,
  onAnswer,
  onScrollToQuestion,
  onFinish,
}: FullExamActiveViewProps) {
  const [mobileAnswerSheetOpen, setMobileAnswerSheetOpen] = useState(false);
  const showPhaseSkipNotice = phaseSkipPassPercent != null;
  const answeredCount = Object.keys(answers).length;

  return (
    <FullExamShell>
      <FullExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle={headerSubtitle ?? `Preguntas: ${questions.length}`}
        exitHref={exitHref}
        timeRemaining={timeRemaining}
        timeColor={timeColor}
        showTimer={examConfig.useTimer}
        answeredCount={answeredCount}
        onOpenAnswerSheet={() => setMobileAnswerSheetOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-3 py-4 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 sm:pb-24 xl:pb-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <div className="space-y-4 sm:space-y-6 xl:col-span-3">
            {questions.map((question, index) => (
              <FullExamQuestionCard
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                onAnswer={onAnswer}
              />
            ))}

            <div className="flex justify-center pt-4 sm:pt-8">
              <button
                type="button"
                onClick={onFinish}
                className={cn(
                  'w-full max-w-md rounded-xl bg-linear-to-r from-green-500 to-emerald-500 px-6 py-3.5',
                  'text-base font-bold text-white sm:w-auto sm:px-12 sm:py-4 sm:text-lg',
                  'transition-all duration-300 hover:from-green-600 hover:to-emerald-600',
                  'cursor-pointer hover:shadow-lg hover:shadow-green-500/50',
                  'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
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
                currentQuestion={0}
                onQuestionClick={onScrollToQuestion}
                questions={questions}
              />
              {showPhaseSkipNotice && (
                <PhaseSkipNotice phaseTitle={phaseSkipPhaseTitle} passPercent={phaseSkipPassPercent} />
              )}
            </div>
          </div>
        </div>
      </div>

      <FullExamAnswerSheetFab
        isOpen={mobileAnswerSheetOpen}
        answeredCount={answeredCount}
        onOpen={() => setMobileAnswerSheetOpen(true)}
      />

      <FullExamMobileAnswerSheet
        isOpen={mobileAnswerSheetOpen}
        questions={questions}
        answers={answers}
        phaseSkipPhaseTitle={phaseSkipPhaseTitle}
        phaseSkipPassPercent={phaseSkipPassPercent}
        onClose={() => setMobileAnswerSheetOpen(false)}
        onScrollToQuestion={onScrollToQuestion}
      />
    </FullExamShell>
  );
}
