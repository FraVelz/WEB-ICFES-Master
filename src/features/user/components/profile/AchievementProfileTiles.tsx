'use client';

import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { resolveAchievementChainViews } from '@/shared/constants/achievements/achievementChainDisplay';
import { AchievementChainRow } from '@/features/achievements/components/AchievementChainRow';
import { achievementTileClass, type ProfileAchievement } from './achievementProfileTypes';

function AchievementStatusLabel({ status }: { status: string }) {
  if (status === 'completed') {
    return <span className="text-xs font-semibold text-amber-700 dark:text-yellow-400">Desbloqueado</span>;
  }
  if (status === 'in_progress') {
    return <span className="text-app-accent-strong dark:text-app-accent text-xs font-semibold">En progreso</span>;
  }
  return <span className="text-on-surface-muted text-xs font-medium">Bloqueado</span>;
}

type ProfileAchievementTilesProps = {
  achievements: ProfileAchievement[];
  mode?: 'logros' | 'profile';
};

/** Vista compacta de logros en cadena para perfil u otros paneles. */
export function ProfileAchievementChainList({ achievements, mode = 'profile' }: ProfileAchievementTilesProps) {
  const chainViews = useMemo(() => resolveAchievementChainViews(achievements, mode), [achievements, mode]);

  if (chainViews.length === 0) return null;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/40 divide-surface-border divide-y overflow-hidden rounded-2xl border',
        'dark:bg-surface-elevated/25'
      )}
    >
      {chainViews.map((achievement) => (
        <AchievementChainRow key={achievement.chainId} achievement={achievement} />
      ))}
    </div>
  );
}

export function AchievementGridTile({ achievement }: { achievement: ProfileAchievement }) {
  const chainView = useMemo(() => resolveAchievementChainViews([achievement], 'logros')[0] ?? null, [achievement]);
  const display = chainView ?? achievement;
  const isUnlocked = display.status === 'completed';
  const iconName = typeof display.icon === 'string' ? display.icon : 'star';
  const showTierBadge = (display.tierCount ?? 1) > 1;

  return (
    <div className="group relative">
      <div
        className={cn(
          'relative flex aspect-square flex-col items-center justify-center rounded-xl border p-2 transition-all',
          achievementTileClass(display.status ?? 'incomplete'),
          'md:cursor-help'
        )}
        aria-label={display.chainTitle ?? display.title}
      >
        <Icon name={iconName} className="mb-1 text-2xl" />
        {showTierBadge && (
          <span className="text-on-surface-muted absolute bottom-1 text-[9px] font-bold uppercase">
            N{display.tierLevel}
          </span>
        )}
        {isUnlocked && (
          <Icon
            name="star"
            size="sm"
            className="absolute top-2 right-2 text-[8px] text-amber-500 dark:text-yellow-200"
          />
        )}
      </div>

      <div
        role="tooltip"
        className={cn(
          'border-surface-border bg-surface-elevated pointer-events-none absolute bottom-[calc(100%+0.5rem)]',
          'left-1/2 z-30 hidden w-52 -translate-x-1/2 rounded-xl border p-3 text-left shadow-xl',
          'opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100',
          'dark:border-surface-border dark:bg-surface-elevated',
          'max-md:hidden'
        )}
      >
        <p className="text-on-surface text-sm font-semibold">{display.chainTitle ?? display.title}</p>
        {display.description && (
          <p className="text-on-surface-muted mt-1 text-xs leading-relaxed">{display.description}</p>
        )}
        <div className="mt-2">
          <AchievementStatusLabel status={display.status ?? 'incomplete'} />
        </div>
      </div>
    </div>
  );
}

export function AchievementDetailRow({ achievement }: { achievement: ProfileAchievement }) {
  const chainView = useMemo(() => resolveAchievementChainViews([achievement], 'logros')[0] ?? null, [achievement]);

  if (chainView) {
    return (
      <li>
        <AchievementChainRow achievement={chainView} />
      </li>
    );
  }

  const iconName = typeof achievement.icon === 'string' ? achievement.icon : 'star';
  const showProgress =
    achievement.status === 'in_progress' &&
    typeof achievement.progress === 'number' &&
    typeof achievement.target === 'number' &&
    achievement.target > 0;

  return (
    <li
      className={cn(
        'border-surface-border flex gap-3 rounded-xl border p-3',
        'bg-surface-via/40 dark:border-surface-border dark:bg-surface-overlay/40',
        achievement.status === 'completed' && 'border-amber-500/25 dark:border-yellow-500/20'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
          achievementTileClass(achievement.status)
        )}
      >
        <Icon name={iconName} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-on-surface text-sm font-semibold">{achievement.title}</p>
          <AchievementStatusLabel status={achievement.status} />
        </div>
        {achievement.description && (
          <p className="text-on-surface-muted mt-1 text-xs leading-relaxed">{achievement.description}</p>
        )}
        {showProgress && (
          <p className="text-on-surface-muted mt-1 text-xs">
            Progreso: {achievement.progress} / {achievement.target}
          </p>
        )}
      </div>
    </li>
  );
}
