'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AnswerSheet } from '@/features/exam/components';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { PhaseSkipNotice } from '@/features/exam/components/practice/PhaseSkipNotice';

type FullExamMobileAnswerSheetProps = {
  isOpen: boolean;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  phaseSkipPhaseTitle?: string;
  phaseSkipPassPercent?: number;
  onClose: () => void;
  onScrollToQuestion: (index: number) => void;
};

export function FullExamMobileAnswerSheet({
  isOpen,
  questions,
  answers,
  phaseSkipPhaseTitle,
  phaseSkipPassPercent,
  onClose,
  onScrollToQuestion,
}: FullExamMobileAnswerSheetProps) {
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

  const sheet = (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center xl:hidden">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="full-exam-answer-sheet-title"
        className={cn(
          'max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10',
          'bg-linear-to-br from-gray-900 via-gray-950 to-black shadow-2xl shadow-cyan-500/10'
        )}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-gray-950/95 px-4 py-3 backdrop-blur-md">
          <h3 id="full-exam-answer-sheet-title" className="font-bold text-white">
            Hoja de respuestas
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar hoja de respuestas"
            className={cn(
              'rounded-lg px-3 py-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white',
              'focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none'
            )}
          >
            <Icon name="x-mark" size="lg" />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <AnswerSheet
            totalQuestions={questions.length}
            answers={answers}
            currentQuestion={0}
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

  return typeof document !== 'undefined' ? createPortal(sheet, document.body) : sheet;
}
