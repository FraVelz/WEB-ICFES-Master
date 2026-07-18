import React from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { LessonPathStatus } from '@/features/learning/utils/lessonPathStatus';

const BORDER_COLORS = {
  green: 'border-green-500/30',
  purple: 'border-purple-500/30',
  orange: 'border-orange-500/30',
  pink: 'border-pink-500/30',
  indigo: 'border-indigo-500/30',
  blue: 'border-blue-500/30',
  slate: 'border-surface-border',
} as const;

function resolveAccentBorder(bgClass: string): string {
  const subjectMatch = bgClass.match(/subject-(lc|math|sci|soc|eng|full)/);
  if (subjectMatch) {
    return `border-subject-${subjectMatch[1]}/30`;
  }

  const legacyColor = (bgClass.split('-')[1] || 'slate') as keyof typeof BORDER_COLORS;
  return BORDER_COLORS[legacyColor] ?? BORDER_COLORS.slate;
}

const FOCUS_RING_CLASS =
  'focus-visible:outline-none focus-visible:relative focus-visible:z-10 focus-visible:border-app-accent focus-visible:shadow-[0_0_0_2px_var(--icfes-surface),0_0_0_5px_var(--color-app-ring)]';

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

  const borderColor = resolveAccentBorder(colorClass);

  const currentIconCircleClass = isMinimumRequirements
    ? 'border-amber-400/30 bg-amber-600 text-white shadow-md'
    : cn(colorClass, 'border-white/20 text-white shadow-md');

  const cardClass = cn(
    'group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4',
    'text-left transition-all duration-200',
    FOCUS_RING_CLASS,
    isPending && 'border-surface-border bg-surface-elevated/40 opacity-70 hover:border-surface-border hover:opacity-90',
    isLocked && 'cursor-not-allowed opacity-55 hover:opacity-55',
    isMinimumRequirements &&
      !isCompleted &&
      (isCurrent
        ? 'border-amber-500/30 bg-surface-elevated/60 lesson-current-glow hover:border-amber-500/40 hover:bg-surface-overlay'
        : 'border-amber-500/25 bg-surface-elevated/60 hover:border-amber-500/35'),
    isCurrent &&
      !isMinimumRequirements &&
      cn(borderColor, 'lesson-current-glow bg-surface-elevated hover:bg-surface-overlay'),
    isCompleted && 'border-green-500/30 bg-surface-elevated/50 hover:bg-surface-elevated'
  );

  const iconCircleClass = cn(
    'relative flex shrink-0 items-center justify-center rounded-full border-b-4',
    'transition-transform group-hover:scale-105',
    isCheckpoint ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg',
    isPending && 'border-surface-border bg-surface-overlay text-on-surface-muted',
    isCurrent && currentIconCircleClass,
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
            isCompleted && 'text-green-600 dark:text-green-400'
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
