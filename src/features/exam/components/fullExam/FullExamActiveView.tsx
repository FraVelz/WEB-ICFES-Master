import { cn } from '@/utils/cn';
import { AnswerSheet } from '@/features/exam/components';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { FullExamHeader } from './FullExamHeader';
import { FullExamShell } from './FullExamShell';

type FullExamActiveViewProps = {
  areaInfo: { name: string; color: string };
  examConfig: ExamConfig;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  timeRemaining: number | null;
  timeColor: string;
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
        timeRemaining={timeRemaining}
        timeColor={timeColor}
        showTimer={examConfig.useTimer}
      />

      <div className="mx-auto max-w-7xl px-6 py-8">
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
                      <p className="mt-2 text-xs text-gray-500">
                        Dificultad:{' '}
                        <span className="text-app-accent-muted">{question.difficulty}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-14 space-y-3">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option.letter;
                    const optionKey = option.letter ?? option.id ?? String(option.text);

                    return (
                      <button
                        type="button"
                        key={optionKey}
                        onClick={() => onAnswer(question.id, optionKey)}
                        className={cn(
                          'w-full rounded-lg border-2 p-4 text-left transition-all duration-300',
                          'focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
                          'focus-visible:ring-app-accent focus-visible:ring-offset-2',
                          'focus-visible:ring-offset-gray-950',
                          isSelected
                            ? 'border-app-accent bg-app-ring/20 text-app-on-accent'
                            : [
                                'hover:border-app-accent/50 hover:bg-app-ring/10',
                                'border-white/20 bg-white/5 text-white',
                              ].join(' ')
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                              'border-2 text-sm font-bold',
                              isSelected ? 'border-app-accent bg-app-ring text-white' : 'border-white/30'
                            )}
                          >
                            {option.letter}
                          </div>
                          <span>{option.text}</span>
                        </div>
                      </button>
                    );
                  })}
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
    </FullExamShell>
  );
}
