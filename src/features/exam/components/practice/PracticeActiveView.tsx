import { cn } from '@/utils/cn';
import { AnswerSheet } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamShell } from '@/features/exam/components/fullExam/FullExamShell';
import { PracticeExamHeader } from './PracticeExamHeader';
import { PracticeQuestionCard } from './PracticeQuestionCard';
import { PracticeMobileAnswerSheet } from './PracticeMobileAnswerSheet';

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
  onAnswer,
  onScrollToQuestion,
  onFinish,
}: PracticeActiveViewProps) {
  return (
    <FullExamShell>
      <PracticeExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle={`Preguntas: ${questions.length}`}
        timeRemaining={timeRemaining}
        timeColor={timeColor}
        showTimer={examConfig.useTimer}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onShowAnswerSheet={() => {
          setShowAnswerSheetMobile(true);
          setMobileMenuOpen(false);
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            {questions.map((question, index) => (
              <PracticeQuestionCard
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                showResults={showResults}
                examConfig={examConfig}
                onAnswer={onAnswer}
              />
            ))}

            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={onFinish}
                className={cn(
                  'rounded-xl bg-linear-to-r from-green-500 to-emerald-500 px-12 py-4 text-lg font-bold',
                  'text-white transition-all duration-300 hover:from-green-600 hover:to-emerald-600',
                  'cursor-pointer hover:shadow-lg hover:shadow-green-500/50',
                  'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                  'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
                )}
              >
                Finalizar Examen
              </button>
            </div>
          </div>

          <div>
            <AnswerSheet
              totalQuestions={questions.length}
              answers={answers}
              currentQuestion={0}
              onQuestionClick={onScrollToQuestion}
              questions={questions}
            />
          </div>
        </div>
      </div>

      <PracticeMobileAnswerSheet
        isOpen={showAnswerSheetMobile}
        questions={questions}
        answers={answers}
        onClose={() => setShowAnswerSheetMobile(false)}
        onScrollToQuestion={onScrollToQuestion}
      />
    </FullExamShell>
  );
}
