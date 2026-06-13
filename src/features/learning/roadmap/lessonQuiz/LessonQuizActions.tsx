import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type LessonQuizActionsProps = {
  currentQuestionIndex: number;
  isSubmitted: boolean;
  isCorrect: boolean;
  isLastQuestion: boolean;
  allQuestionsAnswered: boolean;
  selectedOption: string | null;
  loading: boolean;
  gradeError?: string | null;
  onPrevious: () => void;
  onClose: () => void;
  onSubmit: () => void;
  onRetry: () => void;
  onNext: () => void;
  className?: string;
  innerClassName?: string;
};

const secondaryActionClass = cn(
  'border-surface-border bg-surface-elevated/90 text-on-surface-muted min-h-[48px] cursor-pointer rounded-xl border',
  'font-semibold shadow-sm transition-[color,background-color,border-color,box-shadow,transform] duration-200',
  'hover:border-app-ring/45 hover:bg-surface-overlay hover:text-on-surface hover:shadow-md',
  'active:scale-[0.97]',
  'lg:min-h-[44px] lg:rounded-xl',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface-via'
);

export function LessonQuizActions({
  currentQuestionIndex,
  isSubmitted,
  isCorrect,
  isLastQuestion,
  allQuestionsAnswered,
  selectedOption,
  loading,
  gradeError,
  onPrevious,
  onClose,
  onSubmit,
  onRetry,
  onNext,
  className,
  innerClassName,
}: LessonQuizActionsProps) {
  const buttons = (
    <div className="flex gap-2 lg:gap-3">
      {currentQuestionIndex > 0 && (
        <button
          type="button"
          onClick={onPrevious}
          className={cn(secondaryActionClass, 'px-3.5 py-3 font-bold lg:px-4')}
          aria-label="Pregunta anterior"
        >
          <Icon name="arrow-left" size="lg" className="text-base lg:text-lg" />
        </button>
      )}

      <button
        type="button"
        onClick={onClose}
        className={cn(secondaryActionClass, 'flex-1 px-3 py-3 text-sm lg:px-4 lg:text-base')}
      >
        {isLastQuestion && (isCorrect || allQuestionsAnswered) ? 'Cerrar' : 'Cancelar'}
      </button>

      {!isSubmitted ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!selectedOption || loading}
          className={cn(
            'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-blue-500',
            'px-3 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all',
            'hover:from-blue-500 hover:to-blue-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
            'lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base',
            'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-via'
          )}
        >
          {loading ? 'Verificando...' : 'Enviar'}
        </button>
      ) : (
        <>
          {!isCorrect && (
            <button
              type="button"
              onClick={onRetry}
              className={cn(
                secondaryActionClass,
                'flex-1 px-3 py-3 text-sm font-bold text-white lg:px-4 lg:text-base',
                'border-amber-500/35 bg-amber-500/15 text-amber-100',
                'hover:border-amber-400/55 hover:bg-amber-500/25 hover:text-white'
              )}
            >
              Reintentar
            </button>
          )}
          {isCorrect && !isLastQuestion && (
            <button
              type="button"
              onClick={onNext}
              className={cn(
                'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-linear-to-r from-green-600 to-green-500',
                'px-3 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all',
                'hover:from-green-500 hover:to-green-400 active:scale-95',
                'lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface-via'
              )}
            >
              Siguiente
              <Icon name="arrow-right" size="md" className="ml-1 inline text-sm lg:ml-2 lg:text-base" />
            </button>
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'border-surface-border/80 bg-surface-via/95 shrink-0 border-t p-3 pt-2 backdrop-blur-md lg:p-6 lg:pt-0',
        className
      )}
    >
      {innerClassName ? <div className={innerClassName}>{buttons}</div> : buttons}
      {gradeError ? (
        <p className="text-red-400 mt-2 text-center text-sm" role="alert">
          {gradeError}
        </p>
      ) : null}
    </div>
  );
}
