import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildUserResultsExport,
  downloadUserResultsExport,
  userResultsExportFilename,
} from './exportUserResults';

vi.mock('@/storage/progressStorage', () => ({
  getProgress: vi.fn(() => ({
    totalAttempts: 2,
    totalQuestions: 10,
    totalCorrect: 7,
    percentage: 70,
    streakDays: 1,
    lastAttemptDate: '2026-07-15T00:00:00.000Z',
    areaStats: {},
  })),
  getStoredPractices: vi.fn(() => [{ id: 1, type: 'practice', date: '2026-07-14T12:00:00.000Z', percentage: 80 }]),
  getStoredExams: vi.fn(() => [{ id: 2, type: 'full-exam', date: '2026-07-13T12:00:00.000Z', percentage: 60 }]),
}));

describe('exportUserResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds a versioned snapshot of progress, practices, and exams', () => {
    const now = new Date('2026-07-15T18:00:00.000Z');
    const payload = buildUserResultsExport(now);
    expect(payload.version).toBe(1);
    expect(payload.exportedAt).toBe('2026-07-15T18:00:00.000Z');
    expect(payload.progress?.totalAttempts).toBe(2);
    expect(payload.practices).toHaveLength(1);
    expect(payload.exams).toHaveLength(1);
  });

  it('names the download file with a date stamp', () => {
    expect(userResultsExportFilename(new Date('2026-07-15T18:00:00.000Z'))).toBe(
      'icfes-master-resultados-2026-07-15.json'
    );
  });

  it('downloads a JSON blob in the browser', () => {
    const click = vi.fn();
    const remove = vi.fn();
    const revoke = vi.fn();
    const createObjectURL = vi.fn(() => 'blob:mock');
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL: revoke });

    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
      if (tag === 'a') {
        return { href: '', download: '', rel: '', click, remove } as unknown as HTMLAnchorElement;
      }
      return document.createElement(tag);
    }) as typeof document.createElement);

    const payload = downloadUserResultsExport(new Date('2026-07-15T18:00:00.000Z'));
    expect(payload.version).toBe(1);
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
    expect(revoke).toHaveBeenCalledWith('blob:mock');

    appendChild.mockRestore();
    vi.unstubAllGlobals();
  });
});
