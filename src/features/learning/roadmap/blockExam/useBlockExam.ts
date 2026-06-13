'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  BLOCK_EXAM_PASS_PERCENT,
  getPassedBlockIdsForArea,
  markBlockExamPassed,
} from '@/services/persistence/blockExamPersistence';
import { fetchBlockExamGrade, fetchBlockExamStart } from './blockExamClient';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';

export type UseBlockExamOptions = {
  isOpen: boolean;
  checkpointId: string | null;
  lessonIds: string[];
  areaId: string;
  blockId: string;
  title?: string;
  onPassed?: () => void;
};

export function useBlockExam({ isOpen, checkpointId, lessonIds, areaId, blockId, onPassed }: UseBlockExamOptions) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<NormalizedQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [alreadyPassed, setAlreadyPassed] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [rewards, setRewards] = useState<{ xp: number; coins: number } | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = completedQuestions.size === totalQuestions && totalQuestions > 0;

  const resetQuizState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setAnswers({});
    setRevealedAnswers({});
    setCompletedQuestions(new Set());
    setGradeError(null);
    setFinalScore(null);
    setRewards(null);
  }, []);

  useEffect(() => {
    if (!isOpen || !checkpointId) return;
    setAlreadyPassed(getPassedBlockIdsForArea(areaId).has(blockId));
  }, [isOpen, checkpointId, areaId, blockId]);

  useEffect(() => {
    if (!isOpen || !checkpointId || lessonIds.length === 0) return;

    let active = true;
    setStarting(true);
    setGradeError(null);
    resetQuizState();
    setSessionToken(null);
    setQuestions([]);

    void fetchBlockExamStart(checkpointId, lessonIds)
      .then((session) => {
        if (!active) return;
        setSessionToken(session.sessionToken);
        setQuestions(session.questions);
      })
      .catch((error) => {
        if (!active) return;
        setGradeError(error instanceof Error ? error.message : 'No se pudo iniciar el examen');
      })
      .finally(() => {
        if (active) setStarting(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, checkpointId, lessonIds, resetQuizState]);

  useEffect(() => {
    if (!currentQuestion) return;
    const savedAnswer = answers[currentQuestion.id];
    const isCompleted = completedQuestions.has(currentQuestion.id);
    setSelectedOption(savedAnswer || null);
    setIsSubmitted(isCompleted);
    if (isCompleted && revealedAnswers[currentQuestion.id]) {
      setIsCorrect(savedAnswer === revealedAnswers[currentQuestion.id]);
    }
  }, [currentQuestionIndex, currentQuestion, answers, completedQuestions, revealedAnswers]);

  const handleSubmit = async () => {
    if (!selectedOption || loading || !currentQuestion || !sessionToken) return;

    setLoading(true);
    setGradeError(null);

    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };

    try {
      const gradeResult = await fetchBlockExamGrade(sessionToken, updatedAnswers);
      const questionResult = gradeResult.results.find((result) => result.questionId === currentQuestion.id);
      const correct = questionResult?.correct ?? false;
      const revealed = questionResult?.correctAnswer ?? '';

      setIsCorrect(correct);
      setIsSubmitted(true);
      setAnswers(updatedAnswers);
      setRevealedAnswers((prev) => ({ ...prev, [currentQuestion.id]: revealed }));
      setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));

      if (
        gradeResult.totalQuestions > 0 &&
        updatedAnswers &&
        Object.keys(updatedAnswers).length === gradeResult.totalQuestions
      ) {
        setFinalScore(gradeResult.score);
        if (gradeResult.passed) {
          setAlreadyPassed(true);
          if (gradeResult.rewards) setRewards(gradeResult.rewards);
          markBlockExamPassed(user?.uid, areaId, blockId, gradeResult.score);
          onPassed?.();
        }
      }
    } catch (error) {
      setGradeError(error instanceof Error ? error.message : 'No se pudo calificar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleRetry = () => {
    resetQuizState();
    if (!checkpointId || lessonIds.length === 0) return;
    setStarting(true);
    void fetchBlockExamStart(checkpointId, lessonIds)
      .then((session) => {
        setSessionToken(session.sessionToken);
        setQuestions(session.questions);
      })
      .catch((error) => {
        setGradeError(error instanceof Error ? error.message : 'No se pudo reiniciar el examen');
      })
      .finally(() => setStarting(false));
  };

  return {
    starting,
    loading,
    gradeError,
    passPercent: BLOCK_EXAM_PASS_PERCENT,
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedOption,
    setSelectedOption,
    isSubmitted,
    isCorrect,
    isLastQuestion,
    allQuestionsAnswered,
    alreadyPassed,
    finalScore,
    rewards,
    handleSubmit,
    handleNextQuestion,
    handlePreviousQuestion,
    handleRetry,
  };
}
