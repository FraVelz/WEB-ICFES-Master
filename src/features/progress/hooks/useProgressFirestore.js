import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProgress, getStoredExams, getStoredPractices, clearAllData, getRecommendations } from '@/shared/utils/progressStorage';

/**
 * Hook para gestionar progreso del usuario (localStorage)
 */
export function useProgressFirestore() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [areaStats, setAreaStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProgressData = useCallback(() => {
    if (!user?.uid) {
      setProgress(null);
      setLoading(false);
      return;
    }
    const prog = getProgress();
    setProgress(prog);
    setAreaStats(prog?.areaStats || null);
    setRecommendations(getRecommendations(prog || {}));
    const exams = getStoredExams();
    const practices = getStoredPractices();
    setAttemptHistory([...exams, ...practices].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50));
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const resetProgress = useCallback(async () => {
    clearAllData();
    loadProgressData();
    return true;
  }, [loadProgressData]);

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
    refresh: loadProgressData
  };
}
