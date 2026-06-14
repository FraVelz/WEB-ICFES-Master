import { AnswerSheet } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamShell } from '@/features/exam/components/fullExam/FullExamShell';
import { ResultsAnalysis } from '@/features/exam/components/ResultsAnalysis';
import { PracticeExamHeader } from './PracticeExamHeader';

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
    </FullExamShell>
  );
}
