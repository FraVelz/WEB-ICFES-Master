'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { getStageLabel } from '@/features/learning/shell/SecondaryHeader/sectionStageUtils';
import type { PathNodeData, PathSection } from '@/features/learning/roadmap/AreaPath';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';

function formatStudyTime(minutes: number): string {
  if (minutes <= 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} h ${rest} min` : `${hours} h`;
}

function computeSectionProgress(section: PathSection | undefined) {
  if (!section) {
    return { completedLessons: 0, totalLessons: 0, studyTimeMinutes: 0, percent: 0 };
  }
  const totalLessons = section.nodes.length;
  const completedLessons = section.nodes.filter((n: PathNodeData) => n.status === 'completed').length;
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  return { completedLessons, totalLessons, studyTimeMinutes: 0, percent };
}

export function LearningAsidePanels() {
  const { currentSection, currentStreak, coins } = useDashboardShell();
  const sectionProgress = useMemo(() => computeSectionProgress(currentSection), [currentSection]);

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
    </>
  );
}

export function AchievementsAsidePanels() {
  const { currentStreak, coins } = useDashboardShell();

  return (
    <>
      <AsideCard title="Tu progreso XP" icon="star">
        <p className="text-on-surface-muted text-sm">
          Completa retos en la ruta y simulacros para desbloquear medallas y subir de nivel.
        </p>
        <ul className="text-on-surface-muted mt-4 space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>Racha</span>
            <span className="text-on-surface font-semibold">{currentStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Monedas</span>
            <span className="font-semibold text-yellow-500">{coins}</span>
          </li>
        </ul>
      </AsideCard>

      <AsideCard title="Consejo" icon="lightbulb">
        <p className="text-on-surface-muted text-sm leading-relaxed">
          Prioriza logros de racha y de etapa: mantener constancia suele dar más XP que intentar todo de una vez.
        </p>
      </AsideCard>

      <AsideCard title="Ir a la ruta" icon="graduation-cap">
        <Link
          href="/ruta-aprendizaje"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold',
            'bg-app-accent text-white transition-colors hover:brightness-110',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Continuar aprendiendo
          <Icon name="chevron-right" size="sm" />
        </Link>
      </AsideCard>
    </>
  );
}

export function LeaderboardAsidePanels() {
  const { currentStreak, coins } = useDashboardShell();

  return (
    <>
      <AsideCard title="Liga semanal" icon="trophy">
        <p className="text-on-surface-muted text-sm leading-relaxed">
          Compite en grupos de estudiantes. Los mejores ascienden de liga cada lunes.
        </p>
        <p className="text-on-surface-muted/80 mt-3 text-xs italic">Detalle de tu grupo en el panel central.</p>
      </AsideCard>

      <AsideCard title="Tu energía" icon="fire">
        <ul className="text-on-surface-muted space-y-2 text-sm">
          <li className="flex justify-between gap-2">
            <span>Racha activa</span>
            <span className="font-semibold text-orange-500">{currentStreak} días</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Monedas</span>
            <span className="font-semibold text-yellow-500">{coins}</span>
          </li>
        </ul>
      </AsideCard>

      <AsideCard title="Simulacro" icon="brain">
        <Link
          href="/examen-completo"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold',
            'border-purple-500/40 text-purple-300 transition-colors hover:bg-purple-500/10',
            'focus-visible:ring-purple-400 focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Examen general
        </Link>
      </AsideCard>
    </>
  );
}

export function LecturaAsidePanels() {
  const { currentStreak } = useDashboardShell();

  return (
    <>
      <AsideCard title="Lectura guiada" icon="book-open">
        <p className="text-on-surface-muted text-sm leading-relaxed">
          Material de solo lectura sobre el ICFES, el bachillerato y cómo prepararte sin presión de examen.
        </p>
      </AsideCard>

      <AsideCard title="Tu constancia" icon="fire">
        <p className="text-on-surface text-2xl font-bold">{currentStreak} días</p>
        <p className="text-on-surface-muted mt-1 text-sm">Racha activa mientras estudias en la app</p>
      </AsideCard>

      <AsideCard title="Practicar" icon="graduation-cap">
        <Link
          href="/ruta-aprendizaje"
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold',
            'bg-app-accent text-white transition-colors hover:brightness-110',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          Ir a aprendizaje
        </Link>
      </AsideCard>
    </>
  );
}

export function DashboardShellAsidePanels() {
  const { shellSection } = useDashboardShell();

  switch (shellSection) {
    case 'learning':
      return <LearningAsidePanels />;
    case 'achievements':
      return <AchievementsAsidePanels />;
    case 'leaderboard':
      return <LeaderboardAsidePanels />;
    case 'lectura':
      return <LecturaAsidePanels />;
    default:
      return null;
  }
}
