'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import type { AreaId } from '@/shared/constants';
import { getPracticaHrefForRoadmapArea } from '@/shared/constants';
import { useDashboardShell } from '@/features/dashboard/shell';
import { COMPETENCY_PHASES, getPhaseSkipExamHref } from '../data/competencyPhases';
import {
  GLOBAL_EXAM_PATH,
  ROUTE_TO_500_PATH,
  getJourneyStepById,
  getJourneyStepForCompetencyPhase,
} from '../data/routeTo500';
import { getSectionProgress, resolvePhaseStatuses } from '../data/phaseProgressUtils';
import { PhaseStageCard } from '../components/phases/PhaseStageCard';
import { usePhaseSkips } from '../hooks/usePhaseSkips';

const areaExamStep = getJourneyStepById('examen-materia');
const globalExamStep = getJourneyStepById('examen-global');

export function LearningPhasesPage() {
  const { currentArea, currentAreaData, sections, pathLoading } = useDashboardShell();
  const { skippedSectionIds } = usePhaseSkips(currentArea);
  const phaseStatuses = resolvePhaseStatuses(COMPETENCY_PHASES, sections, skippedSectionIds);
  const areaExamHref = getPracticaHrefForRoadmapArea(currentArea);

  if (pathLoading && sections.length === 0) {
    return <LoadingState label="Cargando fases..." layout="section" />;
  }

  return (
    <div className="space-y-3 max-sm:px-2">
      <div className="space-y-2">
        <p className="text-on-surface-muted text-sm">
          Recorrido por competencias en <span className="text-on-surface font-medium">{currentAreaData.name}</span>.
          Cambia el área desde el panel lateral.
        </p>
        <Link
          href={ROUTE_TO_500_PATH}
          className={cn(
            'text-app-accent inline-flex items-center gap-1 text-sm font-semibold underline-offset-2 hover:underline',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          <Icon name="map" className="text-xs" />
          ¿Por qué estas fases? Ver ruta al 500
        </Link>
      </div>

      <ul className="space-y-3">
        {COMPETENCY_PHASES.map((phase) => {
          const section = sections.find((s) => s.id === phase.sectionId);
          const { percent } = getSectionProgress(section);
          const status = phaseStatuses.get(phase.id) ?? 'upcoming';
          const skippedByExam = skippedSectionIds.has(phase.sectionId);
          const journeyStep = getJourneyStepForCompetencyPhase(phase.id);

          return (
            <li key={phase.id}>
              <PhaseStageCard
                phase={phase}
                status={status}
                progressPercent={skippedByExam ? 100 : percent}
                lessonCount={section?.nodes.length ?? 0}
                areaFocus={phase.areaFocus[currentArea as AreaId]}
                sectionId={phase.sectionId}
                skipExamHref={getPhaseSkipExamHref(currentArea, phase.sectionId)}
                skippedByExam={skippedByExam}
                performanceLevels={journeyStep?.performanceLevels}
              />
            </li>
          );
        })}
      </ul>

      {areaExamHref && areaExamStep ? (
        <Link
          href={areaExamHref}
          className={cn(
            'border-surface-border bg-surface-elevated/80 flex items-start justify-between gap-3',
            'rounded-2xl border p-4',
            'transition-colors hover:border-amber-500/40 hover:bg-amber-500/5',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          <div className="min-w-0 space-y-1">
            <p className="text-on-surface-muted text-xs font-bold tracking-wide uppercase">Paso 4</p>
            <p className="text-on-surface font-semibold">{areaExamStep.title}</p>
            <p className="text-on-surface-muted text-sm">{areaExamStep.summary}</p>
            <p className="text-amber-300 text-xs font-semibold">{areaExamStep.indicativeScoreLabel}</p>
          </div>
          <Icon name="clipboard-list" className="mt-1 shrink-0 text-amber-400" />
        </Link>
      ) : null}

      {globalExamStep ? (
        <Link
          href={GLOBAL_EXAM_PATH}
          className={cn(
            'border-surface-border bg-surface-elevated/80 flex items-start justify-between gap-3',
            'rounded-2xl border p-4',
            'transition-colors hover:border-purple-500/40 hover:bg-purple-500/5',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
        >
          <div className="min-w-0 space-y-1">
            <p className="text-on-surface-muted text-xs font-bold tracking-wide uppercase">Paso 5</p>
            <p className="text-on-surface font-semibold">{globalExamStep.title}</p>
            <p className="text-on-surface-muted text-sm">{globalExamStep.summary}</p>
            <p className="text-purple-300 text-xs font-semibold">{globalExamStep.indicativeScoreLabel}</p>
          </div>
          <Icon name="brain" className="mt-1 shrink-0 text-purple-400" />
        </Link>
      ) : null}
    </div>
  );
}
