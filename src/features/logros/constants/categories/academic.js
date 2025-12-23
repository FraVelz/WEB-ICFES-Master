import { faGraduationCap, faTrophy, faMedal, faBullseye, faMagic, faStar } from '@fortawesome/free-solid-svg-icons';

export const ACADEMIC_BADGES = {
  TEN_QUIZZES: {
    id: 'TEN_QUIZZES',
    name: 'Estudiante Dedicado',
    icon: faGraduationCap,
    description: 'Completa 10 exámenes',
    requirement: 'Realiza 10 exámenes',
    category: 'logros'
  },
  FIFTY_QUIZZES: {
    id: 'FIFTY_QUIZZES',
    name: 'Maestro de Pruebas',
    icon: faTrophy,
    description: 'Completa 50 exámenes',
    requirement: 'Realiza 50 exámenes',
    category: 'logros'
  },
  HUNDRED_QUIZZES: {
    id: 'HUNDRED_QUIZZES',
    name: 'Centinela del Conocimiento',
    icon: faMedal,
    description: 'Completa 100 exámenes',
    requirement: 'Realiza 100 exámenes',
    category: 'logros'
  },
  PERFECT_5: {
    id: 'PERFECT_5',
    name: 'Precisión',
    icon: faBullseye,
    description: '5 exámenes con 100%',
    requirement: 'Obtén 5 puntuaciones perfectas',
    category: 'logros'
  },
  PERFECT_10: {
    id: 'PERFECT_10',
    name: 'Impecable',
    icon: faMagic,
    description: '10 exámenes con 100%',
    requirement: 'Obtén 10 puntuaciones perfectas',
    category: 'logros'
  },
  PERFECT_25: {
    id: 'PERFECT_25',
    name: 'Virtuoso',
    icon: faStar,
    description: '25 exámenes con 100%',
    requirement: 'Obtén 25 puntuaciones perfectas',
    category: 'logros'
  },
  TWO_HUNDRED_QUIZZES: {
    id: 'TWO_HUNDRED_QUIZZES',
    name: 'Leyenda Académica',
    icon: faTrophy,
    description: 'Completa 200 exámenes',
    requirement: 'Realiza 200 exámenes',
    category: 'logros'
  },
  FIVE_HUNDRED_QUIZZES: {
    id: 'FIVE_HUNDRED_QUIZZES',
    name: 'Coloso del Aprendizaje',
    icon: faMedal,
    description: 'Completa 500 exámenes',
    requirement: 'Realiza 500 exámenes',
    category: 'logros'
  },
  PERFECT_50: {
    id: 'PERFECT_50',
    name: 'Perfeccionista Supremo',
    icon: faMagic,
    description: '50 exámenes con 100%',
    requirement: 'Obtén 50 puntuaciones perfectas',
    category: 'logros'
  },
  AVERAGE_95: {
    id: 'AVERAGE_95',
    name: 'Excelencia Académica',
    icon: faStar,
    description: 'Promedio de 95%+ en 20 exámenes',
    requirement: 'Mantén 95%+ durante 20 exámenes',
    category: 'logros'
  },
  PERFECT_WEEK: {
    id: 'PERFECT_WEEK',
    name: 'Semana Impecable',
    icon: faBullseye,
    description: '7 días de exámenes perfectos',
    requirement: 'Obtén 100% en 7 exámenes consecutivos',
    category: 'logros'
  },
  MASTER_ALL_SUBJECTS: {
    id: 'MASTER_ALL_SUBJECTS',
    name: 'Maestro Universal',
    icon: faGraduationCap,
    description: '90%+ en todas las materias',
    requirement: 'Promedio 90%+ en Matemática, Lenguaje, Ciencias y Sociales',
    category: 'logros'
  },
  THOUSAND_QUIZZES: {
    id: 'THOUSAND_QUIZZES',
    name: 'Campeón Eterno',
    icon: faTrophy,
    description: 'Completa 1000 exámenes',
    requirement: 'Realiza 1000 exámenes',
    category: 'logros'
  }
};
