import { getCompetencyPhaseBySectionId } from '@/features/learning/data/competencyPhases';
import { gradeLessonQuizAnswersPure } from '@/features/learning/roadmap/lessonQuiz/gradeLessonQuizAnswersPure';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { loadLessonQuizQuestionsBatch } from '@/services/supabase/LearningSupabaseServer';
import {
  addCoinsServer,
  addXpServer,
  hasRewardReason,
} from '@/services/supabase/gamification/gamificationServerEconomy';
import {
  getPhaseSkipRewardReason,
  PHASE_SKIP_MIN_QUESTIONS,
  PHASE_SKIP_PASS_PERCENT,
  PHASE_SKIP_REWARD_COINS,
  PHASE_SKIP_REWARD_XP,
} from './phaseSkipConstants';
import {
  countPhaseSkipPoolQuestions,
  InsufficientPhaseSkipQuestionsError,
  pickPhaseSkipQuestions,
} from './phaseSkipQuestionPicker';
import { signPhaseSkipSession, stripCorrectAnswers, verifyPhaseSkipSession } from './phaseSkipSessionToken';

async function loadQuestionsByLesson(lessonIds: string[]): Promise<Map<string, NormalizedQuizQuestion[]>> {
  const loaded = await loadLessonQuizQuestionsBatch(lessonIds);
  const questionsByLesson = new Map<string, NormalizedQuizQuestion[]>();
  for (const entry of loaded) {
    questionsByLesson.set(entry.lessonId, entry.questions);
  }
  return questionsByLesson;
}

export async function countPhaseSkipQuestionsAvailable(lessonIds: string[]) {
  if (!lessonIds.length) {
    return {
      totalQuestions: 0,
      lessonCount: 0,
      lessonsWithQuiz: 0,
      canStart: false,
      minRequired: PHASE_SKIP_MIN_QUESTIONS,
    };
  }

  const questionsByLesson = await loadQuestionsByLesson(lessonIds);
  const totalQuestions = countPhaseSkipPoolQuestions(questionsByLesson);
  let lessonsWithQuiz = 0;
  for (const lessonId of lessonIds) {
    if ((questionsByLesson.get(lessonId)?.length ?? 0) > 0) lessonsWithQuiz += 1;
  }

  return {
    totalQuestions,
    lessonCount: lessonIds.length,
    lessonsWithQuiz,
    canStart: totalQuestions >= PHASE_SKIP_MIN_QUESTIONS,
    minRequired: PHASE_SKIP_MIN_QUESTIONS,
  };
}

export async function startPhaseSkipSession(areaId: string, sectionId: string, lessonIds: string[]) {
  if (!getCompetencyPhaseBySectionId(sectionId)) {
    throw new Error('Etapa de fase no válida');
  }

  if (!lessonIds.length) {
    throw new Error('No hay lecciones en esta fase');
  }

  const questionsByLesson = await loadQuestionsByLesson(lessonIds);
  const questions = pickPhaseSkipQuestions(questionsByLesson, lessonIds);

  const sessionToken = signPhaseSkipSession({
    areaId,
    sectionId,
    lessonIds,
    questions,
  });

  const phase = getCompetencyPhaseBySectionId(sectionId);

  return {
    areaId,
    sectionId,
    phaseTitle: phase?.title ?? sectionId,
    passPercent: PHASE_SKIP_PASS_PERCENT,
    sessionToken,
    questions: stripCorrectAnswers(questions),
    totalQuestions: questions.length,
    minRequired: PHASE_SKIP_MIN_QUESTIONS,
  };
}

export async function gradePhaseSkipSession(sessionToken: string, answers: Record<string, string>, userId: string) {
  const session = verifyPhaseSkipSession(sessionToken);
  if (!session) {
    throw new Error('La sesión del simulacro expiró. Vuelve a iniciarlo.');
  }

  const { results, allCorrect } = gradeLessonQuizAnswersPure(session.questions, answers);
  const correctCount = results.filter((result) => result.correct).length;
  const allAnswered = session.questions.every((question) => answers[question.id] != null);
  const score = allAnswered ? Math.round((correctCount / session.questions.length) * 100) : 0;
  const passed = allAnswered && score >= PHASE_SKIP_PASS_PERCENT;

  let rewards: { xp: number; coins: number; alreadyAwarded?: boolean } | undefined;
  if (passed && allAnswered) {
    const reason = getPhaseSkipRewardReason(session.areaId, session.sectionId);
    if (await hasRewardReason(userId, reason)) {
      rewards = { xp: 0, coins: 0, alreadyAwarded: true };
    } else {
      const [xpResult, coinsResult] = await Promise.all([
        addXpServer(userId, PHASE_SKIP_REWARD_XP, reason),
        addCoinsServer(userId, PHASE_SKIP_REWARD_COINS, reason),
      ]);
      rewards = {
        xp: xpResult.awarded ? PHASE_SKIP_REWARD_XP : 0,
        coins: coinsResult.awarded ? PHASE_SKIP_REWARD_COINS : 0,
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
    sectionId: session.sectionId,
    lessonIds: session.lessonIds,
    rewards,
    lessonsCompletedCount: passed ? session.lessonIds.length : 0,
  };
}

export type PhaseSkipStartResult = Awaited<ReturnType<typeof startPhaseSkipSession>>;
export type PhaseSkipGradeResult = Awaited<ReturnType<typeof gradePhaseSkipSession>>;
export type PhaseSkipAvailabilityResult = Awaited<ReturnType<typeof countPhaseSkipQuestionsAvailable>>;

export { InsufficientPhaseSkipQuestionsError };
