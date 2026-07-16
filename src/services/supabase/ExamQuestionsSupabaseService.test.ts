import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockIn = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

function buildQueryChain() {
  const chain = {
    select: mockSelect.mockReturnThis(),
    eq: mockEq.mockReturnThis(),
    in: mockIn.mockReturnThis(),
    order: mockOrder.mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  };
  mockFrom.mockReturnValue(chain);
  mockOrder.mockImplementation(() => chain);
  return chain;
}

vi.mock('@/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import ExamQuestionsSupabaseService from './ExamQuestionsSupabaseService';

describe('ExamQuestionsSupabaseService.getByRouteAreas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildQueryChain();
    mockOrder.mockImplementation(function (this: { order: typeof mockOrder }) {
      if (mockOrder.mock.calls.length >= 2) {
        return Promise.resolve({
          data: [
            {
              id: 'q1',
              area: 'matematicas',
              text: 'Test',
              options: [],
              explanation: null,
              difficulty: null,
              published: true,
              order_index: 0,
            },
          ],
          error: null,
        });
      }
      return this;
    });
  });

  it('uses a single .in() query for multiple route areas', async () => {
    const result = await ExamQuestionsSupabaseService.getByRouteAreas([
      'matematicas',
      'lectura-critica',
      'ciencias-naturales',
    ]);

    expect(mockFrom).toHaveBeenCalledWith('exam_questions_public');
    expect(mockIn).toHaveBeenCalledTimes(1);
    expect(mockIn).toHaveBeenCalledWith('area', ['matematicas', 'lectura_critica', 'ciencias_naturales']);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('q1');
  });

  it('returns empty array when route areas are unknown', async () => {
    const result = await ExamQuestionsSupabaseService.getByRouteAreas(['unknown-area']);
    expect(mockFrom).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});

describe('ExamQuestionsSupabaseService.countPublishedByRouteAreas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockImplementation(() => {
      let dbArea: string | null = null;
      const chain = {
        select: (...args: unknown[]) => {
          mockSelect(...args);
          return chain;
        },
        eq: (column: string, value: string) => {
          mockEq(column, value);
          if (column === 'area') {
            dbArea = value;
            return chain;
          }
          const count = dbArea === 'matematicas' ? 12 : dbArea === 'ingles' ? 0 : 3;
          return Promise.resolve({ count, error: null, data: null });
        },
      };
      return chain;
    });
  });

  it('counts published questions per route area with head queries', async () => {
    const result = await ExamQuestionsSupabaseService.countPublishedByRouteAreas(['matematicas', 'ingles']);

    expect(mockFrom).toHaveBeenCalledWith('exam_questions_public');
    expect(mockSelect).toHaveBeenCalledWith('id', { count: 'exact', head: true });
    expect(result).toEqual({ matematicas: 12, ingles: 0 });
  });

  it('returns zeros without querying when areas are unknown', async () => {
    const result = await ExamQuestionsSupabaseService.countPublishedByRouteAreas(['unknown-area']);
    expect(mockFrom).not.toHaveBeenCalled();
    expect(result).toEqual({ 'unknown-area': 0 });
  });
});
