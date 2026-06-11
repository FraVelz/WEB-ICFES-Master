'use client';

import { cn } from '@/utils/cn';
import { LessonQuizActions } from './LessonQuizActions';
import { LessonQuizPanelBody } from './LessonQuizPanelBody';
import { LessonQuizPanelHeader } from './LessonQuizPanelHeader';
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
      className={isCard ? undefined : 'border-surface-border/80 bg-surface-via/95 p-0 backdrop-blur-md lg:p-0'}
      innerClassName={isCard ? undefined : footerInnerClassName}
    />
  );

  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col',
        isCard &&
          cn(
            'max-h-[calc(95vh-5rem)] w-full max-w-lg overflow-hidden rounded-t-2xl',
            'border-t border-surface-border bg-surface-elevated shadow-2xl lg:max-h-[90vh] lg:rounded-2xl lg:border'
          ),
        className
      )}
    >
      {isCard ? (
        <>
          <LessonQuizPanelHeader
            lessonTitle={lessonTitle ?? ''}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isCard={isCard}
          />
          <LessonQuizPanelBody
            isCard={isCard}
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            isSubmitted={isSubmitted}
            isCorrect={isCorrect}
            isLastQuestion={isLastQuestion}
            rewards={rewards}
            alreadyCompleted={alreadyCompleted}
            bubbleBorder={bubbleBorder}
            onSelectOption={setSelectedOption}
          />
          {quizActions}
        </>
      ) : (
        <>
          <div className={cn(contentClassName, 'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain')}>
            <LessonQuizPanelBody
              isCard={isCard}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              selectedOption={selectedOption}
              isSubmitted={isSubmitted}
              isCorrect={isCorrect}
              isLastQuestion={isLastQuestion}
              rewards={rewards}
              alreadyCompleted={alreadyCompleted}
              bubbleBorder={bubbleBorder}
              onSelectOption={setSelectedOption}
            />
          </div>
          {quizActions}
        </>
      )}
    </div>
  );
}
