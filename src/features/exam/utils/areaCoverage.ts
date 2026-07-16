/** Helpers de cobertura del banco (preguntas publicadas) por área. */

export function formatPublishedCoverageLabel(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return 'Sin preguntas publicadas';
  if (count === 1) return '1 pregunta publicada';
  return `${count} preguntas publicadas`;
}

export function isAreaCoverageEmpty(count: number | undefined | null): boolean {
  return !Number.isFinite(count) || (count ?? 0) <= 0;
}

export function zeroCoverageForAreas(areaIds: readonly string[]): Record<string, number> {
  return Object.fromEntries(areaIds.map((id) => [id, 0]));
}
