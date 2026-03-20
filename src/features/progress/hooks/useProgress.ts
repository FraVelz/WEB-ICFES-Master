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
} from '@/shared/utils/progressStorage';

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [areaStats, setAreaStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const mapped = prog
          ? {
              totalAttempts: prog.totalAttempts,
              totalQuestions: prog.totalCorrect * 2,
              totalCorrect: prog.totalCorrect,
              percentage: prog.percentage,
              streakDays: prog.streakDays,
              areaStats: prog.areaStats || {},
            }
          : null;
        setProgress(mapped);
        setAreaStats(mapped?.areaStats || null);
        setRecommendations(getRecommendations(mapped || {}));
        setAttemptHistory([]);
      } else {
        const prog = getProgress();
        setProgress(prog);
        setAreaStats(prog?.areaStats || null);
        setRecommendations(getRecommendations(prog || {}));
        const exams = getStoredExams();
        const practices = getStoredPractices();
        setAttemptHistory(
          [...exams, ...practices]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 50)
        );
      }
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error cargando progreso');
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
