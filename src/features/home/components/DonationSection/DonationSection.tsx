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
          'border-surface-border mx-auto mt-16 max-w-4xl rounded-2xl border bg-linear-to-b',
          'from-surface-elevated to-surface-overlay px-4 py-12 shadow-2xl sm:px-6'
        )}
      >
        <div className="mb-10 text-center">
          <div className="bg-app-accent/20 mb-4 inline-flex items-center justify-center rounded-full p-3">
            <Icon name="heart" className="text-app-accent animate-pulse text-xl" />
          </div>
          <h3 className="text-on-surface mb-3 text-3xl font-bold">Apoya este Proyecto</h3>
          <p className="text-on-surface-muted mx-auto max-w-2xl leading-relaxed">
            Esta plataforma es completamente gratuita y se mantiene gracias al esfuerzo personal.
            <span className="text-app-accent-muted mt-2 block font-medium">
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
            'border-surface-border mt-12 flex flex-col items-center justify-center gap-4 border-t pt-6',
            'text-on-surface-muted text-center text-xs sm:flex-row'
          )}
        >
          <div className="flex items-center gap-2">
            <Icon name="envelope" />
            <a href="mailto:fravelz@proton.me" className="hover:text-app-accent transition-colors">
              fravelz@proton.me
            </a>
          </div>
          <span className="hidden sm:inline">|</span>
          <div className="flex gap-4">
            <a href="/privacidad" className="hover:text-app-accent transition-colors">
              Privacidad
            </a>
            <a href="/terminos" className="hover:text-app-accent transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </DonationProvider>
  );
};
