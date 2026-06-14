export type AreaId =
  | 'lectura-critica'
  | 'matematicas'
  | 'ciencias-naturales'
  | 'sociales-ciudadanas'
  | 'ingles'
  | 'examen-completo';

export type AreaInfo = {
  name: string;
  color: string;
  icon: string;
  textColor?: string;
  bgColor?: string;
  gradient?: string;
  description?: string;
  preguntas?: number;
  dificultad?: string;
};

export type HomeArea = AreaInfo & { id: AreaId };

const DEFAULT_AREA: AreaInfo = {
  name: 'Lectura Crítica',
  color: 'from-subject-lc-from to-subject-lc-to',
  icon: 'book-open',
};

/**
 * Fuente de verdad para metadatos de áreas ICFES (nombres, colores, iconos).
 */
export const AREA_INFO: Record<AreaId, AreaInfo> = {
  'lectura-critica': {
    name: 'Lectura Crítica',
    color: 'from-subject-lc-from to-subject-lc-to',
    icon: 'book-open',
    textColor: 'text-subject-lc',
    bgColor: 'bg-subject-lc-bold',
    gradient: 'from-subject-lc-grad-from to-subject-lc-grad-to',
    description: 'Comprensión y análisis de textos',
    preguntas: 120,
    dificultad: 'Intermedio',
  },
  matematicas: {
    name: 'Matemáticas',
    color: 'from-subject-math-from to-subject-math-to',
    icon: 'calculator',
    textColor: 'text-subject-math',
    bgColor: 'bg-subject-math-bold',
    gradient: 'from-subject-math-grad-from to-subject-math-grad-to',
    description: 'Razonamiento cuantitativo',
    preguntas: 150,
    dificultad: 'Avanzado',
  },
  'ciencias-naturales': {
    name: 'Ciencias Naturales',
    color: 'from-subject-sci-from to-subject-sci-to',
    icon: 'flask',
    textColor: 'text-subject-sci',
    bgColor: 'bg-subject-sci-bold',
    gradient: 'from-subject-sci-grad-from to-subject-sci-grad-to',
    description: 'Física, química y biología',
    preguntas: 130,
    dificultad: 'Avanzado',
  },
  'sociales-ciudadanas': {
    name: 'Sociales y Ciudadanas',
    color: 'from-subject-soc-from to-subject-soc-to',
    icon: 'landmark',
    textColor: 'text-subject-soc',
    bgColor: 'bg-subject-soc-bold',
    gradient: 'from-subject-soc-grad-from to-subject-soc-grad-to',
    description: 'Historia, geografía y competencias ciudadanas',
    preguntas: 140,
    dificultad: 'Intermedio',
  },
  ingles: {
    name: 'Inglés',
    color: 'from-subject-eng-from to-subject-eng-to',
    icon: 'language',
    textColor: 'text-subject-eng',
    bgColor: 'bg-subject-eng-bold',
    gradient: 'from-subject-eng-grad-from to-subject-eng-grad-to',
    description: 'Comprensión de lectura y vocabulario en inglés',
    preguntas: 110,
    dificultad: 'Intermedio',
  },
  'examen-completo': {
    name: 'Simulacro completo',
    color: 'from-subject-full-from to-subject-full-to',
    icon: 'clipboard-list',
    gradient: 'from-subject-full-from to-subject-full-to',
  },
};

export const HOME_AREA_IDS: AreaId[] = [
  'lectura-critica',
  'matematicas',
  'ciencias-naturales',
  'sociales-ciudadanas',
  'ingles',
];

export function getAreaInfo(areaId: string): AreaInfo {
  return AREA_INFO[areaId as AreaId] ?? DEFAULT_AREA;
}

export function getHomeAreas(): HomeArea[] {
  return HOME_AREA_IDS.map((id) => ({ id, ...AREA_INFO[id] }));
}
