/** Etapas de la ruta (`facil` / `intermedio` / `dificil`). */
export const LEARNING_PHASE_SECTION_IDS = ['facil', 'intermedio', 'dificil'] as const;

export type LearningPhaseSectionId = (typeof LEARNING_PHASE_SECTION_IDS)[number];

/** Fase pedagógica almacenada en `learning_content.phase`. */
export type LearningPhaseNumber = 1 | 2 | 3;

const SECTION_ID_TO_PHASE: Record<LearningPhaseSectionId, LearningPhaseNumber> = {
  facil: 1,
  intermedio: 2,
  dificil: 3,
};

const PHASE_TO_SECTION_ID: Record<LearningPhaseNumber, LearningPhaseSectionId> = {
  1: 'facil',
  2: 'intermedio',
  3: 'dificil',
};

export function sectionIdToPhase(sectionId: string | undefined): LearningPhaseNumber {
  if (sectionId && sectionId in SECTION_ID_TO_PHASE) {
    return SECTION_ID_TO_PHASE[sectionId as LearningPhaseSectionId];
  }
  return 1;
}

export function phaseToSectionId(phase: LearningPhaseNumber): LearningPhaseSectionId {
  return PHASE_TO_SECTION_ID[phase];
}

/** Normaliza valores legados (`difficulty`, strings en JSON). */
export function normalizeLessonPhase(value: unknown): LearningPhaseNumber {
  if (value === 1 || value === 2 || value === 3) return value;
  const n = Number(value);
  if (n === 1 || n === 2 || n === 3) return n as LearningPhaseNumber;

  const text = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (text === 'intermedio' || text === 'intermediate' || text === 'relacion' || text === '2') return 2;
  if (text === 'dificil' || text === 'hard' || text === 'avanzado' || text === 'maestria' || text === '3') {
    return 3;
  }
  return 1;
}
