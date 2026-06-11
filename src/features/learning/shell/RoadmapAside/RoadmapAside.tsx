'use client';

import { useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import { getStageLabel } from '../SecondaryHeader/sectionStageUtils';
import { RoadmapStatsBar } from '../SecondaryHeader/RoadmapStatsBar';
import { AreasModal } from '../SecondaryHeader/AreasModal';
import { StreakModal } from '../SecondaryHeader/StreakModal';
import type { StreakData } from '../SecondaryHeader/StreakModal';

export type SectionProgress = {
  completedLessons: number;
  totalLessons: number;
  studyTimeMinutes: number;
};

type RoadmapAsideProps = {
  currentArea: string;
  currentSection?: PathSection;
  sectionProgress: SectionProgress;
  currentStreak: number;
  coins: number;
  statsLoading?: boolean;
  areasOpen?: boolean;
  streakOpen?: boolean;
  onToggleAreas: () => void;
  onToggleStreak: () => void;
  onCloseModals: () => void;
  onAreaChange: (area: string) => void;
  streakData: StreakData;
  className?: string;
};

function AsideCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'border-surface-border bg-surface-elevated/80 rounded-2xl border p-5 shadow-sm',
        'dark:border-slate-800 dark:bg-slate-900/50'
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-on-surface flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
          <Icon name={icon} className="text-app-accent" size="sm" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function formatStudyTime(minutes: number): string {
  if (minutes <= 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} h ${rest} min` : `${hours} h`;
}

export function RoadmapAside({
  currentArea,
  currentSection,
  sectionProgress,
  currentStreak,
  coins,
  statsLoading = false,
  areasOpen = false,
  streakOpen = false,
  onToggleAreas,
  onToggleStreak,
  onCloseModals,
  onAreaChange,
  streakData,
  className,
}: RoadmapAsideProps) {
  const areaSelectorRef = useRef<HTMLButtonElement>(null);
  const streakButtonRef = useRef<HTMLButtonElement>(null);

  const progressPercent =
    sectionProgress.totalLessons > 0
      ? Math.round((sectionProgress.completedLessons / sectionProgress.totalLessons) * 100)
      : 0;

  return (
    <aside
      className={cn(
        'border-surface-border bg-surface/95 hidden shrink-0 flex-col border-l lg:flex lg:w-[22rem] xl:w-96',
        'sticky top-0 h-dvh overflow-y-auto',
        className
      )}
    >
      <div className="flex flex-col gap-4 p-5">
        <RoadmapStatsBar
          currentArea={currentArea}
          currentStreak={currentStreak}
          coins={coins}
          loading={statsLoading}
          areasOpen={areasOpen}
          streakOpen={streakOpen}
          onToggleAreas={onToggleAreas}
          onToggleStreak={onToggleStreak}
          layout="stacked"
          areaSelectorRef={areaSelectorRef}
          streakButtonRef={streakButtonRef}
        />

        <AsideCard title="Tiempo de estudio" icon="clock">
          <p className="text-on-surface text-3xl font-bold">{formatStudyTime(sectionProgress.studyTimeMinutes)}</p>
          <p className="text-on-surface-muted mt-1 text-sm">
            {currentSection ? getStageLabel(currentSection.id) : 'Fase actual'}
          </p>
          <p className="text-on-surface-muted/80 mt-3 text-xs italic">Plantilla — datos reales próximamente</p>
        </AsideCard>

        <AsideCard
          title="Progreso de la fase"
          icon="chart-line"
          action={
            <span className="text-on-surface-muted text-xs font-semibold">
              {sectionProgress.completedLessons}/{sectionProgress.totalLessons}
            </span>
          }
        >
          <div className="bg-surface-via/80 h-3 overflow-hidden rounded-full">
            <div
              className="bg-app-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-on-surface-muted mt-3 text-sm">
            {progressPercent}% de lecciones completadas en{' '}
            <span className="text-on-surface font-medium">{currentSection?.title ?? 'esta fase'}</span>
          </p>
        </AsideCard>

        <AsideCard title="Resumen rápido" icon="star">
          <ul className="text-on-surface-muted space-y-2 text-sm">
            <li className="flex items-center justify-between gap-2">
              <span>Racha activa</span>
              <span className="text-on-surface font-semibold">{currentStreak} días</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Monedas</span>
              <span className="font-semibold text-yellow-500">{coins}</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Lecciones pendientes</span>
              <span className="text-on-surface font-semibold">
                {Math.max(0, sectionProgress.totalLessons - sectionProgress.completedLessons)}
              </span>
            </li>
          </ul>
          <p className="text-on-surface-muted/80 mt-4 text-xs italic">Plantilla — más métricas próximamente</p>
        </AsideCard>
      </div>

      <AreasModal
        isOpen={areasOpen}
        onClose={onCloseModals}
        currentArea={currentArea}
        onSelectArea={onAreaChange}
        anchorRef={areaSelectorRef}
      />

      <StreakModal isOpen={streakOpen} onClose={onCloseModals} streakData={streakData} anchorRef={streakButtonRef} />
    </aside>
  );
}
