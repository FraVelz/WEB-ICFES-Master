import { useId } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDonationContext } from './DonationContext';

const inputClass = cn(
  'rounded-lg border border-surface-border bg-surface-overlay/40 text-sm text-on-surface',
  'placeholder:text-on-surface-muted/60 transition-colors focus:border-app-accent focus:outline-none'
);

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
        <h5 className="text-lg font-bold text-on-surface">¡Gracias por tu Sprite!</h5>
        <p className="text-sm text-on-surface-muted">Tu apoyo ha sido recibido.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePayment} className="animate-fade-in-up space-y-4">
      <p
        className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-200"
        role="note"
      >
        Simulación visual: este formulario no envía datos de tarjeta ni realiza cobros. Para donar de verdad, elige
        Nequi, transferencia o PayPal.
      </p>
      <div>
        <label htmlFor={cardNumberId} className="mb-1 block text-xs font-medium text-on-surface-muted">
          Número de Tarjeta
        </label>
        <div className="relative">
          <input
            id={cardNumberId}
            type="text"
            placeholder="0000 0000 0000 0000"
            value={cardData.cardNumber}
            onChange={handleCardNumberChange}
            className={cn('w-full py-2.5 pr-4 pl-10', inputClass)}
            required
          />
          <Icon name="credit-card" className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-muted" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={expiryMonthId} className="mb-1 block text-xs font-medium text-on-surface-muted">
            Vencimiento
          </label>
          <div className="flex gap-2">
            <input
              id={expiryMonthId}
              type="text"
              placeholder="MM"
              aria-label="Mes de vencimiento"
              value={cardData.expiryMonth}
              onChange={(e) => handleExpiryChange('month', e.target.value)}
              className={cn('w-full px-3 py-2.5 text-center', inputClass)}
              required
            />
            <input
              id={expiryYearId}
              type="text"
              placeholder="AA"
              aria-label="Año de vencimiento"
              value={cardData.expiryYear}
              onChange={(e) => handleExpiryChange('year', e.target.value)}
              className={cn('w-full px-3 py-2.5 text-center', inputClass)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor={cvvId} className="mb-1 block text-xs font-medium text-on-surface-muted">
            CVC
          </label>
          <div className="relative">
            <input
              id={cvvId}
              type="text"
              placeholder="123"
              value={cardData.cvv}
              onChange={handleCVVChange}
              className={cn('w-full py-2.5 pr-8 pl-3', inputClass)}
              required
            />
            <Icon name="lock" className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-on-surface-muted" />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor={cardHolderId} className="mb-1 block text-xs font-medium text-on-surface-muted">
          Nombre en la Tarjeta
        </label>
        <input
          id={cardHolderId}
          type="text"
          placeholder="COMO APARECE EN LA TARJETA"
          value={cardData.cardHolder}
          onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
          className={cn('w-full px-4 py-2.5', inputClass)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={cn(
          'mt-4 flex w-full transform items-center justify-center gap-2 rounded-xl bg-linear-to-r',
          'from-app-accent-strong to-app-accent-darker px-4 py-3 font-bold text-app-on-accent shadow-lg',
          'shadow-app-accent/25 transition-all hover:scale-[1.02] hover:from-app-accent hover:to-app-accent-strong',
          'disabled:cursor-not-allowed disabled:opacity-50'
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

      <div className="mt-2 flex justify-center gap-2 text-lg text-on-surface-muted">
        <Icon name="cc-visa" />
        <Icon name="cc-mastercard" />
        <Icon name="cc-amex" />
      </div>
    </form>
  );
}
