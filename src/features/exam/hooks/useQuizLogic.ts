import { useState, useCallback } from 'react';
import type { ExamQuestion } from '@/shared/types/question';

export const useQuizLogic = (questions: ExamQuestion[] = []) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const answered =
    currentQuestion && answers[currentQuestion.id] !== undefined;

  const handleAnswer = useCallback(
    (selectedAnswer: string) => {
      setAnswers((prev) => ({
        ...prev,
        ...(currentQuestion && {
          [currentQuestion.id]: selectedAnswer,
        }),
      }));
      setShowExplanation(true);
    },
    [currentQuestion]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(true);
    }
  }, [currentQuestionIndex]);

  const getResults = useCallback(() => {
    return questions.map((question: ExamQuestion) => ({
      question,
      correct: answers[question.id] === question.correctAnswer,
      userAnswer: answers[question.id],
    }));
  }, [questions, answers]);

  const progress = currentQuestionIndex + 1;
  const totalQuestions = questions.length;

  return {
    currentQuestion,
    currentQuestionIndex,
    answered,
    showExplanation,
    isFinished,
    progress,
    totalQuestions,
    handleAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    getResults,
    reset: () => {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowExplanation(false);
      setIsFinished(false);
    },
  };
};
