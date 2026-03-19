import { Icon } from '@/shared/components/Icon';

export const PaymentButtons = ({ isProcessing, isFormValid, onClose, price, plan }) => {
  const isFree = plan?.price === 'Gratis';
  
  return (
    <div className="shrink-0 border-t border-slate-700 p-6 bg-slate-900/50 sm:bg-slate-900">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-300"
          disabled={isProcessing}
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="payment-form"
          disabled={isFree ? isProcessing : (!isFormValid || isProcessing)}
          className={`cursor-pointer px-4 py-3 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            (isFree || (isFormValid && !isProcessing))
              ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Procesando...
            </>
          ) : isFree ? (
            <>
              <Icon name="check" size="sm" className="text-sm" />
              Activar Plan Gratis
            </>
          ) : (
            <>
              <Icon name="credit-card" size="sm" className="text-sm" />
              Pagar {price}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
