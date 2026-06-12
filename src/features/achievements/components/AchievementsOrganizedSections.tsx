'use client';

import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import type { AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';
import {
  organizeChainViewsForDisplay,
  resolveAchievementChainViews,
  type AchievementChainDisplayMode,
} from '@/shared/constants/achievements/achievementChainDisplay';
import { AchievementSectionHeader } from './AchievementSectionHeader';
import { AchievementCard } from './AchievementCard';
import { AchievementChainRow } from './AchievementChainRow';
import type { AchievementItem } from './AchievementsList';

type AchievementsOrganizedSectionsProps = {
  achievements: AchievementItem[];
  activeCategory: AchievementCategoryKey | 'all';
  density?: 'default' | 'compact';
  variant?: 'list' | 'grid';
  displayMode?: AchievementChainDisplayMode;
};

function toCardAchievement(item: AchievementItem & { chainTitle?: string; tierCount?: number; tierLevel?: number }) {
  return {
    ...item,
    title: (item.tierCount ?? 1) > 1 ? item.chainTitle : item.title,
  };
}

export function AchievementsOrganizedSections({
  achievements,
  activeCategory,
  density = 'default',
  variant = 'grid',
  displayMode = 'logros',
}: AchievementsOrganizedSectionsProps) {
  const chainViews = useMemo(
    () => resolveAchievementChainViews(achievements, displayMode),
    [achievements, displayMode]
  );

  const sections = useMemo(
    () => organizeChainViewsForDisplay(chainViews, activeCategory),
    [chainViews, activeCategory]
  );

  const showCategoryHeaders = activeCategory === 'all' && sections.length > 1;
  const outerGap = density === 'compact' ? 'space-y-6' : 'space-y-8 sm:space-y-10';
  const sectionGap = density === 'compact' ? 'space-y-4' : 'space-y-5 sm:space-y-6';

  if (variant === 'list') {
    return (
      <div className={outerGap}>
        {sections.map((section) => (
          <section key={section.categoryKey} className={sectionGap}>
            {showCategoryHeaders && (
              <AchievementSectionHeader
                title={section.label}
                icon={section.icon}
                completedCount={section.completedCount}
                totalCount={section.totalCount}
                level="category"
              />
            )}

            <div
              className={cn(
                'border-surface-border bg-surface-elevated/40 divide-surface-border overflow-hidden rounded-2xl border divide-y',
                'dark:bg-surface-elevated/25'
              )}
            >
              {section.items.map((achievement) => (
                <AchievementChainRow key={achievement.chainId} achievement={achievement} />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className={outerGap}>
      {sections.map((section) => (
        <section key={section.categoryKey} className={sectionGap}>
          {showCategoryHeaders && (
            <AchievementSectionHeader
              title={section.label}
              icon={section.icon}
              completedCount={section.completedCount}
              totalCount={section.totalCount}
              level="category"
            />
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {section.items.map((achievement) => (
              <AchievementCard key={achievement.chainId} achievement={toCardAchievement(achievement)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
