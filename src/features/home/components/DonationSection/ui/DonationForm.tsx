import { Icon } from '@/shared/components/Icon';

import { useDonation } from '../useDonation';

export const DonationForm = ({
  copied,
  cardData,
  setCardData,
  isProcessing,
  paymentSuccess,
  copyToClipboard,
  handleCardNumberChange,
  handleExpiryChange,
  handleCVVChange,
  currentMethod,
  currentAmount,
  handlePayment,
}: {
  selectedAmount: string;
  customAmount: string;
  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
  copied: string | null;
  cardData: any;
  setCardData: React.Dispatch<React.SetStateAction<any>>;
  isProcessing: boolean;
  paymentSuccess: boolean;
  copyToClipboard: (text: string, id: string) => void;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpiryChange: (type: string, value: string) => void;
  handleCVVChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentMethod: any;
  currentAmount: string;
  handlePayment: (e: React.FormEvent<HTMLFormElement>) => void;
}) => {
  return (
    <div className="md:col-span-5">
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-black/20 p-6">
        {/* Background decoration */}
        <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl"></div>

        <div>
          <h4 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
            <Icon name={currentMethod?.icon} className="text-purple-400" />
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

            {/* FORMULARIO DE TARJETA */}
            {currentMethod?.type === 'card' && (
              <form onSubmit={handlePayment} className="animate-fadeIn space-y-4">
                {paymentSuccess ? (
                  <div className="rounded-xl border border-green-500/50 bg-green-500/20 p-6 text-center">
                    <Icon name="check" className="mb-3 text-4xl text-green-400" />
                    <h5 className="text-lg font-bold text-white">¡Gracias por tu Sprite!</h5>
                    <p className="text-sm text-gray-300">Tu apoyo ha sido recibido.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-400">Número de Tarjeta</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardData.cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                          required
                        />
                        <Icon name="credit-card" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">Vencimiento</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="MM"
                            value={cardData.expiryMonth}
                            onChange={(e) => handleExpiryChange('month', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-center text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                            required
                          />
                          <input
                            type="text"
                            placeholder="AA"
                            value={cardData.expiryYear}
                            onChange={(e) => handleExpiryChange('year', e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-center text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">CVC</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={handleCVVChange}
                            className="w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pr-8 pl-3 text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                            required
                          />
                          <Icon
                            name="lock"
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-400">Nombre en la Tarjeta</label>
                      <input
                        type="text"
                        placeholder="COMO APARECE EN LA TARJETA"
                        value={cardData.cardHolder}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            cardHolder: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="mt-4 flex w-full transform items-center justify-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 px-4 py-3 font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:from-purple-500 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                  </>
                )}
              </form>
            )}

            {currentMethod?.type === 'copy' && (
              <div className="animate-fadeIn rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-xs text-gray-500 uppercase">Número de cuenta / Billetera</p>
                <div className="mb-2 flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-black/30 p-3 font-mono text-sm break-all text-purple-300">
                    {currentMethod.detail}
                  </code>
                  <button
                    onClick={() => copyToClipboard(currentMethod.detail, currentMethod.id)}
                    className="rounded-lg bg-purple-600 p-3 text-white transition-colors hover:bg-purple-700"
                    title="Copiar"
                  >
                    <Icon name={copied === currentMethod.id ? 'check' : 'copy'} />
                  </button>
                </div>
                {currentMethod.owner && (
                  <p className="text-xs text-gray-400">
                    Titular: <span className="text-gray-300">{currentMethod.owner}</span>
                  </p>
                )}
              </div>
            )}

            {currentMethod?.type === 'url' && (
              <div className="animate-fadeIn rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="mb-4 text-sm text-gray-300">
                  Serás redirigido a la plataforma segura de {currentMethod.name} para completar la donación.
                </p>
                <a
                  href={currentMethod.detail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full transform rounded-xl bg-purple-600 py-3 font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:bg-purple-700"
                >
                  Ir a Donar
                </a>
              </div>
            )}
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
