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
          'border border-white/5 bg-black/20 p-6'
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32',
            'rounded-full bg-purple-500/10 blur-3xl'
          )}
        />

        <div>
          <h4 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
            {currentMethod?.icon && <Icon name={currentMethod.icon} className="text-purple-400" />}
            {currentMethod?.name}
          </h4>
          <p className="mb-6 border-b border-white/10 pb-4 text-sm text-gray-400">
            {currentMethod?.description || 'Sigue los pasos para completar tu donación.'}
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-xs text-gray-500 uppercase">Monto a donar</p>
              <p className="text-2xl font-bold text-white">
                ${Number(currentAmount).toLocaleString()} <span className="text-sm font-normal text-gray-400">COP</span>
              </p>
            </div>

            {currentMethod?.type === 'card' && <DonationCardForm />}
            <DonationCopyMethod />
            <DonationUrlMethod />
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center">
          <p className="text-xs text-gray-500 italic">
            "¡Gracias por ser parte de este proyecto y ayudarnos a crecer!"
          </p>
        </div>
      </div>
    </div>
  );
};
