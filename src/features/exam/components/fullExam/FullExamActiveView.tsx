import { cn } from '@/utils/cn';
import { AnswerSheet, EXAM_SIDEBAR_STICKY_CLASS } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamHeader } from './FullExamHeader';
import { FullExamShell } from './FullExamShell';
import { ExamAnswerOptions } from '@/features/exam/components/ExamAnswerOptions';

type FullExamActiveViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  timeRemaining: number | null;
  timeColor: string;
  exitHref?: string;
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
  onAnswer,
  onScrollToQuestion,
  onFinish,
}: FullExamActiveViewProps) {
  return (
    <FullExamShell>
      <FullExamHeader
        areaName={areaInfo.name}
        areaColor={areaInfo.color}
        subtitle={`Preguntas: ${questions.length}`}
        exitHref={exitHref}
        timeRemaining={timeRemaining}
        timeColor={timeColor}
        showTimer={examConfig.useTimer}
      />

      <div className="mx-auto max-w-7xl px-6 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            {questions.map((question, index) => (
              <div
                key={question.id}
                id={`question-${index}`}
                className={cn(
                  'rounded-xl border border-white/10 bg-linear-to-br from-gray-800/40 via-gray-900/40',
                  'to-gray-950/40 p-6 shadow-lg backdrop-blur-md transition-all duration-300',
                  'hover:border-white/20 hover:shadow-xl'
                )}
              >
                <div className="mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-r',
                        'from-cta-from to-cta-progress-end text-sm font-bold'
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed font-semibold text-white">{question.text}</p>
                      <p className="text-on-surface-muted mt-2 text-xs">
                        Dificultad: <span className="text-app-accent-muted">{question.difficulty}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-14">
                  <ExamAnswerOptions
                    questionId={question.id}
                    questionNumber={index + 1}
                    options={question.options}
                    selectedAnswer={answers[question.id]}
                    onSelect={onAnswer}
                    selectedClassName="border-app-accent bg-app-ring/20 text-app-on-accent"
                    unselectedClassName="hover:border-app-accent/50 hover:bg-app-ring/10 border-white/20 bg-white/5 text-white"
                    optionClassName="focus-visible:ring-offset-gray-950"
                  />
                </div>
              </div>
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
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
                )}
              >
                Finalizar Examen
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className={cn(EXAM_SIDEBAR_STICKY_CLASS, 'space-y-4')}>
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
      </div>
    </FullExamShell>
  );
}
