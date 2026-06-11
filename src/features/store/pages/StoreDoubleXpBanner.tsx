'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components';
import { formatCountdown } from '../utils/formatCountdown';

type StoreDoubleXpBannerProps = {
  remainingMs: number;
};

export function StoreDoubleXpBanner({ remainingMs }: StoreDoubleXpBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl border border-orange-500/40',
        'bg-orange-100 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/10'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon name="bolt" className="text-orange-700 dark:text-orange-400" />
        <div>
          <p className="text-sm font-bold text-orange-900 dark:text-orange-300">Doble XP activo</p>
          <p className="text-on-surface-muted text-xs">Ganas el doble de experiencia mientras dure el efecto.</p>
        </div>
      </div>
      <span className="font-mono text-lg font-bold text-orange-800 tabular-nums dark:text-orange-300">
        {formatCountdown(remainingMs)}
      </span>
    </div>
  );
}
