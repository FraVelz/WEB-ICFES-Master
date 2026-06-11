'use client';

import { cn } from '@/utils/cn';
import { useRef } from 'react';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';

export interface LessonPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id?: string;
    title?: string;
    content?: string;
    description?: string;
    xp?: number;
    coins?: number;
  } | null;
  onStart: (lesson?: { id?: string }) => void;
}

export const LessonPreview = ({ isOpen, onClose, lesson, onStart }: LessonPreviewProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y(isOpen, onClose, dialogRef);

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <ModalOverlay onClose={onClose} className="bg-black/60 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-preview-title"
        className={cn(
          'animate-fade-in-up border-surface-border bg-surface-elevated relative mb-20 w-screen max-w-md border-t p-6 shadow-2xl',
          'motion-reduce:animate-none sm:rounded-2xl sm:border'
        )}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista previa"
          className={cn(
            'text-on-surface-muted absolute top-4 right-4 cursor-pointer rounded-lg p-2 transition-colors',
            'focus-visible:ring-app-accent hover:text-white focus-visible:ring-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-elevated focus-visible:ring-offset-2'
          )}
        >
          <Icon name="times" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h3 id="lesson-preview-title" className="mr-8 mb-2 text-xl font-bold text-white">
            {lesson.title}
          </h3>
          <p className="text-on-surface-muted text-sm">{lesson.description}</p>
        </div>

        {/* Rewards */}
        <div className="mb-8 flex justify-center gap-4">
          <div
            className={cn(
              'border-surface-border flex min-w-[100px] flex-col items-center rounded-xl border',
              'bg-surface-overlay/50 p-3'
            )}
          >
            <span className="text-lg font-bold text-orange-400">+{lesson?.xp ?? 0}</span>
            <span className="text-on-surface-muted text-xs tracking-wider uppercase">XP</span>
          </div>
          <div
            className={cn(
              'border-surface-border flex min-w-[100px] flex-col items-center rounded-xl border',
              'bg-surface-overlay/50 p-3'
            )}
          >
            <span className="text-lg font-bold text-yellow-400">+{lesson?.coins ?? 0}</span>
            <span className="text-on-surface-muted text-xs tracking-wider uppercase">Monedas</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onStart(lesson);
            onClose();
          }}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-500 py-4',
            'text-surface-via font-bold shadow-lg shadow-green-500/20 transition-all hover:bg-green-400',
            'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:scale-95',
            'focus-visible:ring-offset-surface-elevated focus-visible:ring-offset-2'
          )}
        >
          <Icon name="play" />
          COMENZAR LECCIÓN
        </button>
      </div>
    </div>
  );
};
