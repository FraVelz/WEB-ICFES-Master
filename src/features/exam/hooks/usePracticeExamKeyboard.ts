'use client';

import { useEffect, useRef } from 'react';
import { parsePracticeExamKey } from '@/features/exam/utils/practiceExamKeyboard';
import type { ExamQuestionPublic } from '@/features/exam/types/question';

type UsePracticeExamKeyboardArgs = {
  enabled: boolean;
  questions: ExamQuestionPublic[];
  currentQuestion: number;
  answers: Record<string, string>;
  onAnswer: (questionId: string, answer: string) => void;
  onFocusQuestion: (index: number) => void;
  onToggleFlag: (questionId: string) => void;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

/** Global shortcuts while the practice runner is active (1–4 / N / P / F). */
export function usePracticeExamKeyboard({
  enabled,
  questions,
  currentQuestion,
  answers,
  onAnswer,
  onFocusQuestion,
  onToggleFlag,
}: UsePracticeExamKeyboardArgs) {
  const latest = useRef({
    questions,
    currentQuestion,
    answers,
    onAnswer,
    onFocusQuestion,
    onToggleFlag,
  });
  latest.current = { questions, currentQuestion, answers, onAnswer, onFocusQuestion, onToggleFlag };

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const action = parsePracticeExamKey(event);
      if (!action) return;

      const live = latest.current;
      const question = live.questions[live.currentQuestion];
      if (!question) return;

      event.preventDefault();

      if (action.type === 'selectOption') {
        const option = question.options[action.optionIndex];
        if (!option) return;
        const optionKey = option.letter ?? option.id;
        live.onAnswer(question.id, optionKey);
        return;
      }

      if (action.type === 'next') {
        live.onFocusQuestion(Math.min(live.currentQuestion + 1, live.questions.length - 1));
        return;
      }

      if (action.type === 'prev') {
        live.onFocusQuestion(Math.max(live.currentQuestion - 1, 0));
        return;
      }

      if (action.type === 'toggleFlag') {
        live.onToggleFlag(question.id);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
