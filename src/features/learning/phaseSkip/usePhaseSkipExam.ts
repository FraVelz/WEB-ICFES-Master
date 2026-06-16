'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
  getCompetencyPhaseBySectionId,
  getLearningPhasesHref,
  isPhasesAreaSlug,
} from '@/features/learning/data/competencyPhases';
import { useLearningPath } from '@/features/learning/hooks/useLearningPath';
import { buildPhaseSkipExamConfig } from '@/features/exam/data/phaseSkipExamConfig';
import { PHASE_SKIP_PASS_PERCENT, markPhaseLessonsComplete } from '@/services/persistence';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { queryKeys } from '@/services/query/queryKeys';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { AREA_INFO as SHARED_AREA_INFO } from '@/shared/constants/areaInfo';
import { fetchPhaseSkipGrade, fetchPhaseSkipStart } from './phaseSkipClient';
import { gradedQuizToExamQuestion, quizQuestionToExamPublic } from './quizToExamQuestion';
import type { NormalizedQuizQuestion } from '@/features/learning/roadmap/lessonQuiz/quizTypes';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function usePhaseSkipExam() {
  const { area: areaParam } = useParams<{ area: string }>();
  const searchParams = useSearchParams();
  const areaStr = Array.isArray(areaParam) ? areaParam[0] : (areaParam ?? '');
  const sectionId = searchParams.get('etapa') ?? '';
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { sections, loading: pathLoading } = useLearningPath(isPhasesAreaSlug(areaStr) ? areaStr : undefined, {
    loadAllPhases: true,
  });

  const phase = getCompetencyPhaseBySectionId(sectionId);
  const section = sections.find((s) => s.id === sectionId);
  const lessonIds = useMemo(() => section?.nodes.map((node) => node.id) ?? [], [section?.nodes]);

  const shared = SHARED_AREA_INFO[areaStr as keyof typeof SHARED_AREA_INFO];
  const areaInfo = shared
    ? { name: shared.name, color: shared.color }
    : { name: SHARED_AREA_INFO['lectura-critica'].name, color: SHARED_AREA_INFO['lectura-critica'].color };

  const exitHref = getLearningPhasesHref(isPhasesAreaSlug(areaStr) ? areaStr : undefined);

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [rawQuestions, setRawQuestions] = useState<NormalizedQuizQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [phaseSkipPassed, setPhaseSkipPassed] = useState(false);
  const [rewards, setRewards] = useState<{ xp: number; coins: number } | null>(null);

  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionPublic[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const [gradedResults, setGradedResults] = useState<
    { question: ReturnType<typeof gradedQuizToExamQuestion>; correct: boolean; userAnswer: string }[]
  >([]);
  const gradingStartedRef = useRef(false);

  const isValidParams = Boolean(phase && isPhasesAreaSlug(areaStr) && lessonIds.length > 0);
  const requiresAuth = !user || isDemoUserId(user.uid);

  useEffect(() => {
    if (pathLoading) return;
    if (!isValidParams) {
      setLoadingQuestions(false);
      setQuestionsError('Parámetros de simulacro no válidos. Vuelve a fases e inténtalo de nuevo.');
      return;
    }
    if (requiresAuth) {
      setLoadingQuestions(false);
      setQuestionsError('Inicia sesión con una cuenta real para usar el simulacro de fase.');
      return;
    }

    let active = true;
    setLoadingQuestions(true);
    setQuestionsError(null);
    setSessionToken(null);
    setRawQuestions([]);
    setExamConfig(null);
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setIsFinished(false);
    setTimeRemaining(null);
    setPhaseSkipPassed(false);
    setRewards(null);
    setGradedResults([]);
    gradingStartedRef.current = false;

    void fetchPhaseSkipStart(areaStr, sectionId, lessonIds)
      .then((session) => {
        if (!active) return;
        setSessionToken(session.sessionToken);
        setRawQuestions(session.questions);
        const config = buildPhaseSkipExamConfig(session.totalQuestions);
        const publicQuestions = session.questions.map(quizQuestionToExamPublic);
        setExamConfig(config);
        setQuestions(publicQuestions);
        if (config.useTimer) {
          setTimeRemaining(config.numQuestions * (config.timePerQuestion ?? 2) * 60);
        }
      })
      .catch((error) => {
        if (!active) return;
        setQuestionsError(error instanceof Error ? error.message : 'No se pudo cargar el simulacro');
      })
      .finally(() => {
        if (active) setLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, [areaStr, sectionId, lessonIds, pathLoading, isValidParams, requiresAuth, user?.uid]);

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

  useEffect(() => {
    if (!(isFinished || showResults) || questions.length === 0 || !sessionToken) return;
    if (gradingStartedRef.current) return;

    gradingStartedRef.current = true;
    let active = true;

    void fetchPhaseSkipGrade(sessionToken, answers)
      .then((gradeResult) => {
        if (!active) return;
        setGradingError(null);

        const results = gradeResult.results.map((result) => {
          const source = rawQuestions.find((question) => question.id === result.questionId);
          const question = source
            ? gradedQuizToExamQuestion(source, result)
            : gradedQuizToExamQuestion(
                {
                  id: result.questionId,
                  question: '',
                  options: [],
                  correctAnswer: result.correctAnswer,
                  explanation: result.explanation,
                  difficulty: '',
                },
                result
              );
          return {
            question,
            correct: result.correct,
            userAnswer: answers[result.questionId] ?? '',
          };
        });
        setGradedResults(results);

        if (gradeResult.passed) {
          setPhaseSkipPassed(true);
          if (gradeResult.rewards) {
            setRewards({ xp: gradeResult.rewards.xp, coins: gradeResult.rewards.coins });
          }
          markPhaseLessonsComplete(user?.uid, areaStr, sectionId, gradeResult.lessonIds, gradeResult.score);
          if (user?.uid && !isDemoUserId(user.uid)) {
            void queryClient.invalidateQueries({ queryKey: queryKeys.gamification(user.uid) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.learningProgress(user.uid, areaStr) });
          }
        }
      })
      .catch((error) => {
        if (!active) return;
        gradingStartedRef.current = false;
        setGradingError(error instanceof Error ? error.message : 'Error al calificar el simulacro');
      });

    return () => {
      active = false;
    };
  }, [
    isFinished,
    showResults,
    questions.length,
    sessionToken,
    answers,
    rawQuestions,
    user?.uid,
    areaStr,
    sectionId,
    queryClient,
  ]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleScrollToQuestion = useCallback((index: number) => {
    document.getElementById(`question-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const resetExam = useCallback(() => {
    gradingStartedRef.current = false;
    setGradedResults([]);
    setGradingError(null);
    setPhaseSkipPassed(false);
    setRewards(null);
    setShowResults(false);
    setIsFinished(false);
    setAnswers({});
    setTimeRemaining(null);

    if (!isValidParams || requiresAuth) return;

    setLoadingQuestions(true);
    void fetchPhaseSkipStart(areaStr, sectionId, lessonIds)
      .then((session) => {
        setSessionToken(session.sessionToken);
        setRawQuestions(session.questions);
        const config = buildPhaseSkipExamConfig(session.totalQuestions);
        setExamConfig(config);
        setQuestions(session.questions.map(quizQuestionToExamPublic));
        if (config.useTimer) {
          setTimeRemaining(config.numQuestions * (config.timePerQuestion ?? 2) * 60);
        }
      })
      .catch((error) => {
        setQuestionsError(error instanceof Error ? error.message : 'No se pudo reiniciar el simulacro');
      })
      .finally(() => setLoadingQuestions(false));
  }, [areaStr, sectionId, lessonIds, isValidParams, requiresAuth]);

  const timeColor =
    timeRemaining !== null && timeRemaining < 300
      ? 'text-red-500 dark:text-red-400'
      : timeRemaining !== null && timeRemaining < 600
        ? 'text-amber-600 dark:text-yellow-400'
        : 'text-app-accent-strong';

  const correctCount = gradedResults.filter((r) => r.correct).length;
  const percentage = gradedResults.length > 0 ? Math.round((correctCount / gradedResults.length) * 100) : 0;

  return {
    areaStr,
    sectionId,
    areaInfo,
    phaseTitle: phase?.title,
    phaseSkipPassPercent: PHASE_SKIP_PASS_PERCENT,
    phaseSkipPassed,
    rewards,
    exitHref,
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
    handleAnswer,
    handleScrollToQuestion,
    resetExam,
    results: gradedResults,
    correctCount,
    percentage,
    timeColor,
  };
}
