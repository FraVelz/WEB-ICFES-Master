import type { AreaId } from '@/shared/constants';
import type { PhaseBlockDef } from './phaseBlockTypes';

export const PHASE2_BLOCKS: Partial<Record<AreaId, PhaseBlockDef[]>> = {
  'lectura-critica': [
    {
      blockId: 'estructura-global',
      title: 'Estructura global',
      description: 'Cómo se articulan las partes del texto',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 25,
    },
    {
      blockId: 'textos-discontinuos',
      title: 'Textos discontinuos',
      description: 'Infografías, tablas y caricaturas',
      order: 2,
      orderIndexFrom: 26,
      orderIndexTo: 50,
    },
    {
      blockId: 'inferencia-avanzada',
      title: 'Inferencia avanzada',
      description: 'Relacionar información implícita con evidencia',
      order: 3,
      orderIndexFrom: 51,
      orderIndexTo: 70,
    },
  ],
  matematicas: [
    {
      blockId: 'formulacion-ejecucion',
      title: 'Formulación y ejecución',
      description: 'Diseñar planes para resolver problemas reales',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 25,
    },
    {
      blockId: 'estadistica-contexto',
      title: 'Estadística en contexto',
      description: 'Interpretar tablas y gráficas con tendencias',
      order: 2,
      orderIndexFrom: 26,
      orderIndexTo: 45,
    },
    {
      blockId: 'proporcionalidad-compleja',
      title: 'Proporcionalidad compleja',
      description: 'Finanzas, salud y mezclas con dos variables',
      order: 3,
      orderIndexFrom: 46,
      orderIndexTo: 60,
    },
    {
      blockId: 'geometria-aplicada',
      title: 'Geometría aplicada',
      description: 'Áreas, volúmenes y medidas en situaciones reales',
      order: 4,
      orderIndexFrom: 61,
      orderIndexTo: 70,
    },
  ],
  'ciencias-naturales': [
    {
      blockId: 'explicacion-fenomenos',
      title: 'Explicación de fenómenos',
      description: 'Relacionar variables en procesos naturales',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 25,
    },
    {
      blockId: 'cts',
      title: 'Ciencia, tecnología y sociedad',
      description: 'Impacto de la ciencia en salud y ambiente',
      order: 2,
      orderIndexFrom: 26,
      orderIndexTo: 50,
    },
    {
      blockId: 'modelos-causa-efecto',
      title: 'Modelos causa-efecto',
      description: 'Predecir cambios a partir de relaciones',
      order: 3,
      orderIndexFrom: 51,
      orderIndexTo: 70,
    },
  ],
  'sociales-ciudadanas': [
    {
      blockId: 'perspectivas',
      title: 'Análisis de perspectivas',
      description: 'Intereses y puntos de vista en conflictos',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 25,
    },
    {
      blockId: 'pensamiento-social',
      title: 'Pensamiento social',
      description: 'Economía y política en contextos cotidianos',
      order: 2,
      orderIndexFrom: 26,
      orderIndexTo: 50,
    },
    {
      blockId: 'constitucion-aplicada',
      title: 'Constitución aplicada',
      description: 'Derechos y deberes en casos concretos',
      order: 3,
      orderIndexFrom: 51,
      orderIndexTo: 70,
    },
  ],
  ingles: [
    {
      blockId: 'reading-inferential',
      title: 'Reading inferential',
      description: 'Inferencia explícita en textos cortos',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 25,
    },
    {
      blockId: 'grammar-context',
      title: 'Grammar in context',
      description: 'Estructuras en situaciones comunicativas',
      order: 2,
      orderIndexFrom: 26,
      orderIndexTo: 50,
    },
    {
      blockId: 'vocabulary-context',
      title: 'Vocabulary in context',
      description: 'Palabras y avisos con más contexto',
      order: 3,
      orderIndexFrom: 51,
      orderIndexTo: 70,
    },
  ],
};

export function getPhase2BlocksForArea(areaId: AreaId): PhaseBlockDef[] {
  return PHASE2_BLOCKS[areaId] ?? [];
}
