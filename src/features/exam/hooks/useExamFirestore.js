import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import ExamFirestoreService from '@/features/exam/services/ExamFirestoreService';

/**
 * Hook para gestionar exámenes
 * Proporciona acceso a exámenes, respuestas, análisis y resultados
 */
export function useExamFirestore(examId) {
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadExam = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.uid || !examId) {
        setExam(null);
        return;
      }

      const examData = await ExamFirestoreService.get(examId, user.uid);
      setExam(examData);

      // Si el examen está completado, cargar análisis
      if (examData.status === 'completed') {
        const [analysisData, wrongAnswersData] = await Promise.all([
          ExamFirestoreService.getExamAnalysis(examId, user.uid),
          ExamFirestoreService.getWrongAnswers(examId, user.uid)
        ]);

        setAnalysis(analysisData);
        setWrongAnswers(wrongAnswersData);
      }
    } catch (err) {
      console.error('Error cargando examen:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [examId, user?.uid]);

  // Cargar examen al montar o cuando cambian las dependencias
  useEffect(() => {
    if (examId && user?.uid) {
      loadExam();
    }
  }, [examId, user?.uid, loadExam]);

  // Crear nuevo examen
  const createExam = useCallback(async (examData) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const newExam = await ExamFirestoreService.createExam(user.uid, examData);
      setExam(newExam);
      return newExam;
    } catch (err) {
      console.error('Error creando examen:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Guardar respuesta
  const saveAnswer = useCallback(async (answerData) => {
    if (!user?.uid || !exam?.id) throw new Error('Datos incompletos');

    try {
      const newAnswer = await ExamFirestoreService.saveAnswer(exam.id, user.uid, answerData);
      
      // Actualizar examen local
      setExam(prev => ({
        ...prev,
        answers: [...(prev.answers || []), newAnswer]
      }));

      return newAnswer;
    } catch (err) {
      console.error('Error guardando respuesta:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid, exam?.id]);

  // Completar examen
  const completeExam = useCallback(async () => {
    if (!user?.uid || !exam?.id) throw new Error('Datos incompletos');

    try {
      const result = await ExamFirestoreService.completeExam(exam.id, user.uid);
      
      // Recargar examen con análisis
      await loadExam();
      
      return result;
    } catch (err) {
      console.error('Error completando examen:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid, exam?.id, loadExam]);

  // Abandonar examen
  const abandonExam = useCallback(async () => {
    if (!user?.uid || !exam?.id) throw new Error('Datos incompletos');

    try {
      await ExamFirestoreService.abandonExam(exam.id, user.uid);
      
      setExam(prev => ({
        ...prev,
        status: 'abandoned'
      }));

      return true;
    } catch (err) {
      console.error('Error abandonando examen:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid, exam?.id]);

  // Obtener estadísticas
  const getExamStats = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      return await ExamFirestoreService.getExamStats(user.uid);
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      throw err;
    }
  }, [user?.uid]);

  // Obtener exámenes del usuario
  const getUserExams = useCallback(async (filters = {}) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      return await ExamFirestoreService.getUserExams(user.uid, filters);
    } catch (err) {
      console.error('Error obteniendo exámenes:', err);
      throw err;
    }
  }, [user?.uid]);

  // Comparar exámenes
  const compareExams = useCallback(async (exam1Id, exam2Id) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      return await ExamFirestoreService.compareExams(exam1Id, exam2Id, user.uid);
    } catch (err) {
      console.error('Error comparando exámenes:', err);
      throw err;
    }
  }, [user?.uid]);

  // Exportar resultados
  const exportResults = useCallback(async (format = 'json') => {
    if (!user?.uid || !exam?.id) throw new Error('Datos incompletos');

    try {
      return await ExamFirestoreService.exportResults(exam.id, user.uid, format);
    } catch (err) {
      console.error('Error exportando resultados:', err);
      throw err;
    }
  }, [user?.uid, exam?.id]);

  // Resetear exámenes
  const resetUserExams = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      await ExamFirestoreService.resetUserExams(user.uid);
      setExam(null);
      return true;
    } catch (err) {
      console.error('Error reseteando exámenes:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Recargar datos
  const refresh = useCallback(() => {
    return loadExam();
  }, [loadExam]);

  return {
    exam,
    analysis,
    wrongAnswers,
    loading,
    error,
    createExam,
    saveAnswer,
    completeExam,
    abandonExam,
    getExamStats,
    getUserExams,
    compareExams,
    exportResults,
    resetUserExams,
    refresh
  };
}
