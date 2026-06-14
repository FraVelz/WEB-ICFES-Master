import { describe, expect, it } from 'vitest';
import { getDifficultyForPhaseSkipSection, normalizeExamDifficulty } from './phaseSkipDifficulty';

describe('phaseSkipDifficulty', () => {
  it('maps section ids to exam difficulties', () => {
    expect(getDifficultyForPhaseSkipSection('facil')).toBe('básico');
    expect(getDifficultyForPhaseSkipSection('intermedio')).toBe('intermedio');
    expect(getDifficultyForPhaseSkipSection('dificil')).toBe('avanzado');
  });

  it('normalizes difficulty aliases', () => {
    expect(normalizeExamDifficulty('basico')).toBe('básico');
    expect(normalizeExamDifficulty('intermedio')).toBe('intermedio');
    expect(normalizeExamDifficulty('avanzado')).toBe('avanzado');
  });
});
