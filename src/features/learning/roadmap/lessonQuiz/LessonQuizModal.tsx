'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { LessonQuizActions } from './LessonQuizActions';
import { LessonQuizFeedback } from './LessonQuizFeedback';
import { LessonQuizQuestionPanel } from './LessonQuizQuestionPanel';
import { useLessonQuiz } from './useLessonQuiz';
import type { LessonQuizModalProps } from './quizTypes';

export type { LessonQuizModalProps, QuizInput, QuizQuestionInput } from './quizTypes';

export function LessonQuizModal({
  isOpen,
  onClose,
  onComplete,
  questions,
  quiz,
  lessonId,
  lessonTitle,
  lessonXp,
  lessonCoins,
}: LessonQuizModalProps) {
  const overlayRef = useGSAPModalEntrance({ isOpen, type: 'fade', duration: 0.2 });
  const quizState = useLessonQuiz({ isOpen, questions, quiz, lessonId, lessonXp, lessonCoins });

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

  if (!isOpen || !currentQuestion) return null;

  const handleClose = () => {
    if (isLastQuestion && (isCorrect || allQuestionsAnswered) && onComplete) {
      onComplete({ correct: countCorrectAnswers(), total: totalQuestions });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-70 flex items-end justify-center bg-black/80 p-0 pb-20 backdrop-blur-sm lg:items-center lg:p-4 lg:pb-4"
    >
      <div
        className={cn(
          'flex max-h-[calc(95vh-5rem)] w-full max-w-lg scale-100 transform flex-col overflow-hidden',
          'rounded-t-2xl border-t border-slate-800 bg-slate-900 shadow-2xl transition-all',
          'lg:max-h-[90vh] lg:rounded-2xl lg:border'
        )}
      >
        <div className="shrink-0 border-b border-slate-800 bg-slate-800/50 p-3.5 lg:p-6">
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

        <div
          className={cn(
            'min-h-0 flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent',
            'overflow-x-hidden overflow-y-auto p-3.5 lg:p-6'
          )}
        >
          <LessonQuizQuestionPanel
            question={currentQuestion}
            selectedOption={selectedOption}
            isSubmitted={isSubmitted}
            onSelectOption={setSelectedOption}
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
        />
      </div>
    </div>
  );
}
