import { faFire, faStar, faCrown, faGem } from '@fortawesome/free-solid-svg-icons';

export const STREAK_BADGES = {
  STREAK_7: {
    id: 'STREAK_7',
    name: 'Semana de Fuego',
    icon: faFire,
    description: 'Racha de 7 días consecutivos',
    requirement: 'Accede durante 7 días seguidos',
    category: 'streak'
  },
  STREAK_30: {
    id: 'STREAK_30',
    name: 'Campeón Mensual',
    icon: faStar,
    description: 'Racha de 30 días consecutivos',
    requirement: 'Accede durante 30 días seguidos',
    category: 'streak'
  },
  STREAK_100: {
    id: 'STREAK_100',
    name: 'Leyenda de Rachas',
    icon: faCrown,
    description: 'Racha de 100 días consecutivos',
    requirement: 'Accede durante 100 días seguidos',
    category: 'streak'
  },
  STREAK_365: {
    id: 'STREAK_365',
    name: 'Dedicado por un Año',
    icon: faGem,
    description: 'Racha de 365 días consecutivos',
    requirement: 'Accede durante 365 días seguidos',
    category: 'streak'
  }
};
