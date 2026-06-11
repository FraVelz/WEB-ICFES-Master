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
  onPrevious: () => void;
  onClose: () => void;
  onSubmit: () => void;
  onRetry: () => void;
  onNext: () => void;
  className?: string;
  innerClassName?: string;
};

export function LessonQuizActions({
  currentQuestionIndex,
  isSubmitted,
  isCorrect,
  isLastQuestion,
  allQuestionsAnswered,
  selectedOption,
  loading,
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
            className={cn(
              'min-h-[48px] cursor-pointer rounded-xl bg-slate-800/80 px-3.5 py-3 font-bold',
              'text-slate-300 shadow-md transition-all hover:bg-slate-700 active:scale-95',
              'lg:min-h-[44px] lg:rounded-xl lg:px-4',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'focus-visible:ring-offset-slate-950'
            )}
            aria-label="Pregunta anterior"
          >
            <Icon name="arrow-left" size="lg" className="text-base lg:text-lg" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className={cn(
            'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-slate-800/80 px-3 py-3 text-sm',
            'font-semibold text-slate-300 shadow-md transition-all hover:bg-slate-700 active:scale-95',
            'lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-slate-950'
          )}
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
              'focus-visible:ring-offset-slate-950'
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
                  'min-h-[48px] flex-1 cursor-pointer rounded-xl bg-slate-700 px-3 py-3 text-sm font-bold text-white',
                  'shadow-md transition-all hover:bg-slate-600 active:scale-95 lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-slate-950'
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
                  'hover:from-green-500 hover:to-green-400 active:scale-95 lg:min-h-[44px] lg:rounded-xl lg:px-4 lg:text-base',
                  'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-slate-950'
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
        'shrink-0 border-t border-slate-800 bg-slate-900/95 p-3 pt-2 backdrop-blur-sm lg:p-6 lg:pt-0',
        className
      )}
    >
      {innerClassName ? <div className={innerClassName}>{buttons}</div> : buttons}
    </div>
  );
}
