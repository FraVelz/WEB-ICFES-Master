import { 
  faBookOpen,
  faCalculator,
  faFlask,
  faLandmark,
  faLanguage,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

/**
 * Información de áreas ICFES
 * Mapeo de rutas a nombres, colores e iconos
 */
export const AREA_INFO = {
  'lectura-critica': { 
    name: 'Lectura Crítica', 
    color: 'from-blue-400 to-blue-600',
    icon: faBookOpen
  },
  'matematicas': { 
    name: 'Matemáticas', 
    color: 'from-green-400 to-green-600',
    icon: faCalculator
  },
  'ciencias-naturales': { 
    name: 'Ciencias Naturales', 
    color: 'from-purple-400 to-purple-600',
    icon: faFlask
  },
  'sociales-ciudadanas': { 
    name: 'Sociales y Ciudadanas', 
    color: 'from-orange-400 to-orange-600',
    icon: faLandmark
  },
  'ingles': { 
    name: 'Inglés', 
    color: 'from-indigo-400 to-indigo-600',
    icon: faLanguage
  },
  'examen-completo': { 
    name: 'Examen Completo ICFES', 
    color: 'from-pink-400 to-pink-600',
    icon: faClipboardList
  }
};
