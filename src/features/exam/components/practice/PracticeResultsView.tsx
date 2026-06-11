import { AnswerSheet, ResultsAnalysis } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import { PracticeExamHeader } from './PracticeExamHeader';

type PracticeResultsViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  results: { question: ExamQuestion; correct: boolean; userAnswer: string }[];
  correctCount: number;
  percentage: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onScrollToQuestion: (index: number) => void;
  onRetry: () => void;
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
}: PracticeResultsViewProps) {
  return (
    <div className="min-h-dvh bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-lesson-lc-glow-a/20 absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <PracticeExamHeader
          areaName={areaInfo.name}
          areaColor={areaInfo.color}
          subtitle="Análisis de Resultados"
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onShowAnswerSheet={() => setMobileMenuOpen(false)}
        />

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <ResultsAnalysis
                results={results}
                questions={results.map((r) => r.question)}
                percentage={percentage}
                correctCount={correctCount}
                areaInfo={areaInfo}
                examConfig={examConfig}
                onRetry={onRetry}
              />
            </div>
            <div>
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={0}
                onQuestionClick={onScrollToQuestion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
