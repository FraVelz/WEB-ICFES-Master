import { 
    faAward, faFire, faTrophy, faStar, faCrown,
    faBullseye, faChartLine,
    faUsers, faGem, faLightbulb
} from '@fortawesome/free-solid-svg-icons';

export const BADGE_CATEGORIES_CONFIG = {
  primeros_pasos: {
    title: 'Primeros Pasos',
    icon: faAward,
    color: 'from-blue-500 to-cyan-500'
  },
  streak: {
    title: 'Rachas',
    icon: faFire,
    color: 'from-orange-500 to-red-500'
  },
  logros: {
    title: 'Logros Académicos',
    icon: faTrophy,
    color: 'from-yellow-500 to-amber-500'
  },
  excelencia: {
    title: 'Excelencia',
    icon: faStar,
    color: 'from-purple-500 to-pink-500'
  },
  planes: {
    title: 'Planes y Suscripciones',
    icon: faCrown,
    color: 'from-emerald-500 to-teal-500'
  },
  colaboracion: {
    title: 'Colaboración',
    icon: faUsers,
    color: 'from-indigo-500 to-violet-500'
  },
  desafios: {
    title: 'Desafíos Especiales',
    icon: faFire,
    color: 'from-red-500 to-rose-500'
  },
  mejora: {
    title: 'Mejora Continua',
    icon: faChartLine,
    color: 'from-green-500 to-emerald-500'
  },
  conocimiento: {
    title: 'Conocimiento Profundo',
    icon: faFire,
    color: 'from-cyan-500 to-blue-500'
  },
  hitos: {
    title: 'Hitos Especiales',
    icon: faTrophy,
    color: 'from-yellow-500 to-orange-500'
  },
  gamification: {
    title: 'Gamificación Avanzada',
    icon: faGem,
    color: 'from-pink-500 to-rose-500'
  },
  rigor: {
    title: 'Rigor Académico',
    icon: faBullseye,
    color: 'from-slate-500 to-gray-500'
  },
  estrategia: {
    title: 'Estrategia y Táctica',
    icon: faLightbulb,
    color: 'from-teal-500 to-cyan-500'
  }
};
