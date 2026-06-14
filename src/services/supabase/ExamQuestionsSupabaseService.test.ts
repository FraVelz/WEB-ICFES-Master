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
