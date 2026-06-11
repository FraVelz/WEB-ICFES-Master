'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { LoadingState } from '@/shared/components/LoadingState';
import type { AreaId } from '@/shared/constants';
import { useDashboardShell } from '@/features/dashboard/shell';
import { COMPETENCY_PHASES } from '../data/competencyPhases';
import { getSectionProgress, resolvePhaseStatuses } from '../data/phaseProgressUtils';
import { useLearningPath } from '../hooks/useLearningPath';
import { PhaseStageCard } from '../components/phases/PhaseStageCard';

export function LearningPhasesPage() {
  const { currentArea, currentAreaData, pathLoading } = useDashboardShell();
  const { sections, loading } = useLearningPath(currentArea);
  const phaseStatuses = resolvePhaseStatuses(COMPETENCY_PHASES, sections);

  if (loading || pathLoading) {
    return <LoadingState label="Cargando fases..." layout="section" />;
  }

  return (
    <div className="space-y-3">
      <p className="text-on-surface-muted text-sm">
        Recorrido por competencias en <span className="text-on-surface font-medium">{currentAreaData.name}</span>.
        Cambia el área desde el panel lateral.
      </p>

      <ul className="space-y-3">
        {COMPETENCY_PHASES.map((phase) => {
          const section = sections.find((s) => s.id === phase.sectionId);
          const { percent } = getSectionProgress(section);

          return (
            <li key={phase.id}>
              <PhaseStageCard
                phase={phase}
                status={phaseStatuses.get(phase.id) ?? 'upcoming'}
                progressPercent={percent}
                lessonCount={section?.nodes.length ?? 0}
                areaFocus={phase.areaFocus[currentArea as AreaId]}
                sectionId={phase.sectionId}
              />
            </li>
          );
        })}
      </ul>

      <Link
        href="/examen-completo"
        className={cn(
          'border-surface-border bg-surface-elevated/80 flex items-center justify-between gap-3 rounded-2xl border p-4',
          'transition-colors hover:border-purple-500/40 hover:bg-purple-500/5',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
        )}
      >
        <div className="min-w-0">
          <p className="text-on-surface font-semibold">Examen general</p>
          <p className="text-on-surface-muted text-sm">Simulacro completo de todas las áreas</p>
        </div>
        <Icon name="brain" className="text-purple-400 shrink-0" />
      </Link>
    </div>
  );
}
