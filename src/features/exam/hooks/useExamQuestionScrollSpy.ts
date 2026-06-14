'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const EXAM_SCROLL_ROOT_ID = 'exam-scroll-root';

const SCROLL_SPY_THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1] as const;

function parseQuestionIndex(element: Element): number | null {
  const match = /^question-(\d+)$/.exec(element.id);
  if (!match) return null;
  const index = Number.parseInt(match[1] ?? '', 10);
  return Number.isNaN(index) ? null : index;
}

/** Resalta en la hoja de respuestas la pregunta visible según el scroll del examen. */
export function useExamQuestionScrollSpy(totalQuestions: number) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const ratiosRef = useRef<Map<number, number>>(new Map());
  const clickLockRef = useRef<number | null>(null);
  const clickLockTimerRef = useRef<number | null>(null);

  const releaseClickLock = useCallback(() => {
    clickLockRef.current = null;
    if (clickLockTimerRef.current != null) {
      window.clearTimeout(clickLockTimerRef.current);
      clickLockTimerRef.current = null;
    }
  }, []);

  const focusQuestion = useCallback(
    (index: number) => {
      if (index < 0 || index >= totalQuestions) return;
      releaseClickLock();
      clickLockRef.current = index;
      setCurrentQuestion(index);
      clickLockTimerRef.current = window.setTimeout(() => {
        clickLockRef.current = null;
        clickLockTimerRef.current = null;
      }, 900);
    },
    [releaseClickLock, totalQuestions]
  );

  useEffect(() => {
    if (totalQuestions <= 0) return;

    ratiosRef.current.clear();
    setCurrentQuestion(0);

    const root = document.getElementById(EXAM_SCROLL_ROOT_ID);
    const elements = Array.from({ length: totalQuestions }, (_, index) =>
      document.getElementById(`question-${index}`)
    ).filter((element): element is HTMLElement => element != null);

    if (elements.length === 0) return;

    const pickMostVisible = () => {
      if (clickLockRef.current != null) return;

      let bestIndex = 0;
      let bestRatio = -1;

      for (const [index, ratio] of ratiosRef.current) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestIndex = index;
        }
      }

      if (bestRatio > 0) {
        setCurrentQuestion(bestIndex);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = parseQuestionIndex(entry.target);
          if (index == null) continue;
          ratiosRef.current.set(index, entry.intersectionRatio);
        }
        pickMostVisible();
      },
      {
        root,
        rootMargin: '-15% 0px -50% 0px',
        threshold: [...SCROLL_SPY_THRESHOLDS],
      }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      ratiosRef.current.clear();
      releaseClickLock();
    };
  }, [releaseClickLock, totalQuestions]);

  return { currentQuestion, focusQuestion };
}
