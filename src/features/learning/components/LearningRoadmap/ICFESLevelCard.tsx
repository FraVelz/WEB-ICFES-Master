import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { DIFFICULTY_COLORS } from './constants';

/**
 * Componente para mostrar un nivel individual del mapa ICFES
 */
export const ICFESLevelCard = ({ level, index, totalLevels, icons }) => {
  const isCompleted = level.completed;
  const isLocked = !level.completed && level.progress === 0;
  const isInProgress = level.progress > 0 && level.progress < 100;

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-300 ${
        isCompleted
          ? `${level.colorBg20} ${level.colorBorder}`
          : isLocked
          ? 'bg-slate-800/30 border-slate-700'
          : `bg-slate-800/50 ${level.colorBorder}/50`
      }`}
    >
      {/* Contenedor Principal */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Información del Nivel */}
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-4 rounded-lg bg-linear-to-br ${level.colorGradient} text-white shrink-0 ${
                    isLocked ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <FontAwesomeIcon icon={icons[level.icon]} className="text-2xl" />
                </div>

                {/* Título y Descripción */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">{level.name}</h3>
                  <p className={`text-sm mb-2 ${isLocked ? 'text-slate-500' : 'text-slate-400'}`}>
                    {level.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${DIFFICULTY_COLORS[level.difficulty]}`}>
                      {level.difficulty}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full bg-blue-900/40 text-blue-300`}>
                      {level.estimatedHours}h estimadas
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full bg-slate-700/40 text-slate-300`}>
                      {level.pointRange} puntos
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Icon */}
              <div className="shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                    isCompleted
                      ? 'bg-green-600/40 text-green-400'
                      : isLocked
                      ? 'bg-slate-700/40 text-slate-400'
                      : 'bg-blue-600/40 text-blue-400'
                  }`}
                >
                  <FontAwesomeIcon icon={icons[level.statusIcon]} />
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="ml-16">
              <p className="text-xs text-slate-400 mb-2">Temas principales:</p>
              <div className="flex flex-wrap gap-2">
                {level.topics.map((topic, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full ${
                      isLocked ? 'bg-slate-700/30 text-slate-500' : 'bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress y Action */}
          <div className="flex flex-col justify-between">
            {/* Progress Bar */}
            <div>
              {isInProgress && (
                <>
                  <p className="text-sm font-semibold text-white mb-2">Progreso: {level.progress}%</p>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4 border border-slate-600">
                    <div
                      className={`h-full bg-linear-to-r ${level.colorGradient}`}
                      style={{ width: `${level.progress}%` }}
                    />
                  </div>
                </>
              )}

              {isCompleted && (
                <div className="mb-4 p-4 bg-green-600/20 border border-green-600 rounded-lg">
                  <p className="text-sm font-semibold text-green-400 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    ¡Completado!
                  </p>
                </div>
              )}

              {isLocked && (
                <div className="mb-4 p-4 bg-slate-700/40 border border-slate-600 rounded-lg">
                  <p className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} />
                    Bloqueado
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Completa el nivel anterior para desbloquear</p>
                </div>
              )}
            </div>

            {/* Action Button */}
            {!isLocked && !isCompleted && (
              <Link
                href={`/practica/icfes?nivel=${level.id}`}
                className="w-full px-4 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Continuar <FontAwesomeIcon icon={icons.faArrowRight} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            {isCompleted && (
              <Link
                href={`/practica/icfes?nivel=${level.id}&review=true`}
                className="w-full px-4 py-3 bg-linear-to-r from-slate-700 to-slate-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-slate-600/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Revisar <FontAwesomeIcon icon={icons.faArrowRight} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Conector visual */}
      {index < totalLevels - 1 && (
        <div className="flex justify-center py-2">
          <div
            className={`w-1 h-8 rounded-full ${
              isCompleted ? 'bg-linear-to-b from-green-600 to-green-600' : 'bg-slate-700'
            }`}
          />
        </div>
      )}
    </div>
  );
};
