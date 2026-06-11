'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getStageLabel } from '@/features/learning/shell/SecondaryHeader/sectionStageUtils';
import { getPracticaHrefForRoadmapArea } from '@/shared/constants';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';
import { computeSectionProgress, formatStudyTime } from './asidePanelUtils';

export function LearningAsidePanels() {
  const { currentArea, currentAreaData, currentSection, currentStreak, coins } = useDashboardShell();
  const sectionProgress = useMemo(() => computeSectionProgress(currentSection), [currentSection]);
  const areaExamHref = getPracticaHrefForRoadmapArea(currentArea);

  return (
    <>
      <AsideCard title="Tiempo de estudio" icon="clock">
        <p className="text-on-surface text-3xl font-bold">{formatStudyTime(sectionProgress.studyTimeMinutes)}</p>
        <p className="text-on-surface-muted mt-1 text-sm">
          {currentSection ? getStageLabel(currentSection.id) : 'Etapa actual'}
        </p>
        <p className="text-on-surface-muted/80 mt-3 text-xs italic">Plantilla — datos reales próximamente</p>
      </AsideCard>

      <AsideCard
        title="Progreso de la etapa"
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
            style={{ width: `${sectionProgress.percent}%` }}
          />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          {sectionProgress.percent}% de lecciones completadas en{' '}
          <span className="text-on-surface font-medium">{currentSection?.title ?? 'esta etapa'}</span>
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
      </AsideCard>

      {areaExamHref ? (
        <AsideCard title="Simulacro" icon="brain">
          <p className="text-on-surface-muted mb-3 text-xs leading-relaxed">Simulacro de {currentAreaData.name}</p>
          <Link
            href={areaExamHref}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold',
              'border-purple-500/40 text-purple-300 transition-colors hover:bg-purple-500/10',
              'focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none'
            )}
          >
            Examen general
          </Link>
        </AsideCard>
      ) : null}
    </>
  );
}
