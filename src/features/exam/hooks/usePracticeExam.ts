'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getDifficultyForPhaseSkipSection } from '@/features/exam/data/phaseSkipDifficulty';
import { getPracticeExitHref } from '@/features/exam/utils/getPracticeExitHref';
import {
  clearPracticeSession,
  computeTimeRemainingFromEndsAt,
  hydratePracticeSessionFromStorage,
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
  /** Absolute end timestamp (ms); source of truth for the timer. UI renders wall-clock delta. */
  const [timerEndsAt, setTimerEndsAt] = useState<number | null>(null);
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
    timerEndsAt: null as number | null,
    isFinished: false,
    showResults: false,
  });
  liveRef.current = { examConfig, questions, answers, timerEndsAt, isFinished, showResults };

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

    const hydrated = hydratePracticeSessionFromStorage(areaStr, practiceDifficulty);
    if (hydrated) {
      setExamConfig(hydrated.examConfig);
      setQuestions(hydrated.questions);
      setAnswers(hydrated.answers);
      setShowResults(false);
      setIsFinished(false);
      setMobileMenuOpen(false);
      setShowAnswerSheetMobile(false);
      setTimerEndsAt(hydrated.timerEndsAt);

      const remaining = hydrated.timeRemaining;
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
      setTimerEndsAt(null);
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
      endsAt: number | null
    ) => {
      savePracticeSession({
        state: 'in_progress',
        areaSlug: areaStr,
        difficulty: practiceDifficulty,
        examConfig: config,
        questions: selectedQuestions,
        answers: nextAnswers,
        timerEndsAt: endsAt,
      });
    },
    [areaStr, practiceDifficulty]
  );

  const handleExamStart = useCallback(
    (config: ExamConfig) => {
      const selectedQuestions = allQuestions.slice(0, config.numQuestions);
      const durationSec = config.useTimer ? config.numQuestions * (config.timePerQuestion ?? 2) * 60 : null;
      const endsAt = durationSec != null ? Date.now() + durationSec * 1000 : null;
      setQuestions(selectedQuestions);
      setExamConfig(config);
      setAnswers({});
      setShowResults(false);
      setIsFinished(false);
      resetGrading();
      setTimerEndsAt(endsAt);
      setTimeRemaining(durationSec);
      persistInProgress(config, selectedQuestions, {}, endsAt);
    },
    [allQuestions, resetGrading, persistInProgress]
  );

  // Tick from wall clock against absolute timerEndsAt (not decrementing interval state).
  useEffect(() => {
    if (timerEndsAt == null) {
      setTimeRemaining(null);
      return;
    }

    const tick = () => {
      const remaining = computeTimeRemainingFromEndsAt(timerEndsAt);
      setTimeRemaining(remaining);
      if (remaining !== null && remaining <= 0) {
        setIsFinished(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timerEndsAt]);

  // Keep answers/meta durable; timerEndsAt stays the fixed absolute anchor.
  useEffect(() => {
    if (!sessionHydrated || !examConfig || isFinished || showResults) return;

    const id = window.setInterval(() => {
      const live = liveRef.current;
      if (!live.examConfig || live.isFinished || live.showResults) return;
      persistInProgress(live.examConfig, live.questions, live.answers, live.timerEndsAt);
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
        persistInProgress(examConfig, questions, next, timerEndsAt);
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
    setTimerEndsAt(null);
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
