import { describe, expect, it } from 'vitest';

import {
  ENGLISH_QUESTIONS,
  LANGUAGE_QUESTIONS,
  MATHEMATICS_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS,
} from './questions';

/** Documented gold floor — see docs/ops/gold-bank.md (B3-3). */
export const GOLD_BANK_N_PER_AREA = 8;

const GOLD_BY_AREA: Record<string, { length: number }> = {
  matematicas: MATHEMATICS_QUESTIONS,
  'lectura-critica': LANGUAGE_QUESTIONS,
  'ciencias-naturales': SCIENCE_QUESTIONS,
  'sociales-ciudadanas': SOCIAL_QUESTIONS,
  ingles: ENGLISH_QUESTIONS,
};

describe('gold bank floor (B3-3)', () => {
  it(`has at least N=${GOLD_BANK_N_PER_AREA} human-reviewed seed questions per area`, () => {
    for (const [area, questions] of Object.entries(GOLD_BY_AREA)) {
      expect(questions.length, area).toBeGreaterThanOrEqual(GOLD_BANK_N_PER_AREA);
      for (const q of questions) {
        expect(q.version ?? 1, `${area}/${q.id}`).toBeGreaterThanOrEqual(1);
        expect(q.correctAnswer, `${area}/${q.id}`).toBeTruthy();
        expect(q.explanation, `${area}/${q.id}`).toBeTruthy();
      }
    }
  });
});
