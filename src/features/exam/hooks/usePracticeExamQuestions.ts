'use client';

import { useEffect, useState } from 'react';
import { fetchQuestionsByRouteArea } from '@/features/exam/services/QuestionService';
import type { ExamQuestionPublic } from '@/features/exam/types/question';

export function usePracticeExamQuestions(areaStr: string) {
  const [allQuestions, setAllQuestions] = useState<ExamQuestionPublic[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

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

  return { allQuestions, loadingQuestions, questionsError };
}
