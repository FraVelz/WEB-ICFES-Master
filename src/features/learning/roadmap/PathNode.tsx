import React from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { LessonPathStatus } from '@/features/learning/utils/lessonPathStatus';

const BORDER_COLORS = {
  green: 'border-green-500/50',
  purple: 'border-purple-500/50',
  orange: 'border-orange-500/50',
  pink: 'border-pink-500/50',
  indigo: 'border-indigo-500/50',
  slate: 'border-on-surface-muted/50',
};

export interface PathNodeProps {
  status?: LessonPathStatus;
  type?: 'lesson' | 'checkpoint' | string;
  title?: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
  colorClass?: string;
}

export const PathNode = ({
  status = 'pending',
  type = 'lesson',
  title,
  description,
  icon,
  onClick,
  colorClass = 'bg-blue-500',
}: PathNodeProps) => {
  const isCheckpoint = type === 'checkpoint';
  const isMinimumRequirements = type === 'minimum-requirements';
  const isLocked = status === 'locked';
  const isPending = status === 'pending' || isLocked;
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  const colorName = (colorClass.split('-')[1] || 'slate') as keyof typeof BORDER_COLORS;
  const borderColor = BORDER_COLORS[colorName] ?? BORDER_COLORS.slate;

  const cardClass = cn(
    'group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 p-4',
    'text-left transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2',
    'focus-visible:ring-offset-surface-via',
    isPending && 'border-surface-border bg-surface-elevated/40 opacity-70 hover:border-surface-border hover:opacity-90',
    isLocked && 'cursor-not-allowed opacity-55 hover:opacity-55',
    isMinimumRequirements && !isCompleted && 'border-amber-500/35 bg-surface-elevated/60 hover:border-amber-500/50',
    isCurrent && cn(borderColor, 'lesson-current-glow bg-surface-elevated hover:bg-surface-overlay'),
    isCompleted && 'border-green-500/40 bg-surface-elevated/50 hover:bg-surface-elevated'
  );

  const iconCircleClass = cn(
    'relative flex shrink-0 items-center justify-center rounded-full border-b-4',
    'transition-transform group-hover:scale-105',
    isCheckpoint ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg',
    isPending && 'border-surface-border bg-surface-overlay text-on-surface-muted',
    isCurrent && cn(colorClass, 'border-white/20 text-white shadow-md'),
    isCompleted &&
      'border-green-600/40 bg-green-500/15 text-green-600 dark:border-green-600 dark:bg-green-600/20 dark:text-green-400'
  );

  const playButtonClass = cn(
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
    isPending && 'bg-surface-overlay text-on-surface-muted',
    isCurrent && 'bg-on-surface text-surface shadow-sm',
    isCompleted && 'bg-surface-overlay text-green-500 dark:text-green-400'
  );

  const playIconClass = cn(
    isPending && 'text-on-surface-muted',
    isCurrent && 'text-surface',
    isCompleted && 'text-green-500 dark:text-green-400'
  );

  const body = (
    <>
      <div className={iconCircleClass}>
        <Icon
          name={isCompleted ? 'check' : isLocked ? 'lock' : icon || 'book'}
          className={cn(
            isPending && 'text-on-surface-muted',
            isCurrent && 'text-white',
            isCompleted && 'text-green-500 dark:text-green-400'
          )}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4
          className={cn(
            'truncate text-base font-bold',
            isPending && 'text-on-surface-muted',
            isCurrent && 'text-on-surface',
            isCompleted && 'text-green-600 dark:text-green-400'
          )}
        >
          {title}
        </h4>
        <p className="text-on-surface-muted truncate text-xs">
          {isLocked ? 'Bloqueado — completa el bloque anterior' : description}
        </p>
      </div>

      <div className={playButtonClass}>
        <Icon name={isCompleted ? 'check' : 'play'} size="sm" className={playIconClass} />
      </div>
    </>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={cardClass}
      aria-current={isCurrent ? 'step' : undefined}
      aria-disabled={isLocked}
    >
      {body}
    </button>
  );
};
