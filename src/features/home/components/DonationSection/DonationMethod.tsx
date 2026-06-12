import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { paymentMethods } from './paymentMethods';
import { useDonationContext } from './DonationContext';
import type { selectedAmountType } from './types';

export const DonationMethod = () => {
  const {
    selectedAmount,
    customAmount,
    selectedMethod,
    setSelectedMethod,
    handleAmountSelect,
    handleCustomAmountChange,
  } = useDonationContext();

  return (
    <div className="space-y-8 md:col-span-7">
      <div>
        <label className="mb-3 block text-sm font-medium tracking-wider text-on-surface-muted uppercase">
          1. Elige un monto de apoyo
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['2000', '5000', '10000'] as selectedAmountType[]).map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={cn(
                'cursor-pointer rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-200',
                selectedAmount === amount
                  ? 'scale-105 transform border-app-accent bg-app-accent-strong text-app-on-accent shadow-lg shadow-app-accent/20'
                  : 'border-surface-border bg-surface-elevated/50 text-on-surface-muted hover:border-surface-border hover:bg-surface-overlay/60'
              )}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => handleAmountSelect('custom')}
              className={cn(
                'h-full w-full cursor-pointer rounded-xl border px-2 py-3 text-sm font-semibold',
                'transition-all duration-200',
                selectedAmount === 'custom'
                  ? 'border-app-accent bg-app-accent-strong text-app-on-accent shadow-lg shadow-app-accent/20'
                  : 'border-surface-border bg-surface-elevated/50 text-on-surface-muted hover:border-surface-border hover:bg-surface-overlay/60'
              )}
            >
              Otro
            </button>
          </div>
        </div>
        {selectedAmount === 'custom' && (
          <div className="animate-fade-in-up mt-3">
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-muted">$</span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Ingresa el valor (COP)"
                className={cn(
                  'w-full rounded-xl border border-surface-border bg-surface-overlay/40 py-3 pr-4 pl-8 text-on-surface',
                  'placeholder:text-on-surface-muted/60 transition-all focus:border-app-accent focus:ring-1',
                  'focus:ring-app-accent focus:outline-none'
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium tracking-wider text-on-surface-muted uppercase">
          2. Elige el medio de donación
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={cn(
                'group relative cursor-pointer rounded-xl border p-4 text-left transition-all duration-200',
                selectedMethod === method.id
                  ? 'border-app-accent bg-surface-overlay/60 ring-1 ring-app-accent/50'
                  : 'border-surface-border bg-surface-elevated/50 hover:border-surface-border hover:bg-surface-overlay/60',
                method.highlight && 'sm:col-span-2'
              )}
            >
              {method.highlight && (
                <div
                  className={cn(
                    'absolute -top-3 -right-2 rotate-3 transform rounded-full bg-linear-to-r from-yellow-400',
                    'to-orange-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg'
                  )}
                >
                  RECOMENDADO
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    method.highlight ? 'bg-lesson-sci-glow-a/20 text-green-400' : 'bg-surface-overlay/60 text-on-surface-muted'
                  )}
                >
                  <Icon name={method.icon} className="text-lg" />
                </div>
                <div>
                  <h4 className={cn('font-bold', selectedMethod === method.id ? 'text-on-surface' : 'text-on-surface-muted')}>
                    {method.name}
                  </h4>
                  <p className="text-xs text-on-surface-muted">{method.info}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
