import Link from 'next/link';
import type { ExamQuestion } from '@/shared/types/question';
import type { ExamConfig } from '@/features/exam/types';

interface ResultItem {
  question: ExamQuestion;
  correct: boolean;
  userAnswer: string;
}

interface ResultsAnalysisProps {
  results: ResultItem[];
  questions: ExamQuestion[];
  percentage: number;
  correctCount: number;
  examConfig: ExamConfig | null;
  onRetry: () => void;
  returnTo?: string;
  areaInfo?: { name: string; color: string; icon?: string };
}

export const ResultsAnalysis = ({
  results,
  questions,
  percentage,
  correctCount,
  examConfig,
  onRetry,
  returnTo,
}: ResultsAnalysisProps) => {
  const backHref = returnTo || '/';
  const backLabel = returnTo === '/ruta-aprendizaje' ? 'Volver a la Ruta' : 'Volver al Inicio';
  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-sm">
        <div className="mb-12 text-center">
          <h1 className="mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            ¡Examen Completado!
          </h1>
          <div className="mb-4 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-7xl font-black text-transparent">
            {percentage}%
          </div>
          <p className="mb-2 text-xl text-gray-300">Calificación Final</p>
          <p className="text-lg text-gray-400">
            {correctCount} de {questions.length} respuestas correctas
          </p>
        </div>

        <div className="mb-12 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-700"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onRetry}
            className="cursor-pointer rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
          >
            Intentar de Nuevo
          </button>
          <Link
            href={backHref}
            className="cursor-pointer rounded-xl bg-linear-to-r from-purple-600 to-purple-700 px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg"
          >
            {backLabel}
          </Link>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-6">
        <h2 className="mb-8 text-2xl font-bold text-white">Análisis Detallado</h2>
        {results.map((result, idx) => {
          const isCorrect = result.correct;

          return (
            <div
              key={result.question.id}
              className="rounded-xl border border-white/10 bg-linear-to-br from-gray-800/40 via-gray-900/40 to-gray-950/40 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-xl"
            >
              {/* Question Header */}
              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                      isCorrect
                        ? 'bg-linear-to-r from-green-500 to-emerald-500'
                        : 'bg-linear-to-r from-red-500 to-rose-500'
                    }`}
                  >
                    {isCorrect ? '' : ''}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-lg leading-relaxed font-semibold text-white">Pregunta {idx + 1}</p>
                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${
                          isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {isCorrect ? 'Correcta' : 'Incorrecta'}
                      </span>
                    </div>
                    <p className="text-lg leading-relaxed font-semibold text-white">{result.question.text}</p>
                  </div>
                </div>
              </div>

              {/* User Answer and Correct Answer */}
              <div className="ml-14 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-cyan-300">Tu respuesta:</p>
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
                    {result.userAnswer ? (
                      <p className="text-white">
                        <span className="font-bold text-cyan-300">{result.userAnswer}.</span>{' '}
                        {result.question.options.find((o) => o.letter === result.userAnswer)?.text}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">Sin responder</p>
                    )}
                  </div>
                </div>

                {!isCorrect && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-green-300">Respuesta correcta:</p>
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                      <p className="text-white">
                        <span className="font-bold text-green-300">{result.question.correctAnswer}.</span>{' '}
                        {result.question.options.find((o) => o.letter === result.question.correctAnswer)?.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {examConfig?.showExplanations && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-blue-300">Explicación:</p>
                    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                      <p className="text-gray-200">{result.question.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
