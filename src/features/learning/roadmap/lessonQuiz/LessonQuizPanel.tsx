'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MASCOT_IMAGES } from '@/assets';
import { LessonMascotBubble } from '../LessonMascotBubble';
import { LessonQuizActions } from './LessonQuizActions';
import { LessonQuizFeedback } from './LessonQuizFeedback';
import { LessonQuizQuestionPanel } from './LessonQuizQuestionPanel';
import { useLessonQuiz } from './useLessonQuiz';
import type { LessonQuizModalProps } from './quizTypes';

export type LessonQuizPanelProps = Omit<LessonQuizModalProps, 'isOpen' | 'onClose'> & {
  active: boolean;
  onCancel: () => void;
  className?: string;
  contentClassName?: string;
  footerInnerClassName?: string;
  variant?: 'inline' | 'card';
  bubbleBorder?: string;
};

export function LessonQuizPanel({
  active,
  onCancel,
  onComplete,
  questions,
  quiz,
  lessonId,
  lessonTitle,
  lessonXp,
  lessonCoins,
  className,
  contentClassName,
  footerInnerClassName,
  variant = 'inline',
  bubbleBorder = 'border-blue-400/50',
}: LessonQuizPanelProps) {
  const quizState = useLessonQuiz({
    isOpen: active,
    questions,
    quiz,
    lessonId,
    lessonXp,
    lessonCoins,
  });

  const {
    currentQuestion,
    totalQuestions,
    currentQuestionIndex,
    selectedOption,
    setSelectedOption,
    isSubmitted,
    isCorrect,
    loading,
    alreadyCompleted,
    rewards,
    isLastQuestion,
    allQuestionsAnswered,
    handleSubmit,
    handleNextQuestion,
    handlePreviousQuestion,
    handleRetry,
    countCorrectAnswers,
  } = quizState;

  if (!active || !currentQuestion) return null;

  const handleClose = () => {
    if (isLastQuestion && (isCorrect || allQuestionsAnswered) && onComplete) {
      onComplete({ correct: countCorrectAnswers(), total: totalQuestions });
    } else {
      onCancel();
    }
  };

  const isCard = variant === 'card';

  const quizHeader = (
    <div
      className={cn(
        'shrink-0 border-b border-slate-800 bg-slate-800/50',
        isCard ? 'p-3.5 lg:p-6' : 'rounded-t-2xl p-4 sm:p-5'
      )}
    >
      <div className="mb-1 flex items-center justify-center gap-2">
        <Icon name="trophy" size="lg" className="text-base text-yellow-400 lg:text-lg" />
        <h3 className="text-center text-base font-bold text-white lg:text-xl">Prueba de Conocimiento</h3>
      </div>
      <p className="mt-1.5 line-clamp-2 text-center text-xs text-slate-400 lg:text-sm">{lessonTitle}</p>
      {totalQuestions > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-2">
          <div className="h-1.5 max-w-[120px] flex-1 overflow-hidden rounded-full bg-slate-700/50">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium whitespace-nowrap text-slate-400">
            {currentQuestionIndex + 1}/{totalQuestions}
          </span>
        </div>
      )}
    </div>
  );

  const quizBody = (
    <div
      className={cn(
        'min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain',
        'scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent',
        isCard ? 'p-3.5 lg:p-6' : undefined
      )}
    >
      {isCard ? (
        <LessonQuizQuestionPanel
          question={currentQuestion}
          selectedOption={selectedOption}
          isSubmitted={isSubmitted}
          onSelectOption={setSelectedOption}
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
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Pregunta {currentQuestionIndex + 1} de {totalQuestions}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 sm:p-6 md:p-8">
            <LessonQuizQuestionPanel
              question={currentQuestion}
              selectedOption={selectedOption}
              isSubmitted={isSubmitted}
              onSelectOption={setSelectedOption}
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

  const quizActions = (
    <LessonQuizActions
      currentQuestionIndex={currentQuestionIndex}
      isSubmitted={isSubmitted}
      isCorrect={isCorrect}
      isLastQuestion={isLastQuestion}
      allQuestionsAnswered={allQuestionsAnswered}
      selectedOption={selectedOption}
      loading={loading}
      onPrevious={handlePreviousQuestion}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onRetry={handleRetry}
      onNext={handleNextQuestion}
      className={
        isCard
          ? undefined
          : 'border-slate-800/80 bg-slate-950/95 p-0 backdrop-blur-md lg:p-0'
      }
      innerClassName={isCard ? undefined : footerInnerClassName}
    />
  );

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        isCard &&
          'max-h-[calc(95vh-5rem)] w-full max-w-lg overflow-hidden rounded-t-2xl border-t border-slate-800 bg-slate-900 shadow-2xl lg:max-h-[90vh] lg:rounded-2xl lg:border',
        className
      )}
    >
      {isCard ? (
        <>
          {quizHeader}
          {quizBody}
          {quizActions}
        </>
      ) : (
        <>
          <div className={cn(contentClassName, 'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain')}>
            {quizBody}
          </div>
          {quizActions}
        </>
      )}
    </div>
  );
}
