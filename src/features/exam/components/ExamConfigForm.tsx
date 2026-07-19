'use client';

import { cn } from '@/utils/cn';
import { useState } from 'react';
import type { ExamConfig } from '@/features/exam/types';

type ExamConfigFormProps = {
  area: string;
  totalQuestions: number;
  onStart: (config: ExamConfig) => void | Promise<void>;
  onCancel?: () => void;
  isFullExam?: boolean;
  variant?: 'modal' | 'page';
};

export function ExamConfigForm({
  area,
  totalQuestions: maxQuestions,
  onStart,
  onCancel,
  isFullExam = false,
  variant = 'modal',
}: ExamConfigFormProps) {
  const [numQuestions, setNumQuestions] = useState(isFullExam ? maxQuestions : 10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(2);
  const [showExplanations, setShowExplanations] = useState(true);

  const handleStart = () => {
    onStart({
      numQuestions,
      useTimer,
      timePerQuestion,
      showExplanations,
    });
  };

  const isPage = variant === 'page';

  return (
    <div className={cn(isPage ? 'space-y-8' : 'space-y-6')}>
      <div className={isPage ? 'space-y-2' : undefined}>
        <h2
          id="exam-config-title"
          className={cn('text-on-surface font-bold', isPage ? 'text-2xl sm:text-3xl' : 'mb-2 text-3xl')}
        >
          {isPage ? 'Configura tu simulacro' : 'Configurar Examen'}
        </h2>
        <p className={cn('text-on-surface-muted', isPage ? 'text-sm sm:text-base' : 'mb-8')}>{area}</p>
        {isPage ? (
          <p className="text-on-surface-muted text-sm leading-relaxed">
            Personaliza el número de preguntas, el tiempo y si quieres ver explicaciones al terminar.
          </p>
        ) : null}
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="exam-num-questions" className="text-on-surface mb-3 block font-semibold">
            Número de preguntas
          </label>
          <div className="flex items-center gap-4">
            <input
              id="exam-num-questions"
              type="range"
              min="1"
              max={maxQuestions}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              aria-valuetext={`${numQuestions} preguntas`}
              className={cn(
                'accent-app-accent bg-surface-overlay h-2 flex-1 cursor-pointer appearance-none rounded-lg',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
              )}
            />
            <span className="bg-app-ring/20 text-app-accent-strong rounded-lg px-4 py-1 text-lg font-semibold">
              {numQuestions}
            </span>
          </div>
          <p className="text-on-surface-muted mt-2 text-xs">Disponibles: {maxQuestions} preguntas</p>
        </div>

        <div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={useTimer}
              onChange={(e) => setUseTimer(e.target.checked)}
              className={cn(
                'border-app-accent accent-app-ring h-5 w-5 rounded border-2 focus-visible:outline-none',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-surface-via'
              )}
            />
            <span className="text-on-surface font-semibold">Usar temporizador</span>
          </label>
        </div>

        {useTimer ? (
          <div>
            <label htmlFor="exam-time-per-question" className="text-on-surface mb-3 block font-semibold">
              Minutos por pregunta
            </label>
            <div className="flex items-center gap-4">
              <input
                id="exam-time-per-question"
                type="range"
                min="1"
                max="10"
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                aria-valuetext={`${timePerQuestion} minutos por pregunta`}
                className={cn(
                  'accent-app-accent bg-surface-overlay h-2 flex-1 cursor-pointer appearance-none rounded-lg',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
                )}
              />
              <span className="bg-app-ring/20 text-app-accent-strong rounded-lg px-4 py-1 font-semibold">
                {timePerQuestion}m
              </span>
            </div>
          </div>
        ) : null}

        <div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={showExplanations}
              onChange={(e) => setShowExplanations(e.target.checked)}
              className={cn(
                'border-app-accent accent-app-ring h-5 w-5 rounded border-2 focus-visible:outline-none',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
                'focus-visible:ring-offset-surface-via'
              )}
            />
            <span className="text-on-surface font-semibold">Mostrar explicaciones</span>
          </label>
        </div>

        <div className="border-surface-border bg-surface-overlay/50 rounded-lg border p-4">
          <p className="text-on-surface-muted text-sm">
            Tiempo total estimado:{' '}
            <span className="text-app-accent-strong font-semibold">
              {useTimer ? `${numQuestions * timePerQuestion}` : 'Sin límite'} minutos
            </span>
          </p>
        </div>

        <div className={cn('flex gap-3', isPage ? 'pt-2' : 'pt-6')}>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                'border-surface-border bg-surface-overlay flex-1 rounded-lg border px-6 py-3 text-center font-semibold',
                'text-on-surface hover:bg-surface-border cursor-pointer transition-all duration-300',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
              )}
            >
              Cancelar
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleStart}
            className={cn(
              'from-cta-from to-cta-progress-end rounded-lg bg-linear-to-r px-6 py-3 font-semibold',
              'hover:from-app-accent-strong text-white transition-all duration-300 hover:to-blue-600',
              'hover:shadow-app-ring/50 cursor-pointer hover:shadow-lg',
              'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
              'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2',
              onCancel ? 'flex-1' : 'w-full sm:w-auto sm:min-w-[12rem]'
            )}
          >
            Comenzar simulacro
          </button>
        </div>
      </div>
    </div>
  );
}
