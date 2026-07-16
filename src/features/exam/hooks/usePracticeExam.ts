'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getDifficultyForPhaseSkipSection } from '@/features/exam/data/phaseSkipDifficulty';
import { getPracticeExitHref } from '@/features/exam/utils/getPracticeExitHref';
import {
  clearPracticeSession,
  computeTimeRemainingFromEndsAt,
  loadPracticeSession,
  savePracticeSession,
} from '@/features/exam/utils/practiceSessionStorage';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { AREA_INFO as SHARED_AREA_INFO } from '@/shared/constants/areaInfo';
import { usePracticeExamQuestions } from './usePracticeExamQuestions';
import { usePracticeExamGrading } from './usePracticeExamGrading';

export function usePracticeExam() {
  const { area } = useParams<{ area: string }>();
  const searchParams = useSearchParams();
  const areaStr = Array.isArray(area) ? area[0] : (area ?? '');
  const practiceDifficulty = useMemo(
    () => getDifficultyForPhaseSkipSection(searchParams.get('etapa') ?? searchParams.get('saltar-fase')),
    [searchParams]
  );
  const shared = SHARED_AREA_INFO[areaStr as keyof typeof SHARED_AREA_INFO];
  const areaInfo = shared
    ? { name: shared.name, color: shared.color }
    : { name: SHARED_AREA_INFO['examen-completo'].name, color: SHARED_AREA_INFO['examen-completo'].color };

  const { allQuestions, loadingQuestions, questionsError } = usePracticeExamQuestions(areaStr, practiceDifficulty);

  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionPublic[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnswerSheetMobile, setShowAnswerSheetMobile] = useState(false);
  const [referrerPath, setReferrerPath] = useState<string | null>(null);
  const [sessionHydrated, setSessionHydrated] = useState(false);

  const liveRef = useRef({
    examConfig: null as ExamConfig | null,
    questions: [] as ExamQuestionPublic[],
    answers: {} as Record<string, string>,
    timeRemaining: null as number | null,
    isFinished: false,
    showResults: false,
  });
  liveRef.current = { examConfig, questions, answers, timeRemaining, isFinished, showResults };

  useEffect(() => {
    if (!document.referrer) return;
    try {
      const ref = new URL(document.referrer);
      if (ref.origin === window.location.origin) {
        setReferrerPath(`${ref.pathname}${ref.search}`);
      }
    } catch {
      /* ignore invalid referrer */
    }
  }, []);

  // Restore in_progress practice session after refresh (D1: práctica por área).
  useEffect(() => {
    setSessionHydrated(false);

    const snapshot = loadPracticeSession(areaStr, practiceDifficulty);
    if (snapshot) {
      setExamConfig(snapshot.examConfig);
      setQuestions(snapshot.questions);
      setAnswers(snapshot.answers);
      setShowResults(false);
      setIsFinished(false);
      setMobileMenuOpen(false);
      setShowAnswerSheetMobile(false);

      const remaining = computeTimeRemainingFromEndsAt(snapshot.timerEndsAt);
      if (remaining === null) {
        setTimeRemaining(null);
      } else if (remaining <= 0) {
        setTimeRemaining(0);
        setIsFinished(true);
      } else {
        setTimeRemaining(remaining);
      }
    } else {
      setExamConfig(null);
      setQuestions([]);
      setAnswers({});
      setShowResults(false);
      setIsFinished(false);
      setTimeRemaining(null);
    }

    setSessionHydrated(true);
  }, [areaStr, practiceDifficulty]);

  const exitHref = useMemo(
    () =>
      getPracticeExitHref({
        areaSlug: areaStr,
        searchParams,
        referrerPath,
      }),
    [areaStr, searchParams, referrerPath]
  );

  const { gradingError, results, correctCount, percentage, resetGrading } = usePracticeExamGrading({
    isFinished,
    showResults,
    questions,
    answers,
    examConfig,
    areaStr,
    areaName: areaInfo.name,
  });

  const persistInProgress = useCallback(
    (
      config: ExamConfig,
      selectedQuestions: ExamQuestionPublic[],
      nextAnswers: Record<string, string>,
      remaining: number | null
    ) => {
      savePracticeSession({
        state: 'in_progress',
        areaSlug: areaStr,
        difficulty: practiceDifficulty,
        examConfig: config,
        questions: selectedQuestions,
        answers: nextAnswers,
        timerEndsAt: remaining != null ? Date.now() + remaining * 1000 : null,
      });
    },
    [areaStr, practiceDifficulty]
  );

  const handleExamStart = useCallback(
    (config: ExamConfig) => {
      const selectedQuestions = allQuestions.slice(0, config.numQuestions);
      const remaining = config.useTimer ? config.numQuestions * (config.timePerQuestion ?? 2) * 60 : null;
      setQuestions(selectedQuestions);
      setExamConfig(config);
      setAnswers({});
      setShowResults(false);
      setIsFinished(false);
      resetGrading();
      setTimeRemaining(remaining);
      persistInProgress(config, selectedQuestions, {}, remaining);
    },
    [allQuestions, resetGrading, persistInProgress]
  );

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

  // Keep timerEndsAt fresh periodically so refresh mid-timer stays accurate.
  useEffect(() => {
    if (!sessionHydrated || !examConfig || isFinished || showResults) return;

    const id = window.setInterval(() => {
      const live = liveRef.current;
      if (!live.examConfig || live.isFinished || live.showResults) return;
      persistInProgress(live.examConfig, live.questions, live.answers, live.timeRemaining);
    }, 15_000);

    return () => window.clearInterval(id);
  }, [sessionHydrated, examConfig, isFinished, showResults, persistInProgress]);

  // submitted → clear durable snapshot (terminal state documented in practiceSessionStorage).
  useEffect(() => {
    if (!sessionHydrated || !examConfig) return;
    if (!(isFinished || showResults)) return;
    clearPracticeSession(areaStr, practiceDifficulty);
  }, [sessionHydrated, examConfig, isFinished, showResults, areaStr, practiceDifficulty]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: answer };
      if (examConfig) {
        persistInProgress(examConfig, questions, next, timeRemaining);
      }
      return next;
    });
  };

  const handleScrollToQuestion = (index: number) => {
    document.getElementById(`question-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetExam = () => {
    // abandoned → clear snapshot
    clearPracticeSession(areaStr, practiceDifficulty);
    setExamConfig(null);
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setIsFinished(false);
    setTimeRemaining(null);
    setMobileMenuOpen(false);
    setShowAnswerSheetMobile(false);
    resetGrading();
  };

  const timeColor =
    timeRemaining !== null && timeRemaining < 300
      ? 'text-red-500 dark:text-red-400'
      : timeRemaining !== null && timeRemaining < 600
        ? 'text-amber-600 dark:text-yellow-400'
        : 'text-app-accent-strong';

  return {
    areaInfo,
    exitHref,
    allQuestions,
    loadingQuestions: !sessionHydrated || (loadingQuestions && !examConfig),
    questionsError,
    gradingError,
    examConfig,
    questions,
    answers,
    showResults,
    setShowResults,
    timeRemaining,
    isFinished,
    mobileMenuOpen,
    setMobileMenuOpen,
    showAnswerSheetMobile,
    setShowAnswerSheetMobile,
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
