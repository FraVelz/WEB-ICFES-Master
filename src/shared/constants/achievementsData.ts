import { ACHIEVEMENTS_STUDY_PERFORMANCE } from './achievements/achievementsStudyPerformance';
import { ACHIEVEMENTS_CONSTANCY_METAS } from './achievements/achievementsConstancyMetas';
import { ACHIEVEMENTS_LECTURA } from './achievements/achievementsLectura';
import { ACHIEVEMENTS_PHASES } from './achievements/achievementsPhases';
import { ACHIEVEMENTS_LIGAS } from './achievements/achievementsLigas';
import { ACHIEVEMENTS_REFERRALS } from './achievements/achievementsReferrals';
import { ACHIEVEMENTS_PROFILE_REPORTS, ACHIEVEMENTS_SUPPORT_REPORTS } from './achievements/achievementsReports';
export { ACHIEVEMENT_CATEGORIES, type AchievementCategoryKey } from './achievements/achievementCategories';

export const ACHIEVEMENTS_DATA = [
  ...ACHIEVEMENTS_STUDY_PERFORMANCE,
  ...ACHIEVEMENTS_CONSTANCY_METAS,
  ...ACHIEVEMENTS_LECTURA,
  ...ACHIEVEMENTS_PHASES,
  ...ACHIEVEMENTS_LIGAS,
  ...ACHIEVEMENTS_REFERRALS,
  ...ACHIEVEMENTS_SUPPORT_REPORTS,
  ...ACHIEVEMENTS_PROFILE_REPORTS,
] as const;

/** IDs de logros otorgados al ascender de liga (job semanal). */
const LEAGUE_ACHIEVEMENT_IDS: Record<string, string> = {
  explorador: 'league_explorador',
  aprendiz: 'league_aprendiz',
  competente: 'league_competente',
  avanzado: 'league_avanzado',
  experto: 'league_experto',
  maestro: 'league_maestro',
};
