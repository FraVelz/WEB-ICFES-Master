import { cn } from '@/utils/cn';

export interface BillingPeriodSelectorProps {
  billingPeriod: 'monthly' | 'annual';
  setBillingPeriod: React.Dispatch<React.SetStateAction<'monthly' | 'annual'>>;
}

export const BillingPeriodSelector = ({ billingPeriod, setBillingPeriod }: BillingPeriodSelectorProps) => {
  return (
    <div className="mb-6 rounded-lg bg-slate-800/50 p-4">
      <label className="mb-3 block text-sm font-semibold text-white">Período de Facturación</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setBillingPeriod('monthly')}
          className={cn(
            'rounded-lg px-4 py-3 font-semibold transition-all duration-300',
            billingPeriod === 'monthly'
              ? 'border border-cyan-400 bg-cyan-500 text-white'
              : 'border border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
          )}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod('annual')}
          className={cn(
            'relative rounded-lg px-4 py-3 font-semibold transition-all duration-300',
            billingPeriod === 'annual'
              ? 'border border-cyan-400 bg-cyan-500 text-white'
              : 'border border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
          )}
        >
          Anual
          {billingPeriod === 'annual' && (
            <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
              -10%
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
