import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { PHASE_SKIP_PASS_PERCENT, PHASE_SKIP_REWARD_COINS, PHASE_SKIP_REWARD_XP } from './phaseSkipConstants';
import { signPhaseSkipSession } from './phaseSkipSessionToken';

vi.mock('@/services/supabase/LearningSupabaseServer', () => ({
  loadLessonQuizQuestionsBatch: vi.fn(),
}));

vi.mock('@/services/supabase/gamification/gamificationServerEconomy', () => ({
  hasRewardReason: vi.fn(),
  addXpServer: vi.fn(),
  addCoinsServer: vi.fn(),
}));

import { loadLessonQuizQuestionsBatch } from '@/services/supabase/LearningSupabaseServer';
import {
  addCoinsServer,
  addXpServer,
  hasRewardReason,
} from '@/services/supabase/gamification/gamificationServerEconomy';
import { countPhaseSkipQuestionsAvailable, gradePhaseSkipSession } from './phaseSkipServer';

function q(id: string, correct = 'a'): NormalizedQuizQuestion {
  return {
    id,
    question: `Pregunta ${id}`,
    options: [
      { id: 'a', text: 'A' },
      { id: 'b', text: 'B' },
    ],
    correctAnswer: correct,
    explanation: 'exp',
    difficulty: 'facil',
  };
}

function buildLoaded(lessonCount: number, perLesson: number) {
  return Array.from({ length: lessonCount }, (_, i) => ({
    lessonId: `lesson-${i}`,
    questions: Array.from({ length: perLesson }, (_, j) => q(`lesson-${i}-q${j}`)),
  }));
}

describe('countPhaseSkipQuestionsAvailable', () => {
  beforeEach(() => {
    vi.mocked(loadLessonQuizQuestionsBatch).mockReset();
  });

  it('marca canStart false cuando hay menos de 120 preguntas', async () => {
    vi.mocked(loadLessonQuizQuestionsBatch).mockResolvedValue(buildLoaded(10, 5));

    const result = await countPhaseSkipQuestionsAvailable(
      Array.from({ length: 10 }, (_, i) => `lesson-${i}`)
    );

    expect(result.totalQuestions).toBe(50);
    expect(result.canStart).toBe(false);
  });

  it('marca canStart true cuando hay al menos 120 preguntas', async () => {
    vi.mocked(loadLessonQuizQuestionsBatch).mockResolvedValue(buildLoaded(40, 4));

    const result = await countPhaseSkipQuestionsAvailable(
      Array.from({ length: 40 }, (_, i) => `lesson-${i}`)
    );

    expect(result.totalQuestions).toBe(160);
    expect(result.canStart).toBe(true);
  });
});

describe('gradePhaseSkipSession', () => {
  beforeEach(() => {
    vi.mocked(hasRewardReason).mockReset();
    vi.mocked(addXpServer).mockReset();
    vi.mocked(addCoinsServer).mockReset();
  });

  it('aprueba en el límite del 70% y otorga recompensas', async () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({
      ...q(`q${i}`),
      id: `lesson-0__q${i}`,
    }));
    const token = signPhaseSkipSession({
      areaId: 'lectura-critica',
      sectionId: 'facil',
      lessonIds: ['lesson-0'],
      questions,
    });

    const answers: Record<string, string> = {};
    const correctNeeded = Math.ceil((questions.length * PHASE_SKIP_PASS_PERCENT) / 100);
    questions.forEach((question, index) => {
      answers[question.id] = index < correctNeeded ? 'a' : 'b';
    });

    vi.mocked(hasRewardReason).mockResolvedValue(false);
    vi.mocked(addXpServer).mockResolvedValue({ awarded: true, xp: 1000 });
    vi.mocked(addCoinsServer).mockResolvedValue({ awarded: true, coins: 500 });

    const result = await gradePhaseSkipSession(token, answers, 'user-1');

    expect(result.passed).toBe(true);
    expect(result.score).toBe(70);
    expect(result.rewards).toEqual({
      xp: PHASE_SKIP_REWARD_XP,
      coins: PHASE_SKIP_REWARD_COINS,
      alreadyAwarded: false,
    });
    expect(addXpServer).toHaveBeenCalledWith('user-1', PHASE_SKIP_REWARD_XP, 'phase_skip_lectura-critica_facil');
  });

  it('no otorga recompensas duplicadas si ya se cobró', async () => {
    const questions = [{ ...q('q0'), id: 'lesson-0__q0' }];
    const token = signPhaseSkipSession({
      areaId: 'matematicas',
      sectionId: 'facil',
      lessonIds: ['lesson-0'],
      questions,
    });

    vi.mocked(hasRewardReason).mockResolvedValue(true);

    const result = await gradePhaseSkipSession(token, { 'lesson-0__q0': 'a' }, 'user-1');

    expect(result.passed).toBe(true);
    expect(result.rewards).toEqual({ xp: 0, coins: 0, alreadyAwarded: true });
    expect(addXpServer).not.toHaveBeenCalled();
  });

  it('reproba por debajo del 70%', async () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({
      ...q(`q${i}`),
      id: `lesson-0__q${i}`,
    }));
    const token = signPhaseSkipSession({
      areaId: 'lectura-critica',
      sectionId: 'facil',
      lessonIds: ['lesson-0'],
      questions,
    });

    const answers: Record<string, string> = {};
    questions.forEach((question, index) => {
      answers[question.id] = index < 6 ? 'a' : 'b';
    });

    const result = await gradePhaseSkipSession(token, answers, 'user-1');

    expect(result.passed).toBe(false);
    expect(result.score).toBe(60);
    expect(result.rewards).toBeUndefined();
  });
});
