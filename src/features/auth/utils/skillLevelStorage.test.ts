import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  isLevelAssessmentDone,
  markLevelAssessmentDone,
  resolveAssessmentScope,
} from '@/features/auth/utils/skillLevelStorage';

describe('skillLevelStorage', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.restoreAllMocks();
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

  it('resuelve scope demo y cuenta', () => {
    expect(resolveAssessmentScope({ demoMode: true, userId: 'u1' })).toBe('demo');
    expect(resolveAssessmentScope({ demoMode: false, userId: 'u1' })).toBe('u1');
  });

  it('marca evaluación completada por scope', () => {
    markLevelAssessmentDone('demo', {
      level: 'basics',
      completedAt: new Date().toISOString(),
    });
    expect(isLevelAssessmentDone('demo')).toBe(true);
    expect(isLevelAssessmentDone('u1')).toBe(false);
  });
});
