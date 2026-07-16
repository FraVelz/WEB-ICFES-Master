import { cn } from '@/utils/cn';
import type { ExamQuestionPublic } from '@/features/exam/types/question';

/** Sticky wrapper para la hoja de respuestas bajo el header del examen. */
export const EXAM_SIDEBAR_STICKY_CLASS =
  'sticky top-[var(--exam-sticky-offset,6.25rem)] z-10 max-h-[calc(100dvh-var(--exam-sticky-offset,6.25rem)-1rem)] overflow-y-auto';

interface AnswerSheetProps {
  totalQuestions: number;
  answers: Record<string, string>;
  currentQuestion: number;
  onQuestionClick: (index: number) => void;
  questions?: ExamQuestionPublic[];
  /** Question ids marked for review (keyboard F). */
  flaggedIds?: ReadonlySet<string>;
  className?: string;
}

export const AnswerSheet = ({
  totalQuestions,
  answers,
  currentQuestion,
  onQuestionClick,
  questions = [],
  flaggedIds,
  className,
}: AnswerSheetProps) => {
  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/90 h-fit rounded-xl border',
        'p-4 shadow-2xl backdrop-blur-md',
        className
      )}
    >
      <h3 className="text-on-surface mb-4 flex items-center gap-2 text-sm font-bold">
        <span
          className={cn(
            'from-cta-from to-cta-progress-end flex h-8 w-8 items-center justify-center',
            'rounded-lg bg-linear-to-r text-xs font-bold text-white'
          )}
        />
        HOJA DE RESPUESTAS
      </h3>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const question = questions[idx];
          const questionId = question?.id ?? String(idx + 1);
          const questionNum = idx + 1;
          const answer = answers[questionId];
          const isAnswered = answer !== undefined;
          const isCurrent = currentQuestion === idx;
          const isFlagged = questionId ? Boolean(flaggedIds?.has(questionId)) : false;

          const labelParts = [
            `Pregunta ${questionNum}`,
            isAnswered ? `respondida: ${answer}` : 'sin responder',
            isFlagged ? 'marcada' : null,
            isCurrent ? 'viendo ahora' : null,
          ].filter(Boolean);
          const label = labelParts.join(', ');

          return (
            <button
              type="button"
              key={questionNum}
              onClick={() => onQuestionClick(idx)}
              aria-label={label}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg text-xs font-bold',
                'transition-all duration-300',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface-via',
                isAnswered
                  ? cn(
                      'bg-linear-to-r from-green-500 to-emerald-500 text-white',
                      'hover:shadow-lg hover:shadow-green-500/50 focus-visible:ring-white'
                    )
                  : cn(
                      'border-surface-border bg-surface-overlay/50 text-on-surface-muted hover:bg-surface-overlay border',
                      'focus-visible:ring-app-accent'
                    ),
                isFlagged && 'outline outline-2 outline-offset-1 outline-amber-400',
                isCurrent &&
                  cn(
                    'ring-app-accent text-app-accent-strong ring-offset-surface-elevated z-10 scale-110 ring-2 ring-offset-2',
                    'focus-visible:ring-app-accent-bright',
                    !isAnswered && 'bg-app-ring/30'
                  )
              )}
            >
              {isAnswered ? <span className="text-xs">{answer}</span> : <span>{questionNum}</span>}
            </button>
          );
        })}
      </div>

      <div className="text-on-surface-muted mt-6 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="ring-app-accent bg-surface-overlay/50 ring-offset-surface-elevated h-4 w-4 rounded ring-2 ring-offset-1" />
          <span>Viendo ahora</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-surface-border bg-surface-overlay/50 h-4 w-4 rounded border" />
          <span>No respondidas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-linear-to-r from-green-500 to-emerald-500" />
          <span>Respondidas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded outline outline-2 outline-offset-1 outline-amber-400" />
          <span>Marcadas (F)</span>
        </div>
      </div>
    </div>
  );
};
