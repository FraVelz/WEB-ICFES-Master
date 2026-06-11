'use client';
import { cn } from '@/utils/cn';
import { useRef, useState } from 'react';
import type { ExamConfig } from '@/features/exam/types';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';

interface ExamConfigModalProps {
  area: string;
  totalQuestions: number;
  onStart: (config: ExamConfig) => void;
  isFullExam?: boolean;
}

export const ExamConfigModal = ({
  area,
  totalQuestions: maxQuestions,
  onStart,
  isFullExam = false,
}: ExamConfigModalProps) => {
  const [numQuestions, setNumQuestions] = useState(isFullExam ? maxQuestions : 10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(2);
  const [showExplanations, setShowExplanations] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogA11y(true, () => window.history.back(), dialogRef);

  const handleStart = () => {
    onStart({
      numQuestions,
      useTimer,
      timePerQuestion,
      showExplanations,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-hidden="true">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-config-title"
        className={cn(
          'w-full max-w-md rounded-2xl border border-surface-border bg-surface-elevated p-8 shadow-2xl'
        )}
      >
        <h2 id="exam-config-title" className="mb-2 text-3xl font-bold text-on-surface">
          Configurar Examen
        </h2>
        <p className="mb-8 text-on-surface-muted">{area}</p>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block font-semibold text-on-surface">Número de preguntas</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={maxQuestions}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className={cn(
                  'accent-app-accent h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-surface-overlay',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
                )}
              />
              <span className="bg-app-ring/20 text-app-accent-strong rounded-lg px-4 py-1 text-lg font-semibold">
                {numQuestions}
              </span>
            </div>
            <p className="mt-2 text-xs text-on-surface-muted">Disponibles: {maxQuestions} preguntas</p>
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
              <span className="font-semibold text-on-surface">Usar temporizador</span>
            </label>
          </div>

          {useTimer && (
            <div>
              <label className="mb-3 block font-semibold text-on-surface">Minutos por pregunta</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                  className={cn(
                    'accent-app-accent h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-surface-overlay',
                    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                    'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
                  )}
                />
                <span className="bg-app-ring/20 text-app-accent-strong rounded-lg px-4 py-1 font-semibold">
                  {timePerQuestion}m
                </span>
              </div>
            </div>
          )}

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
              <span className="font-semibold text-on-surface">Mostrar explicaciones</span>
            </label>
          </div>

          <div className="mt-8 rounded-lg border border-surface-border bg-surface-overlay/50 p-4">
            <p className="text-sm text-on-surface-muted">
              Tiempo total estimado:{' '}
              <span className="text-app-accent-strong font-semibold">
                {useTimer ? `${numQuestions * timePerQuestion}` : 'Sin límite'} minutos
              </span>
            </p>
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className={cn(
                'flex-1 rounded-lg border border-surface-border bg-surface-overlay px-6 py-3 text-center font-semibold',
                'cursor-pointer text-on-surface transition-all duration-300 hover:bg-surface-border',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
              )}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleStart}
              className={cn(
                'from-cta-from to-cta-progress-end flex-1 rounded-lg bg-linear-to-r px-6 py-3 font-semibold',
                'hover:from-app-accent-strong text-white transition-all duration-300 hover:to-blue-600',
                'hover:shadow-app-ring/50 cursor-pointer hover:shadow-lg',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
              )}
            >
              Comenzar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
