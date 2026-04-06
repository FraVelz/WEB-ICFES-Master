export const QUICK_STATS = [
  {
    label: 'Racha',
    value: (streak: number) => `${streak}d`,
    icon: 'fire',
    color: 'from-red-600 to-orange-600',
  },
  {
    label: 'Precisión',
    value: (accuracy: number) => `${accuracy}%`,
    icon: 'bullseye',
    color: 'from-green-600 to-emerald-600',
  },
  {
    label: 'Horas',
    value: (hours: number) => `${hours}h`,
    icon: 'clock',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    label: 'XP Hoy',
    value: (xp: number) => Math.floor(xp),
    icon: 'zap',
    color: 'from-purple-600 to-pink-600',
  },
];

export const NAVIGATION_CARDS = [
  {
    id: 'learning-roadmap',
    title: 'Tu Ruta de Aprendizaje',
    description: 'Aprende de forma estructurada por niveles y áreas',
    icon: 'map',
    color: 'from-blue-600 to-blue-400',
    link: '/ruta-aprendizaje',
    badge: 'Nueva',
  },
  {
    id: 'daily-challenges',
    title: 'Desafíos Diarios',
    description: 'Completa retos para ganar XP y bonificaciones',
    icon: 'fire',
    color: 'from-orange-600 to-red-400',
    link: '/desafios-diarios',
    badge: null,
  },
];

export const AREA_ICONS = {
  matematicas: { icon: 'calculator', color: 'text-yellow-400' },
  lenguaje: { icon: 'book', color: 'text-blue-400' },
  ciencias: { icon: 'flask', color: 'text-green-400' },
  sociales: { icon: 'globe', color: 'text-orange-400' },
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

export const ICON_COLORS = ['text-cyan-400', 'text-orange-400', 'text-yellow-400', 'text-pink-400'];
