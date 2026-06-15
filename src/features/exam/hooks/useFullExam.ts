'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { saveFullExam } from '@/services/persistence';
import { fetchQuestionsForFullExam } from '@/features/exam/services/QuestionService';
import { FULL_EXAM_MAX_QUESTIONS } from '@/features/exam/constants/fullExamLimits';
import { fetchGradedExamResults, gradedToExamQuestion } from '@/features/exam/services/examGradingClient';
import type { GradedExamAnswer } from '@/features/exam/services/examGradingServer';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import type { ExamConfig } from '@/features/exam/types';
import { AREA_INFO } from '@/shared/constants';
import { getFullExamExitHref } from '@/features/exam/utils/getPracticeExitHref';
import { consumePendingFullExamConfig } from '@/features/exam/utils/fullExamConfigStorage';
import { getSimulacroCompletoSectionHref } from '@/features/exam/utils/simulacroNavigation';

export function useFullExam() {
  const router = useRouter();
  const areaInfo = AREA_INFO['examen-completo'];
  const searchParams = useSearchParams();
  const exitHref = useMemo(() => getFullExamExitHref({ searchParams }), [searchParams]);

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
  const [gradingAttempt, setGradingAttempt] = useState(0);
  const { user } = useAuth();
  const gradingStartedRef = useRef(false);

  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    setQuestionsError(null);

    try {
      const loaded = await fetchQuestionsForFullExam();
      setAllQuestions(loaded);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar las preguntas.';
      setQuestionsError(message);
      setAllQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    void loadQuestions();
  }, [loadQuestions]);

  const handleExamStart = useCallback(
    (config: ExamConfig) => {
      const questionCount = Math.min(config.numQuestions, FULL_EXAM_MAX_QUESTIONS, allQuestions.length);
      const selectedQuestions = allQuestions.slice(0, questionCount);
      setQuestions(selectedQuestions);
      setExamConfig({ ...config, numQuestions: questionCount });
      setGradedResults(null);
      setGradingError(null);
      gradingStartedRef.current = false;

      if (config.useTimer) {
        setTimeRemaining(questionCount * (config.timePerQuestion ?? 2) * 60);
      } else {
        setTimeRemaining(null);
      }
    },
    [allQuestions]
  );

  useEffect(() => {
    if (loadingQuestions || questionsError || examConfig) return;

    const pendingConfig = consumePendingFullExamConfig();
    if (pendingConfig) {
      handleExamStart(pendingConfig);
      return;
    }

    router.replace(getSimulacroCompletoSectionHref());
  }, [loadingQuestions, questionsError, examConfig, handleExamStart, router]);

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

    const attemptId = Date.now();

    void fetchGradedExamResults(answers, {
      awardActivity: user?.uid && !isDemoUserId(user.uid) ? { attemptType: 'full-exam', attemptId } : undefined,
    })
      .then(({ results }) => {
        if (!active) return;
        setGradedResults(results);
        setGradingError(null);

        const fullQuestions: ExamQuestion[] = results.map(gradedToExamQuestion);
        const correctCount = results.filter((r) => r.correct).length;
        const percentage = Math.round((correctCount / results.length) * 100);

        saveFullExam({
          id: attemptId,
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
  }, [isFinished, showResults, questions, answers, examConfig, gradingAttempt, user?.uid]);

  const reloadQuestions = loadQuestions;

  const retryGrading = useCallback(() => {
    gradingStartedRef.current = false;
    setGradingError(null);
    setGradedResults(null);
    setGradingAttempt((attempt) => attempt + 1);
  }, []);

  const resetExam = () => {
    router.push(getSimulacroCompletoSectionHref());
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
    reloadQuestions,
    retryGrading,
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
    exitHref,
  };
}
