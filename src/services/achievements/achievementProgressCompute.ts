import { ACHIEVEMENTS_DATA } from '@/shared/constants/achievementsData';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import { calculateLevel } from '@/services/gamification/gamificationUtils';
import { getStreakMetrics, loadStreakState, type StreakScope } from '@/services/streak';
import { getCompletedLessons, getStoredExams, getStoredPractices } from '@/storage/progressStorage';
import { loadLecturaReadSections } from '@/features/lectura/services/lecturaReadPersistence';
import { getStudyTimeStats } from '@/services/studyTime/studyTimeService';
import type { AchievementProgressMap, SyncAchievementsOptions } from './achievementProgressTypes';

function toStreakScope(userId: string): StreakScope {
  return isDemoUserId(userId) ? 'demo' : userId;
}

function countPerfectAttempts(items: Array<Record<string, unknown>>): number {
  return items.filter((item) => Number(item.percentage) === 100).length;
}

async function readLevel(userId: string): Promise<number> {
  if (isDemoUserId(userId)) {
    return calculateLevel(getDemoTotalXP());
  }

  try {
    const profile = await gamificationPersistence.getProfile(userId);
    return calculateLevel(Number(profile?.xp ?? 0));
  } catch {
    return 1;
  }
}

function buildProgressFromGameplay(
  completedLessons: number,
  practiceCount: number,
  examCount: number,
  perfectCount: number,
  currentStreak: number,
  level: number,
  readImportancia: number,
  readInformacion: number,
  readConsejos: number,
  longestStudySessionMinutes: number
): AchievementProgressMap {
  const metrics: Record<string, number> = {
    study_1: completedLessons,
    study_2: completedLessons,
    perf_1: perfectCount,
    const_1: currentStreak,
    meta_1: level,
    practice_1: practiceCount,
    practice_5: practiceCount,
    exam_1: examCount,
    time_1: longestStudySessionMinutes,
    read_importancia: readImportancia,
    read_informacion: readInformacion,
    read_consejos: readConsejos,
  };

  const next: AchievementProgressMap = {};

  for (const achievement of ACHIEVEMENTS_DATA) {
    const current = metrics[achievement.id] ?? 0;
    const unlocked = current >= achievement.target;
    next[achievement.id] = {
      current: Math.min(current, achievement.target),
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : null,
    };
  }

  return next;
}

export async function computeAchievementProgressFromGameplay(
  userId: string,
  options: Pick<SyncAchievementsOptions, 'userLevel' | 'currentStreak'> = {}
): Promise<AchievementProgressMap> {
  const scope = toStreakScope(userId);
  const currentStreak = options.currentStreak ?? getStreakMetrics(await loadStreakState(scope)).currentStreak;
  const level = options.userLevel ?? (await readLevel(userId));
  const readSections = loadLecturaReadSections(userId);
  const studyTime = getStudyTimeStats(userId);
  const practices = getStoredPractices() as Array<Record<string, unknown>>;
  const exams = getStoredExams() as Array<Record<string, unknown>>;

  return buildProgressFromGameplay(
    getCompletedLessons().length,
    practices.length,
    exams.length,
    countPerfectAttempts(practices) + countPerfectAttempts(exams),
    currentStreak,
    level,
    readSections.includes('importancia') ? 1 : 0,
    readSections.includes('informacion') ? 1 : 0,
    readSections.includes('consejos') ? 1 : 0,
    studyTime.longestSessionMinutes
  );
}
