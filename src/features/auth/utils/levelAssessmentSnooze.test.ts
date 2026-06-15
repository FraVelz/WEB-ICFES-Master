import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isLevelAssessmentSnoozed,
  LEVEL_ASSESSMENT_SNOOZE_MS,
  snoozeLevelAssessment,
  clearLevelAssessmentSnooze,
} from './levelAssessmentSnooze';

describe('levelAssessmentSnooze', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => storage.clear(),
    });
  });

  it('marca snooze activo durante el periodo configurado', () => {
    const now = 1_700_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    snoozeLevelAssessment('demo');
    expect(isLevelAssessmentSnoozed('demo')).toBe(true);

    vi.spyOn(Date, 'now').mockReturnValue(now + LEVEL_ASSESSMENT_SNOOZE_MS - 1);
    expect(isLevelAssessmentSnoozed('demo')).toBe(true);

    vi.spyOn(Date, 'now').mockReturnValue(now + LEVEL_ASSESSMENT_SNOOZE_MS);
    expect(isLevelAssessmentSnoozed('demo')).toBe(false);
  });

  it('clearLevelAssessmentSnooze elimina el aplazamiento', () => {
    snoozeLevelAssessment('user-1');
    clearLevelAssessmentSnooze('user-1');
    expect(isLevelAssessmentSnoozed('user-1')).toBe(false);
  });
});
