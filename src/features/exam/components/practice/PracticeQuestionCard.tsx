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
              Dificultad: <span className="text-app-accent-muted">{question.difficulty}</span>
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
                'focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                isSelected
                  ? 'border-app-accent bg-app-ring/20 text-app-on-accent'
                  : 'hover:border-app-accent/50 hover:bg-app-ring/10 border-white/20 bg-white/5 text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold',
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

      {showResults && examConfig.showExplanations && answer && (
        <div className="mt-6 ml-14 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
          <p className="mb-2 text-xs font-semibold text-blue-300">EXPLICACIÓN:</p>
          <p className="text-sm text-gray-200">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
