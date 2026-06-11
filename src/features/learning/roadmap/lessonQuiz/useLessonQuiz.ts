'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getCompletedLessons, markLessonAsCompleted } from '@/services/persistence';
import { fetchLessonQuizGrade } from './lessonQuizClient';
import { normalizeQuizQuestions } from './normalizeQuizQuestions';
import { shuffleQuestionOptions, shuffleQuizQuestions } from './shuffleQuizQuestions';
import type { LessonQuizModalProps } from './quizTypes';

export function useLessonQuiz({
  isOpen,
  questions,
  quiz,
  lessonId,
  lessonXp,
  lessonCoins,
}: Pick<LessonQuizModalProps, 'isOpen' | 'questions' | 'quiz' | 'lessonId' | 'lessonXp' | 'lessonCoins'>) {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [rewards, setRewards] = useState<{ xp: number; coins: number } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [gradeError, setGradeError] = useState<string | null>(null);

  const baseQuestions = useMemo(() => normalizeQuizQuestions(questions, quiz), [questions, quiz]);
  const [displayQuestions, setDisplayQuestions] = useState<typeof baseQuestions>([]);

  const currentQuestion = displayQuestions[currentQuestionIndex];
  const totalQuestions = displayQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = completedQuestions.size === totalQuestions;

  const checkCompletionStatus = useCallback(async () => {
    try {
      const completedLessons = getCompletedLessons();
      setAlreadyCompleted(lessonId ? completedLessons.includes(lessonId) : false);
    } catch (error) {
      console.error('Error checking completion status:', error);
      setAlreadyCompleted(false);
    }
  }, [lessonId]);

  useEffect(() => {
    if (isOpen && user && lessonId) checkCompletionStatus();
    if (isOpen) {
      setDisplayQuestions(shuffleQuizQuestions(baseQuestions));
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setRewards(null);
      setAnswers({});
      setRevealedAnswers({});
      setCompletedQuestions(new Set());
      setGradeError(null);
    }
  }, [isOpen, user, lessonId, checkCompletionStatus, baseQuestions]);

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
    if (!selectedOption || loading || !currentQuestion || !lessonId) return;

    setLoading(true);
    setGradeError(null);

    try {
      const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };
      const allAnswered = displayQuestions.every((q) => updatedAnswers[q.id] != null);
      const shouldAward = Boolean(
        !alreadyCompleted && user?.uid && (totalQuestions === 1 || (isLastQuestion && allAnswered))
      );

      const gradeResult = await fetchLessonQuizGrade(lessonId, updatedAnswers, {
        awardRewards: shouldAward,
      });

      const questionResult = gradeResult.results.find((r) => r.questionId === currentQuestion.id);
      const correct = questionResult?.correct ?? false;
      const revealed = questionResult?.correctAnswer ?? '';

      setIsCorrect(correct);
      setIsSubmitted(true);
      setAnswers(updatedAnswers);
      setRevealedAnswers((prev) => ({ ...prev, [currentQuestion.id]: revealed }));
      setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));

      if (gradeResult.rewards) {
        setRewards(gradeResult.rewards);
        setAlreadyCompleted(true);
        markLessonAsCompleted(user!.uid, lessonId);
      } else if (shouldAward && gradeResult.allCorrect) {
        setAlreadyCompleted(true);
        markLessonAsCompleted(user!.uid, lessonId);
      }
    } catch (err) {
      setGradeError(err instanceof Error ? err.message : 'No se pudo calificar la respuesta');
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
    const failedQuestionId = currentQuestion?.id;
    const shouldReshuffleAll = totalQuestions === 1 || currentQuestionIndex === 0 || isLastQuestion;

    if (shouldReshuffleAll) {
      setDisplayQuestions(shuffleQuizQuestions(baseQuestions));
      setCurrentQuestionIndex(0);
      setAnswers({});
      setRevealedAnswers({});
      setCompletedQuestions(new Set());
    } else {
      setDisplayQuestions((prev) =>
        prev.map((question, index) => (index === currentQuestionIndex ? shuffleQuestionOptions(question) : question))
      );
      setAnswers((prev) => {
        const next = { ...prev };
        if (failedQuestionId) delete next[failedQuestionId];
        return next;
      });
      setRevealedAnswers((prev) => {
        const next = { ...prev };
        if (failedQuestionId) delete next[failedQuestionId];
        return next;
      });
      setCompletedQuestions((prev) => {
        const next = new Set(prev);
        if (failedQuestionId) next.delete(failedQuestionId);
        return next;
      });
    }

    setIsSubmitted(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setGradeError(null);
  };

  const countCorrectAnswers = () =>
    Object.keys(answers).filter((k) => answers[k] === revealedAnswers[k]).length;

  const questionsWithRevealedAnswers = displayQuestions.map((q) => ({
    ...q,
    correctAnswer: revealedAnswers[q.id] ?? q.correctAnswer,
  }));

  return {
    user,
    currentQuestion: currentQuestion
      ? { ...currentQuestion, correctAnswer: revealedAnswers[currentQuestion.id] ?? '' }
      : currentQuestion,
    normalizedQuestions: questionsWithRevealedAnswers,
    totalQuestions,
    currentQuestionIndex,
    selectedOption,
    setSelectedOption,
    isSubmitted,
    isCorrect,
    loading,
    alreadyCompleted,
    rewards,
    answers,
    isLastQuestion,
    allQuestionsAnswered,
    gradeError,
    handleSubmit,
    handleNextQuestion,
    handlePreviousQuestion,
    handleRetry,
    countCorrectAnswers,
  };
}
