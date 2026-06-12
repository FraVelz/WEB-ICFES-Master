'use client';

import { useMemo } from 'react';
import type { AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';
import { organizeAchievementsForDisplay } from '@/shared/constants/achievements/achievementGrouping';
import { AchievementSectionHeader } from './AchievementSectionHeader';
import { AchievementCard } from './AchievementCard';
import type { AchievementItem } from './AchievementsList';

type AchievementsOrganizedSectionsProps = {
  achievements: AchievementItem[];
  activeCategory: AchievementCategoryKey | 'all';
  density?: 'default' | 'compact';
};

export function AchievementsOrganizedSections({
  achievements,
  activeCategory,
  density = 'default',
}: AchievementsOrganizedSectionsProps) {
  const sections = useMemo(
    () => organizeAchievementsForDisplay(achievements, activeCategory),
    [achievements, activeCategory]
  );

  const showCategoryHeaders = activeCategory === 'all' && sections.length > 1;
  const outerGap = density === 'compact' ? 'space-y-6' : 'space-y-8 sm:space-y-10';
  const groupGap = density === 'compact' ? 'space-y-5' : 'space-y-6 sm:space-y-7';

  return (
    <div className={outerGap}>
      {sections.map((section) => (
        <section key={section.categoryKey} className={density === 'compact' ? 'space-y-4' : 'space-y-5 sm:space-y-6'}>
          {showCategoryHeaders && (
            <AchievementSectionHeader
              title={section.label}
              icon={section.icon}
              completedCount={section.completedCount}
              totalCount={section.totalCount}
              level="category"
            />
          )}

          <div className={groupGap}>
            {section.groups.map((group) => (
              <div key={group.groupKey} className="space-y-4">
                {(showCategoryHeaders || section.groups.length > 1) && (
                  <AchievementSectionHeader
                    title={group.meta.label}
                    icon={group.meta.icon}
                    completedCount={group.completedCount}
                    totalCount={group.totalCount}
                    level="group"
                  />
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                  {group.achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
