/**
 * Progreso agregado — Supabase `user_progress` + historial local de intentos.
 */
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import { isDemoUserId } from '@/services/demo/demoCoins';
import {
  getProgress,
  getStoredExams,
  getStoredPractices,
  clearAllData,
  getRecommendations,
  getDefaultProgress,
  type ProgressData,
  type AttemptWithQuestions,
} from '@/storage/progressStorage';
import { isSupabaseConfigured } from './supabaseConfigured';

export type ProgressViewState = {
  progress: ProgressData | null;
  areaStats: Record<string, unknown> | null;
  recommendations: string[];
  attemptHistory: AttemptWithQuestions[];
};

function loadLocalProgressViewState(): ProgressViewState {
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

export async function loadProgressViewState(userId: string): Promise<ProgressViewState> {
  if (!isSupabaseConfigured() || isDemoUserId(userId)) {
    return loadLocalProgressViewState();
  }

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

  const local = loadLocalProgressViewState();

  return {
    progress: mapped ?? local.progress,
    areaStats: mapped?.areaStats ?? local.areaStats,
    recommendations: getRecommendations(mapped ?? local.progress ?? getDefaultProgress()),
    attemptHistory: local.attemptHistory,
  };
}

export async function resetProgressData(userId: string): Promise<void> {
  if (isSupabaseConfigured() && !isDemoUserId(userId)) {
    await ProgressSupabaseService.upsert(userId, {
      totalAttempts: 0,
      totalCorrect: 0,
      percentage: 0,
      streakDays: 0,
      areaStats: {},
    });
  }
  clearAllData();
}
