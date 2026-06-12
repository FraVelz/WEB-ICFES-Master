import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { DonationProvider } from './DonationContext';
import { DonationMethod } from './DonationMethod';
import { DonationForm } from './DonationForm';

export const DonationSection = () => {
  return (
    <DonationProvider>
      <div
        className={cn(
          'mx-auto mt-16 max-w-4xl rounded-2xl border border-surface-border bg-linear-to-b',
          'from-surface-elevated to-surface-overlay px-4 py-12 shadow-2xl sm:px-6'
        )}
      >
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-app-accent/20 p-3">
            <Icon name="heart" className="animate-pulse text-xl text-app-accent" />
          </div>
          <h3 className="mb-3 text-3xl font-bold text-on-surface">Apoya este Proyecto</h3>
          <p className="mx-auto max-w-2xl leading-relaxed text-on-surface-muted">
            Esta plataforma es completamente gratuita y se mantiene gracias al esfuerzo personal.
            <span className="mt-2 block font-medium text-app-accent-muted">
              Incluso una donación pequeña (como 2.000 COP) ayuda a mantener los servidores y seguir mejorando.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <DonationMethod />
          <DonationForm />
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col items-center justify-center gap-4 border-t border-surface-border pt-6',
            'text-center text-xs text-on-surface-muted sm:flex-row'
          )}
        >
          <div className="flex items-center gap-2">
            <Icon name="envelope" />
            <a href="mailto:fravelz@proton.me" className="transition-colors hover:text-app-accent">
              fravelz@proton.me
            </a>
          </div>
          <span className="hidden sm:inline">|</span>
          <div className="flex gap-4">
            <a href="/privacidad" className="transition-colors hover:text-app-accent">
              Privacidad
            </a>
            <a href="/terminos" className="transition-colors hover:text-app-accent">
              Términos
            </a>
          </div>
        </div>
      </div>
    </DonationProvider>
  );
};
