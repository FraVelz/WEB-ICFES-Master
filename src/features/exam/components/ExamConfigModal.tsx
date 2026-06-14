'use client';
import { useRef } from 'react';
import { cn } from '@/utils/cn';
import type { ExamConfig } from '@/features/exam/types';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
import { ExamConfigForm } from './ExamConfigForm';

interface ExamConfigModalProps {
  area: string;
  totalQuestions: number;
  onStart: (config: ExamConfig) => void;
  onCancel?: () => void;
  isFullExam?: boolean;
}

export const ExamConfigModal = ({
  area,
  totalQuestions,
  onStart,
  onCancel,
  isFullExam = false,
}: ExamConfigModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y(true, onCancel ?? (() => window.history.back()), dialogRef);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-config-title"
        className={cn('border-surface-border bg-surface-elevated w-full max-w-md rounded-2xl border p-8 shadow-2xl')}
      >
        <ExamConfigForm
          area={area}
          totalQuestions={totalQuestions}
          onStart={onStart}
          onCancel={onCancel ?? (() => window.history.back())}
          isFullExam={isFullExam}
          variant="modal"
        />
      </div>
    </div>
  );
};
