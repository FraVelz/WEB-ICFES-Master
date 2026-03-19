export const PlanInfo = ({ plan, billingPeriod, priceCalculation }) => {
  const getPrice = () => priceCalculation.finalPrice;
  const getSavings = () => priceCalculation.savings;
  const getMonthlyPrice = () => priceCalculation.monthlyPrice;

  return (
    <div className="mb-6 rounded-lg border border-slate-700/50 bg-linear-to-r from-slate-800/50 to-slate-800/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-slate-300">{plan?.name}</span>
        <span className="text-3xl font-bold text-cyan-400">{getPrice()}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Período:</span>
          <span className="font-semibold text-slate-300">
            {billingPeriod === 'monthly' ? 'Mensual' : 'Anual'}
          </span>
        </div>
        {billingPeriod === 'annual' && (
          <div className="flex items-center justify-between border-t border-slate-700/50 pt-2 text-sm">
            <span className="text-slate-400">Precio mensual:</span>
            <span className="text-slate-300">{getMonthlyPrice()}</span>
          </div>
        )}
        {getSavings() && (
          <div className="flex items-center justify-between border-t border-slate-700/50 pt-2 text-sm">
            <span className="text-slate-400">Ahorras:</span>
            <span className="text-base font-semibold text-green-400">
              ${getSavings()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
