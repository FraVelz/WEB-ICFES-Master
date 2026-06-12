'use client';

import { useRef } from 'react';
import { cn } from '@/utils/cn';

import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { LessonQuizPanel } from './LessonQuizPanel';
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
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y(isOpen, onClose, dialogRef);

  if (!isOpen) return null;

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
        aria-labelledby="lesson-quiz-title"
        className="flex w-full max-w-3xl flex-col"
      >
        <LessonQuizPanel
          active={isOpen}
          variant="card"
          onCancel={onClose}
          onComplete={onComplete}
          questions={questions}
          quiz={quiz}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          lessonXp={lessonXp}
          lessonCoins={lessonCoins}
        />
      </div>
    </div>
  );
}
