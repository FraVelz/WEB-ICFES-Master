import { AnswerSheet, ResultsAnalysis } from '@/features/exam/components';
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
  onScrollToQuestion,
  onRetry,
}: FullExamResultsViewProps) {
  return (
    <FullExamShell>
      <FullExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle="Análisis de Resultados"
        onExit={() => window.history.back()}
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
