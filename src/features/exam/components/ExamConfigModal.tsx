'use client';
import { useState } from 'react';
import Link from 'next/link';

export const ExamConfigModal = ({
  area,
  totalQuestions: maxQuestions,
  onStart,
  isFullExam = false,
}) => {
  const [numQuestions, setNumQuestions] = useState(
    isFullExam ? maxQuestions : 10
  );
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-linear-to-br from-gray-800 via-gray-900 to-gray-950 p-8 shadow-2xl">
        <h2 className="mb-2 text-3xl font-bold text-white">
          Configurar Examen
        </h2>
        <p className="mb-8 text-gray-400">{area}</p>

        <div className="space-y-6">
          {/* Número de preguntas */}
          <div>
            <label className="mb-3 block font-semibold text-white">
              Número de preguntas
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={maxQuestions}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-cyan-400"
              />
              <span className="rounded-lg bg-cyan-500/20 px-4 py-1 text-lg font-semibold text-cyan-300">
                {numQuestions}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Disponibles: {maxQuestions} preguntas
            </p>
          </div>

          {/* Temporizador */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={useTimer}
                onChange={(e) => setUseTimer(e.target.checked)}
                className="h-5 w-5 rounded border-2 border-cyan-400 accent-cyan-500"
              />
              <span className="font-semibold text-white">
                Usar temporizador
              </span>
            </label>
          </div>

          {/* Tiempo por pregunta */}
          {useTimer && (
            <div>
              <label className="mb-3 block font-semibold text-white">
                Minutos por pregunta
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-cyan-400"
                />
                <span className="rounded-lg bg-cyan-500/20 px-4 py-1 font-semibold text-cyan-300">
                  {timePerQuestion}m
                </span>
              </div>
            </div>
          )}

          {/* Mostrar explicaciones */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showExplanations}
                onChange={(e) => setShowExplanations(e.target.checked)}
                className="h-5 w-5 rounded border-2 border-cyan-400 accent-cyan-500"
              />
              <span className="font-semibold text-white">
                Mostrar explicaciones
              </span>
            </label>
          </div>

          {/* Resumen */}
          <div className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">
              Tiempo total estimado:{' '}
              <span className="font-semibold text-cyan-300">
                {useTimer ? `${numQuestions * timePerQuestion}` : 'Sin límite'}{' '}
                minutos
              </span>
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-6">
            <Link
              href="/"
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-center font-semibold text-white transition-all duration-300 hover:bg-white/20"
            >
              Cancelar
            </Link>
            <button
              onClick={handleStart}
              className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              Comenzar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
