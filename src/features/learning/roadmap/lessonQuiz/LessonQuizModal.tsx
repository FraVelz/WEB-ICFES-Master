'use client';

import { cn } from '@/utils/cn';

import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
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

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-70 flex items-end justify-center bg-black/80 p-0 pb-20 backdrop-blur-sm',
        'lg:items-center lg:p-4 lg:pb-4'
      )}
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
  );
}
