import { beforeEach, describe, expect, it, vi } from 'vitest';

import { migrateLocalAttemptsToSupabase } from '@/services/demo/migrateLocalAttemptsToSupabase';
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';

vi.mock('@/services/persistence/supabaseConfigured', () => ({
  isSupabaseConfigured: vi.fn(() => true),
}));

vi.mock('@/storage/progressStorage', () => ({
  getStoredExams: vi.fn(() => [
    { id: 1, type: 'full-exam', percentage: 70, correctCount: 7, totalQuestions: 10, date: '2026-06-01' },
  ]),
  getStoredPractices: vi.fn(() => [
    {
      id: 2,
      type: 'practice',
      practiceArea: 'matematicas',
      percentage: 90,
      correctCount: 9,
      totalQuestions: 10,
      date: '2026-06-02',
    },
  ]),
}));

vi.mock('@/services/supabase/ExamSupabaseService', () => ({
  default: {
    insertMigratedAttempt: vi.fn(async () => true),
  },
}));

describe('migrateLocalAttemptsToSupabase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('inserta cada intento local con idempotencia delegada al servicio', async () => {
    const count = await migrateLocalAttemptsToSupabase('user-abc');

    expect(count).toBe(2);
    expect(vi.mocked(ExamSupabaseService.insertMigratedAttempt)).toHaveBeenCalledTimes(2);
    expect(vi.mocked(ExamSupabaseService.insertMigratedAttempt)).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-abc', id: 'migrated_user-abc_1' })
    );
  });
});
