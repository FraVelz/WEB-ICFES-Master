'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { isDemoUserId } from '@/services/demo/demoCoins';
import { savePractice } from '@/services/persistence';
import { fetchGradedExamResults, gradedToExamQuestion } from '@/features/exam/services/examGradingClient';
import type { GradedExamAnswer } from '@/features/exam/services/examGradingServer';
import type { ExamConfig } from '@/features/exam/types';
import type { ExamQuestion, ExamQuestionPublic } from '@/features/exam/types/question';
import { captureExamRunnerError } from '@/lib/monitoring/examSentry';

type GradingParams = {
  isFinished: boolean;
  showResults: boolean;
  questions: ExamQuestionPublic[];
  answers: Record<string, string>;
  examConfig: ExamConfig | null;
  areaStr: string;
  areaName: string;
  timerToken: string | null;
};

export function usePracticeExamGrading({
  isFinished,
  showResults,
  questions,
  answers,
  examConfig,
  areaStr,
  areaName,
  timerToken,
}: GradingParams) {
  const { user } = useAuth();
  const [gradedResults, setGradedResults] = useState<GradedExamAnswer[] | null>(null);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const gradingStartedRef = useRef(false);

  useEffect(() => {
    if (!(isFinished || showResults) || questions.length === 0) return;
    if (gradingStartedRef.current) return;

    gradingStartedRef.current = true;
    let active = true;

    const attemptId = Date.now();

    void fetchGradedExamResults(answers, {
      awardActivity:
        user?.uid && !isDemoUserId(user.uid)
          ? { attemptType: 'practice', attemptId, timerToken: timerToken ?? undefined }
          : undefined,
    })
      .then(({ results }) => {
        if (!active) return;
        setGradedResults(results);
        setGradingError(null);

        const fullQuestions: ExamQuestion[] = results.map(gradedToExamQuestion);
        const correctCount = results.filter((r) => r.correct).length;
        const percentage = Math.round((correctCount / results.length) * 100);

        savePractice({
          id: attemptId,
          practiceArea: areaStr,
          areaName,
          examMode: 'area-general',
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
        captureExamRunnerError(error, { phase: 'submit', area: areaStr });
        setGradingError(error instanceof Error ? error.message : 'Error al calificar el examen');
      });

    return () => {
      active = false;
    };
  }, [isFinished, showResults, questions, answers, examConfig, areaStr, areaName, user?.uid, timerToken]);

  const resetGrading = () => {
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

  return {
    gradedResults,
    gradingError,
    results,
    correctCount,
    percentage,
    resetGrading,
  };
}
