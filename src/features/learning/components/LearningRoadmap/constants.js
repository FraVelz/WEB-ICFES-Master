/**
 * Constantes del mapa de aprendizaje
 */

export const ICFES_LEVELS = [
  {
    id: 'basic',
    name: 'Nivel Básico',
    pointRange: '0-150',
    description: 'Fundamentos y conceptos básicos',
    difficulty: 'Fácil',
    estimatedHours: 40,
    topics: ['Números básicos', 'Operaciones fundamentales', 'Vocabulario básico'],
    colorGradient: 'from-green-600 to-green-400',
    colorBorder: 'border-green-600',
    colorBg20: 'bg-green-600/20',
    icon: 'faBook',
    statusIcon: 'faCheckCircle',
    completed: true,
    progress: 100
  },
  {
    id: 'intermediate-low',
    name: 'Intermedio Bajo',
    pointRange: '150-250',
    description: 'Aplicación de conceptos y análisis básico',
    difficulty: 'Intermedio',
    estimatedHours: 50,
    topics: ['Aplicaciones prácticas', 'Análisis simple', 'Comprensión detallada'],
    colorGradient: 'from-blue-600 to-blue-400',
    colorBorder: 'border-blue-600',
    colorBg20: 'bg-blue-600/20',
    icon: 'faBullseye',
    statusIcon: 'faCheckCircle',
    completed: true,
    progress: 100
  },
  {
    id: 'intermediate-high',
    name: 'Intermedio Alto',
    pointRange: '250-350',
    description: 'Razonamiento complejo y síntesis',
    difficulty: 'Avanzado',
    estimatedHours: 60,
    topics: ['Razonamiento lógico', 'Síntesis de información', 'Pensamiento crítico'],
    colorGradient: 'from-purple-600 to-purple-400',
    colorBorder: 'border-purple-600',
    colorBg20: 'bg-purple-600/20',
    icon: 'faCog',
    statusIcon: 'faFire',
    completed: true,
    progress: 75
  },
  {
    id: 'advanced',
    name: 'Avanzado',
    pointRange: '350-450',
    description: 'Dominio profundo y aplicación experta',
    difficulty: 'Muy Avanzado',
    estimatedHours: 70,
    topics: ['Análisis profundo', 'Aplicación experta', 'Resolución compleja'],
    colorGradient: 'from-orange-600 to-orange-400',
    colorBorder: 'border-orange-600',
    colorBg20: 'bg-orange-600/20',
    icon: 'faSquareRootVariable',
    statusIcon: 'faArrowRight',
    completed: false,
    progress: 45
  },
  {
    id: 'expert',
    name: 'Nivel Experto',
    pointRange: '450-500',
    description: 'Maestría completa - Objetivo ICFES 500',
    difficulty: 'Experto',
    estimatedHours: 80,
    topics: ['Maestría absoluta', 'Excelencia', 'Puntaje máximo'],
    colorGradient: 'from-yellow-600 to-yellow-400',
    colorBorder: 'border-yellow-600',
    colorBg20: 'bg-yellow-600/20',
    icon: 'faTrophy',
    statusIcon: 'faLock',
    completed: false,
    progress: 0
  }
];

export const DIFFICULTY_COLORS = {
  'Fácil': 'bg-green-900/40 text-green-300',
  'Intermedio': 'bg-yellow-900/40 text-yellow-300',
  'Avanzado': 'bg-orange-900/40 text-orange-300',
  'Muy Avanzado': 'bg-red-900/40 text-red-300',
  'Experto': 'bg-purple-900/40 text-purple-300'
};

export const LEVEL_CONFIG = {
  basico: {
    color: 'green',
    icon: 'faLightbulb',
    title: 'NIVEL BÁSICO',
    subtitle: 'Aprende los fundamentos de cada materia'
  },
  intermedio: {
    color: 'yellow',
    icon: 'faBook',
    title: 'NIVEL INTERMEDIO',
    subtitle: 'Exámenes individuales de cada materia'
  },
  avanzado: {
    color: 'red',
    icon: 'faTrophy',
    title: 'NIVEL AVANZADO',
    subtitle: 'Simulacro completo del examen ICFES'
  }
};
