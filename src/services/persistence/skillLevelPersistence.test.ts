import { describe, expect, it, vi, beforeEach } from 'vitest';

import {
  hasCompletedLevelAssessment,
  persistLevelAssessment,
} from '@/services/persistence/skillLevelPersistence';

vi.mock('@/services/supabase/UserSupabaseService', () => ({
  default: {
    updateSkillLevel: vi.fn(),
    getByUserId: vi.fn(),
  },
}));

vi.mock('@/services/persistence/apiMode', () => ({
  isSupabaseMode: vi.fn(() => true),
}));

import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { isSupabaseMode } from '@/services/persistence/apiMode';

describe('skillLevelPersistence', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
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

  it('persiste solo en localStorage en modo demo', async () => {
    await persistLevelAssessment(
      'demo',
      { level: 'basics', completedAt: '2026-01-01T00:00:00.000Z' },
      null
    );

    expect(storage.get('icfes_level_assessment_done_demo')).toBe('true');
    expect(storage.get('icfes_skill_level_demo')).toBe('basics');
    expect(UserSupabaseService.updateSkillLevel).not.toHaveBeenCalled();
  });

  it('persiste en Supabase y caché local para cuenta', async () => {
    vi.mocked(isSupabaseMode).mockReturnValue(true);
    vi.mocked(UserSupabaseService.updateSkillLevel).mockResolvedValue({
      id: 'user-1',
      email: null,
      displayName: null,
      username: null,
      bio: null,
      profileImage: null,
      virtualMoney: 0,
      skillLevel: 'advanced',
      levelAssessmentCompletedAt: '2026-01-01T00:00:00.000Z',
      createdAt: null,
      updatedAt: null,
    });

    await persistLevelAssessment(
      'user-1',
      { level: 'advanced', completedAt: '2026-01-01T00:00:00.000Z' },
      'user-1'
    );

    expect(UserSupabaseService.updateSkillLevel).toHaveBeenCalledWith('user-1', 'advanced');
    expect(storage.get('icfes_skill_level_user-1')).toBe('advanced');
  });

  it('lee nivel completado desde Supabase si no hay caché local', async () => {
    vi.mocked(isSupabaseMode).mockReturnValue(true);
    vi.mocked(UserSupabaseService.getByUserId).mockResolvedValue({
      id: 'user-2',
      email: null,
      displayName: null,
      username: null,
      bio: null,
      profileImage: null,
      virtualMoney: 0,
      skillLevel: 'intermediate',
      levelAssessmentCompletedAt: '2026-01-01T00:00:00.000Z',
      createdAt: null,
      updatedAt: null,
    });

    const done = await hasCompletedLevelAssessment('user-2', 'user-2');
    expect(done).toBe(true);
    expect(storage.get('icfes_skill_level_user-2')).toBe('intermediate');
  });
});
