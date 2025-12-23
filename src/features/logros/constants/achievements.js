import { 
  faBook, 
  faBrain, 
  faFire, 
  faTrophy, 
  faStar, 
  faBolt,
  faGraduationCap,
  faClock
} from '@fortawesome/free-solid-svg-icons';

export const ACHIEVEMENTS_DATA = [
  {
    id: 'study_1',
    category: 'estudio',
    title: 'Primeros Pasos',
    description: 'Completa tus primeras 5 lecciones',
    icon: faBook,
    target: 5,
    xpReward: 100,
    coinsReward: 50
  },
  {
    id: 'study_2',
    category: 'estudio',
    title: 'Estudiante Dedicado',
    description: 'Completa 20 lecciones',
    icon: faGraduationCap,
    target: 20,
    xpReward: 500,
    coinsReward: 200
  },
  {
    id: 'perf_1',
    category: 'rendimiento',
    title: 'Mente Brillante',
    description: 'Obtén 100% en un examen',
    icon: faBrain,
    target: 1,
    xpReward: 300,
    coinsReward: 150
  },
  {
    id: 'const_1',
    category: 'constancia',
    title: 'Racha de Fuego',
    description: 'Mantén una racha de 7 días',
    icon: faFire,
    target: 7,
    xpReward: 200,
    coinsReward: 100
  },
  {
    id: 'meta_1',
    category: 'metas',
    title: 'Leyenda del ICFES',
    description: 'Alcanza el nivel 10',
    icon: faTrophy,
    target: 10,
    xpReward: 1000,
    coinsReward: 500
  },
  {
    id: 'time_1',
    category: 'constancia',
    title: 'Maratón de Estudio',
    description: 'Estudia durante 2 horas seguidas',
    icon: faClock,
    target: 120, // minutos
    xpReward: 150,
    coinsReward: 75
  }
];

export const ACHIEVEMENT_CATEGORIES = {
  all: { label: 'Todos', icon: faStar },
  estudio: { label: 'Estudio', icon: faBook },
  rendimiento: { label: 'Rendimiento', icon: faBolt },
  constancia: { label: 'Constancia', icon: faFire },
  metas: { label: 'Metas', icon: faTrophy }
};
