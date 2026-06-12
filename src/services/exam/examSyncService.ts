import {
  buildMigratedExamId,
  mapLocalAttemptToExamResult,
  type LocalAttemptRecord,
} from '@/services/demo/mapLocalAttemptToExamResult';
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import type { AreaStatItem, AttemptWithQuestions, ProgressData } from '@/storage/progressStorage';
import { isAnswerCorrect } from '@/features/exam/utils/answerKey';

const AREA_BUCKETS: Record<string, { key: string; icon: string; color: string }> = {
  Matemáticas: { key: 'matematicas', icon: 'calculator', color: 'from-yellow-500 to-yellow-600' },
  'Lectura Crítica': { key: 'lenguaje', icon: 'book-open', color: 'from-blue-500 to-blue-600' },
  'Ciencias Naturales': { key: 'ciencias', icon: 'flask', color: 'from-green-500 to-green-600' },
  'Sociales y Ciudadanas': { key: 'sociales', icon: 'landmark', color: 'from-orange-500 to-orange-600' },
};

function initAreaBuckets(): Record<string, { total: number; correct: number }> {
  return {
    Matemáticas: { total: 0, correct: 0 },
    'Lectura Crítica': { total: 0, correct: 0 },
    'Ciencias Naturales': { total: 0, correct: 0 },
    'Sociales y Ciudadanas': { total: 0, correct: 0 },
  };
}

function buildAreaStats(areaBuckets: Record<string, { total: number; correct: number }>): ProgressData['areaStats'] {
  const areaStats = {} as ProgressData['areaStats'];
  for (const [label, meta] of Object.entries(AREA_BUCKETS)) {
    const bucket = areaBuckets[label];
    areaStats[meta.key as keyof ProgressData['areaStats']] = {
      name: label,
      correct: bucket.correct,
      total: bucket.total,
      percentage: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0,
      icon: meta.icon,
      color: meta.color,
    };
  }
  return areaStats;
}

function accumulateQuestionStats(
  questions: Array<{ id?: string; areaLabel?: string; correctAnswer?: string }>,
  answers: Record<string, string>,
  areaBuckets: Record<string, { total: number; correct: number }>
): { totalQuestions: number; totalCorrect: number } {
  let totalQuestions = 0;
  let totalCorrect = 0;

  for (const question of questions) {
    if (!question.id) continue;
    const areaLabel = question.areaLabel || 'Desconocido';
    totalQuestions += 1;
    if (areaBuckets[areaLabel]) areaBuckets[areaLabel].total += 1;

    if (isAnswerCorrect(answers[question.id] ?? '', question.correctAnswer ?? '')) {
      totalCorrect += 1;
      if (areaBuckets[areaLabel]) areaBuckets[areaLabel].correct += 1;
    }
  }

  return { totalQuestions, totalCorrect };
}

export function mapExamResultRowToAttempt(
  row: Record<string, unknown>
): AttemptWithQuestions & Record<string, unknown> {
  const questionsPayload = row.questions;
  let questions: unknown[] = [];
  let answers: Record<string, string> = {};
  let areaName: string | undefined;
  let config: unknown;
  let examMode: string | undefined;
  let phaseSkipSectionId: string | undefined;

  if (questionsPayload && typeof questionsPayload === 'object' && !Array.isArray(questionsPayload)) {
    const payload = questionsPayload as Record<string, unknown>;
    questions = (payload.questions as unknown[]) ?? [];
    answers = (payload.answers as Record<string, string>) ?? {};
    areaName = payload.areaName as string | undefined;
    config = payload.config;
    examMode = payload.examMode as string | undefined;
    phaseSkipSectionId = payload.phaseSkipSectionId as string | undefined;
  } else if (Array.isArray(questionsPayload)) {
    questions = questionsPayload;
  }

  const examType = String(row.exam_type ?? '');
  const isFullExam = examType === 'full-exam';

  return {
    id: row.id as string,
    type: isFullExam ? 'full-exam' : 'practice',
    date: String(row.completed_at ?? ''),
    completedAt: String(row.completed_at ?? ''),
    questions: questions as AttemptWithQuestions['questions'],
    answers,
    correctCount: Number(row.correct_answers ?? 0),
    percentage: Number(row.score ?? 0),
    totalQuestions: Number(row.total_questions ?? 0),
    config,
    ...(isFullExam
      ? {}
      : {
          practiceArea: examType,
          areaName,
          examMode,
          phaseSkipSectionId,
        }),
  };
}

export function mergeAttemptHistories(
  userId: string,
  localAttempts: AttemptWithQuestions[],
  remoteAttempts: AttemptWithQuestions[]
): AttemptWithQuestions[] {
  const remoteIds = new Set(remoteAttempts.map((attempt) => String(attempt.id ?? '')));
  const localOnly = localAttempts.filter((attempt) => {
    const migratedId = buildMigratedExamId(userId, attempt as LocalAttemptRecord);
    return !remoteIds.has(migratedId);
  });

  return [...remoteAttempts, ...localOnly]
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
    .slice(0, 50);
}

export async function syncAttemptToSupabase(userId: string, attempt: LocalAttemptRecord): Promise<boolean> {
  if (!isSupabaseConfigured() || isDemoUserId(userId)) return false;

  try {
    const row = mapLocalAttemptToExamResult(userId, attempt);
    const inserted = await ExamSupabaseService.insertMigratedAttempt(row);
    await rebuildUserProgress(userId);
    return inserted;
  } catch (err) {
    console.warn('No se pudo sincronizar intento a Supabase:', err);
    return false;
  }
}

export async function rebuildUserProgress(userId: string): Promise<void> {
  if (!isSupabaseConfigured() || isDemoUserId(userId)) return;

  const rows = await ExamSupabaseService.getByUserId(userId, { includeQuestions: true });
  if (rows.length === 0) {
    await ProgressSupabaseService.upsert(userId, {
      totalAttempts: 0,
      totalCorrect: 0,
      percentage: 0,
      areaStats: buildAreaStats(initAreaBuckets()),
    });
    return;
  }

  const areaBuckets = initAreaBuckets();
  let totalCorrect = 0;
  let totalQuestions = 0;
  let lastActivityDate: string | null = null;

  for (const row of rows) {
    const rowCorrect = Number(row.correct_answers ?? 0);
    const rowTotal = Number(row.total_questions ?? 0);
    totalCorrect += rowCorrect;
    totalQuestions += rowTotal;

    const completedAt = String(row.completed_at ?? '');
    if (completedAt && (!lastActivityDate || completedAt > lastActivityDate)) {
      lastActivityDate = completedAt;
    }

    const questionsPayload = row.questions;
    if (questionsPayload && typeof questionsPayload === 'object' && !Array.isArray(questionsPayload)) {
      const payload = questionsPayload as Record<string, unknown>;
      accumulateQuestionStats(
        (payload.questions as Array<{ id?: string; areaLabel?: string; correctAnswer?: string }>) ?? [],
        (payload.answers as Record<string, string>) ?? {},
        areaBuckets
      );
    }
  }

  const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  await ProgressSupabaseService.upsert(userId, {
    totalAttempts: rows.length,
    totalCorrect,
    percentage,
    lastActivityDate,
    areaStats: buildAreaStats(areaBuckets),
  });
}

export async function fetchRemoteAttempts(userId: string): Promise<AttemptWithQuestions[]> {
  if (!isSupabaseConfigured() || isDemoUserId(userId)) return [];
  const rows = await ExamSupabaseService.getByUserId(userId, { limit: 50 });
  return rows.map((row) => mapExamResultRowToAttempt(row));
}
