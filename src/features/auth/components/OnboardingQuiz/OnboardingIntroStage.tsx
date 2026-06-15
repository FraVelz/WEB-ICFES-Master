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
  deferLabel?: string;
  onDefer?: () => void;
};

export function OnboardingIntroStage({
  message,
  description,
  avatarSrc,
  onBack,
  onNext,
  deferLabel,
  onDefer,
}: OnboardingIntroStageProps) {
  return (
    <OnboardingLayout>
      <div className="flex h-16 items-center px-6">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'hover:bg-surface-overlay cursor-pointer rounded-lg p-2 transition-all duration-200',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none'
          )}
          title="Volver atrás"
          aria-label="Volver atrás"
        >
          <Icon name="chevron-left" className="text-app-accent text-xl" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <MascotaCircle src={avatarSrc} size="large" alt="Zeus - Tu asistente" className="mb-8" />
        <div
          className={cn(
            'border-surface-border bg-surface-overlay/50 w-full max-w-2xl rounded-lg border p-8',
            'text-center backdrop-blur-sm'
          )}
        >
          <h2
            className={cn(
              'hero-title-gradient from-cta-text-start via-cta-text-via to-cta-text-end mb-2 bg-linear-to-r',
              'bg-clip-text text-2xl font-bold text-transparent md:text-3xl'
            )}
          >
            {message}
          </h2>
          <p className="text-on-surface-muted text-sm">{description}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md space-y-3 px-6 pb-8">
        <button
          type="button"
          onClick={onNext}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r',
            'from-cta-from to-cta-to px-6 py-4 text-lg font-bold text-white transition-all',
            'hover:shadow-app-ring/50 duration-300 hover:shadow-lg',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface'
          )}
        >
          <span>Continuar</span>
          <Icon name="arrow-right" />
        </button>
        {onDefer && deferLabel ? (
          <button
            type="button"
            onClick={onDefer}
            className={cn(
              'text-on-surface-muted hover:text-on-surface w-full py-2 text-sm font-semibold underline',
              'underline-offset-2 transition-colors',
              'focus-visible:ring-app-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none'
            )}
          >
            {deferLabel}
          </button>
        ) : null}
      </div>
    </OnboardingLayout>
  );
}
