'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { EmptyState } from '@/shared/components/EmptyState';
import type { AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';
import { organizeAchievementsForDisplay } from '@/shared/constants/achievements/achievementGrouping';
import { AchievementCategoryFilter } from './AchievementCategoryFilter';
import { AchievementsOrganizedSections } from './AchievementsOrganizedSections';

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
        <AchievementsOrganizedSections achievements={achievements} activeCategory={activeCategory} />
      )}
    </div>
  );
};
