import { ACHIEVEMENTS_STUDY_PERFORMANCE } from './achievements/achievementsStudyPerformance';
import { ACHIEVEMENTS_CONSTANCY_METAS } from './achievements/achievementsConstancyMetas';
import { ACHIEVEMENTS_LECTURA } from './achievements/achievementsLectura';
import { ACHIEVEMENTS_PHASES } from './achievements/achievementsPhases';
import { ACHIEVEMENTS_LIGAS } from './achievements/achievementsLigas';
export { ACHIEVEMENT_CATEGORIES, type AchievementCategoryKey } from './achievements/achievementCategories';

export const ACHIEVEMENTS_DATA = [
  ...ACHIEVEMENTS_STUDY_PERFORMANCE,
  ...ACHIEVEMENTS_CONSTANCY_METAS,
  ...ACHIEVEMENTS_LECTURA,
  ...ACHIEVEMENTS_PHASES,
  ...ACHIEVEMENTS_LIGAS,
] as const;

/** IDs de logros otorgados al ascender de liga (job semanal). */
export const LEAGUE_ACHIEVEMENT_IDS: Record<string, string> = {
  explorador: 'league_explorador',
  aprendiz: 'league_aprendiz',
  competente: 'league_competente',
  avanzado: 'league_avanzado',
  experto: 'league_experto',
  maestro: 'league_maestro',
};
