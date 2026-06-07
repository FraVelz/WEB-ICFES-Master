'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  addCoinsBalance,
  gamificationPersistence,
  getCompletedLessons,
  markLessonAsCompleted,
} from '@/services/persistence';
import { normalizeQuizQuestions } from './normalizeQuizQuestions';
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
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  const normalizedQuestions = useMemo(() => normalizeQuizQuestions(questions, quiz), [questions, quiz]);
  const currentQuestion = normalizedQuestions[currentQuestionIndex];
  const totalQuestions = normalizedQuestions.length;
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
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setRewards(null);
      setAnswers({});
      setCompletedQuestions(new Set());
    }
  }, [isOpen, user, lessonId, checkCompletionStatus]);

  useEffect(() => {
    if (!currentQuestion) return;
    const savedAnswer = answers[currentQuestion.id];
    const isCompleted = completedQuestions.has(currentQuestion.id);
    setSelectedOption(savedAnswer || null);
    setIsSubmitted(isCompleted);
    setIsCorrect(savedAnswer === currentQuestion.correctAnswer);
  }, [currentQuestionIndex, currentQuestion, answers, completedQuestions]);

  const awardRewards = async () => {
    if (!user?.uid) return;
    const xpAmount = lessonXp ?? quiz?.rewards?.xp ?? 500;
    const coinsAmount = lessonCoins ?? quiz?.rewards?.coins ?? 250;
    await gamificationPersistence.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
    await addCoinsBalance(user.uid, coinsAmount, `lesson_quiz_${lessonId ?? 'unknown'}`);
    if (lessonId) markLessonAsCompleted(user.uid, lessonId);
    setRewards({ xp: xpAmount, coins: coinsAmount });
    setAlreadyCompleted(true);
  };

  const handleSubmit = async () => {
    if (!selectedOption || loading || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(updatedAnswers);
    setCompletedQuestions((prev) => new Set([...prev, currentQuestion.id]));

    const allAnswered = normalizedQuestions.every((q) => updatedAnswers[q.id] != null);
    const allCorrect = normalizedQuestions.every((q) => updatedAnswers[q.id] === q.correctAnswer);

    const shouldAward =
      !alreadyCompleted && user?.uid && allCorrect && (totalQuestions === 1 || (isLastQuestion && allAnswered));

    if (!shouldAward) return;

    setLoading(true);
    try {
      await awardRewards();
    } catch (err) {
      console.error('Error otorgando recompensas del quiz:', err);
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
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  const countCorrectAnswers = () =>
    Object.keys(answers).filter((k) => answers[k] === normalizedQuestions.find((q) => q.id === k)?.correctAnswer)
      .length;

  return {
    user,
    currentQuestion,
    normalizedQuestions,
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
    handleSubmit,
    handleNextQuestion,
    handlePreviousQuestion,
    handleRetry,
    countCorrectAnswers,
  };
}
