import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStoredExams, clearExamsOnly } from '@/shared/utils/progressStorage';

/**
 * Hook para gestionar exámenes (localStorage)
 */
export function useExamFirestore(examId) {
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExam = useCallback(() => {
    if (!examId) return;
    const exams = getStoredExams();
    const found = exams.find(e => e.id === examId);
    setExam(found || null);
  }, [examId]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  const resetUserExams = useCallback(async () => {
    clearExamsOnly();
    setExam(null);
    return true;
  }, []);

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
    getUserExams: async () => getStoredExams(),
    compareExams: async () => ({}),
    exportResults: async () => ({}),
    resetUserExams,
    refresh: loadExam
  };
}
