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
}: ExamAnswerOptionsProps) {
  const groupLabel = `Pregunta ${questionNumber}: opciones de respuesta`;

  return (
    <div role="radiogroup" aria-label={groupLabel} className="space-y-3">
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
              'w-full rounded-lg border-2 p-4 text-left transition-all duration-300',
              'focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-app-accent focus-visible:ring-offset-2',
              isSelected ? selectedClassName : unselectedClassName,
              optionClassName
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
  );
}
