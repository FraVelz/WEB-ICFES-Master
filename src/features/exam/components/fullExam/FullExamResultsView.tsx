import { AnswerSheet, EXAM_SIDEBAR_STICKY_CLASS, ResultsAnalysis } from '@/features/exam/components';
import { cn } from '@/utils/cn';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamHeader } from './FullExamHeader';
import { FullExamShell } from './FullExamShell';

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
  return (
    <FullExamShell>
      <FullExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle="Análisis de Resultados"
        exitHref={exitHref}
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
          <div className="hidden lg:block">
            <div className={EXAM_SIDEBAR_STICKY_CLASS}>
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
    </FullExamShell>
  );
}
