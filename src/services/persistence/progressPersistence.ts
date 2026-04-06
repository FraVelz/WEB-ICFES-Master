/**
 * Progreso: una sola entrada para Supabase o localStorage.
 */
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import {
  getProgress,
  getStoredExams,
  getStoredPractices,
  clearAllData,
  getRecommendations,
  getDefaultProgress,
  type ProgressData,
  type AttemptWithQuestions,
} from '@/shared/utils/progressStorage';
import { isSupabaseMode } from './apiMode';

export type ProgressViewState = {
  progress: ProgressData | null;
  areaStats: Record<string, unknown> | null;
  recommendations: string[];
  attemptHistory: AttemptWithQuestions[];
};

export async function loadProgressViewState(userId: string): Promise<ProgressViewState> {
  if (isSupabaseMode()) {
    const prog = await ProgressSupabaseService.getByUserId(userId);
    const mapped: ProgressData | null = prog
      ? {
          totalAttempts: prog.totalAttempts,
          totalQuestions: prog.totalCorrect * 2,
          totalCorrect: prog.totalCorrect,
          percentage: prog.percentage,
          streakDays: prog.streakDays,
          lastAttemptDate: (prog as { lastAttemptDate?: string | null }).lastAttemptDate ?? null,
          areaStats: (prog.areaStats || {}) as ProgressData['areaStats'],
        }
      : null;
    return {
      progress: mapped,
      areaStats: mapped?.areaStats || null,
      recommendations: getRecommendations(mapped ?? getDefaultProgress()),
      attemptHistory: [],
    };
  }

  const prog = getProgress();
  const exams = getStoredExams();
  const practices = getStoredPractices();
  return {
    progress: prog,
    areaStats: prog?.areaStats || null,
    recommendations: getRecommendations(prog ?? getDefaultProgress()),
    attemptHistory: [...exams, ...practices]
      .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
      .slice(0, 50),
  };
}

export async function resetProgressData(userId: string): Promise<void> {
  if (isSupabaseMode()) {
    await ProgressSupabaseService.upsert(userId, {
      totalAttempts: 0,
      totalCorrect: 0,
      percentage: 0,
      streakDays: 0,
      areaStats: {},
    });
    return;
  }
  clearAllData();
}
