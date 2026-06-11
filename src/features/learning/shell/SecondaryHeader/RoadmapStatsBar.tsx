'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { getAreaInfo } from '@/shared/constants';
import type { RefObject } from 'react';

export type RoadmapStatsBarProps = {
  currentArea: string;
  currentStreak: number;
  coins: number;
  loading?: boolean;
  areasOpen?: boolean;
  streakOpen?: boolean;
  onToggleAreas: () => void;
  onToggleStreak: () => void;
  layout?: 'inline' | 'stacked';
  className?: string;
  areaSelectorRef?: RefObject<HTMLButtonElement | null>;
  streakButtonRef?: RefObject<HTMLButtonElement | null>;
};

export function RoadmapStatsBar({
  currentArea,
  currentStreak,
  coins,
  loading = false,
  areasOpen = false,
  streakOpen = false,
  onToggleAreas,
  onToggleStreak,
  layout = 'inline',
  className,
  areaSelectorRef,
  streakButtonRef,
}: RoadmapStatsBarProps) {
  const currentAreaInfo = getAreaInfo(currentArea);

  return (
    <div
      className={cn(
        layout === 'stacked' ? 'flex flex-col gap-3' : 'flex w-full items-center justify-between gap-3',
        className
      )}
    >
      <button
        ref={areaSelectorRef}
        type="button"
        onClick={onToggleAreas}
        className={cn(
          'hover:bg-surface-elevated/80 flex cursor-pointer items-center gap-2 rounded-xl p-2 transition-colors',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'focus-visible:ring-offset-surface',
          layout === 'stacked' && 'w-full'
        )}
        title={`Área: ${currentAreaInfo.name}`}
        aria-expanded={areasOpen}
        aria-haspopup="dialog"
      >
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-lg',
            `bg-linear-to-br ${currentAreaInfo.color}`
          )}
        >
          <Icon name={currentAreaInfo.icon ?? 'book'} className="text-sm text-white" />
        </div>
        {layout === 'stacked' && (
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <span className="text-on-surface-muted text-xs font-bold tracking-wider uppercase">Área actual</span>
            <span className="text-on-surface truncate text-sm font-bold">{currentAreaInfo.name}</span>
          </div>
        )}
        <Icon
          name="chevron-down"
          className={cn(
            'text-on-surface-muted ml-auto text-xs transition-transform',
            areasOpen && 'rotate-180',
            layout === 'inline' && 'ml-1'
          )}
        />
      </button>

      <div className={cn('flex items-center gap-2', layout === 'stacked' && 'w-full')}>
        <button
          ref={streakButtonRef}
          type="button"
          onClick={onToggleStreak}
          className={cn(
            'group border-surface-border flex cursor-pointer items-center gap-2 rounded-full border',
            'bg-surface-elevated px-3 py-1.5 transition-colors hover:border-orange-500/50',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface',
            layout === 'stacked' && 'flex-1 justify-center'
          )}
          title="Ver información de racha"
          aria-expanded={streakOpen}
          aria-haspopup="dialog"
        >
          <Icon
            name="fire"
            className={cn(
              'text-sm transition-colors',
              currentStreak > 0 ? 'text-orange-500' : 'text-on-surface-muted group-hover:text-orange-500/50'
            )}
          />
          <span
            className={cn(
              'text-sm font-bold',
              currentStreak > 0 ? 'text-orange-500' : 'text-on-surface-muted group-hover:text-orange-500/50',
              loading && 'animate-pulse opacity-60'
            )}
          >
            {currentStreak}
          </span>
        </button>

        <Link
          href="/tienda"
          className={cn(
            'group border-surface-border flex cursor-pointer items-center gap-2 rounded-full border',
            'bg-surface-elevated px-3 py-1.5 transition-colors hover:border-yellow-500/50',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface',
            layout === 'stacked' && 'flex-1 justify-center'
          )}
          title="Ir a la tienda"
        >
          <Icon name="coins" className="text-sm text-yellow-500" />
          <span className={cn('text-sm font-bold text-yellow-500', loading && 'animate-pulse opacity-60')}>
            {coins}
          </span>
        </Link>

        <ThemeToggle compact className="hidden lg:inline-flex" />
      </div>
    </div>
  );
}
