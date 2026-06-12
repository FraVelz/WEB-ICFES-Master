'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import { EmptyState } from '@/shared/components/EmptyState';
import type { AchievementCategoryKey } from '@/shared/constants/achievements/achievementCategories';
import { organizeAchievementsForDisplay } from '@/shared/constants/achievements/achievementGrouping';
import { AchievementCategoryFilter } from '@/features/achievements/components/AchievementCategoryFilter';
import { AchievementsOrganizedSections } from '@/features/achievements/components/AchievementsOrganizedSections';
import type { ProfileAchievement } from './achievementProfileTypes';
import { filterProfileVisibleAchievements } from './achievementProfileTypes';

type ProfileAchievementsSectionProps = {
  achievements: ProfileAchievement[];
  loading?: boolean;
  showViewAll?: boolean;
  onViewAll?: () => void;
};

export function ProfileAchievementsSection({
  achievements,
  loading = false,
  showViewAll,
  onViewAll,
}: ProfileAchievementsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<AchievementCategoryKey | 'all'>('all');

  const visibleAchievements = useMemo(
    () => filterProfileVisibleAchievements(achievements),
    [achievements]
  );

  const sections = useMemo(
    () => organizeAchievementsForDisplay(visibleAchievements, activeCategory),
    [visibleAchievements, activeCategory]
  );

  const visibleCount = sections.reduce((sum, section) => sum + section.totalCount, 0);
  const completedCount = achievements.filter((achievement) => achievement.status === 'completed').length;
  const inProgressCount = achievements.filter((achievement) => achievement.status === 'in_progress').length;
  const showSectionLoading = loading && achievements.length === 0;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 w-full rounded-2xl border p-6 shadow-sm',
        'dark:border-surface-border dark:bg-surface-elevated/50'
      )}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-on-surface flex items-center gap-3 text-xl font-bold">
            <Icon name="trophy" className="text-amber-600 dark:text-yellow-400" />
            Logros
          </h2>
          {achievements.length > 0 && (
            <p className="text-on-surface-muted mt-1 text-sm">
              {completedCount} de {achievements.length} desbloqueados
              {inProgressCount > 0 ? ` · ${inProgressCount} en progreso` : ''}
            </p>
          )}
        </div>
        {showViewAll && onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className={cn(
              'text-app-accent-strong hover:text-app-accent dark:text-app-accent',
              'dark:hover:text-app-accent-muted cursor-pointer text-xs font-bold tracking-wider uppercase'
            )}
          >
            Ver página de logros
          </button>
        )}
      </div>

      {achievements.length > 0 && visibleAchievements.length > 0 && (
        <div className="mb-6">
          <AchievementCategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>
      )}

      {showSectionLoading && <LoadingState label="Cargando logros..." layout="section" className="py-6" />}

      {!showSectionLoading && visibleCount > 0 && (
        <AchievementsOrganizedSections
          achievements={visibleAchievements}
          activeCategory={activeCategory}
          density="compact"
        />
      )}

      {!showSectionLoading && achievements.length > 0 && visibleAchievements.length === 0 && (
        <EmptyState
          icon="trophy"
          title="Sin logros en progreso"
          description={
            showViewAll
              ? 'Cuando empieces a avanzar en una meta, aparecerá aquí. El resto está en la página de logros.'
              : 'Este usuario aún no tiene logros completados ni en progreso.'
          }
          className="py-6"
        />
      )}

      {!showSectionLoading && visibleAchievements.length > 0 && visibleCount === 0 && (
        <EmptyState
          icon="trophy"
          title="Nada en esta categoría"
          description="No tienes logros completados ni en progreso en este filtro."
          className="py-6"
        />
      )}

      {!showSectionLoading && achievements.length === 0 && (
        <p className="text-on-surface-muted py-4 text-center text-sm">
          {showViewAll ? 'Completa lecciones para desbloquear logros.' : 'Sin logros desbloqueados aún.'}
        </p>
      )}
    </div>
  );
}
