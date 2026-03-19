import { Icon } from '@/shared/components/Icon';

export const PaymentButtons = ({
  isProcessing,
  isFormValid,
  onClose,
  price,
  plan,
}) => {
  const isFree = plan?.price === 'Gratis';

  return (
    <div className="shrink-0 border-t border-slate-700 bg-slate-900/50 p-6 sm:bg-slate-900">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-slate-700 px-4 py-3 font-bold text-white transition-all duration-300 hover:bg-slate-600"
          disabled={isProcessing}
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="payment-form"
          disabled={isFree ? isProcessing : !isFormValid || isProcessing}
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold transition-all duration-300 ${
            isFree || (isFormValid && !isProcessing)
              ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/50'
              : 'cursor-not-allowed bg-slate-700 text-slate-500'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
