import { faPlay, faBook, faBolt } from '@fortawesome/free-solid-svg-icons';

export const FIRST_STEPS_BADGES = {
  FIRST_QUIZ: {
    id: 'FIRST_QUIZ',
    name: 'Primer Paso',
    icon: faPlay,
    description: 'Completa tu primer examen',
    requirement: 'Realiza 1 examen',
    category: 'primeros_pasos'
  },
  FIVE_QUIZZES: {
    id: 'FIVE_QUIZZES',
    name: 'Aprendiz',
    icon: faBook,
    description: 'Completa 5 exámenes',
    requirement: 'Realiza 5 exámenes',
    category: 'primeros_pasos'
  },
  FIRST_PERFECT: {
    id: 'FIRST_PERFECT',
    name: 'Perfeccionista Primerizo',
    icon: faBook,
    description: 'Obtén 100% en un examen',
    requirement: 'Consigue puntuación perfecta',
    category: 'primeros_pasos'
  },
  FIRST_STREAK_3: {
    id: 'FIRST_STREAK_3',
    name: 'Racha Inicial',
    icon: faBolt,
    description: 'Mantén una racha de 3 días',
    requirement: 'Accede 3 días seguidos',
    category: 'primeros_pasos'
  }
};
