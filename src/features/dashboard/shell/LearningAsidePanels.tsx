'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getStageLabel } from '@/features/learning/shell/SecondaryHeader/sectionStageUtils';
import { getPracticaHrefForRoadmapArea } from '@/shared/constants';
import { resolveStudyTimeUserId } from '@/services/studyTime';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { AsideCard } from './AsideCard';
import { useDashboardShell } from './DashboardShellContext';
import { computeSectionProgress, findNextLesson, formatStudyTime } from './asidePanelUtils';
import { useStudyTimeStats } from './useStudyTimeStats';
import { AsideAdSlot } from './AsideAdSlot';
import { LearningAsideDonations } from './LearningAsideDonations';

export function LearningAsidePanels() {
  const { currentArea, currentAreaData, currentSection } = useDashboardShell();
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const studyUserId = resolveStudyTimeUserId(user?.uid, demoMode);
  const studyStats = useStudyTimeStats(studyUserId);

  const sectionProgress = useMemo(() => computeSectionProgress(currentSection), [currentSection]);
  const nextLesson = useMemo(() => findNextLesson(currentSection), [currentSection]);
  const areaExamHref = getPracticaHrefForRoadmapArea(currentArea);
  const pendingLessons = Math.max(0, sectionProgress.totalLessons - sectionProgress.completedLessons);

  const studyDetail =
    studyStats.currentSessionMinutes > 0
      ? `Sesión actual: ${formatStudyTime(studyStats.currentSessionMinutes)}`
      : studyStats.longestSessionMinutes > 0
        ? `Mejor sesión: ${formatStudyTime(studyStats.longestSessionMinutes)}`
        : 'Se registra mientras estudias en la ruta o en práctica';

  if (currentArea === 'examen-completo') {
    return (
      <>
        <AsideCard title="Tiempo de estudio" icon="clock">
          <p className="text-on-surface text-3xl font-bold">{formatStudyTime(studyStats.totalMinutes)}</p>
          <p className="text-on-surface-muted mt-1 text-sm">Simulacro integral · todas las áreas</p>
          <p className="text-on-surface-muted mt-3 text-xs leading-relaxed">{studyDetail}</p>
        </AsideCard>

        <AsideAdSlot slot="learning-aside" />

        <LearningAsideDonations />
      </>
    );
  }

  return (
    <>
      <AsideCard title="Tiempo de estudio" icon="clock">
        <p className="text-on-surface text-3xl font-bold">{formatStudyTime(studyStats.totalMinutes)}</p>
        <p className="text-on-surface-muted mt-1 text-sm">
          {currentAreaData.name} · {currentSection ? getStageLabel(currentSection.id) : 'Fase actual'}
        </p>
        <p className="text-on-surface-muted mt-3 text-xs leading-relaxed">{studyDetail}</p>
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
            style={{ width: `${sectionProgress.percent}%` }}
          />
        </div>
        <p className="text-on-surface-muted mt-3 text-sm">
          {sectionProgress.percent}% de lecciones completadas en{' '}
          <span className="text-on-surface font-medium">{currentSection?.title ?? 'esta fase'}</span>
        </p>
        {nextLesson?.title ? (
          <p className="text-on-surface-muted/90 mt-2 text-xs leading-relaxed">
            Siguiente lección: <span className="text-on-surface font-medium">{nextLesson.title}</span>
          </p>
        ) : sectionProgress.totalLessons > 0 && pendingLessons === 0 ? (
          <p className="text-on-surface-muted/90 mt-2 text-xs text-emerald-500">Fase completada en esta área</p>
        ) : null}
      </AsideCard>

      <AsideAdSlot slot="learning-aside" />

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
            Simulacro general
          </Link>
        </AsideCard>
      ) : null}

      <LearningAsideDonations />
    </>
  );
}
