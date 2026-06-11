'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  markPhaseSkipped,
  PHASE_SKIP_PASS_PERCENT,
  savePractice,
} from '@/services/persistence';
import { getCompetencyPhaseBySectionId } from '@/features/learning/data/competencyPhases';
import { fetchQuestionsByRouteArea } from '@/features/exam/services/QuestionService';
import type { ExamQuestion } from '@/features/exam/types/question';
import type { ExamConfig } from '@/features/exam/types';
import { AREA_INFO as SHARED_AREA_INFO } from '@/shared/constants/areaInfo';

export function usePracticeExam() {
  const { area } = useParams<{ area: string }>();
  const searchParams = useSearchParams();
  const areaStr = Array.isArray(area) ? area[0] : (area ?? '');
  const phaseSkipSectionId = searchParams.get('saltar-fase');
  const isPhaseSkipMode = Boolean(phaseSkipSectionId);
  const phaseSkipPhase = phaseSkipSectionId
    ? getCompetencyPhaseBySectionId(phaseSkipSectionId)
    : undefined;
  const phaseSkipAppliedRef = useRef(false);
  const [phaseSkipPassed, setPhaseSkipPassed] = useState(false);
  const shared = SHARED_AREA_INFO[areaStr as keyof typeof SHARED_AREA_INFO];
  const areaInfo = shared
    ? { name: shared.name, color: shared.color }
    : { name: SHARED_AREA_INFO['examen-completo'].name, color: SHARED_AREA_INFO['examen-completo'].color };

  const [allQuestions, setAllQuestions] = useState<ExamQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnswerSheetMobile, setShowAnswerSheetMobile] = useState(false);

  useEffect(() => {
    let active = true;

    setLoadingQuestions(true);
    setQuestionsError(null);

    void fetchQuestionsByRouteArea(areaStr)
      .then((loaded) => {
        if (!active) return;
        setAllQuestions(loaded);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setQuestionsError(error instanceof Error ? error.message : 'No se pudieron cargar las preguntas.');
        setAllQuestions([]);
      })
      .finally(() => {
        if (active) setLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, [areaStr]);

  const handleExamStart = (config: ExamConfig) => {
    const selectedQuestions = allQuestions.slice(0, config.numQuestions);
    setQuestions(selectedQuestions);
    setExamConfig(config);
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
    if ((isFinished || showResults) && questions.length > 0) {
      const results = questions.map((q) => ({
        question: q,
        correct: answers[q.id] === q.correctAnswer,
        userAnswer: answers[q.id],
      }));
      const correctCount = results.filter((r) => r.correct).length;
      const percentage = Math.round((correctCount / questions.length) * 100);
      savePractice({
        practiceArea: areaStr,
        areaName: areaInfo.name,
        questions,
        answers,
        correctCount,
        percentage,
        totalQuestions: questions.length,
        config: examConfig,
        completedAt: new Date().toISOString(),
      });

      if (
        isPhaseSkipMode &&
        phaseSkipSectionId &&
        percentage >= PHASE_SKIP_PASS_PERCENT &&
        !phaseSkipAppliedRef.current
      ) {
        phaseSkipAppliedRef.current = true;
        markPhaseSkipped(areaStr, phaseSkipSectionId, percentage);
        setPhaseSkipPassed(true);
      }
    }
  }, [
    isFinished,
    showResults,
    questions,
    answers,
    examConfig,
    areaStr,
    areaInfo.name,
    isPhaseSkipMode,
    phaseSkipSectionId,
  ]);

  const resetExam = () => {
    setExamConfig(null);
    setAnswers({});
    setShowResults(false);
    setIsFinished(false);
    setTimeRemaining(null);
    setMobileMenuOpen(false);
    setShowAnswerSheetMobile(false);
    phaseSkipAppliedRef.current = false;
    setPhaseSkipPassed(false);
  };

  const results =
    questions.length > 0
      ? questions.map((q) => ({
          question: q,
          correct: answers[q.id] === q.correctAnswer,
          userAnswer: answers[q.id] ?? '',
        }))
      : [];

  const correctCount = results.filter((r) => r.correct).length;
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const timeColor =
    timeRemaining !== null && timeRemaining < 300
      ? 'text-red-400'
      : timeRemaining !== null && timeRemaining < 600
        ? 'text-yellow-400'
        : 'text-app-accent-muted';

  return {
    areaInfo,
    isPhaseSkipMode,
    phaseSkipSectionId,
    phaseSkipPhaseTitle: phaseSkipPhase?.title,
    phaseSkipPassed,
    phaseSkipPassPercent: PHASE_SKIP_PASS_PERCENT,
    allQuestions,
    loadingQuestions,
    questionsError,
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
