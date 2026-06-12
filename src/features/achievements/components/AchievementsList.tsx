'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { EmptyState } from '@/shared/components/EmptyState';
import type { AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';
import { organizeAchievementsForDisplay } from '@/shared/constants/achievements/achievementGrouping';
import { AchievementCategoryFilter } from './AchievementCategoryFilter';
import { AchievementSectionHeader } from './AchievementSectionHeader';
import { AchievementCard } from './AchievementCard';

export interface AchievementItem {
  id: string;
  category?: string;
  group?: string;
  status?: string;
  progress?: number;
  target?: number;
  title?: string;
  description?: string;
  icon?: string;
  xpReward?: number;
}

export interface AchievementsListProps {
  achievements?: AchievementItem[];
}

export const AchievementsList = ({ achievements = [] }: AchievementsListProps) => {
  const [activeCategory, setActiveCategory] = useState<AchievementCategoryKey | 'all'>('all');

  const sections = useMemo(
    () => organizeAchievementsForDisplay(achievements, activeCategory),
    [achievements, activeCategory]
  );

  const visibleCount = sections.reduce((sum, section) => sum + section.totalCount, 0);
  const showCategoryHeaders = activeCategory === 'all' && sections.length > 1;

  return (
    <div className="animate-fade-in w-full min-w-0 space-y-6 sm:space-y-8">
      <div className="space-y-4 sm:space-y-5">
        <h2
          className={cn(
            'from-hub-title-from bg-linear-to-r to-blue-400 bg-clip-text px-0.5',
            'text-2xl font-bold text-transparent sm:text-3xl'
          )}
        >
          Logros y Metas
        </h2>

        <AchievementCategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      {visibleCount === 0 ? (
        <EmptyState
          icon="trophy"
          title="No hay logros en esta categoría"
          description="Prueba otra categoría o sigue estudiando para desbloquear metas."
          actionLabel="Ir a estudiar"
          actionHref="/ruta-aprendizaje"
        />
      ) : (
        <div className="space-y-8 sm:space-y-10">
          {sections.map((section) => (
            <section key={section.categoryKey} className="space-y-5 sm:space-y-6">
              {showCategoryHeaders && (
                <AchievementSectionHeader
                  title={section.label}
                  icon={section.icon}
                  completedCount={section.completedCount}
                  totalCount={section.totalCount}
                  level="category"
                />
              )}

              <div className="space-y-6 sm:space-y-7">
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
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
      )}
    </div>
  );
};
