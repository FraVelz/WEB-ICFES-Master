'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AnswerSheet } from '@/features/exam/components';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { PhaseSkipNotice } from './PhaseSkipNotice';

type PracticeMobileAnswerSheetProps = {
  isOpen: boolean;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  currentQuestion: number;
  phaseSkipPhaseTitle?: string;
  phaseSkipPassPercent?: number;
  onClose: () => void;
  onScrollToQuestion: (index: number) => void;
};

export function PracticeMobileAnswerSheet({
  isOpen,
  questions,
  answers,
  currentQuestion,
  phaseSkipPhaseTitle,
  phaseSkipPassPercent,
  onClose,
  onScrollToQuestion,
}: PracticeMobileAnswerSheetProps) {
  const showPhaseSkipNotice = phaseSkipPassPercent != null;
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y(isOpen, onClose, dialogRef);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm md:hidden">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-answer-sheet-title"
        className="border-surface-border bg-surface-elevated max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border"
      >
        <div className="border-surface-border bg-surface-via sticky top-0 flex items-center justify-between border-b p-4">
          <h3 id="practice-answer-sheet-title" className="text-on-surface font-bold">
            Hoja de Respuestas
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar hoja de respuestas"
            className={cn(
              'text-on-surface-muted hover:bg-surface-overlay hover:text-on-surface rounded-lg px-3 py-2 transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
            )}
          >
            <Icon name="x-mark" size="lg" />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <AnswerSheet
            totalQuestions={questions.length}
            answers={answers}
            currentQuestion={currentQuestion}
            onQuestionClick={(index) => {
              onScrollToQuestion(index);
              onClose();
            }}
            questions={questions}
          />
          {showPhaseSkipNotice && (
            <PhaseSkipNotice phaseTitle={phaseSkipPhaseTitle} passPercent={phaseSkipPassPercent} />
          )}
        </div>
      </div>
    </div>
  );
}
