export const PlanInfo = ({ plan, billingPeriod, priceCalculation }) => {
  const getPrice = () => priceCalculation.finalPrice;
  const getSavings = () => priceCalculation.savings;
  const getMonthlyPrice = () => priceCalculation.monthlyPrice;

  return (
    <div className="bg-linear-to-r from-slate-800/50 to-slate-800/30 rounded-lg p-4 mb-6 border border-slate-700/50">
      <div className="flex justify-between items-center mb-3">
        <span className="text-slate-300 font-medium">{plan?.name}</span>
        <span className="text-3xl font-bold text-cyan-400">{getPrice()}</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Período:</span>
          <span className="text-slate-300 font-semibold">
            {billingPeriod === 'monthly' ? 'Mensual' : 'Anual'}
          </span>
        </div>
        {billingPeriod === 'annual' && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700/50">
            <span className="text-slate-400">Precio mensual:</span>
            <span className="text-slate-300">{getMonthlyPrice()}</span>
          </div>
        )}
        {getSavings() && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700/50">
            <span className="text-slate-400">Ahorras:</span>
            <span className="text-green-400 font-semibold text-base">${getSavings()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
