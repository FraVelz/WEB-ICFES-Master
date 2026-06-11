import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type LessonQuizPanelHeaderProps = {
  lessonTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isCard: boolean;
};

export function LessonQuizPanelHeader({
  lessonTitle,
  currentQuestionIndex,
  totalQuestions,
  isCard,
}: LessonQuizPanelHeaderProps) {
  return (
    <div
      className={cn(
        'shrink-0 border-b border-surface-border bg-surface-overlay/50',
        isCard ? 'p-3.5 lg:p-6' : 'rounded-t-2xl p-4 sm:p-5'
      )}
    >
      <div className="mb-1 flex items-center justify-center gap-2">
        <Icon name="trophy" size="lg" className="text-base text-yellow-400 lg:text-lg" />
        <h3 id="lesson-quiz-title" className="text-center text-base font-bold text-white lg:text-xl">
          Prueba de Conocimiento
        </h3>
      </div>
      <p className="mt-1.5 line-clamp-2 text-center text-xs text-on-surface-muted lg:text-sm">{lessonTitle}</p>
      {totalQuestions > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-2">
          <div className="h-1.5 max-w-[120px] flex-1 overflow-hidden rounded-full bg-on-surface-muted/50">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium whitespace-nowrap text-on-surface-muted">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>
      )}
    </div>
  );
}
