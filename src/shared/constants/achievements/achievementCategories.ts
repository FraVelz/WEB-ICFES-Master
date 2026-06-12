export const ACHIEVEMENT_CATEGORIES = {
  all: { label: 'Todos', icon: 'star' },
  estudio: { label: 'Estudio', icon: 'book' },
  fases: { label: 'Fases', icon: 'tasks' },
  rendimiento: { label: 'Rendimiento', icon: 'bolt' },
  constancia: { label: 'Constancia', icon: 'fire' },
  metas: { label: 'Metas', icon: 'trophy' },
  lectura: { label: 'Lectura', icon: 'book-open' },
  ligas: { label: 'Ligas', icon: 'trophy' },
} as const;

export type AchievementCategoryKey = keyof typeof ACHIEVEMENT_CATEGORIES;
