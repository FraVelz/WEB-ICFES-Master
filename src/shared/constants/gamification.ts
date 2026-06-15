/** Saldo inicial de monedas (demo y cuenta nueva). */
export const STARTING_COINS_BALANCE = 100;

/** Jugadores por cohorte dentro de cada liga. */
export const LEAGUE_GROUP_SIZE = 30;

/** Ligas semanales pausadas en UI hasta reactivar el torneo en producción. */
export const LEAGUES_TEMPORARILY_DISABLED = true;

export const LEAGUES_DISABLED_MESSAGE =
  'Las ligas semanales están deshabilitadas temporalmente. Volverán pronto.';

/** XP por respuesta correcta en práctica. */
export const PRACTICE_XP_PER_CORRECT = 10;

/** XP base al completar un simulacro ICFES completo. */
export const FULL_EXAM_COMPLETION_XP = 200;

/** Bonus XP por cada respuesta correcta en simulacro completo. */
export const FULL_EXAM_XP_PER_CORRECT = 5;

const WEEKLY_XP_EXCLUDED_REASONS = ['demo_migration'] as const;

/** Indica si un motivo de XP debe sumar al ranking semanal de ligas. */
export function countsForWeeklyLeagueXp(reason: string): boolean {
  if (WEEKLY_XP_EXCLUDED_REASONS.includes(reason as (typeof WEEKLY_XP_EXCLUDED_REASONS)[number])) {
    return false;
  }
  if (reason.startsWith('achievement_') || reason.startsWith('league_')) {
    return false;
  }
  return reason.startsWith('lesson_quiz_') || reason.startsWith('practice_') || reason.startsWith('exam_');
}
