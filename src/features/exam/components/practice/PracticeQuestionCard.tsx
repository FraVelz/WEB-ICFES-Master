import { cn } from '@/utils/cn';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';

type PracticeQuestionCardProps = {
  question: ExamQuestionPublic;
  index: number;
  answer?: string;
  showResults: boolean;
  examConfig: ExamConfig;
  onAnswer: (questionId: string, answer: string) => void;
};

export function PracticeQuestionCard({
  question,
  index,
  answer,
  showResults,
  examConfig,
  onAnswer,
}: PracticeQuestionCardProps) {
  return (
    <div
      id={`question-${index}`}
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-xl border p-6 shadow-lg',
        'hover:border-surface-border/80 backdrop-blur-md transition-all duration-300 hover:shadow-xl'
      )}
    >
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-r',
              'from-cta-from to-cta-progress-end text-sm font-bold text-white'
            )}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-on-surface text-lg leading-relaxed font-semibold">{question.text}</p>
            <p className="text-on-surface-muted mt-2 text-xs">
              Dificultad: <span className="text-app-accent font-medium">{question.difficulty}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="ml-14 space-y-3">
        {question.options.map((option) => {
          const isSelected = answer === option.letter;
          return (
            <button
              type="button"
              key={option.letter}
              onClick={() => onAnswer(question.id, option.letter ?? option.id)}
              className={cn(
                'w-full rounded-lg border-2 p-4 text-left transition-all duration-300',
                'focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-app-accent focus-visible:ring-offset-surface-via focus-visible:ring-offset-2',
                isSelected
                  ? 'border-app-accent bg-app-ring/20 text-app-accent-strong'
                  : 'border-surface-border bg-surface-overlay/40 text-on-surface hover:border-app-accent/50 hover:bg-app-ring/10'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
                    isSelected
                      ? 'border-app-accent bg-app-ring text-white'
                      : 'border-surface-border text-on-surface-muted'
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

      {showResults && examConfig.showExplanations && answer && (
        <div className="mt-6 ml-14 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="mb-2 text-xs font-semibold text-blue-600 dark:text-blue-300">EXPLICACIÓN:</p>
          <p className="text-on-surface-muted text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
