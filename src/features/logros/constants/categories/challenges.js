import { faPlay } from '@fortawesome/free-solid-svg-icons';

export const CHALLENGE_BADGES = {
  WEEKEND_WARRIOR: {
    id: 'WEEKEND_WARRIOR',
    name: 'Guerrero de Fin de Semana',
    icon: faPlay,
    description: 'Completa 5 exámenes en un fin de semana',
    requirement: 'Realiza 5 exámenes de viernes a domingo',
    category: 'desafios'
  },
  MIDNIGHT_SCHOLAR: {
    id: 'MIDNIGHT_SCHOLAR',
    name: 'Erudito Nocturno',
    icon: faPlay,
    description: 'Realiza exámenes después de media noche',
    requirement: 'Completa 3 exámenes después de las 12 AM',
    category: 'desafios'
  },
  EARLY_BIRD: {
    id: 'EARLY_BIRD',
    name: 'Madrugador',
    icon: faPlay,
    description: 'Estudia antes de las 6 AM',
    requirement: 'Completa 5 exámenes antes de las 6 AM',
    category: 'desafios'
  },
  CHALLENGE_ACCEPTED: {
    id: 'CHALLENGE_ACCEPTED',
    name: 'Desafío Aceptado',
    icon: faPlay,
    description: 'Completa un desafío semanal',
    requirement: 'Termina el desafío de la semana',
    category: 'desafios'
  },
  CHALLENGE_MASTER: {
    id: 'CHALLENGE_MASTER',
    name: 'Maestro de Desafíos',
    icon: faPlay,
    description: 'Completa 20 desafíos semanales',
    requirement: 'Termina 20 desafíos semanales',
    category: 'desafios'
  }
};
