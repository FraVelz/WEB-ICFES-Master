import { cn } from '@/utils/cn';
import { MASCOT_IMAGES } from '@/assets';
import { LessonMascotBubble } from '../LessonMascotBubble';
import { LessonQuizFeedback } from './LessonQuizFeedback';
import { LessonQuizQuestionPanel } from './LessonQuizQuestionPanel';
import type { NormalizedQuizQuestion } from './quizTypes';

type LessonQuizPanelBodyProps = {
  isCard: boolean;
  currentQuestion: NormalizedQuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedOption: string | null;
  isSubmitted: boolean;
  isCorrect: boolean;
  isLastQuestion: boolean;
  rewards: { xp: number; coins: number } | null;
  alreadyCompleted: boolean;
  bubbleBorder: string;
  onSelectOption: (option: string) => void;
};

export function LessonQuizPanelBody({
  isCard,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedOption,
  isSubmitted,
  isCorrect,
  isLastQuestion,
  rewards,
  alreadyCompleted,
  bubbleBorder,
  onSelectOption,
}: LessonQuizPanelBodyProps) {
  return (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain',
        'scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent',
        isCard ? 'p-3.5 lg:p-6' : undefined
      )}
    >
      {isCard ? (
        <LessonQuizQuestionPanel
          question={currentQuestion}
          selectedOption={selectedOption}
          isSubmitted={isSubmitted}
          onSelectOption={onSelectOption}
        />
      ) : (
        <>
          <LessonMascotBubble
            className="mb-6 sm:mb-8"
            text={currentQuestion.question}
            mascotSrc={MASCOT_IMAGES.logo}
            bubbleBorder={bubbleBorder}
          />

          <div className="mb-4 flex justify-center sm:mb-6">
            <span
              className={cn(
                'rounded-full bg-surface-overlay/80 px-3 py-1 text-xs font-semibold tracking-wider text-on-surface-muted',
                'uppercase'
              )}
            >
              Pregunta {currentQuestionIndex + 1} de {totalQuestions}
            </span>
          </div>

          <div className="rounded-2xl border border-surface-border/60 bg-surface-elevated/30 p-4 sm:p-6 md:p-8">
            <LessonQuizQuestionPanel
              question={currentQuestion}
              selectedOption={selectedOption}
              isSubmitted={isSubmitted}
              onSelectOption={onSelectOption}
              hideQuestionTitle
            />
            {isSubmitted && (
              <LessonQuizFeedback
                isCorrect={isCorrect}
                isLastQuestion={isLastQuestion}
                rewards={rewards}
                alreadyCompleted={alreadyCompleted}
              />
            )}
          </div>
        </>
      )}

      {isCard && isSubmitted && (
        <LessonQuizFeedback
          isCorrect={isCorrect}
          isLastQuestion={isLastQuestion}
          rewards={rewards}
          alreadyCompleted={alreadyCompleted}
        />
      )}
    </div>
  );
}
