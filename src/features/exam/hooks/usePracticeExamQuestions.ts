'use client';

import { useEffect, useState } from 'react';
import type { ExamQuestionDifficulty } from '@/features/exam/data/phaseSkipDifficulty';
import { fetchQuestionsByRouteArea } from '@/features/exam/services/QuestionService';
import type { ExamQuestionPublic } from '@/features/exam/types/question';
import { captureExamRunnerError } from '@/lib/monitoring/examSentry';

export function usePracticeExamQuestions(areaStr: string, difficulty?: ExamQuestionDifficulty | null) {
  const [allQuestions, setAllQuestions] = useState<ExamQuestionPublic[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoadingQuestions(true);
    setQuestionsError(null);

    void fetchQuestionsByRouteArea(areaStr, undefined, difficulty)
      .then((loaded) => {
        if (!active) return;
        setAllQuestions(loaded);
      })
      .catch((error: unknown) => {
        if (!active) return;
        captureExamRunnerError(error, { phase: 'load', area: areaStr });
        setQuestionsError(error instanceof Error ? error.message : 'No se pudieron cargar las preguntas.');
        setAllQuestions([]);
      })
      .finally(() => {
        if (active) setLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, [areaStr, difficulty]);

  return { allQuestions, loadingQuestions, questionsError };
}
