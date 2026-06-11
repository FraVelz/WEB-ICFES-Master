'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import { sortAchievementsForProfile, type ProfileAchievement } from './achievementProfileTypes';
import { AchievementGridTile, AchievementDetailRow } from './AchievementProfileTiles';

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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const sortedAchievements = sortAchievementsForProfile(achievements);
  const visibleAchievements = sortedAchievements.slice(0, 9);
  const completedCount = achievements.filter((achievement) => achievement.status === 'completed').length;
  const showSectionLoading = loading && achievements.length === 0;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface-elevated/80 sticky top-24 rounded-2xl border p-6 shadow-sm',
        'dark:border-surface-border dark:bg-surface-elevated/50'
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-on-surface flex items-center gap-3 text-xl font-bold">
            <Icon name="trophy" className="text-amber-600 dark:text-yellow-400" />
            Logros
          </h2>
          {achievements.length > 0 && (
            <p className="text-on-surface-muted mt-1 text-xs">
              {completedCount} de {achievements.length} desbloqueados
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
            Ver todos
          </button>
        )}
      </div>

      {showSectionLoading && <LoadingState label="Cargando logros..." layout="section" className="py-6" />}

      {!showSectionLoading && visibleAchievements.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {visibleAchievements.map((achievement) => (
              <AchievementGridTile key={achievement.id} achievement={achievement} />
            ))}
          </div>

          <p className="text-on-surface-muted mt-3 hidden text-center text-[11px] md:block">
            Pasa el cursor sobre un icono para ver el detalle.
          </p>

          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            aria-expanded={detailsOpen}
            className={cn(
              'border-surface-border bg-surface-via/60 text-on-surface mt-4 flex w-full cursor-pointer items-center',
              'hover:bg-surface-via justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold',
              'focus-visible:ring-app-accent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
              'focus-visible:ring-offset-surface dark:border-surface-border focus-visible:outline-none',
              'dark:bg-surface-overlay/60 dark:hover:bg-surface-overlay md:mt-3'
            )}
          >
            <Icon name={detailsOpen ? 'chevron-up' : 'info-circle'} size="sm" />
            {detailsOpen ? 'Ocultar detalles' : 'Más información'}
          </button>

          {detailsOpen && (
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1 md:max-h-96">
              {visibleAchievements.map((achievement) => (
                <AchievementDetailRow key={achievement.id} achievement={achievement} />
              ))}
            </ul>
          )}
        </>
      )}

      {!showSectionLoading && achievements.length === 0 && (
        <p className="text-on-surface-muted py-4 text-center text-sm">
          {showViewAll ? 'Completa lecciones para desbloquear logros.' : 'Sin logros desbloqueados aún.'}
        </p>
      )}
    </div>
  );
}
