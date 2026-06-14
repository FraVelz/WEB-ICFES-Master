import type { AreaId } from '@/shared/constants';
import type { PhaseBlockDef } from './phaseBlockTypes';

export const PHASE3_BLOCKS: Partial<Record<AreaId, PhaseBlockDef[]>> = {
  'lectura-critica': [
    {
      blockId: 'nivel-critico',
      title: 'Nivel crítico',
      description: 'Validez de argumentos y prejuicios',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 20,
    },
    {
      blockId: 'intencion-autor',
      title: 'Intención del autor',
      description: 'Propaganda, opinión y caricatura',
      order: 2,
      orderIndexFrom: 21,
      orderIndexTo: 35,
    },
    {
      blockId: 'multifuente',
      title: 'Multifuente',
      description: 'Contrastar dos fuentes de información',
      order: 3,
      orderIndexFrom: 36,
      orderIndexTo: 50,
    },
  ],
  matematicas: [
    {
      blockId: 'argumentacion',
      title: 'Argumentación matemática',
      description: 'Validar o refutar conclusiones',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 20,
    },
    {
      blockId: 'razonamiento-abstracto',
      title: 'Razonamiento abstracto',
      description: 'Funciones y cambios en contextos científicos',
      order: 2,
      orderIndexFrom: 21,
      orderIndexTo: 35,
    },
    {
      blockId: 'no-generico',
      title: 'Contenido no genérico',
      description: 'Problemas selectivos de bachillerato',
      order: 3,
      orderIndexFrom: 36,
      orderIndexTo: 50,
    },
  ],
  'ciencias-naturales': [
    {
      blockId: 'indagacion',
      title: 'Indagación',
      description: 'Diseño experimental y variables',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 20,
    },
    {
      blockId: 'analisis-datos',
      title: 'Análisis de datos',
      description: 'Gráficas, tendencias y conclusiones',
      order: 2,
      orderIndexFrom: 21,
      orderIndexTo: 35,
    },
    {
      blockId: 'prediccion-teorica',
      title: 'Predicción teórica',
      description: 'Usar modelos para anticipar resultados',
      order: 3,
      orderIndexFrom: 36,
      orderIndexTo: 50,
    },
  ],
  'sociales-ciudadanas': [
    {
      blockId: 'pensamiento-sistemico',
      title: 'Pensamiento sistémico',
      description: 'Dimensiones económica, ambiental y política',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 20,
    },
    {
      blockId: 'normas-conflictos',
      title: 'Normas y conflictos',
      description: 'Dilemas ciudadanos con trade-offs',
      order: 2,
      orderIndexFrom: 21,
      orderIndexTo: 35,
    },
    {
      blockId: 'multiperspectiva',
      title: 'Multiperspectiva compleja',
      description: 'Actores, poder e intereses ocultos',
      order: 3,
      orderIndexFrom: 36,
      orderIndexTo: 50,
    },
  ],
  ingles: [
    {
      blockId: 'reading-b1',
      title: 'Reading B1',
      description: 'Textos fácticos con comprensión satisfactoria',
      order: 1,
      orderIndexFrom: 1,
      orderIndexTo: 20,
    },
    {
      blockId: 'grammar-complex',
      title: 'Grammar complex',
      description: 'Gramática en contexto avanzado',
      order: 2,
      orderIndexFrom: 21,
      orderIndexTo: 35,
    },
    {
      blockId: 'text-factual',
      title: 'Factual texts',
      description: 'Lectura inferencial en párrafos largos',
      order: 3,
      orderIndexFrom: 36,
      orderIndexTo: 50,
    },
  ],
};

export function getPhase3BlocksForArea(areaId: AreaId): PhaseBlockDef[] {
  return PHASE3_BLOCKS[areaId] ?? [];
}
