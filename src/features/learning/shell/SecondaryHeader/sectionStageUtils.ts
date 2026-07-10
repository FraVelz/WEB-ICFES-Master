import type { PathSection } from '@/features/learning/roadmap/AreaPath';

const STAGE_NUMBERS: Record<string, number> = {
  facil: 1,
  intermedio: 2,
  dificil: 3,
};

function getStageNumber(sectionId: string): number {
  return STAGE_NUMBERS[sectionId] ?? 1;
}

export function getStageLabel(sectionId: string): string {
  return `Fase ${getStageNumber(sectionId)}`;
}

/** Primera sección con lecciones disponibles; si no hay, la primera cargada. */
export function pickDefaultSectionId(sections: PathSection[]): string | undefined {
  if (sections.length === 0) return undefined;
  const withCurrent = sections.find((s) => s.nodes.some((n) => n.status === 'current'));
  return withCurrent?.id ?? sections[0]?.id;
}
