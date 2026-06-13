import { HOME_AREA_IDS, type AreaId } from '@/shared/constants/areaInfo';

export type CompetencyPhaseId = 'cimentacion' | 'relacion' | 'maestria';

export type CompetencyPhase = {
  id: CompetencyPhaseId;
  /** Id de etapa en la ruta (`facil`, `intermedio`, `dificil`). */
  sectionId: string;
  order: number;
  title: string;
  subtitle: string;
  summary: string;
  areaFocus: Partial<Record<AreaId, string>>;
};

/** Recorrido por competencias — alineado con nota2.md (marcos ICFES). */
export const COMPETENCY_PHASES: CompetencyPhase[] = [
  {
    id: 'cimentacion',
    sectionId: 'facil',
    order: 1,
    title: 'Fase de Cimentación',
    subtitle: 'Alfabetización básica y lectura literal',
    summary:
      'Familiarízate con los lenguajes básicos de cada disciplina. El foco es el sentido literal y las ' +
      'herramientas mínimas para interactuar con información cotidiana.',
    areaFocus: {
      'lectura-critica':
        'Identificar contenidos locales (palabras y frases) y entender el sentido literal de lo que lees.',
      matematicas: 'Contenidos genéricos: porcentajes, proporciones y lectura de tablas sencillas.',
      'ciencias-naturales': 'Reconocer características de seres u objetos y describir fenómenos de forma directa.',
      'sociales-ciudadanas':
        'Fundamentos de la Constitución Política: derechos, deberes y organización básica del Estado.',
      ingles: 'Nivel Pre A1: palabras sueltas con imágenes y avisos muy sencillos.',
    },
  },
  {
    id: 'relacion',
    sectionId: 'intermedio',
    order: 2,
    title: 'Fase de Relación',
    subtitle: 'Comprensión inferencial y aplicación',
    summary:
      'Conecta información, relaciona variables y aplica lo aprendido en contextos laborales o sociales, ' +
      'no solo mecánicos.',
    areaFocus: {
      'lectura-critica':
        'Comprensión global del texto: cómo se articulan sus partes para dar sentido al escrito completo.',
      matematicas: 'Formular y ejecutar planes para resolver problemas en contextos laborales o sociales.',
      'ciencias-naturales':
        'Explicar cómo ocurren los fenómenos naturales relacionando variables (p. ej. temperatura en un gas).',
      'sociales-ciudadanas':
        'Análisis de perspectivas: distintos puntos de vista e intereses ante un conflicto social.',
      ingles: 'Relacionar información explícita en textos cortos y avisos con algo más de contexto.',
    },
  },
  {
    id: 'maestria',
    sectionId: 'dificil',
    order: 3,
    title: 'Fase de Maestría',
    subtitle: 'Pensamiento crítico e indagación (ruta al 500)',
    summary:
      'Domina procesos cognitivos superiores: evaluar argumentos, diseñar indagaciones y usar el conocimiento ' +
      'en situaciones nuevas y retadoras.',
    areaFocus: {
      'lectura-critica': 'Nivel crítico: validez de argumentos, prejuicios e intención del autor.',
      matematicas: 'Argumentación compleja: validar o refutar conclusiones con ejemplos y contraejemplos.',
      'ciencias-naturales': 'Indagación: diseñar experimentos, analizar resultados y derivar conclusiones válidas.',
      'sociales-ciudadanas':
        'Pensamiento sistémico: dimensiones económica, ambiental y política de los problemas sociales.',
      ingles: 'Nivel B1: lectura de textos fácticos diversos con comprensión satisfactoria.',
    },
  },
];

export const JOURNEY_TIPS: string[] = [
  'Prioriza el Diseño Centrado en Evidencias (DCE): practica demostrando lo que sabes hacer, no solo leyendo teoría.',
  'Usa contextos reales: noticias, gráficas, problemas de salud pública y situaciones cotidianas.',
  'Busca el Nivel 4 de desempeño en todas las áreas (B1+ en inglés): saber usar el concepto en situaciones nuevas.',
  'Evita la memorización aislada: fechas, fórmulas sueltas y definiciones de memoria no son el foco del ICFES.',
];

export function getCompetencyPhaseBySectionId(sectionId: string): CompetencyPhase | undefined {
  return COMPETENCY_PHASES.find((p) => p.sectionId === sectionId);
}

export const LEARNING_PHASES_PATH = '/fases';
export const LEARNING_ROADMAP_PATH = '/ruta-aprendizaje';

/** Slugs válidos para rutas `/fases/[area]`. */
export const PHASES_AREA_SLUGS = HOME_AREA_IDS;

export type PhasesAreaSlug = Exclude<AreaId, 'examen-completo'>;

export function isPhasesAreaSlug(id: string): id is PhasesAreaSlug {
  return (PHASES_AREA_SLUGS as readonly string[]).includes(id);
}

const DEFAULT_PHASES_AREA: PhasesAreaSlug = 'lectura-critica';

export function getLearningPhasesHref(areaId?: string): string {
  const area = areaId && isPhasesAreaSlug(areaId) ? areaId : DEFAULT_PHASES_AREA;
  return `${LEARNING_PHASES_PATH}/${area}`;
}

export function parsePhasesAreaFromPathname(pathname: string): PhasesAreaSlug | null {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (!normalized.startsWith(`${LEARNING_PHASES_PATH}/`)) return null;
  const slug = normalized.slice(`${LEARNING_PHASES_PATH}/`.length).split('/')[0];
  if (!slug || !isPhasesAreaSlug(slug)) return null;
  return slug;
}

export function getRoadmapHref(sectionId?: string, areaId?: string): string {
  const params = new URLSearchParams();
  if (areaId) params.set('area', areaId);
  if (sectionId) params.set('etapa', sectionId);
  const qs = params.toString();
  if (!qs) return LEARNING_ROADMAP_PATH;
  return `${LEARNING_ROADMAP_PATH}?${qs}`;
}

/** Examen de práctica para saltar una fase (`?saltar-fase=facil|intermedio|dificil`). */
export function getPhaseSkipExamHref(areaId: string, sectionId: string): string {
  return `/practica/${areaId}?saltar-fase=${sectionId}`;
}
