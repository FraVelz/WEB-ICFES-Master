import { faStar, faCrown, faBolt, faChartLine } from '@fortawesome/free-solid-svg-icons';

export const EXCELLENCE_BADGES = {
  NINETY_PERCENT: {
    id: 'NINETY_PERCENT',
    name: 'Excelencia',
    icon: faStar,
    description: 'Promedio de 90% o superior',
    requirement: 'Mantén promedio de 90% en 10 exámenes',
    category: 'excelencia'
  },
  MASTER_ALL_AREAS: {
    id: 'MASTER_ALL_AREAS',
    name: 'Maestro Integral',
    icon: faCrown,
    description: 'Domina todas las áreas',
    requirement: 'Obtén 90%+ en todas las áreas',
    category: 'excelencia'
  },
  SPEED_DEMON: {
    id: 'SPEED_DEMON',
    name: 'Rayo Veloz',
    icon: faBolt,
    description: 'Completa examen en tiempo récord',
    requirement: 'Completa un examen en menos de 10 min',
    category: 'excelencia'
  },
  CONSISTENCY_CHAMPION: {
    id: 'CONSISTENCY_CHAMPION',
    name: 'Campeón de Consistencia',
    icon: faChartLine,
    description: 'Nunca bajes de 85% en 20 exámenes',
    requirement: 'Promedio de 85%+ en 20 exámenes',
    category: 'excelencia'
  }
};
