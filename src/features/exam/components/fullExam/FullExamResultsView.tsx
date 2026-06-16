'use client';

import { useState } from 'react';
import { AnswerSheet, EXAM_SIDEBAR_STICKY_CLASS, ResultsAnalysis } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamHeader } from './FullExamHeader';
import { FullExamShell } from './FullExamShell';
import { FullExamMobileAnswerSheet } from './FullExamMobileAnswerSheet';
import { FullExamAnswerSheetFab } from './FullExamAnswerSheetFab';
import { useExamQuestionScrollSpy } from '@/features/exam/hooks/useExamQuestionScrollSpy';

type FullExamResultsViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  results: { question: ExamQuestion; correct: boolean; userAnswer: string }[];
  correctCount: number;
  percentage: number;
  exitHref?: string;
  onScrollToQuestion: (index: number) => void;
  onRetry: () => void;
};

export function FullExamResultsView({
  areaInfo,
  examConfig,
  questions,
  answers,
  results,
  correctCount,
  percentage,
  exitHref,
  onScrollToQuestion,
  onRetry,
}: FullExamResultsViewProps) {
  const [mobileAnswerSheetOpen, setMobileAnswerSheetOpen] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const { currentQuestion, focusQuestion } = useExamQuestionScrollSpy(questions.length);

  const handleQuestionClick = (index: number) => {
    focusQuestion(index);
    onScrollToQuestion(index);
  };

  return (
    <FullExamShell>
      <FullExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle="Análisis de Resultados"
        exitHref={exitHref}
        answeredCount={answeredCount}
        onOpenAnswerSheet={() => setMobileAnswerSheetOpen(true)}
      />

      <div className="mx-auto max-w-7xl px-3 py-4 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 sm:pb-24 xl:pb-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <div className="xl:col-span-3">
            <ResultsAnalysis
              results={results}
              percentage={percentage}
              correctCount={correctCount}
              areaInfo={areaInfo}
              examConfig={examConfig}
              onRetry={onRetry}
              returnTo={exitHref}
            />
          </div>
          <div className="hidden xl:block">
            <div className={EXAM_SIDEBAR_STICKY_CLASS}>
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={currentQuestion}
                onQuestionClick={handleQuestionClick}
                questions={questions}
              />
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
        currentQuestion={currentQuestion}
        onClose={() => setMobileAnswerSheetOpen(false)}
        onScrollToQuestion={handleQuestionClick}
      />
    </FullExamShell>
  );
}
