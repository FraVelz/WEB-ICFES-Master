import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { NormalizedQuizQuestion } from './quizTypes';

type LessonQuizQuestionPanelProps = {
  question: NormalizedQuizQuestion;
  selectedOption: string | null;
  isSubmitted: boolean;
  onSelectOption: (id: string) => void;
  hideQuestionTitle?: boolean;
};

export function LessonQuizQuestionPanel({
  question,
  selectedOption,
  isSubmitted,
  onSelectOption,
  hideQuestionTitle = false,
}: LessonQuizQuestionPanelProps) {
  return (
    <div className={hideQuestionTitle ? '' : 'mb-3 lg:mb-6'}>
      {!hideQuestionTitle && (
        <h4 className="mb-3 px-0.5 text-base leading-relaxed font-semibold text-white lg:mb-4 lg:text-lg">
          {question.question}
        </h4>
      )}

      <div role="radiogroup" aria-label="Opciones de respuesta" className="space-y-2 lg:space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selectedOption === option.id}
            onClick={() => !isSubmitted && onSelectOption(option.id)}
            disabled={isSubmitted}
            className={cn(
              'relative min-h-[52px] w-full cursor-pointer rounded-xl border-2 p-3.5 text-left text-sm transition-all',
              'focus-visible:ring-app-accent focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:focus-visible:ring-0',
              'lg:min-h-[48px] lg:rounded-xl lg:p-4 lg:text-base',
              isSubmitted
                ? option.id === question.correctAnswer
                  ? 'border-green-500 bg-green-500/15 text-green-300 shadow-lg shadow-green-500/10'
                  : option.id === selectedOption
                    ? 'border-red-500 bg-red-500/15 text-red-300 shadow-lg shadow-red-500/10'
                    : 'border-slate-700/50 bg-slate-800/30 text-slate-500 opacity-60'
                : selectedOption === option.id
                  ? 'scale-[1.02] border-blue-500 bg-blue-500/15 text-blue-300 shadow-lg shadow-blue-500/10'
                  : cn(
                      'border-slate-700/50 bg-slate-800/50 text-slate-200',
                      'hover:border-slate-600 hover:bg-slate-800/70 active:scale-[0.98] active:bg-slate-700'
                    )
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  'lg:h-7 lg:w-7 lg:text-sm',
                  isSubmitted
                    ? option.id === question.correctAnswer
                      ? 'bg-lesson-sci-glow-a/20 border border-green-500/30 text-green-400'
                      : option.id === selectedOption
                        ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                        : 'border border-slate-600/50 bg-slate-700/50 text-slate-500'
                    : selectedOption === option.id
                      ? 'bg-lesson-lc-glow-a/20 border border-blue-500/30 text-blue-400'
                      : 'border border-slate-600/50 bg-slate-700/50 text-slate-400'
                )}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span className="flex-1 leading-snug wrap-break-word">{option.text}</span>
                {isSubmitted && option.id === question.correctAnswer && (
                  <Icon name="check" size="xl" className="ml-2 shrink-0 text-lg text-green-400 lg:text-xl" />
                )}
                {isSubmitted && option.id === selectedOption && option.id !== question.correctAnswer && (
                  <Icon name="times" size="xl" className="ml-2 shrink-0 text-lg text-red-400 lg:text-xl" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {isSubmitted && question.explanation && (
        <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 lg:mt-5 lg:p-4">
          <div className="space-y-2 text-xs leading-relaxed text-blue-200 lg:text-sm">
            <p className="flex items-center gap-1.5 font-semibold text-blue-300">
              <Icon name="lightbulb" size="sm" />
              Explicación:
            </p>
            <p>{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
