import { isAnswerCorrect } from '@/features/exam/utils/answerKey';

/** Simulacro general del área vs examen para saltar una fase. */
export type AreaPracticeExamMode = 'area-general' | 'phase-skip';

/** Intento guardado en localStorage (examen completo o práctica por área). */
export type LocalAttemptRecord = Record<string, unknown> & {
  id?: string | number;
  type?: string;
  date?: string;
  completedAt?: string;
  practiceArea?: string;
  examMode?: AreaPracticeExamMode;
  phaseSkipSectionId?: string;
  correctCount?: number;
  percentage?: number;
  totalQuestions?: number;
  questions?: Array<{ id?: string; correctAnswer?: string }>;
  answers?: Record<string, string>;
};

export function resolvePracticeExamMode(attempt: LocalAttemptRecord): AreaPracticeExamMode {
  if (attempt.examMode === 'phase-skip' || attempt.examMode === 'area-general') {
    return attempt.examMode;
  }
  return 'area-general';
}

export type MappedExamResultRow = {
  id: string;
  user_id: string;
  exam_type: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  completed_at: string;
  questions: Record<string, unknown>;
};

export function buildMigratedExamId(userId: string, attempt: LocalAttemptRecord): string {
  const localId = attempt.id ?? attempt.date ?? attempt.completedAt ?? 'unknown';
  return `migrated_${userId}_${localId}`;
}

function countCorrectAnswers(attempt: LocalAttemptRecord): number {
  if (typeof attempt.correctCount === 'number' && Number.isFinite(attempt.correctCount)) {
    return attempt.correctCount;
  }

  const questions = attempt.questions ?? [];
  const answers = attempt.answers ?? {};
  return questions.filter((q) => q.id && isAnswerCorrect(answers[q.id] ?? '', q.correctAnswer ?? '')).length;
}

function resolveExamType(attempt: LocalAttemptRecord): string {
  if (attempt.type === 'full-exam') return 'full-exam';
  if (typeof attempt.practiceArea === 'string' && attempt.practiceArea.length > 0) {
    return attempt.practiceArea;
  }
  return 'practice';
}

/** Mapea un intento local al esquema de `exam_results` en Supabase. */
export function mapLocalAttemptToExamResult(userId: string, attempt: LocalAttemptRecord): MappedExamResultRow {
  const totalQuestions =
    typeof attempt.totalQuestions === 'number' && attempt.totalQuestions > 0
      ? attempt.totalQuestions
      : (attempt.questions?.length ?? 0);
  const correctAnswers = countCorrectAnswers(attempt);
  const score =
    typeof attempt.percentage === 'number' && Number.isFinite(attempt.percentage)
      ? Math.round(attempt.percentage)
      : totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

  const completedAt =
    (typeof attempt.completedAt === 'string' && attempt.completedAt) ||
    (typeof attempt.date === 'string' && attempt.date) ||
    new Date().toISOString();

  return {
    id: buildMigratedExamId(userId, attempt),
    user_id: userId,
    exam_type: resolveExamType(attempt),
    score,
    correct_answers: correctAnswers,
    total_questions: totalQuestions,
    time_spent: 0,
    completed_at: completedAt,
    questions: {
      questions: attempt.questions ?? [],
      answers: attempt.answers ?? {},
      areaName: attempt.areaName,
      config: attempt.config,
      examMode: attempt.examMode ?? resolvePracticeExamMode(attempt),
      phaseSkipSectionId: attempt.phaseSkipSectionId ?? null,
      migratedFrom: 'demo',
      localAttemptId: attempt.id ?? null,
    },
  };
}
