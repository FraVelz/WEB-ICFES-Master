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
          'border-surface-border/50 bg-surface-overlay/40 border p-6'
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32',
            'bg-app-accent/10 rounded-full blur-3xl'
          )}
        />

        <div>
          <h4 className="text-on-surface mb-1 flex items-center gap-2 text-lg font-bold">
            {currentMethod?.icon && <Icon name={currentMethod.icon} className="text-app-accent" />}
            {currentMethod?.name}
          </h4>
          <p className="border-surface-border text-on-surface-muted mb-6 border-b pb-4 text-sm">
            {currentMethod?.description || 'Sigue los pasos para completar tu donación.'}
          </p>

          <div className="space-y-4">
            <div className="border-surface-border bg-surface-elevated/50 rounded-xl border p-4">
              <p className="text-on-surface-muted mb-1 text-xs uppercase">Monto a donar</p>
              <p className="text-on-surface text-2xl font-bold">
                ${Number(currentAmount).toLocaleString()}{' '}
                <span className="text-on-surface-muted text-sm font-normal">COP</span>
              </p>
            </div>

            {currentMethod?.type === 'card' && <DonationCardForm />}
            <DonationCopyMethod />
            <DonationUrlMethod />
          </div>
        </div>

        <div className="border-surface-border mt-8 border-t pt-4 text-center">
          <p className="text-on-surface-muted text-xs italic">
            "¡Gracias por ser parte de este proyecto y ayudarnos a crecer!"
          </p>
        </div>
      </div>
    </div>
  );
};
