import { Icon } from '@/shared/components/Icon';
import Link from 'next/link';
import { DIFFICULTY_COLORS } from './constants';

/**
 * Componente para mostrar un nivel individual del mapa ICFES
 */
export interface ICFESLevelCardProps {
  level: {
    completed?: boolean;
    progress?: number;
    colorBg20?: string;
    colorBorder?: string;
    colorGradient?: string;
    icon?: string;
    name?: string;
    description?: string;
    difficulty?: string;
    estimatedHours?: number;
    pointRange?: string;
    statusIcon?: string;
    topics?: string[];
    [key: string]: unknown;
  };
  index: number;
  totalLevels: number;
}

export const ICFESLevelCard = ({ level, index, totalLevels }: ICFESLevelCardProps) => {
  const progress = level.progress ?? 0;
  const isCompleted = level.completed;
  const isLocked = !level.completed && progress === 0;
  const isInProgress = progress > 0 && progress < 100;

  return (
    <div
      className={`relative rounded-2xl border-2 transition-all duration-300 ${
        isCompleted
          ? `${level.colorBg20} ${level.colorBorder}`
          : isLocked
            ? 'border-slate-700 bg-slate-800/30'
            : `bg-slate-800/50 ${level.colorBorder}/50`
      }`}
    >
      {/* Contenedor Principal */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Información del Nivel */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`rounded-lg bg-linear-to-br p-4 ${level.colorGradient} shrink-0 text-white ${
                    isLocked ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <Icon name={level.icon ?? 'book'} size="2xl" className="text-2xl" />
                </div>

                {/* Título y Descripción */}
                <div className="flex-1">
                  <h3 className="mb-1 text-2xl font-bold text-white">
                    {level.name}
                  </h3>
                  <p
                    className={`mb-2 text-sm ${isLocked ? 'text-slate-500' : 'text-slate-400'}`}
                  >
                    {level.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${DIFFICULTY_COLORS[level.difficulty ?? ''] ?? 'bg-slate-700/40 text-slate-300'}`}
                    >
                      {level.difficulty}
                    </span>
                    <span
                      className={`rounded-full bg-blue-900/40 px-3 py-1 text-xs text-blue-300`}
                    >
                      {level.estimatedHours}h estimadas
                    </span>
                    <span
                      className={`rounded-full bg-slate-700/40 px-3 py-1 text-xs text-slate-300`}
                    >
                      {level.pointRange} puntos
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Icon */}
              <div className="shrink-0">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                    isCompleted
                      ? 'bg-green-600/40 text-green-400'
                      : isLocked
                        ? 'bg-slate-700/40 text-slate-400'
                        : 'bg-blue-600/40 text-blue-400'
                  }`}
                >
                  <Icon name={level.statusIcon ?? 'star'} />
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="ml-16">
              <p className="mb-2 text-xs text-slate-400">Temas principales:</p>
              <div className="flex flex-wrap gap-2">
                {(level.topics ?? []).map((topic: string, i: number) => (
                  <span
                    key={i}
                    className={`rounded-full px-3 py-1 text-xs ${
                      isLocked
                        ? 'bg-slate-700/30 text-slate-500'
                        : 'bg-slate-700/50 text-slate-300'
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
                  <p className="mb-2 text-sm font-semibold text-white">
                    Progreso: {level.progress}%
                  </p>
                  <div className="mb-4 h-3 overflow-hidden rounded-full border border-slate-600 bg-slate-700">
                    <div
                      className={`h-full bg-linear-to-r ${level.colorGradient}`}
                      style={{ width: `${level.progress}%` }}
                    />
                  </div>
                </>
              )}

              {isCompleted && (
                <div className="mb-4 rounded-lg border border-green-600 bg-green-600/20 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-green-400">
                    <Icon name="check-circle" />
                    ¡Completado!
                  </p>
                </div>
              )}

              {isLocked && (
                <div className="mb-4 rounded-lg border border-slate-600 bg-slate-700/40 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                    <Icon name="lock" />
                    Bloqueado
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Completa el nivel anterior para desbloquear
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            {!isLocked && !isCompleted && (
              <Link
                href={`/practica/icfes?nivel=${level.id}`}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
              >
                Continuar{' '}
                <Icon
                  name="arrow-right"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}

            {isCompleted && (
              <Link
                href={`/practica/icfes?nivel=${level.id}&review=true`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-slate-700 to-slate-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-slate-600/50"
              >
                Revisar <Icon name="arrow-right" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Conector visual */}
      {index < totalLevels - 1 && (
        <div className="flex justify-center py-2">
          <div
            className={`h-8 w-1 rounded-full ${
              isCompleted
                ? 'bg-linear-to-b from-green-600 to-green-600'
                : 'bg-slate-700'
            }`}
          />
        </div>
      )}
    </div>
  );
};
