const BOGOTA_TZ = 'America/Bogota';

function getBogotaDateParts(date: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BOGOTA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return {
    year: Number(parts.find((p) => p.type === 'year')?.value ?? 0),
    month: Number(parts.find((p) => p.type === 'month')?.value ?? 1),
    day: Number(parts.find((p) => p.type === 'day')?.value ?? 1),
  };
}

/** Semana ISO (año + número) a partir de fecha calendario en Bogotá. */
function getIsoWeekParts(year: number, month: number, day: number): { isoYear: number; isoWeek: number } {
  const utc = new Date(Date.UTC(year, month - 1, day));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const isoYear = utc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const isoWeek = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { isoYear, isoWeek };
}

/** Semana ISO en zona Bogotá, ej. `2026-W24`. */
export function getIsoWeekId(date = new Date()): string {
  const { year, month, day } = getBogotaDateParts(date);
  const { isoYear, isoWeek } = getIsoWeekParts(year, month, day);
  return `${isoYear}-W${String(isoWeek).padStart(2, '0')}`;
}

/** Próximo lunes 00:00 en Bogotá (inicio del reset semanal). */
export function getNextMondayResetAt(now = new Date()): Date {
  const bogotaNow = new Date(now.toLocaleString('en-US', { timeZone: BOGOTA_TZ }));
  const day = bogotaNow.getDay();
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : 8 - day;

  const target = new Date(bogotaNow);
  target.setDate(bogotaNow.getDate() + daysUntilMonday);
  target.setHours(0, 0, 0, 0);

  const offsetMs = now.getTime() - bogotaNow.getTime();
  return new Date(target.getTime() + offsetMs);
}

export function getMsUntilNextMondayReset(now = new Date()): number {
  return Math.max(0, getNextMondayResetAt(now).getTime() - now.getTime());
}

export function formatCountdownToReset(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
