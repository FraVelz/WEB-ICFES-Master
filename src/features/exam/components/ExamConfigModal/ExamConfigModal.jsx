import { useState } from 'react';
import { Link } from 'react-router-dom';

export const ExamConfigModal = ({ area, totalQuestions: maxQuestions, onStart, isFullExam = false }) => {
  const [numQuestions, setNumQuestions] = useState(isFullExam ? maxQuestions : 10);
  const [useTimer, setUseTimer] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(2);
  const [showExplanations, setShowExplanations] = useState(true);

  const handleStart = () => {
    onStart({
      numQuestions,
      useTimer,
      timePerQuestion,
      showExplanations
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-linear-to-br from-gray-800 via-gray-900 to-gray-950 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Configurar Examen</h2>
        <p className="text-gray-400 mb-8">
          {area}
        </p>

        <div className="space-y-6">
          {/* Número de preguntas */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Número de preguntas
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max={maxQuestions}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="bg-cyan-500/20 text-cyan-300 px-4 py-1 rounded-lg font-semibold text-lg">
                {numQuestions}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Disponibles: {maxQuestions} preguntas
            </p>
          </div>

          {/* Temporizador */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useTimer}
                onChange={(e) => setUseTimer(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-cyan-400 accent-cyan-500"
              />
              <span className="text-white font-semibold">Usar temporizador</span>
            </label>
          </div>

          {/* Tiempo por pregunta */}
          {useTimer && (
            <div>
              <label className="block text-white font-semibold mb-3">
                Minutos por pregunta
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                  className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="bg-cyan-500/20 text-cyan-300 px-4 py-1 rounded-lg font-semibold">
                  {timePerQuestion}m
                </span>
              </div>
            </div>
          )}

          {/* Mostrar explicaciones */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showExplanations}
                onChange={(e) => setShowExplanations(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-cyan-400 accent-cyan-500"
              />
              <span className="text-white font-semibold">Mostrar explicaciones</span>
            </label>
          </div>

          {/* Resumen */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mt-8">
            <p className="text-sm text-gray-400">
              Tiempo total estimado:{' '}
              <span className="text-cyan-300 font-semibold">
                {useTimer ? `${(numQuestions * timePerQuestion)}` : 'Sin límite'} minutos
              </span>
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-6">
            <Link
              to="/"
              className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 border border-white/20"
            >
              Cancelar
            </Link>
            <button
              onClick={handleStart}
              className="flex-1 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              Comenzar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
