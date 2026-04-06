/**
 * Hook para gestionar exámenes (Supabase o localStorage)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getExamById, resetUserExams as resetUserExamsPersistence, getUserExamsList } from '@/services/persistence';

export function useExam(examId: string | undefined) {
  const { user } = useAuth();
  const [exam, setExam] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExam = useCallback(async () => {
    if (!examId) return;
    try {
      const found = await getExamById(examId, user?.uid);
      setExam(found || null);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  }, [examId, user?.uid]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  const resetUserExams = useCallback(async () => {
    await resetUserExamsPersistence(user?.uid);
    setExam(null);
    return true;
  }, [user?.uid]);

  return {
    exam,
    analysis: null,
    wrongAnswers: [],
    loading,
    error,
    createExam: async () => ({}),
    saveAnswer: async () => ({}),
    completeExam: async () => ({}),
    abandonExam: async () => ({}),
    getExamStats: async () => ({}),
    getUserExams: async () => getUserExamsList(user?.uid),
    compareExams: async () => ({}),
    exportResults: async () => ({}),
    resetUserExams,
    refresh: loadExam,
  };
}
