/** Formato legible de minutos acumulados (p. ej. perfil). */
export function formatStudyTime(totalMinutes: number): string {
  const minutes = Math.max(0, Math.floor(totalMinutes));
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function secondsToDisplayMinutes(totalSeconds: number): number {
  return Math.floor(Math.max(0, totalSeconds) / 60);
}
