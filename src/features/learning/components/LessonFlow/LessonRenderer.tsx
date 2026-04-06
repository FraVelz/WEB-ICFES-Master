'use client';

import { cn } from '@/utils/cn';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { LessonStepRow } from '@/features/learning/types/lessonFlow';

import { renderLessonStep } from './renderLessonStep';

const STORAGE_PREFIX = 'icfes_lesson_step_';

type LessonRendererProps = {
  lessonId: string;
  steps: LessonStepRow[];
};

export function LessonRenderer({ lessonId, steps }: LessonRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const total = steps.length;
  const current = steps[currentIndex];
  const isLast = currentIndex >= total - 1;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${lessonId}`);
      if (raw !== null) {
        const n = Number.parseInt(raw, 10);
        if (!Number.isNaN(n) && n >= 0 && n < total) {
          setCurrentIndex(n);
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [lessonId, total]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${lessonId}`, String(currentIndex));
    } catch {
      /* ignore */
    }
  }, [currentIndex, hydrated, lessonId]);

  useEffect(() => {
    setCanProceed(false);
  }, [currentIndex]);

  const markReady = useCallback((value = true) => {
    setCanProceed(value);
  }, []);

  const goNext = useCallback(() => {
    if (!canProceed || isLast) return;
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [canProceed, isLast, total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const stepView = useMemo(() => {
    if (!current) return null;
    return renderLessonStep(current, markReady);
  }, [current, markReady]);

  if (!hydrated) {
    return (
      <div
        className="mx-auto min-h-[50vh] max-w-2xl animate-pulse rounded-2xl bg-slate-800/40 px-4 py-16"
        aria-hidden
      />
    );
  }

  if (total === 0) {
    return <p className="text-center text-slate-400">No hay pasos en esta lección.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-16">
      <div className="mb-8 flex items-center justify-between gap-4 text-sm text-slate-400">
        <span>
          Paso {currentIndex + 1} / {total}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div key={current?.id ?? currentIndex} className="transition-opacity duration-200 ease-out">
        {stepView}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={cn(
            'min-h-[52px] rounded-xl border border-slate-600 px-6 text-lg font-medium text-slate-200',
            'transition enabled:hover:border-slate-500 enabled:hover:bg-slate-800/50',
            'disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          Anterior
        </button>
        {!isLast ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed}
            className={cn(
              'min-h-[52px] rounded-xl bg-cyan-600 px-8 text-lg font-semibold text-white transition',
              'enabled:hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40'
            )}
          >
            Siguiente
          </button>
        ) : (
          <div className="flex flex-1 justify-end">
            <span className="text-center text-lg font-medium text-emerald-400 sm:text-right">¡Lección completada!</span>
          </div>
        )}
      </div>
    </div>
  );
}
