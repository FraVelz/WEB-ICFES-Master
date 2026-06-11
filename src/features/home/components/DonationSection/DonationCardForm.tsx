import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDonationContext } from './DonationContext';

export function DonationCardForm() {
  const {
    cardData,
    setCardData,
    isProcessing,
    paymentSuccess,
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
    currentAmount,
    handlePayment,
  } = useDonationContext();
  const cardNumberId = useId();
  const expiryMonthId = useId();
  const expiryYearId = useId();
  const cvvId = useId();
  const cardHolderId = useId();

  if (paymentSuccess) {
    return (
      <div className="bg-lesson-sci-glow-a/20 rounded-xl border border-green-500/50 p-6 text-center">
        <Icon name="check" className="mb-3 text-4xl text-green-400" />
        <h5 className="text-lg font-bold text-white">¡Gracias por tu Sprite!</h5>
        <p className="text-sm text-gray-300">Tu apoyo ha sido recibido.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="animate-fade-in-up space-y-4">
      <div>
        <label htmlFor={cardNumberId} className="mb-1 block text-xs font-medium text-gray-400">Número de Tarjeta</label>
        <div className="relative">
          <input
            id={cardNumberId}
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardData.cardNumber}
            onChange={handleCardNumberChange}
            className={cn(
              'w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pr-4 pl-10 text-sm text-white',
              'placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none'
            )}
            required
          />
          <Icon name="credit-card" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={expiryMonthId} className="mb-1 block text-xs font-medium text-gray-400">Vencimiento</label>
          <div className="flex gap-2">
            <input
              id={expiryMonthId}
              type="text"
              placeholder="MM"
              aria-label="Mes de vencimiento"
              value={cardData.expiryMonth}
              onChange={(e) => handleExpiryChange('month', e.target.value)}
              className={cn(
                'w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-center text-sm',
                'text-white placeholder-gray-600 transition-colors focus:border-purple-500',
                'focus:outline-none'
              )}
              required
            />
            <input
              type="text"
              placeholder="AA"
              aria-label="Año de vencimiento"
              value={cardData.expiryYear}
              onChange={(e) => handleExpiryChange('year', e.target.value)}
              className={cn(
                'w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-center text-sm',
                'text-white placeholder-gray-600 transition-colors focus:border-purple-500',
                'focus:outline-none'
              )}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor={cvvId} className="mb-1 block text-xs font-medium text-gray-400">CVC</label>
          <div className="relative">
            <input
              id={cvvId}
              type="text"
              placeholder="123"
              value={cardData.cvv}
              onChange={handleCVVChange}
              className={cn(
                'w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pr-8 pl-3 text-sm text-white',
                'placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none'
              )}
              required
            />
            <Icon name="lock" className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor={cardHolderId} className="mb-1 block text-xs font-medium text-gray-400">Nombre en la Tarjeta</label>
        <input
          id={cardHolderId}
          type="text"
          placeholder="COMO APARECE EN LA TARJETA"
          value={cardData.cardHolder}
          onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
          className={cn(
            'w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white',
            'placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none'
          )}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={cn(
          'mt-4 flex w-full transform items-center justify-center gap-2 rounded-xl bg-linear-to-r',
          'from-purple-600 to-purple-700 px-4 py-3 font-bold text-white shadow-lg',
          'shadow-purple-500/25 transition-all hover:scale-[1.02] hover:from-purple-500',
          'hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isProcessing ? (
          <>
            <Icon name="spinner" className="animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Icon name="heart" />
            Donar ${Number(currentAmount).toLocaleString()}
          </>
        )}
      </button>

      <div className="mt-2 flex justify-center gap-2 text-lg text-gray-500">
        <Icon name="cc-visa" />
        <Icon name="cc-mastercard" />
        <Icon name="cc-amex" />
      </div>
    </form>
  );
}
