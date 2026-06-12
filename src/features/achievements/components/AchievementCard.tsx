'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { AchievementItem } from './AchievementsList';

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return (
        'border-app-accent-strong/45 bg-app-accent/10 text-app-accent-darker ' +
        'dark:border-app-accent/45 dark:bg-app-accent/15 dark:text-app-accent-bright'
      );
    case 'in_progress':
      return 'text-app-accent border-app-ring/50 bg-app-ring/10';
    default:
      return 'text-on-surface-muted border-surface-border bg-surface-elevated/60';
  }
}

function getProgressBarColor(status: string) {
  if (status === 'completed') return 'bg-app-accent-strong dark:bg-app-accent';
  if (status === 'incomplete') return 'bg-on-surface-muted';
  return 'bg-hub-orb';
}

export function AchievementCard({ achievement }: { achievement: AchievementItem }) {
  const isCompleted = achievement.status === 'completed';
  const isIncomplete = achievement.status === 'incomplete';
  const showTierBadge = (achievement.tierCount ?? 1) > 1;
  const percent = Math.min(100, Math.max(0, ((achievement.progress ?? 0) / (achievement.target ?? 1)) * 100));

  return (
    <article
      className={cn(
        'group flex min-w-0 flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 sm:p-6',
        isCompleted
          ? cn(
              'border-app-accent-strong/45 bg-surface-elevated hover:border-app-accent-strong shadow-sm',
              'dark:bg-surface-overlay/80 dark:border-app-accent/35 dark:shadow-none',
              'dark:hover:border-app-accent/55'
            )
          : isIncomplete
            ? 'border-surface-border bg-surface-elevated/50 opacity-80'
            : 'hover:border-app-ring/30 border-surface-border bg-surface-overlay/30 hover:bg-surface-overlay/50'
      )}
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl border sm:h-14 sm:w-14',
              getStatusColor(achievement.status ?? 'incomplete')
            )}
          >
            <Icon name={achievement.icon ?? 'trophy'} className="text-xl sm:text-2xl" />
          </div>
          {showTierBadge && (
            <span
              className={cn(
                'absolute inset-x-0 bottom-0 translate-y-1/2 rounded-md px-1 py-0.5 text-center',
                'bg-surface-elevated text-[9px] font-bold tracking-wide uppercase',
                'border-surface-border dark:bg-surface-overlay border shadow-sm'
              )}
            >
              Nivel {achievement.tierLevel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'line-clamp-2 text-base leading-snug font-bold sm:text-lg',
                isCompleted ? 'text-app-accent-darker dark:text-app-accent-bright' : 'text-on-surface'
              )}
            >
              {achievement.title}
            </h4>
            {isCompleted && (
              <Icon name="check" className="text-app-accent-strong dark:text-app-accent mt-0.5 shrink-0 text-sm" />
            )}
            {isIncomplete && <Icon name="lock" className="text-on-surface-muted mt-0.5 shrink-0 text-sm" />}
          </div>
        </div>
      </div>

      <p
        className={cn(
          'line-clamp-3 text-sm leading-relaxed',
          isCompleted ? 'text-app-accent-darker/80 dark:text-on-surface-muted' : 'text-on-surface-muted'
        )}
      >
        {achievement.description}
      </p>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between gap-3 text-xs font-medium sm:text-sm">
          <span
            className={
              isCompleted ? 'text-app-accent-strong dark:text-app-accent font-semibold' : 'text-app-accent-strong'
            }
          >
            {isCompleted ? '¡Completado!' : `${achievement.progress ?? 0} / ${achievement.target ?? 0}`}
          </span>
          <span
            className={isCompleted ? 'text-app-accent-strong/75 dark:text-on-surface-muted' : 'text-on-surface-muted'}
          >
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
            isCompleted ? 'bg-app-accent/15 dark:bg-surface-via' : 'bg-surface-via'
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              getProgressBarColor(achievement.status ?? 'incomplete')
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </article>
  );
}
