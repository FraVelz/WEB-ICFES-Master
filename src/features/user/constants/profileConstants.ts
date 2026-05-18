export const QUICK_STATS = [
  {
    label: 'Racha',
    value: (streak: number) => `${streak}d`,
    icon: 'fire',
    color: 'from-stat-streak-from to-stat-streak-to',
  },
  {
    label: 'Precisión',
    value: (accuracy: number) => `${accuracy}%`,
    icon: 'bullseye',
    color: 'from-stat-accuracy-from to-stat-accuracy-to',
  },
  {
    label: 'Horas',
    value: (hours: number) => `${hours}h`,
    icon: 'clock',
    color: 'from-stat-hours-from to-stat-hours-to',
  },
  {
    label: 'XP Hoy',
    value: (xp: number) => Math.floor(xp),
    icon: 'zap',
    color: 'from-stat-xp-from to-stat-xp-to',
  },
];

export const NAVIGATION_CARDS = [
  {
    id: 'learning-roadmap',
    title: 'Tu Ruta de Aprendizaje',
    description: 'Aprende de forma estructurada por niveles y áreas',
    icon: 'map',
    color: 'from-nav-roadmap-from to-nav-roadmap-to',
    link: '/ruta-aprendizaje',
    badge: 'Nueva',
  },
  {
    id: 'daily-challenges',
    title: 'Desafíos Diarios',
    description: 'Completa retos para ganar XP y bonificaciones',
    icon: 'fire',
    color: 'from-nav-challenges-from to-nav-challenges-to',
    link: '/desafios-diarios',
    badge: null,
  },
];

export const AREA_ICONS = {
  matematicas: { icon: 'calculator', color: 'text-profile-math-icon' },
  lenguaje: { icon: 'book', color: 'text-profile-lc-icon' },
  ciencias: { icon: 'flask', color: 'text-profile-sci-icon' },
  sociales: { icon: 'globe', color: 'text-profile-soc-icon' },
};

export const TABS = [
  { id: 'profile', label: 'Perfil', icon: 'check-circle' },
  { id: 'dashboard', label: 'Tu Tablero', icon: 'chart-line' },
  { id: 'progress', label: 'Progreso', icon: 'award' },
];

export const RECOMMENDED_SESSIONS = [
  {
    area: 'Matemáticas',
    nivel: 'Intermedio Alto',
    tiempo: '45 min',
    puntos: 200,
  },
  {
    area: 'Lectura Crítica',
    nivel: 'Intermedio',
    tiempo: '30 min',
    puntos: 150,
  },
  {
    area: 'Ciencias Naturales',
    nivel: 'Intermedio Alto',
    tiempo: '50 min',
    puntos: 180,
  },
];

export const ICON_COLORS = [
  'text-icon-wash-1',
  'text-icon-wash-2',
  'text-icon-wash-3',
  'text-icon-wash-4',
];
