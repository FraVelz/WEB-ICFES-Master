/**
 * useExam - Hook para gestionar exámenes
 * 
 * USO:
 * const { exam, loading, saveAnswer, completeExam, analysis } = useExam(examId);
 */

import { useState, useEffect, useCallback } from 'react';
import { ExamService } from '@/services';

export function useExam(examId) {
  const [exam, setExam] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);
      const examData = await ExamService.get(examId);
      setExam(examData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando examen:', err);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  // Cargar examen al montar o cuando cambia examId
  useEffect(() => {
    if (examId) {
      loadExam();
    }
  }, [examId, loadExam]);

  const saveAnswer = async (questionId, selectedAnswer, correctAnswer, isCorrect, timeSpent) => {
    try {
      const updated = await ExamService.saveAnswer(examId, {
        questionId,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        timeSpent
      });
      setExam(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeExam = async () => {
    try {
      const completed = await ExamService.completeExam(examId);
      setExam(completed);

      // Cargar análisis
      const analysisData = await ExamService.getExamAnalysis(examId);
      setAnalysis(analysisData);

      // Cargar respuestas incorrectas
      const wrongAnswersData = await ExamService.getWrongAnswers(examId);
      setWrongAnswers(wrongAnswersData);

      return completed;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const abandonExam = async () => {
    try {
      const abandoned = await ExamService.abandonExam(examId);
      setExam(abandoned);
      return abandoned;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loadAnalysis = async () => {
    try {
      const analysisData = await ExamService.getExamAnalysis(examId);
      setAnalysis(analysisData);
      return analysisData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loadWrongAnswers = async () => {
    try {
      const wrongAnswersData = await ExamService.getWrongAnswers(examId);
      setWrongAnswers(wrongAnswersData);
      return wrongAnswersData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const exportResults = async (format = 'json') => {
    try {
      return await ExamService.exportResults(examId, format);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    exam,
    analysis,
    wrongAnswers,
    loading,
    error,
    saveAnswer,
    completeExam,
    abandonExam,
    loadAnalysis,
    loadWrongAnswers,
    exportResults,
    reload: loadExam
  };
}

export default useExam;
