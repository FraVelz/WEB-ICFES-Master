export const BillingPeriodSelector = ({ billingPeriod, setBillingPeriod }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
      <label className="block text-sm font-semibold text-white mb-3">
        Período de Facturación
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setBillingPeriod('monthly')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            billingPeriod === 'monthly'
              ? 'bg-cyan-500 text-white border border-cyan-400'
              : 'bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500'
          }`}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod('annual')}
          className={`py-3 px-4 rounded-lg font-semibold transition-all duration-300 relative ${
            billingPeriod === 'annual'
              ? 'bg-cyan-500 text-white border border-cyan-400'
              : 'bg-slate-700 text-slate-300 border border-slate-600 hover:border-slate-500'
          }`}
        >
          Anual
          {billingPeriod === 'annual' && (
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -10%
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
