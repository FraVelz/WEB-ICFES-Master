import type { LearningPhaseSectionId } from '@/features/learning/constants/learningPhases';

export type ExamQuestionDifficulty = 'básico' | 'intermedio' | 'avanzado';

const SECTION_TO_DIFFICULTY: Record<LearningPhaseSectionId, ExamQuestionDifficulty> = {
  facil: 'básico',
  intermedio: 'intermedio',
  dificil: 'avanzado',
};

export function getDifficultyForPhaseSkipSection(sectionId: string | null | undefined): ExamQuestionDifficulty | null {
  if (!sectionId || !(sectionId in SECTION_TO_DIFFICULTY)) return null;
  return SECTION_TO_DIFFICULTY[sectionId as LearningPhaseSectionId];
}

export function normalizeExamDifficulty(value: string | null | undefined): ExamQuestionDifficulty | null {
  if (!value) return null;
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalized === 'basico' || normalized === 'facil' || normalized === 'easy') return 'básico';
  if (normalized === 'intermedio' || normalized === 'medium') return 'intermedio';
  if (normalized === 'avanzado' || normalized === 'dificil' || normalized === 'hard') return 'avanzado';
  return null;
}
