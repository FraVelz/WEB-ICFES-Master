'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { AchievementItem } from './AchievementsList';

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return (
        'border-cyan-700/45 bg-cyan-50 text-cyan-900 dark:border-amber-500/45 ' +
        'dark:bg-amber-500/15 dark:text-amber-300'
      );
    case 'in_progress':
      return 'text-app-accent border-app-ring/50 bg-app-ring/10';
    default:
      return 'text-on-surface-muted border-surface-border bg-surface-elevated/60';
  }
}

function getProgressBarColor(status: string) {
  if (status === 'completed') return 'bg-cyan-700 dark:bg-amber-500';
  if (status === 'incomplete') return 'bg-on-surface-muted';
  return 'bg-hub-orb';
}

export function AchievementCard({ achievement }: { achievement: AchievementItem }) {
  const isCompleted = achievement.status === 'completed';
  const isIncomplete = achievement.status === 'incomplete';
  const percent = Math.min(100, Math.max(0, ((achievement.progress ?? 0) / (achievement.target ?? 1)) * 100));

  return (
    <article
      className={cn(
        'group flex min-w-0 flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 sm:p-6',
        isCompleted
          ? cn(
              'border-cyan-700/45 bg-white shadow-sm hover:border-cyan-800',
              'dark:bg-surface-overlay/80 dark:border-amber-500/35 dark:shadow-none',
              'dark:hover:border-amber-500/55'
            )
          : isIncomplete
            ? 'border-surface-border bg-surface-elevated/50 opacity-80'
            : 'hover:border-app-ring/30 border-surface-border bg-surface-overlay/30 hover:bg-surface-overlay/50'
      )}
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border sm:h-14 sm:w-14',
            getStatusColor(achievement.status ?? 'incomplete')
          )}
        >
          <Icon name={achievement.icon ?? 'trophy'} className="text-xl sm:text-2xl" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'line-clamp-2 text-base leading-snug font-bold sm:text-lg',
                isCompleted ? 'text-cyan-900 dark:text-amber-50' : 'text-on-surface'
              )}
            >
              {achievement.title}
            </h4>
            {isCompleted && (
              <Icon name="check" className="mt-0.5 shrink-0 text-sm text-cyan-800 dark:text-amber-400" />
            )}
            {isIncomplete && <Icon name="lock" className="text-on-surface-muted mt-0.5 shrink-0 text-sm" />}
          </div>
        </div>
      </div>

      <p
        className={cn(
          'line-clamp-3 text-sm leading-relaxed',
          isCompleted ? 'dark:text-on-surface-muted text-cyan-800/80' : 'text-on-surface-muted'
        )}
      >
        {achievement.description}
      </p>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between gap-3 text-xs font-medium sm:text-sm">
          <span
            className={isCompleted ? 'font-semibold text-cyan-800 dark:text-amber-400' : 'text-app-accent-strong'}
          >
            {isCompleted ? '¡Completado!' : `${achievement.progress ?? 0} / ${achievement.target ?? 0}`}
          </span>
          <span className={isCompleted ? 'dark:text-on-surface-muted text-cyan-700/75' : 'text-on-surface-muted'}>
            +{achievement.xpReward ?? 0} XP
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de ${achievement.title}`}
          className={cn(
            'h-2 w-full overflow-hidden rounded-full',
            isCompleted ? 'dark:bg-surface-via bg-cyan-100' : 'bg-surface-via'
          )}
        >
          <div
            className={cn('h-full rounded-full transition-all duration-500', getProgressBarColor(achievement.status ?? 'incomplete'))}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
