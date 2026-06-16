'use client';

import { AnswerSheet, EXAM_SIDEBAR_STICKY_CLASS } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamShell } from '@/features/exam/components/fullExam/FullExamShell';
import { ResultsAnalysis } from '@/features/exam/components/ResultsAnalysis';
import { PracticeExamHeader } from './PracticeExamHeader';
import { useExamQuestionScrollSpy } from '@/features/exam/hooks/useExamQuestionScrollSpy';

type PracticeResultsViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  results: Array<{ question: ExamQuestion; correct: boolean; userAnswer: string }>;
  correctCount: number;
  percentage: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onScrollToQuestion: (index: number) => void;
  onRetry: () => void;
  exitHref?: string;
};

export function PracticeResultsView({
  areaInfo,
  examConfig,
  questions,
  answers,
  results,
  correctCount,
  percentage,
  mobileMenuOpen,
  setMobileMenuOpen,
  onScrollToQuestion,
  onRetry,
  exitHref,
}: PracticeResultsViewProps) {
  const { currentQuestion, focusQuestion } = useExamQuestionScrollSpy(questions.length);

  const handleQuestionClick = (index: number) => {
    focusQuestion(index);
    onScrollToQuestion(index);
  };

  return (
    <FullExamShell>
      <PracticeExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle="Análisis de Resultados"
        exitHref={exitHref}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onShowAnswerSheet={() => setMobileMenuOpen(false)}
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
    </FullExamShell>
  );
}
