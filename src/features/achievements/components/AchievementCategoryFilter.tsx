'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ACHIEVEMENT_CATEGORIES, type AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';

type AchievementCategoryFilterProps = {
  activeCategory: AchievementCategoryKey | 'all';
  onCategoryChange: (category: AchievementCategoryKey | 'all') => void;
  compact?: boolean;
};

export function AchievementCategoryFilter({
  activeCategory,
  onCategoryChange,
  compact = false,
}: AchievementCategoryFilterProps) {
  return (
    <div
      className={cn(
        'scrollbar-hide flex gap-2 overflow-x-auto pb-1',
        compact ? '-mx-1 px-1' : '-mx-1 px-1 sm:mx-0 sm:flex-wrap sm:gap-2.5 sm:overflow-visible sm:px-0'
      )}
    >
      {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, { label, icon }]) => (
        <button
          key={key}
          type="button"
          onClick={() => onCategoryChange(key as AchievementCategoryKey | 'all')}
          className={cn(
            'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap',
            'transition-all duration-300 focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2',
            compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm sm:px-4',
            activeCategory === key
              ? 'border-app-ring bg-app-ring/20 text-app-accent shadow-app-ring/20 shadow-lg'
              : cn(
                  'border-surface-border bg-surface-elevated text-on-surface-muted',
                  'hover:border-app-ring/40 hover:text-on-surface dark:border-surface-border',
                  'dark:bg-surface-overlay/50 dark:text-on-surface-muted dark:hover:border-surface-border dark:hover:bg-surface-overlay'
                )
          )}
        >
          <Icon name={icon} className="shrink-0" size={compact ? 'sm' : undefined} />
          {label}
        </button>
      ))}
    </div>
  );
}
