import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProgressFirestoreService from '../services/ProgressFirestoreService';

/**
 * Hook para gestionar progreso del usuario
 * Proporciona acceso a estadísticas, intentos y recomendaciones
 */
export function useProgressFirestore() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [areaStats, setAreaStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.uid) {
        setProgress(null);
        return;
      }

      const [prog, areas, recs, history] = await Promise.all([
        ProgressFirestoreService.getProgress(user.uid),
        ProgressFirestoreService.getProgressByArea(user.uid),
        ProgressFirestoreService.getRecommendations(user.uid),
        ProgressFirestoreService.getAttemptHistory(user.uid, 50)
      ]);

      setProgress(prog);
      setAreaStats(areas);
      setRecommendations(recs);
      setAttemptHistory(history);
    } catch (err) {
      console.error('Error cargando progreso:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Cargar datos de progreso al montar o cuando cambia user.uid
  useEffect(() => {
    if (user?.uid) {
      loadProgressData();
    }
  }, [user?.uid, loadProgressData]);

  // Guardar intento
  const saveAttempt = useCallback(async (attemptData) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const newAttempt = await ProgressFirestoreService.saveAttempt(user.uid, attemptData);
      
      // Recargar datos después de guardar
      await loadProgressData();
      
      return newAttempt;
    } catch (err) {
      console.error('Error guardando intento:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid, loadProgressData]);

  // Obtener estadísticas por área
  const getAreaStatistics = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      return await ProgressFirestoreService.getAreaStatistics(user.uid);
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      throw err;
    }
  }, [user?.uid]);

  // Obtener análisis de rendimiento
  const getPerformanceAnalysis = useCallback(async (days = 30) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      return await ProgressFirestoreService.getPerformanceAnalysis(user.uid, days);
    } catch (err) {
      console.error('Error en análisis de rendimiento:', err);
      throw err;
    }
  }, [user?.uid]);

  // Actualizar progreso manualmente
  const updateProgress = useCallback(async (progressData) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await ProgressFirestoreService.updateProgress(user.uid, progressData);
      setProgress(updated);
      return updated;
    } catch (err) {
      console.error('Error actualizando progreso:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Resetear progreso
  const resetProgress = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      await ProgressFirestoreService.resetProgress(user.uid);
      await loadProgressData();
      return true;
    } catch (err) {
      console.error('Error reseteando progreso:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid, loadProgressData]);

  // Recargar datos
  const refresh = useCallback(() => {
    return loadProgressData();
  }, [loadProgressData]);

  return {
    progress,
    areaStats,
    recommendations,
    attemptHistory,
    loading,
    error,
    saveAttempt,
    getAreaStatistics,
    getPerformanceAnalysis,
    updateProgress,
    resetProgress,
    refresh
  };
}
