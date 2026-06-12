'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { AchievementChainDisplayItem } from '@/shared/constants/achievements/achievementChainDisplay';

function getProgressBarColor(status: string) {
  if (status === 'completed') return 'bg-cyan-700 dark:bg-amber-500';
  if (status === 'incomplete') return 'bg-on-surface-muted';
  return 'bg-hub-orb';
}

type AchievementChainRowProps = {
  achievement: AchievementChainDisplayItem;
};

export function AchievementChainRow({ achievement }: AchievementChainRowProps) {
  const isCompleted = achievement.status === 'completed';
  const isIncomplete = achievement.status === 'incomplete';
  const percent = Math.min(100, Math.max(0, ((achievement.progress ?? 0) / (achievement.target ?? 1)) * 100));
  const displayTitle =
    achievement.tierCount > 1 ? achievement.chainTitle : (achievement.title ?? achievement.chainTitle);
  const showTierBadge = achievement.tierCount > 1;

  return (
    <article className={cn('flex gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6', isIncomplete && 'opacity-75')}>
      <div className="relative shrink-0">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl border sm:h-[4.5rem] sm:w-[4.5rem]',
            isCompleted
              ? 'border-amber-500/40 bg-amber-50 text-amber-700 dark:border-yellow-500/35 dark:bg-yellow-500/10 dark:text-yellow-300'
              : isIncomplete
                ? 'border-surface-border bg-surface-elevated/60 text-on-surface-muted'
                : 'border-app-ring/40 bg-app-ring/10 text-app-accent-strong dark:text-app-accent'
          )}
        >
          <Icon name={achievement.icon ?? 'trophy'} className="text-2xl sm:text-3xl" />
        </div>
        {showTierBadge && (
          <span
            className={cn(
              'absolute inset-x-0 bottom-0 translate-y-1/2 rounded-md px-1.5 py-0.5 text-center',
              'bg-surface-elevated text-[10px] font-bold tracking-wide uppercase',
              'border-surface-border border shadow-sm',
              'dark:bg-surface-overlay'
            )}
          >
            Nivel {achievement.tierLevel}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-on-surface text-base font-bold sm:text-lg">{displayTitle}</h3>
          <span className="text-on-surface-muted shrink-0 text-sm font-semibold tabular-nums">
            {isCompleted ? (
              <Icon name="check" className="text-amber-600 dark:text-amber-400" />
            ) : (
              `${achievement.progress ?? 0}/${achievement.target ?? 0}`
            )}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso de ${displayTitle}`}
          className="bg-surface-via mb-2 h-2.5 w-full overflow-hidden rounded-full"
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              getProgressBarColor(achievement.status ?? 'incomplete')
            )}
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-on-surface-muted text-sm leading-relaxed">{achievement.description}</p>

        {(achievement.xpReward ?? 0) > 0 && (
          <p className="text-on-surface-muted mt-2 text-xs font-medium">+{achievement.xpReward} XP al completar</p>
        )}
      </div>
    </article>
  );
}
