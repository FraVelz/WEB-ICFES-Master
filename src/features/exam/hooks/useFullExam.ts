'use client';

import { useState, useEffect, useRef } from 'react';
import { saveFullExam } from '@/services/persistence';
import { fetchQuestionsForFullExam } from '@/features/exam/services/QuestionService';
import {
  fetchGradedExamResults,
  gradedToExamQuestion,
} from '@/features/exam/services/examGradingClient';
import type { GradedExamAnswer } from '@/features/exam/services/examGradingServer';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import type { ExamConfig } from '@/features/exam/types';
import { AREA_INFO } from '@/shared/constants';

export function useFullExam() {
  const areaInfo = AREA_INFO['examen-completo'];

  const [allQuestions, setAllQuestions] = useState<ExamQuestionPublic[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionPublic[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [gradedResults, setGradedResults] = useState<GradedExamAnswer[] | null>(null);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const gradingStartedRef = useRef(false);

  useEffect(() => {
    let active = true;

    setLoadingQuestions(true);
    setQuestionsError(null);

    void fetchQuestionsForFullExam()
      .then((loaded) => {
        if (!active) return;
        setAllQuestions(loaded);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message =
          error instanceof Error ? error.message : 'No se pudieron cargar las preguntas.';
        setQuestionsError(message);
        setAllQuestions([]);
      })
      .finally(() => {
        if (active) setLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleExamStart = (config: ExamConfig) => {
    const selectedQuestions = allQuestions.slice(0, config.numQuestions);
    setQuestions(selectedQuestions);
    setExamConfig(config);
    setGradedResults(null);
    setGradingError(null);
    gradingStartedRef.current = false;

    if (config.useTimer) {
      setTimeRemaining(config.numQuestions * (config.timePerQuestion ?? 2) * 60);
    }
  };

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleScrollToQuestion = (index: number) => {
    document.getElementById(`question-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!(isFinished || showResults) || questions.length === 0) return;
    if (gradingStartedRef.current) return;

    gradingStartedRef.current = true;
    let active = true;

    void fetchGradedExamResults(answers)
      .then((results) => {
        if (!active) return;
        setGradedResults(results);
        setGradingError(null);

        const fullQuestions: ExamQuestion[] = results.map(gradedToExamQuestion);
        const correctCount = results.filter((r) => r.correct).length;
        const percentage = Math.round((correctCount / results.length) * 100);

        saveFullExam({
          examType: 'full-exam',
          questions: fullQuestions,
          answers,
          correctCount,
          percentage,
          totalQuestions: results.length,
          config: examConfig,
          completedAt: new Date().toISOString(),
        });
      })
      .catch((error: unknown) => {
        if (!active) return;
        gradingStartedRef.current = false;
        setGradingError(error instanceof Error ? error.message : 'Error al calificar el examen');
      });

    return () => {
      active = false;
    };
  }, [isFinished, showResults, questions, answers, examConfig]);

  const resetExam = () => {
    setExamConfig(null);
    setAnswers({});
    setShowResults(false);
    setIsFinished(false);
    setTimeRemaining(null);
    setGradedResults(null);
    setGradingError(null);
    gradingStartedRef.current = false;
  };

  const results =
    gradedResults?.map((graded) => ({
      question: gradedToExamQuestion(graded),
      correct: graded.correct,
      userAnswer: graded.userAnswer,
    })) ?? [];

  const correctCount = results.filter((r) => r.correct).length;
  const percentage = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  const timeColor =
    timeRemaining !== null && timeRemaining < 300
      ? 'text-red-400'
      : timeRemaining !== null && timeRemaining < 600
        ? 'text-yellow-400'
        : 'text-app-accent-muted';

  return {
    areaInfo,
    allQuestions,
    loadingQuestions,
    questionsError,
    gradingError,
    examConfig,
    questions,
    answers,
    showResults,
    setShowResults,
    timeRemaining,
    isFinished,
    gradedResults,
    handleExamStart,
    handleAnswer,
    handleScrollToQuestion,
    resetExam,
    results,
    correctCount,
    percentage,
    timeColor,
  };
}
