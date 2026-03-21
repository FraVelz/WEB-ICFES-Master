/**
 * Hook para gestionar progreso del usuario (Supabase o localStorage)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import API_CONFIG from '@/services/api.config';
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

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [areaStats, setAreaStats] = useState<Record<string, unknown> | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [attemptHistory, setAttemptHistory] = useState<AttemptWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgressData = useCallback(async () => {
    if (!user?.uid) {
      setProgress(null);
      setAreaStats(null);
      setRecommendations([]);
      setAttemptHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (API_CONFIG.MODE === 'supabase') {
        const prog = await ProgressSupabaseService.getByUserId(user.uid);
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
        setProgress(mapped);
        setAreaStats(mapped?.areaStats || null);
        setRecommendations(getRecommendations(mapped ?? getDefaultProgress()));
        setAttemptHistory([]);
      } else {
        const prog = getProgress();
        setProgress(prog);
        setAreaStats(prog?.areaStats || null);
        setRecommendations(getRecommendations(prog ?? getDefaultProgress()));
        const exams = getStoredExams();
        const practices = getStoredPractices();
        setAttemptHistory(
          [...exams, ...practices]
            .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
            .slice(0, 50)
        );
      }
      setError(null);
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Error cargando progreso') ?? 'Error cargando progreso');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const resetProgress = useCallback(async () => {
    if (!user?.uid) return true;
    if (API_CONFIG.MODE === 'supabase') {
      await ProgressSupabaseService.upsert(user.uid, {
        totalAttempts: 0,
        totalCorrect: 0,
        percentage: 0,
        streakDays: 0,
        areaStats: {},
      });
    } else {
      clearAllData();
    }
    loadProgressData();
    return true;
  }, [user?.uid, loadProgressData]);

  return {
    progress,
    areaStats,
    recommendations,
    attemptHistory,
    loading,
    error,
    saveAttempt: async () => ({}),
    getAreaStatistics: async () => ({}),
    getPerformanceAnalysis: async () => ({}),
    updateProgress: async () => ({}),
    resetProgress,
    refresh: loadProgressData,
  };
}
