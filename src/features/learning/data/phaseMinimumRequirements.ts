import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { getLessonRewardsForPhase } from '@/features/learning/utils/lessonRewards';
import { HOME_AREA_IDS, type AreaId } from '@/shared/constants';

/** Tipo de módulo en la ruta (primer nodo de fase 1). */
export const MINIMUM_REQUIREMENTS_MODULE_TYPE = 'minimum-requirements' as const;

export type MinimumRequirementsModuleType = typeof MINIMUM_REQUIREMENTS_MODULE_TYPE;

export const MINIMUM_REQUIREMENTS_ID_PREFIX = 'req-minimos-';

export type PhaseMinimumRequirementsModule = {
  areaId: AreaId;
  title: string;
  description: string;
  duration: string;
  content: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }>;
};

const SHARED_INTRO = `Antes de entrar a la **Fase de Cimentación** conviene tener estas bases. No es un examen del colegio completo: es lo mínimo para que puedas seguir las lecciones y entender preguntas sencillas en contexto.

Si ya dominas estos puntos, repásalos rápido y continúa. Si detectas vacíos, tómate el tiempo aquí: te ahorrará frustración después.`;

const MODULES: Record<AreaId, PhaseMinimumRequirementsModule | undefined> = {
  'lectura-critica': {
    areaId: 'lectura-critica',
    title: 'Requisitos mínimos',
    description: 'Lectura y escritura básica antes de bachillerato',
    duration: '45 min',
    content: `${SHARED_INTRO}

---

## Leer con fluidez básica

- Reconocer el **alfabeto** y las letras mayúsculas y minúsculas.
- Leer **palabras y oraciones completas** en español (no solo sílabas sueltas).
- Entender instrucciones cortas: *abre*, *cierra*, *marca*, *escribe tu nombre*.
- Diferenciar una **pregunta** de una **afirmación** al leer.

---

## Vocabulario cotidiano

- Palabras de la vida diaria: familia, trabajo, salud, compras, transporte.
- Sinónimos y antónimos sencillos (*grande/pequeño*, *entrada/salida*).
- Conectores básicos: *y*, *pero*, *porque*, *entonces*, *sin embargo*.

---

## Comprensión literal

- Responder *¿qué dice el texto?* sin inventar información.
- Ubicar un dato concreto en un párrafo corto (nombre, fecha, lugar, número).
- Identificar el **tema principal** de un aviso o noticia breve.

---

## Escritura mínima

- Escribir oraciones con sujeto y verbo.
- Usar mayúscula al inicio y punto al final.
- Copiar y completar textos cortos sin errores que impidan entender el mensaje.`,
    questions: [
      {
        id: 'req_lc_1',
        question: '¿Cuál es el objetivo principal de este módulo?',
        options: [
          'Memorizar biografías de autores famosos',
          'Tener bases de lectura y escritura para empezar la fase 1',
          'Aprender a escribir ensayos filosóficos',
        ],
        correct_answer: 1,
        explanation:
          'Este módulo consolida alfabetización y comprensión literal, no contenidos avanzados de bachillerato.',
      },
      {
        id: 'req_lc_2',
        question: 'La comprensión literal consiste en…',
        options: [
          'Entender lo que el texto dice de forma explícita',
          'Adivinar lo que el autor pensaba sin leer',
          'Memorizar fechas históricas',
        ],
        correct_answer: 0,
        explanation: 'Literal = lo que está escrito; las inferencias complejas llegan en fases posteriores.',
      },
    ],
  },
  matematicas: {
    areaId: 'matematicas',
    title: 'Requisitos mínimos',
    description: 'Números y operaciones básicas antes de bachillerato',
    duration: '50 min',
    content: `${SHARED_INTRO}

---

## Números naturales

- Leer y escribir números hasta **seis o siete cifras**.
- Comparar cantidades: mayor, menor, igual.
- Valor posicional: unidades, decenas, centenas, miles.

---

## Operaciones básicas

- **Suma y resta** con llevadas sencillas.
- **Multiplicación** (tablas hasta 10 y productos cortos).
- **División** exacta y con residuo en problemas cotidianos.
- Operaciones combinadas en dos pasos (*compra, cambio, reparto*).

---

## Fracciones y decimales (introducción)

- Reconocer **mitad, tercio, cuarto** en dibujos y repartos.
- Leer decimales sencillos en precios (*$ 1.500, $ 2.99*).
- Comparar fracciones simples con el mismo denominador.

---

## Medidas y proporciones cotidianas

- Unidades de **longitud, peso y tiempo** usadas en la vida diaria.
- Leer la hora en reloj analógico y digital.
- Resolver situaciones de **proporción directa** muy simples (el doble, la mitad, repartir en partes iguales).`,
    questions: [
      {
        id: 'req_mat_1',
        question: 'Para empezar matemáticas en fase 1, ¿qué es imprescindible?',
        options: [
          'Dominar funciones trigonométricas',
          'Manejar suma, resta, multiplicación y división en contextos cotidianos',
          'Memorizar todas las fórmulas de física',
        ],
        correct_answer: 1,
        explanation: 'La cimentación matemática parte de operaciones básicas aplicadas a situaciones reales.',
      },
      {
        id: 'req_mat_2',
        question: 'Leer precios como $ 3.250 implica entender…',
        options: ['Números naturales y decimales básicos', 'Integrales', 'Logaritmos'],
        correct_answer: 0,
        explanation: 'Los decimales en moneda son una habilidad previa muy común en problemas tipo ICFES.',
      },
    ],
  },
  'ciencias-naturales': {
    areaId: 'ciencias-naturales',
    title: 'Requisitos mínimos',
    description: 'Observación y lenguaje científico elemental',
    duration: '40 min',
    content: `${SHARED_INTRO}

---

## Observar el entorno

- Diferenciar **seres vivos** de objetos inertes.
- Nombrar partes básicas de plantas y animales conocidos.
- Describir cambios simples: día/noche, estaciones, crecimiento.

---

## Cuerpo humano y salud básica

- Órganos de los sentidos y su función general.
- Hábitos de higiene y alimentación equilibrada (conceptos generales).
- Diferenciar causa y consecuencia en frases sencillas (*si no hay agua, la planta se seca*).

---

## Materia y energía (ideas iniciales)

- Estados de la materia: **sólido, líquido, gas** con ejemplos cotidianos.
- Fuentes de energía conocidas: Sol, alimentos, baterías, electricidad en el hogar.
- Mezclas y sustancias puras a nivel intuitivo (agua con sal, aire).

---

## Medición sencilla

- Usar regla, termómetro y reloj en situaciones familiares.
- Leer escalas simples en gráficas de barras o pictogramas.
- Comprender que medir permite **comparar** y **describir** fenómenos.`,
    questions: [
      {
        id: 'req_cie_1',
        question: 'En ciencias, un requisito mínimo antes de bachillerato es…',
        options: [
          'Memorizar la tabla periódica completa',
          'Observar, describir y comparar fenómenos del entorno',
          'Resolver ecuaciones químicas avanzadas',
        ],
        correct_answer: 1,
        explanation: 'El ICFES prioriza comprensión de fenómenos en contexto, no memorización de tablas.',
      },
    ],
  },
  'sociales-ciudadanas': {
    areaId: 'sociales-ciudadanas',
    title: 'Requisitos mínimos',
    description: 'Convivencia, territorio y ciudadanía elemental',
    duration: '45 min',
    content: `${SHARED_INTRO}

---

## Entorno cercano

- Identificar roles en la **familia**, el **barrio** y el **colegio**.
- Leer un mapa sencillo: calles, puntos cardinales básicos, símbolos comunes.
- Reconocer servicios públicos del municipio (salud, educación, transporte).

---

## Tiempo y cambio social (noción general)

- Ordenar hechos recientes en una línea simple (*antes / después*).
- Diferenciar **hecho** de **opinión** en frases cortas.
- Comprender que las sociedades cambian con el tiempo (sin memorizar fechas).

---

## Convivencia y normas

- Reglas de respeto y convivencia en espacios públicos y privados.
- Qué es una **norma**, un **acuerdo** y una **autoridad** legítima.
- Resolución pacífica de conflictos cotidianos (diálogo, turnos, reglas).

---

## Derechos y deberes (introducción)

- Derechos fundamentales en lenguaje accesible: vida, educación, salud, libertad.
- Deberes básicos: respetar la ley, participar responsablemente, cuidar el espacio común.
- Saber que la **Constitución** organiza el Estado y protege derechos (sin artículos de memoria).`,
    questions: [
      {
        id: 'req_soc_1',
        question: 'Antes de bachillerato, en sociales conviene saber…',
        options: [
          'Todas las capitales del mundo de memoria',
          'Derechos, deberes y convivencia en contextos cercanos',
          'Solo fechas de batallas del siglo XIX',
        ],
        correct_answer: 1,
        explanation: 'El enfoque ciudadano y contextual es la base para las competencias ICFES en esta área.',
      },
    ],
  },
  ingles: {
    areaId: 'ingles',
    title: 'Requisitos mínimos',
    description: 'Primer contacto con el idioma (Pre A1)',
    duration: '40 min',
    content: `${SHARED_INTRO}

---

## Alfabeto y pronunciación básica

- Reconocer las **26 letras** del alfabeto inglés.
- Deletrear el propio nombre y palabras cortas.
- Diferenciar mayúsculas y minúsculas en palabras comunes.

---

## Saludos y presentaciones

- *Hello*, *Hi*, *Good morning/afternoon/evening*, *Goodbye*.
- *My name is…*, *I am from…*, *Nice to meet you*.
- Números del **0 al 20** y decenas básicas (*twenty, thirty…*).

---

## Vocabulario de objetos cotidianos

- Colores, días de la semana, miembros de la familia.
- Objetos del aula y del hogar (*book, table, door, phone*).
- Verbos muy frecuentes: *to be*, *to have*, *to go* en formas sencillas.

---

## Lectura de avisos cortos

- Entender carteles con una palabra o frase (*Exit*, *Open*, *Stop*).
- Relacionar imagen + palabra en inglés.
- Responder preguntas de **información explícita** en oraciones de 5–8 palabras.`,
    questions: [
      {
        id: 'req_en_1',
        question: 'El inglés del ICFES Saber 11° evalúa principalmente…',
        options: [
          'Speaking y listening en conversaciones largas',
          'Lectura y uso del lenguaje en textos cortos',
          'Traducción literaria de novelas',
        ],
        correct_answer: 1,
        explanation: 'La prueba oficial se centra en reading y gramática; este módulo prepara vocabulario Pre A1.',
      },
    ],
  },
  'examen-completo': undefined,
};

export function getMinimumRequirementsLessonId(areaId: AreaId): string {
  return `${MINIMUM_REQUIREMENTS_ID_PREFIX}${areaId}`;
}

export function isMinimumRequirementsLessonId(id: string): boolean {
  return id.startsWith(MINIMUM_REQUIREMENTS_ID_PREFIX);
}

export function parseAreaFromMinimumRequirementsId(id: string): AreaId | null {
  if (!isMinimumRequirementsLessonId(id)) return null;
  const areaId = id.slice(MINIMUM_REQUIREMENTS_ID_PREFIX.length) as AreaId;
  return HOME_AREA_IDS.includes(areaId) ? areaId : null;
}

export function getPhaseMinimumRequirementsModule(areaId: AreaId): PhaseMinimumRequirementsModule | null {
  return MODULES[areaId] ?? null;
}

/** Lección sintética que se inserta como primer nodo de la fase 1 en cada área. */
export function buildMinimumRequirementsLesson(areaId: AreaId): LearningPathLesson | null {
  const requirementsModule = getPhaseMinimumRequirementsModule(areaId);
  if (!requirementsModule) return null;

  const phaseOneRewards = getLessonRewardsForPhase(1);

  return {
    id: getMinimumRequirementsLessonId(areaId),
    title: requirementsModule.title,
    description: requirementsModule.description,
    order: 0,
    phase: 1,
    difficulty: 'facil',
    moduleType: MINIMUM_REQUIREMENTS_MODULE_TYPE,
    duration: requirementsModule.duration,
    content: requirementsModule.content,
    questions: requirementsModule.questions,
    quiz: {
      questions: requirementsModule.questions,
      rewards: phaseOneRewards,
    },
    rewards: phaseOneRewards,
    xp: phaseOneRewards.xp,
    coins: phaseOneRewards.coins,
  };
}
