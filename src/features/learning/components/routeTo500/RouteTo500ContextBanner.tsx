import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import {
  ROUTE_TO_500_PATH,
  getAreaSimulacroPhaseTitle,
  getJourneyStepById,
  LECTURA_INDEX_PATH,
} from '@/features/learning/data/routeTo500';

type RouteTo500ContextBannerProps = {
  stepId: 'examen-materia' | 'examen-global';
  areaName?: string;
  className?: string;
};

export function RouteTo500ContextBanner({ stepId, areaName, className }: RouteTo500ContextBannerProps) {
  const step = getJourneyStepById(stepId);
  if (!step) return null;

  const stepTitle = stepId === 'examen-materia' && areaName ? getAreaSimulacroPhaseTitle(areaName) : step.title;

  return (
    <div
      className={cn(
        'mx-auto mb-6 max-w-3xl rounded-2xl border px-4 py-3 text-sm',
        stepId === 'examen-materia'
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100'
          : 'border-purple-500/30 bg-purple-500/10 text-purple-900 dark:text-purple-100',
        className
      )}
    >
      <p>
        <span className="font-semibold">Paso {step.order} de tu ruta al 500:</span> {stepTitle}.{' '}
        {stepId === 'examen-materia'
          ? 'Consolida las tres fases de aprendizaje en esta área.'
          : 'Simulacro integral y lectura de todos los apartados en /lectura (Importancia, Información, Consejos).'}
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <Link
          href={ROUTE_TO_500_PATH}
          className={cn(
            'inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline',
            'focus-visible:ring-2 focus-visible:outline-none',
            stepId === 'examen-materia' ? 'focus-visible:ring-amber-400' : 'focus-visible:ring-purple-400'
          )}
        >
          <Icon name="map" className="text-xs" />
          Ver la ruta completa
        </Link>
        {stepId === 'examen-global' ? (
          <Link
            href={LECTURA_INDEX_PATH}
            className={cn(
              'inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline',
              'focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none'
            )}
          >
            <Icon name="book-open" className="text-xs" />
            Ir a lectura
          </Link>
        ) : null}
      </div>
    </div>
  );
}
