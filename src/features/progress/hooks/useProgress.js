/**
 * useProgress - Hook para acceder a estadísticas y progreso
 * 
 * USO:
 * const { stats, loading, recommendations, getAreaStats } = useProgress(userId);
 */

import { useState, useEffect, useCallback } from 'react';
import { ProgressService } from '@/services';

export function useProgress(userId) {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, recs, analysisData] = await Promise.all([
        ProgressService.getUserStats(userId),
        ProgressService.getRecommendations(userId),
        ProgressService.getPerformanceAnalysis(userId)
      ]);
      setStats(statsData);
      setRecommendations(recs);
      setAnalysis(analysisData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar estadísticas al montar o cuando cambia userId
  useEffect(() => {
    if (userId) {
      loadStats();
    }
  }, [userId, loadStats]);

  const updateAfterAnswer = async (answerData) => {
    try {
      const updated = await ProgressService.updateAfterAnswer(userId, answerData);
      setStats(updated);
      
      // Actualizar recomendaciones y análisis
      const [recs, analysisData] = await Promise.all([
        ProgressService.getRecommendations(userId),
        ProgressService.getPerformanceAnalysis(userId)
      ]);
      setRecommendations(recs);
      setAnalysis(analysisData);
      
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAreaStats = async (area) => {
    try {
      return await ProgressService.getAreaStats(userId, area);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getAllAreaStats = async () => {
    try {
      return await ProgressService.getAllAreaStats(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getStreak = async () => {
    try {
      return await ProgressService.getStreak(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateDailyStreak = async () => {
    try {
      const updated = await ProgressService.updateDailyStreak(userId);
      setStats(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reset = async () => {
    try {
      const reset = await ProgressService.resetProgress(userId);
      setStats(reset);
      setRecommendations([]);
      setAnalysis(null);
      return reset;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    stats,
    recommendations,
    analysis,
    loading,
    error,
    updateAfterAnswer,
    getAreaStats,
    getAllAreaStats,
    getStreak,
    updateDailyStreak,
    reset,
    reload: loadStats
  };
}

export default useProgress;
