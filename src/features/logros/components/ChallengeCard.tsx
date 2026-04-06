import { cn } from '@/utils/cn';
import React from 'react';
import { Icon } from '@/shared/components/Icon';
import { useRouter } from 'next/navigation';

export interface ChallengeItem {
  id: string;
  status?: string;
  progress?: number;
  target?: number;
  area?: string;
  title?: string;
  description?: string;
  icon?: string;
  xpReward?: number;
  coinsReward?: number;
  [key: string]: unknown;
}

export interface ChallengeCardProps {
  challenge: ChallengeItem;
  onComplete: (id: string) => void;
}

export const ChallengeCard = ({ challenge, onComplete }: ChallengeCardProps) => {
  const router = useRouter();
  const isCompleted = challenge.status === 'completed';

  const getRoute = (area: string) => {
    if (area === 'matematicas') return '/practica/matematicas';
    if (area === 'lectura-critica') return '/practica/lectura-critica';
    if (area === 'ciencias-naturales') return '/practica/ciencias-naturales';
    if (area === 'sociales') return '/practica/sociales';
    return '/examen-completo'; // Default
  };

  const handleStart = () => {
    if (isCompleted) return;

    // En un caso real, aquí navegaríamos a la práctica y pasaríamos el ID del desafío
    // Para esta demo, simulamos completar el desafío al hacer click (o navegar)
    // navigate(getRoute(challenge.area));

    // SIMULACIÓN: Completar directamente para probar la UI
    if (window.confirm('¿Simular completar este desafío? (En producción esto iría a la lección)')) {
      onComplete(challenge.id);
    } else {
      router.push(getRoute(challenge.area ?? 'examen-completo'));
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border transition-all duration-300',
        isCompleted
          ? 'border-green-500/30 bg-slate-900/40 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
          : 'border-slate-700 bg-slate-800/40 hover:border-cyan-500/50 hover:bg-slate-800/60'
      )}
    >
      {/* Background Progress Bar (Visual effect) */}
      {!isCompleted && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-cyan-500/50 transition-all duration-500"
          style={{ width: `${((challenge.progress ?? 0) / (challenge.target ?? 1)) * 100}%` }}
        />
      )}

      <div className="flex items-start gap-4 p-5">
        {/* Icon Box */}
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl',
            isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-cyan-400'
          )}
        >
          <Icon name={typeof challenge.icon === 'string' ? challenge.icon : 'bolt'} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between">
            <h3
              className={cn('truncate text-lg font-bold', isCompleted ? 'text-slate-400 line-through' : 'text-white')}
            >
              {String(challenge.title ?? '')}
            </h3>
            {isCompleted && (
              <span className="flex items-center gap-1 text-sm text-green-400">
                <Icon name="check-circle" />
                Hecho
              </span>
            )}
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-slate-400">{String(challenge.description ?? '')}</p>

          {/* Rewards & Action */}
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-3 text-xs font-bold tracking-wider uppercase">
              <span className={cn('flex items-center gap-1', isCompleted ? 'text-slate-500' : 'text-yellow-400')}>
                <Icon name="bolt" /> +{challenge.xpReward ?? 0} XP
              </span>
              <span className={cn('flex items-center gap-1', isCompleted ? 'text-slate-500' : 'text-amber-400')}>
                <Icon name="coins" /> +{challenge.coinsReward ?? 0}
              </span>
            </div>

            {!isCompleted && (
              <button
                onClick={handleStart}
                className={cn(
                  'flex items-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-1.5 text-sm font-medium',
                  'text-cyan-400 transition-colors hover:bg-cyan-500/20'
                )}
              >
                Comenzar <Icon name="arrow-right" className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
