import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import { HOME_AREA_IDS, type AreaId } from '@/shared/constants';

export const BLOCK_CHECKPOINT_ID_PREFIX = 'block-checkpoint-';

export type Phase1BlockDef = {
  blockId: string;
  title: string;
  description: string;
  order: number;
  orderIndexFrom: number;
  orderIndexTo: number;
};

const PHASE1_BLOCKS: Partial<Record<AreaId, Phase1BlockDef[]>> = {
  matematicas: [
    { blockId: 'numeros', title: 'Números', description: 'Operaciones, potencias y divisibilidad', order: 1, orderIndexFrom: 1, orderIndexTo: 35 },
    { blockId: 'algebra', title: 'Álgebra', description: 'Expresiones, ecuaciones y factorización', order: 2, orderIndexFrom: 36, orderIndexTo: 50 },
    { blockId: 'funciones', title: 'Funciones', description: 'Relaciones, gráficas y variación', order: 3, orderIndexFrom: 51, orderIndexTo: 60 },
    { blockId: 'estadistica', title: 'Estadística', description: 'Datos, probabilidad y tendencias', order: 4, orderIndexFrom: 61, orderIndexTo: 82 },
    { blockId: 'geometria', title: 'Geometría', description: 'Figuras, medidas y transformaciones', order: 5, orderIndexFrom: 83, orderIndexTo: 125 },
  ],
  'lectura-critica': [
    { blockId: 'comprension', title: 'Comprensión', description: 'Lectura literal e inferencial básica', order: 1, orderIndexFrom: 1, orderIndexTo: 80 },
    { blockId: 'argumentacion', title: 'Argumentación', description: 'Tesis, evidencia y contraargumentos', order: 2, orderIndexFrom: 81, orderIndexTo: 125 },
  ],
  'ciencias-naturales': [
    { blockId: 'biologia', title: 'Biología', description: 'Seres vivos, célula y ecosistemas', order: 1, orderIndexFrom: 1, orderIndexTo: 55 },
    { blockId: 'quimica', title: 'Química', description: 'Materia, reacciones y enlaces', order: 2, orderIndexFrom: 56, orderIndexTo: 95 },
    { blockId: 'fisica', title: 'Física', description: 'Movimiento, fuerzas y energía', order: 3, orderIndexFrom: 96, orderIndexTo: 125 },
  ],
  'sociales-ciudadanas': [
    { blockId: 'historia', title: 'Historia', description: 'Procesos sociales y cambio en el tiempo', order: 1, orderIndexFrom: 1, orderIndexTo: 50 },
    { blockId: 'geografia', title: 'Geografía', description: 'Territorio, población y ambiente', order: 2, orderIndexFrom: 51, orderIndexTo: 80 },
    { blockId: 'ciudadania', title: 'Ciudadanía', description: 'Derechos, democracia y convivencia', order: 3, orderIndexFrom: 81, orderIndexTo: 125 },
  ],
  ingles: [
    { blockId: 'grammar', title: 'Grammar', description: 'Estructuras y uso del lenguaje', order: 1, orderIndexFrom: 1, orderIndexTo: 70 },
    { blockId: 'reading', title: 'Reading', description: 'Comprensión de textos cortos', order: 2, orderIndexFrom: 71, orderIndexTo: 100 },
    { blockId: 'vocabulary', title: 'Vocabulary', description: 'Vocabulario contextual y avisos', order: 3, orderIndexFrom: 101, orderIndexTo: 125 },
  ],
};

export function getPhase1BlocksForArea(areaId: AreaId): Phase1BlockDef[] {
  return PHASE1_BLOCKS[areaId] ?? [];
}

export function getBlockCheckpointId(areaId: AreaId, blockId: string): string {
  return `${BLOCK_CHECKPOINT_ID_PREFIX}${areaId}-${blockId}`;
}

export function isBlockCheckpointId(id: string): boolean {
  return id.startsWith(BLOCK_CHECKPOINT_ID_PREFIX);
}

export function parseBlockCheckpointId(id: string): { areaId: AreaId; blockId: string } | null {
  if (!isBlockCheckpointId(id)) return null;
  const rest = id.slice(BLOCK_CHECKPOINT_ID_PREFIX.length);
  const areaId = HOME_AREA_IDS.find((candidate) => rest.startsWith(`${candidate}-`));
  if (!areaId) return null;
  const blockId = rest.slice(areaId.length + 1);
  if (!blockId) return null;
  return { areaId, blockId };
}

export function resolveLessonBlockId(areaId: AreaId, lesson: Pick<LearningPathLesson, 'blockId' | 'order'>): string | null {
  if (lesson.blockId && typeof lesson.blockId === 'string') return lesson.blockId;

  const orderIndex = Number(lesson.order);
  if (!Number.isFinite(orderIndex)) return null;

  const block = getPhase1BlocksForArea(areaId).find(
    (candidate) => orderIndex >= candidate.orderIndexFrom && orderIndex <= candidate.orderIndexTo
  );
  return block?.blockId ?? null;
}

export function getPhase1BlockDef(areaId: AreaId, blockId: string): Phase1BlockDef | undefined {
  return getPhase1BlocksForArea(areaId).find((block) => block.blockId === blockId);
}
