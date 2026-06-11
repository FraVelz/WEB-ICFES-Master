import { ACHIEVEMENTS_STUDY_PERFORMANCE } from './achievements/achievementsStudyPerformance';
import { ACHIEVEMENTS_CONSTANCY_METAS } from './achievements/achievementsConstancyMetas';
import { ACHIEVEMENTS_LECTURA } from './achievements/achievementsLectura';
import { ACHIEVEMENTS_LIGAS } from './achievements/achievementsLigas';

export const ACHIEVEMENTS_DATA = [
  ...ACHIEVEMENTS_STUDY_PERFORMANCE,
  ...ACHIEVEMENTS_CONSTANCY_METAS,
  ...ACHIEVEMENTS_LECTURA,
  ...ACHIEVEMENTS_LIGAS,
] as const;

export const ACHIEVEMENT_CATEGORIES = {
  all: { label: 'Todos', icon: 'star' },
  estudio: { label: 'Estudio', icon: 'book' },
  rendimiento: { label: 'Rendimiento', icon: 'bolt' },
  constancia: { label: 'Constancia', icon: 'fire' },
  metas: { label: 'Metas', icon: 'trophy' },
  lectura: { label: 'Lectura', icon: 'book-open' },
  ligas: { label: 'Ligas', icon: 'trophy' },
} as const;

/** IDs de logros otorgados al ascender de liga (job semanal). */
export const LEAGUE_ACHIEVEMENT_IDS: Record<string, string> = {
  explorador: 'league_explorador',
  aprendiz: 'league_aprendiz',
  competente: 'league_competente',
  avanzado: 'league_avanzado',
  experto: 'league_experto',
  maestro: 'league_maestro',
};

export type AchievementCategoryKey = keyof typeof ACHIEVEMENT_CATEGORIES;
