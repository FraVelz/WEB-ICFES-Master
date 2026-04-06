/** Aggregate progress + recommendations */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loadProgressViewState, resetProgressData, type ProgressViewState } from '@/services/persistence';
import type { ProgressData, AttemptWithQuestions } from '@/shared/utils/progressStorage';

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [areaStats, setAreaStats] = useState<Record<string, unknown> | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [attemptHistory, setAttemptHistory] = useState<AttemptWithQuestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyViewState = useCallback((state: ProgressViewState) => {
    setProgress(state.progress);
    setAreaStats(state.areaStats);
    setRecommendations(state.recommendations);
    setAttemptHistory(state.attemptHistory);
  }, []);

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
      const state = await loadProgressViewState(user.uid);
      applyViewState(state);
      setError(null);
    } catch (err) {
      setError((err instanceof Error ? err.message : 'Error cargando progreso') ?? 'Error cargando progreso');
    } finally {
      setLoading(false);
    }
  }, [user?.uid, applyViewState]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const resetProgress = useCallback(async () => {
    if (!user?.uid) return true;
    await resetProgressData(user.uid);
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
