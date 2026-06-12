'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type AchievementSectionHeaderProps = {
  title: string;
  icon?: string;
  completedCount: number;
  totalCount: number;
  level?: 'category' | 'group';
};

export function AchievementSectionHeader({
  title,
  icon = 'star',
  completedCount,
  totalCount,
  level = 'group',
}: AchievementSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center justify-between gap-3',
        level === 'category' ? 'border-surface-border border-b pb-2' : 'pb-1'
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          name={icon}
          className={cn(
            'shrink-0',
            level === 'category' ? 'text-app-accent text-base' : 'text-on-surface-muted text-sm'
          )}
        />
        <h3
          className={cn(
            'truncate font-bold',
            level === 'category' ? 'text-on-surface text-lg sm:text-xl' : 'text-on-surface text-sm sm:text-base'
          )}
        >
          {title}
        </h3>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
          level === 'category'
            ? 'bg-app-ring/15 text-app-accent-strong dark:text-app-accent'
            : 'bg-surface-via text-on-surface-muted dark:bg-surface-overlay/70'
        )}
      >
        {completedCount}/{totalCount}
      </span>
    </div>
  );
}
