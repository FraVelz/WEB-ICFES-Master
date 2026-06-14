import { cn } from '@/utils/cn';
import type { QuestionOption } from '@/features/exam/types/question';

type ExamAnswerOptionsProps = {
  questionId: string;
  questionNumber: number;
  options: QuestionOption[];
  selectedAnswer?: string;
  onSelect: (questionId: string, answer: string) => void;
  disabled?: boolean;
  optionClassName?: string;
  selectedClassName?: string;
  unselectedClassName?: string;
  /** Estilo más compacto en pantallas pequeñas (simulacros fullscreen). */
  responsive?: boolean;
};

export function ExamAnswerOptions({
  questionId,
  questionNumber,
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
  optionClassName,
  selectedClassName,
  unselectedClassName,
  responsive = false,
}: ExamAnswerOptionsProps) {
  const groupLabel = `Pregunta ${questionNumber}: opciones de respuesta`;

  return (
    <div role="radiogroup" aria-label={groupLabel} className={cn(responsive ? 'space-y-2 sm:space-y-3' : 'space-y-3')}>
      {options.map((option) => {
        const optionKey = option.letter ?? option.id;
        const isSelected = selectedAnswer === optionKey;

        return (
          <button
            key={optionKey}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onSelect(questionId, optionKey)}
            className={cn(
              'w-full rounded-lg border-2 text-left transition-all duration-300',
              responsive ? 'p-3 sm:p-4' : 'p-4',
              'focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-app-accent focus-visible:ring-offset-2',
              isSelected ? selectedClassName : unselectedClassName,
              optionClassName
            )}
          >
            <div
              className={cn('flex gap-2.5', responsive ? 'items-start sm:items-center sm:gap-3' : 'items-center gap-3')}
            >
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full border-2 font-bold',
                  responsive ? 'mt-0.5 h-7 w-7 text-xs sm:mt-0 sm:h-8 sm:w-8 sm:text-sm' : 'h-8 w-8 text-sm',
                  isSelected
                    ? 'border-app-accent bg-app-ring text-app-on-accent'
                    : 'border-surface-border text-on-surface-muted'
                )}
              >
                {option.letter}
              </div>
              <span className={cn(responsive && 'text-sm leading-snug sm:text-base')}>{option.text}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
