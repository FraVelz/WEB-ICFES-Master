'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PHASE_SKIP_PASS_PERCENT } from '@/services/persistence';
import { getCompetencyPhaseBySectionId } from '@/features/learning/data/competencyPhases';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { AREA_INFO as SHARED_AREA_INFO } from '@/shared/constants/areaInfo';
import { usePracticeExamQuestions } from './usePracticeExamQuestions';
import { usePracticeExamGrading } from './usePracticeExamGrading';

export function usePracticeExam() {
  const { area } = useParams<{ area: string }>();
  const searchParams = useSearchParams();
  const areaStr = Array.isArray(area) ? area[0] : (area ?? '');
  const phaseSkipSectionId = searchParams.get('saltar-fase');
  const isPhaseSkipMode = Boolean(phaseSkipSectionId);
  const phaseSkipPhase = phaseSkipSectionId ? getCompetencyPhaseBySectionId(phaseSkipSectionId) : undefined;
  const shared = SHARED_AREA_INFO[areaStr as keyof typeof SHARED_AREA_INFO];
  const areaInfo = shared
    ? { name: shared.name, color: shared.color }
    : { name: SHARED_AREA_INFO['examen-completo'].name, color: SHARED_AREA_INFO['examen-completo'].color };

  const { allQuestions, loadingQuestions, questionsError } = usePracticeExamQuestions(areaStr);

  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ExamQuestionPublic[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnswerSheetMobile, setShowAnswerSheetMobile] = useState(false);

  const { gradingError, phaseSkipPassed, results, correctCount, percentage, resetGrading } = usePracticeExamGrading({
    isFinished,
    showResults,
    questions,
    answers,
    examConfig,
    areaStr,
    areaName: areaInfo.name,
    isPhaseSkipMode,
    phaseSkipSectionId,
  });

  const handleExamStart = (config: ExamConfig) => {
    const selectedQuestions = allQuestions.slice(0, config.numQuestions);
    setQuestions(selectedQuestions);
    setExamConfig(config);
    resetGrading();
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

  const resetExam = () => {
    setExamConfig(null);
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
