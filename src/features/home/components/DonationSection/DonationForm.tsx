import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDonationContext } from './DonationContext';
import { DonationCardForm } from './DonationCardForm';
import { DonationCopyMethod, DonationUrlMethod } from './DonationAltMethods';

export const DonationForm = () => {
  const { currentMethod, currentAmount } = useDonationContext();

  return (
    <div className="md:col-span-5">
      <div
        className={cn(
          'relative flex h-full flex-col justify-between overflow-hidden rounded-2xl',
          'border border-surface-border/50 bg-surface-overlay/40 p-6'
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32',
            'rounded-full bg-app-accent/10 blur-3xl'
          )}
        />

        <div>
          <h4 className="mb-1 flex items-center gap-2 text-lg font-bold text-on-surface">
            {currentMethod?.icon && <Icon name={currentMethod.icon} className="text-app-accent" />}
            {currentMethod?.name}
          </h4>
          <p className="mb-6 border-b border-surface-border pb-4 text-sm text-on-surface-muted">
            {currentMethod?.description || 'Sigue los pasos para completar tu donación.'}
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-surface-border bg-surface-elevated/50 p-4">
              <p className="mb-1 text-xs text-on-surface-muted uppercase">Monto a donar</p>
              <p className="text-2xl font-bold text-on-surface">
                ${Number(currentAmount).toLocaleString()} <span className="text-sm font-normal text-on-surface-muted">COP</span>
              </p>
            </div>

            {currentMethod?.type === 'card' && <DonationCardForm />}
            <DonationCopyMethod />
            <DonationUrlMethod />
          </div>
        </div>

        <div className="mt-8 border-t border-surface-border pt-4 text-center">
          <p className="text-xs text-on-surface-muted italic">
            "¡Gracias por ser parte de este proyecto y ayudarnos a crecer!"
          </p>
        </div>
      </div>
    </div>
  );
};
