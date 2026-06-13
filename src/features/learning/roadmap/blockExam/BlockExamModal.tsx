'use client';

import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { useToast } from '@/shared/components/Toast/ToastProvider';
import { LessonQuizActions } from '../lessonQuiz/LessonQuizActions';
import { LessonQuizPanelBody } from '../lessonQuiz/LessonQuizPanelBody';
import { LessonQuizPanelHeader } from '../lessonQuiz/LessonQuizPanelHeader';
import { useBlockExam } from './useBlockExam';
import type { PathNodeData } from '../AreaPath';

export type BlockExamModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  checkpoint: PathNodeData | null;
  areaId: string;
};

export function BlockExamModal({ isOpen, onClose, onComplete, checkpoint, areaId }: BlockExamModalProps) {
  const overlayRef = useGSAPModalEntrance({ isOpen, type: 'fade', duration: 0.2 });
  const dialogRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const lessonIds = Array.isArray(checkpoint?.lessonIds)
    ? (checkpoint.lessonIds as string[])
    : [];

  const blockId = typeof checkpoint?.blockId === 'string' ? checkpoint.blockId : '';

  const quiz = useBlockExam({
    isOpen,
    checkpointId: checkpoint?.id ?? null,
    lessonIds,
    areaId,
    blockId,
    onPassed: () => {
      showToast('¡Bloque aprobado! Ya puedes continuar con el siguiente.', 'success');
      onComplete?.();
    },
  });

  useDialogA11y(isOpen, onClose, dialogRef);

  if (!isOpen || !checkpoint) return null;

  const {
    starting,
    loading,
    gradeError,
    passPercent,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedOption,
    setSelectedOption,
    isSubmitted,
    isCorrect,
    isLastQuestion,
    allQuestionsAnswered,
    alreadyPassed,
    finalScore,
    rewards,
    handleSubmit,
    handleNextQuestion,
    handlePreviousQuestion,
    handleRetry,
  } = quiz;

  const title = String(checkpoint.title ?? 'Examen de bloque');
  const showPassBanner = !alreadyPassed && totalQuestions > 0;

  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-70 flex items-end justify-center bg-black/80 p-0 pb-20 backdrop-blur-sm',
        'lg:items-center lg:p-4 lg:pb-4'
      )}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-exam-title"
        className="border-surface-border bg-surface-via flex max-h-[min(92dvh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border shadow-2xl lg:rounded-2xl"
      >
        <LessonQuizPanelHeader
          lessonTitle={title}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          isCard
        />

        {showPassBanner && (
          <p className="text-on-surface-muted border-surface-border/70 border-b px-4 py-2 text-sm">
            Necesitas al menos <span className="text-on-surface font-semibold">{passPercent}%</span> de aciertos para
            desbloquear el siguiente bloque.
          </p>
        )}

        {starting || !currentQuestion ? (
          <div className="text-on-surface-muted flex flex-1 items-center justify-center p-8 text-sm">
            {starting ? 'Preparando preguntas aleatorias...' : 'No hay preguntas disponibles para este bloque.'}
          </div>
        ) : (
          <LessonQuizPanelBody
            isCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            selectedOption={selectedOption}
            isSubmitted={isSubmitted}
            isCorrect={isCorrect}
            isLastQuestion={isLastQuestion}
            rewards={rewards}
            alreadyCompleted={alreadyPassed}
            bubbleBorder="border-amber-400/50"
            onSelectOption={setSelectedOption}
          />
        )}

        {isLastQuestion && isSubmitted && finalScore != null && !alreadyPassed && allQuestionsAnswered && (
          <p className="text-amber-300 px-4 pb-2 text-center text-sm">
            Obtuviste {finalScore}%. Necesitas {passPercent}% para continuar.
          </p>
        )}

        <LessonQuizActions
          currentQuestionIndex={currentQuestionIndex}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          isLastQuestion={isLastQuestion}
          allQuestionsAnswered={allQuestionsAnswered}
          selectedOption={selectedOption}
          loading={loading || starting}
          gradeError={gradeError}
          onPrevious={handlePreviousQuestion}
          onClose={onClose}
          onSubmit={() => void handleSubmit()}
          onRetry={handleRetry}
          onNext={handleNextQuestion}
        />
      </div>
    </div>
  );
}
