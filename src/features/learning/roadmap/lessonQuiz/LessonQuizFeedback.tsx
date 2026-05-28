import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type LessonQuizFeedbackProps = {
  isCorrect: boolean;
  isLastQuestion: boolean;
  rewards: { xp: number; coins: number } | null;
  alreadyCompleted: boolean;
};

export function LessonQuizFeedback({ isCorrect, isLastQuestion, rewards, alreadyCompleted }: LessonQuizFeedbackProps) {
  return (
    <div
      className={cn(
        'mb-3 rounded-xl border-2 p-3.5 text-center lg:mb-6 lg:rounded-xl lg:p-4',
        isCorrect
          ? 'border-green-500/30 bg-linear-to-br from-green-500/15 to-green-600/5 shadow-lg shadow-green-500/5'
          : 'border-red-500/30 bg-linear-to-br from-red-500/15 to-red-600/5 shadow-lg shadow-red-500/5'
      )}
    >
      <div className="mb-2 flex items-center justify-center gap-2">
        {isCorrect ? (
          <Icon name="check" size="2xl" className="text-xl text-green-400 lg:text-2xl" />
        ) : (
          <Icon name="times" size="2xl" className="text-xl text-red-400 lg:text-2xl" />
        )}
        <h5 className={cn('text-lg font-bold lg:text-xl', isCorrect ? 'text-green-300' : 'text-red-300')}>
          {isCorrect ? '¡Correcto!' : 'Incorrecto'}
        </h5>
      </div>

      {isCorrect && rewards && isLastQuestion && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 lg:gap-4">
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/15 px-3',
              'py-1.5 text-sm font-bold text-yellow-300 shadow-md lg:px-4 lg:py-2 lg:text-base'
            )}
          >
            <Icon name="coins" size="md" className="text-sm lg:text-base" />
            <span>+{rewards.coins}</span>
          </div>
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/15 px-3 py-1.5',
              'text-sm font-bold text-blue-300 shadow-md lg:px-4 lg:py-2 lg:text-base'
            )}
          >
            <Icon name="star" size="md" className="text-sm lg:text-base" />
            <span>+{rewards.xp} XP</span>
          </div>
        </div>
      )}

      {isCorrect && alreadyCompleted && !rewards && isLastQuestion && (
        <p className="mt-2 text-xs text-slate-300 lg:text-sm">Ya has completado esta lección anteriormente.</p>
      )}

      {!isCorrect && (
        <p className="mt-2 px-2 text-xs leading-relaxed text-slate-300 lg:text-sm">
          {isLastQuestion ? 'Inténtalo de nuevo para ganar tus recompensas.' : 'Continúa con la siguiente pregunta.'}
        </p>
      )}
    </div>
  );
}
