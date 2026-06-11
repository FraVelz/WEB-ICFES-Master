import type { StaticImageData } from 'next/image';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';
import { OnboardingLayout } from './OnboardingLayout';

type OnboardingIntroStageProps = {
  message: string;
  description: string;
  avatarSrc: string | StaticImageData;
  onBack: () => void;
  onNext: () => void;
};

export function OnboardingIntroStage({ message, description, avatarSrc, onBack, onNext }: OnboardingIntroStageProps) {
  return (
    <OnboardingLayout>
      <div className="flex h-16 items-center px-6">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-surface-overlay"
          title="Volver atrás"
        >
          <Icon name="chevron-left" className="text-app-accent text-xl" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <MascotaCircle src={avatarSrc} size="large" alt="Zeus - Tu asistente" className="mb-8" />
        <div
          className={cn(
            'w-full max-w-2xl rounded-lg border border-surface-border bg-surface-overlay/50 p-8',
            'text-center backdrop-blur-sm'
          )}
        >
          <h2
            className={cn(
              'from-cta-text-start via-cta-text-via to-cta-text-end mb-2 bg-linear-to-r bg-clip-text text-2xl',
              'font-bold text-transparent md:text-3xl'
            )}
          >
            {message}
          </h2>
          <p className="text-sm text-on-surface-muted">{description}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md px-6 pb-8">
        <button
          type="button"
          onClick={onNext}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r',
            'from-cta-from to-cta-to px-6 py-4 text-lg font-bold text-white transition-all',
            'hover:shadow-app-ring/50 duration-300 hover:shadow-lg'
          )}
        >
          <span>Continuar</span>
          <Icon name="arrow-right" />
        </button>
      </div>
    </OnboardingLayout>
  );
}
