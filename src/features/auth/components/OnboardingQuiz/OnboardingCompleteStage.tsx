import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { OnboardingLayout } from './OnboardingLayout';

type OnboardingCompleteStageProps = {
  onContinue: () => void;
};

export function OnboardingCompleteStage({ onContinue }: OnboardingCompleteStageProps) {
  return (
    <OnboardingLayout className="items-center justify-center">
      <div
        className={cn(
          'mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center',
          'space-y-8 px-6 py-12 text-center'
        )}
      >
        <div
          className={cn(
            'mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r',
            'from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
          )}
        >
          <Icon name="check-circle" className="text-5xl" />
        </div>

        <div className="space-y-4">
          <h2
            className={cn(
              'from-cta-text-start via-cta-text-via to-cta-text-end bg-linear-to-r',
              'bg-clip-text text-3xl font-black text-transparent md:text-4xl'
            )}
          >
            ¡Perfecto!
          </h2>
          <p className="text-lg text-on-surface-muted">
            Hemos entendido tus necesidades. Ahora crearemos tu cuenta personalizada con un plan adaptado a ti.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r',
            'from-cta-from to-cta-to px-6 py-4 text-lg font-bold text-white transition-all',
            'hover:shadow-app-ring/50 duration-300 hover:shadow-lg'
          )}
        >
          <Icon name="arrow-right" />
          Ir al Registro
        </button>
      </div>
    </OnboardingLayout>
  );
}
