import React from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import type { LessonPathStatus } from '@/features/learning/utils/lessonPathStatus';

const BORDER_COLORS = {
  blue: 'border-blue-500/50',
  green: 'border-green-500/50',
  purple: 'border-purple-500/50',
  orange: 'border-orange-500/50',
  pink: 'border-pink-500/50',
  indigo: 'border-indigo-500/50',
  slate: 'border-slate-500/50',
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
  const isPending = status === 'pending';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  const colorName = (colorClass.split('-')[1] || 'slate') as keyof typeof BORDER_COLORS;
  const borderColor = BORDER_COLORS[colorName] ?? BORDER_COLORS.slate;

  const cardClass = cn(
    'group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 p-4',
    'text-left transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2',
    'focus-visible:ring-offset-slate-950',
    isPending && 'border-slate-800 bg-slate-900/40 opacity-70 hover:border-slate-600 hover:opacity-90',
    isCurrent && cn(borderColor, 'lesson-current-glow bg-slate-900 hover:bg-slate-800'),
    isCompleted && 'border-green-500/40 bg-slate-900/50 hover:bg-slate-900'
  );

  const iconCircleClass = cn(
    'relative flex shrink-0 items-center justify-center rounded-full border-b-4',
    'transition-transform group-hover:scale-105',
    isCheckpoint ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg',
    isPending && 'border-slate-700 bg-slate-800 text-slate-600',
    isCurrent && cn(colorClass, 'border-white/20 text-white shadow-md'),
    isCompleted && 'border-green-600 bg-green-600/20 text-green-400'
  );

  const body = (
    <>
      <div className={iconCircleClass}>
        <Icon
          name={isCompleted ? 'check' : icon || 'book'}
          className={cn(isPending && 'text-slate-600', isCurrent && 'text-white', isCompleted && 'text-green-400')}
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4
          className={cn(
            'truncate text-base font-bold',
            isPending && 'text-slate-500',
            isCurrent && 'text-white',
            isCompleted && 'text-green-400'
          )}
        >
          {title}
        </h4>
        <p className="truncate text-xs text-slate-400">{description}</p>
      </div>

      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isPending && 'bg-slate-700/50 text-slate-500',
          isCurrent && 'bg-white text-slate-900',
          isCompleted && 'bg-slate-800 text-green-400'
        )}
      >
        <Icon
          name={isCompleted ? 'check' : 'play'}
          size="sm"
          className={cn(isPending && 'text-slate-500', isCurrent && 'text-slate-900', isCompleted && 'text-green-400')}
        />
      </div>
    </>
  );

  return (
    <button type="button" onClick={onClick} className={cardClass} aria-current={isCurrent ? 'step' : undefined}>
      {body}
    </button>
  );
};
