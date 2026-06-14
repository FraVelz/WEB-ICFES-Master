import { BLOCK_EXAM_PASS_PERCENT } from '@/services/persistence/blockExamPersistence';
import { parseBlockCheckpointId } from '@/features/learning/data/phase1Blocks';
import { findPhaseBlockDef } from '@/features/learning/data/phaseBlocks';
import { gradeLessonQuizAnswersPure } from '@/features/learning/roadmap/lessonQuiz/gradeLessonQuizAnswersPure';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { loadLessonQuizQuestionsBatch } from '@/services/supabase/LearningSupabaseServer';
import {
  addCoinsServer,
  addXpServer,
  hasRewardReason,
} from '@/services/supabase/gamification/gamificationServerEconomy';
import type { AreaId } from '@/shared/constants';
import { signBlockExamSession, stripCorrectAnswers, verifyBlockExamSession } from './blockExamSessionToken';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickBlockExamQuestionCount(lessonCount: number): number {
  return Math.min(8, Math.max(5, lessonCount));
}

export function pickBlockExamQuestions(
  questionsByLesson: Map<string, NormalizedQuizQuestion[]>,
  lessonIds: string[]
): NormalizedQuizQuestion[] {
  const targetCount = pickBlockExamQuestionCount(lessonIds.length);
  const shuffledLessonIds = shuffle(lessonIds.filter((id) => (questionsByLesson.get(id)?.length ?? 0) > 0));
  const picked: NormalizedQuizQuestion[] = [];

  for (const lessonId of shuffledLessonIds) {
    if (picked.length >= targetCount) break;
    const pool = questionsByLesson.get(lessonId) ?? [];
    if (pool.length === 0) continue;
    const question = pool[Math.floor(Math.random() * pool.length)];
    picked.push({
      ...question,
      id: `${lessonId}__${question.id}`,
    });
  }

  return picked;
}

export async function startBlockExamSession(checkpointId: string, lessonIds?: string[]) {
  const parsed = parseBlockCheckpointId(checkpointId);
  if (!parsed) {
    throw new Error('Checkpoint de bloque no válido');
  }

  const { areaId, blockId } = parsed;
  const block = findPhaseBlockDef(areaId, blockId);
  const poolLessonIds = lessonIds?.length ? lessonIds : [];

  if (poolLessonIds.length === 0) {
    throw new Error('No hay lecciones en este bloque');
  }

  const loaded = await loadLessonQuizQuestionsBatch(poolLessonIds);
  const questionsByLesson = new Map<string, NormalizedQuizQuestion[]>();
  for (const entry of loaded) {
    questionsByLesson.set(entry.lessonId, entry.questions);
  }

  const questions = pickBlockExamQuestions(questionsByLesson, poolLessonIds);
  if (questions.length === 0) {
    throw new Error('Este bloque no tiene preguntas de quiz disponibles');
  }

  const sessionToken = signBlockExamSession({
    checkpointId,
    areaId,
    blockId,
    questions,
  });

  return {
    checkpointId,
    areaId,
    blockId,
    blockTitle: block?.title ?? blockId,
    passPercent: BLOCK_EXAM_PASS_PERCENT,
    sessionToken,
    questions: stripCorrectAnswers(questions),
    totalQuestions: questions.length,
  };
}

export async function gradeBlockExamSession(sessionToken: string, answers: Record<string, string>, userId: string) {
  const session = verifyBlockExamSession(sessionToken);
  if (!session) {
    throw new Error('La sesión del examen expiró. Vuelve a iniciarlo.');
  }

  const { results, allCorrect } = gradeLessonQuizAnswersPure(session.questions, answers);
  const answeredCount = session.questions.filter((question) => answers[question.id] != null).length;
  const correctCount = results.filter((result) => result.correct).length;
  const allAnswered = session.questions.every((question) => answers[question.id] != null);
  const score = allAnswered ? Math.round((correctCount / session.questions.length) * 100) : 0;
  const passed = allAnswered && score >= BLOCK_EXAM_PASS_PERCENT;

  let rewards: { xp: number; coins: number; alreadyAwarded?: boolean } | undefined;
  if (passed && allAnswered) {
    const reason = `block_exam_${session.checkpointId}`;
    if (await hasRewardReason(userId, reason)) {
      rewards = { xp: 0, coins: 0, alreadyAwarded: true };
    } else {
      const block = getPhase1BlockDef(session.areaId as AreaId, session.blockId);
      const xp = 80;
      const coins = 40;
      const [xpResult, coinsResult] = await Promise.all([
        addXpServer(userId, xp, reason),
        addCoinsServer(userId, coins, reason),
      ]);
      rewards = {
        xp: xpResult.awarded ? xp : 0,
        coins: coinsResult.awarded ? coins : 0,
        alreadyAwarded: !xpResult.awarded && !coinsResult.awarded,
      };
    }
  }

  return {
    passed,
    score,
    allCorrect,
    correctCount,
    totalQuestions: session.questions.length,
    results,
    areaId: session.areaId,
    blockId: session.blockId,
    checkpointId: session.checkpointId,
    rewards,
  };
}

export type BlockExamStartResult = Awaited<ReturnType<typeof startBlockExamSession>>;
export type BlockExamGradeResult = Awaited<ReturnType<typeof gradeBlockExamSession>>;

export function getBlockExamTitle(block: Phase1BlockDef | undefined, blockId: string): string {
  return block?.title ?? blockId;
}
