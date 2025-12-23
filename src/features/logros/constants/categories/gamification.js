import { faPlay } from '@fortawesome/free-solid-svg-icons';

export const GAMIFICATION_BADGES = {
  BADGE_COLLECTOR: {
    id: 'BADGE_COLLECTOR',
    name: 'Coleccionista de Insignias',
    icon: faPlay,
    description: 'Desbloquea 25 insignias',
    requirement: 'Desbloquea 25 logros diferentes',
    category: 'gamification'
  },
  BADGE_COLLECTOR_ELITE: {
    id: 'BADGE_COLLECTOR_ELITE',
    name: 'Coleccionista Élite',
    icon: faPlay,
    description: 'Desbloquea 50 insignias',
    requirement: 'Desbloquea 50 logros diferentes',
    category: 'gamification'
  },
  BADGE_COLLECTOR_MASTER: {
    id: 'BADGE_COLLECTOR_MASTER',
    name: 'Maestro Coleccionista',
    icon: faPlay,
    description: 'Desbloquea todas las insignias',
    requirement: 'Desbloquea todos los logros disponibles',
    category: 'gamification'
  },
  STREAK_MASTER: {
    id: 'STREAK_MASTER',
    name: 'Maestro de Rachas',
    icon: faPlay,
    description: 'Mantén 3 rachas diferentes activas',
    requirement: 'Alcanza 3 rachas distintas simultáneamente',
    category: 'gamification'
  },
  PERFECT_WEEK: {
    id: 'PERFECT_WEEK',
    name: 'Semana Perfecta',
    icon: faPlay,
    description: '7 días de 90%+ promedio',
    requirement: 'Obtén 90%+ cada día durante una semana',
    category: 'gamification'
  },
  PERFECT_MONTH: {
    id: 'PERFECT_MONTH',
    name: 'Mes Perfecto',
    icon: faPlay,
    description: '30 días de 90%+ promedio',
    requirement: 'Obtén 90%+ cada día durante un mes',
    category: 'gamification'
  },
  COMEBACK_STORY: {
    id: 'COMEBACK_STORY',
    name: 'Historia de Regreso',
    icon: faPlay,
    description: 'Recuperar después de 3 fallos seguidos',
    requirement: 'Obtén 100% después de 3 exámenes con <50%',
    category: 'gamification'
  },
  VERSATILE_SCHOLAR: {
    id: 'VERSATILE_SCHOLAR',
    name: 'Erudito Versátil',
    icon: faPlay,
    description: 'Alterna entre diferentes áreas exitosamente',
    requirement: 'Obtén 85%+ en 4 áreas diferentes',
    category: 'gamification'
  },
  VERSATILE_MASTER: {
    id: 'VERSATILE_MASTER',
    name: 'Maestro Versátil',
    icon: faPlay,
    description: 'Desbloquea logros en todas las categorías',
    requirement: 'Obtén al menos 1 logro de cada categoría',
    category: 'gamification'
  },
  SCORE_BOOSTER: {
    id: 'SCORE_BOOSTER',
    name: 'Impulsador de Puntuación',
    icon: faPlay,
    description: 'Obtén 3 bonificaciones de XP en una sesión',
    requirement: 'Alcanza 3 multiplicadores de XP en un día',
    category: 'gamification'
  },
  COMBO_KING: {
    id: 'COMBO_KING',
    name: 'Rey de Combos',
    icon: faPlay,
    description: 'Crea una cadena de 5 logros en una semana',
    requirement: 'Desbloquea 5 logros en 7 días consecutivos',
    category: 'gamification'
  },
  LEADERBOARD_CHAMPION: {
    id: 'LEADERBOARD_CHAMPION',
    name: 'Campeón de Clasificación',
    icon: faPlay,
    description: 'Lidera el ranking semanal',
    requirement: 'Obtén la puntuación más alta en la semana',
    category: 'gamification'
  },
  REWARD_HUNTER: {
    id: 'REWARD_HUNTER',
    name: 'Cazador de Recompensas',
    icon: faPlay,
    description: 'Acumula 100000 puntos totales',
    requirement: 'Gana 100000 puntos de experiencia en total',
    category: 'gamification'
  },
  CHALLENGE_DOMINATOR: {
    id: 'CHALLENGE_DOMINATOR',
    name: 'Dominador de Desafíos',
    icon: faPlay,
    description: 'Completa 25 desafíos especiales',
    requirement: 'Finaliza 25 desafíos de gamificación',
    category: 'gamification'
  }
};
