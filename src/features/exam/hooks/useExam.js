/**
 * Hook para gestionar exámenes (Supabase o localStorage)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import API_CONFIG from '@/services/api.config';
import ExamSupabaseService from '@/services/supabase/ExamSupabaseService';
import { getStoredExams, clearExamsOnly } from '@/shared/utils/progressStorage';

export function useExam(examId) {
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExam = useCallback(async () => {
    if (!examId) return;
    if (API_CONFIG.MODE === 'supabase' && user?.uid) {
      const found = await ExamSupabaseService.getById(examId);
      setExam(found || null);
    } else {
      const exams = getStoredExams();
      const found = exams.find(e => e.id === examId);
      setExam(found || null);
    }
  }, [examId, user?.uid]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  const resetUserExams = useCallback(async () => {
    if (API_CONFIG.MODE === 'supabase' && user?.uid) {
      await ExamSupabaseService.resetUserExams(user.uid);
    } else {
      clearExamsOnly();
    }
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
    getUserExams: async () => {
      if (API_CONFIG.MODE === 'supabase' && user?.uid) {
        return ExamSupabaseService.getByUserId(user.uid);
      }
      return getStoredExams();
    },
    compareExams: async () => ({}),
    exportResults: async () => ({}),
    resetUserExams,
    refresh: loadExam
  };
}
