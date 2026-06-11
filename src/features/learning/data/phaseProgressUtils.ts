import type { PathSection } from '@/features/learning/roadmap/AreaPath';
import type { CompetencyPhase } from './competencyPhases';

export type PhaseCardStatus = 'completed' | 'active' | 'upcoming' | 'locked';

export function getSectionProgress(section: PathSection | undefined): {
  completed: number;
  total: number;
  percent: number;
} {
  if (!section || section.nodes.length === 0) {
    return { completed: 0, total: 0, percent: 0 };
  }
  const total = section.nodes.length;
  const completed = section.nodes.filter((n) => n.status === 'completed').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

export function resolvePhaseStatuses(
  phases: CompetencyPhase[],
  sections: PathSection[]
): Map<string, PhaseCardStatus> {
  const statuses = new Map<string, PhaseCardStatus>();
  let foundActive = false;

  for (const phase of phases) {
    const section = sections.find((s) => s.id === phase.sectionId);
    const { percent } = getSectionProgress(section);

    if (percent >= 100 && section && section.nodes.length > 0) {
      statuses.set(phase.id, 'completed');
      continue;
    }

    if (!foundActive) {
      const prevIndex = phase.order - 2;
      const prevPhase = phases[prevIndex];
      const prevSection = prevPhase ? sections.find((s) => s.id === prevPhase.sectionId) : undefined;
      const prevDone =
        !prevPhase || (getSectionProgress(prevSection).percent >= 100 && (prevSection?.nodes.length ?? 0) > 0);

      if (prevDone || phase.order === 1) {
        statuses.set(phase.id, 'active');
        foundActive = true;
        continue;
      }
    }

    statuses.set(phase.id, foundActive ? 'locked' : 'upcoming');
  }

  return statuses;
}
