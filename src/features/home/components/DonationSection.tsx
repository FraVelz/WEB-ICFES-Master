import { useState } from 'react';
import { Icon } from '@/shared/components/Icon';

export const DonationSection = () => {
  const [selectedAmount, setSelectedAmount] = useState(2000);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('sprite');
  const [copied, setCopied] = useState(null);

  // Card Form State
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setSelectedAmount('custom');
  };

  // Card Input Handlers
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, cardNumber: value });
  };

  const handleExpiryChange = (type, value) => {
    if (type === 'month') {
      value = value.replace(/\D/g, '').slice(0, 2);
      if (parseInt(value) > 12) value = '12';
    } else if (type === 'year') {
      value = value.replace(/\D/g, '').slice(0, 2);
    }
    setCardData({
      ...cardData,
      [`expiry${type.charAt(0).toUpperCase() + type.slice(1)}`]: value,
    });
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardData({ ...cardData, cvv: value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Reset after showing success
      setTimeout(() => {
        setPaymentSuccess(false);
        setCardData({
          cardNumber: '',
          cardHolder: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
        });
      }, 3000);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: 'sprite',
      name: 'Invítame una Sprite',
      icon: 'droplet',
      info: 'Tarjeta Débito / Crédito',
      type: 'card',
      highlight: true,
      description:
        'Usa tu tarjeta para invitar una Sprite al creador de forma segura.',
    },
    {
      id: 'nequi',
      name: 'Nequi',
      icon: 'device-phone-mobile',
      info: 'Transferencia instantánea',
      detail: '322 596 3277',
      type: 'copy',
      owner: 'Marisol Otavo',
    },
    {
      id: 'transferencia',
      name: 'Bancolombia / A la mano',
      icon: 'landmark',
      info: 'Cuenta de Ahorros',
      detail: '03225963277',
      type: 'copy',
      owner: 'Marisol Otavo',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'paypal',
      info: 'Pago internacional',
      detail: 'paypal.me/fravelz',
      type: 'url',
    },
    {
      id: 'crypto',
      name: 'Criptomonedas',
      icon: 'bitcoin',
      info: 'BTC, ETH, etc.',
      detail: 'bc1qh50kpz5x0snvk6sg56jn6lamqy3ltmmu5f7ncn',
      type: 'copy',
    },
  ];

  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod);
  const currentAmount =
    selectedAmount === 'custom' ? customAmount || '0' : selectedAmount;

  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/10 bg-linear-to-b from-gray-900 to-gray-800 px-4 py-12 shadow-2xl sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-500/20 p-3">
          <Icon
            name="heart"
            className="animate-pulse text-xl text-purple-400"
          />
        </div>
        <h3 className="mb-3 text-3xl font-bold text-white">
          Apoya este Proyecto
        </h3>
        <p className="mx-auto max-w-2xl leading-relaxed text-gray-300">
          Esta plataforma es completamente gratuita y se mantiene gracias al
          esfuerzo personal.
          <span className="mt-2 block font-medium text-purple-300">
            Incluso una donación pequeña (como 2.000 COP) ayuda a mantener los
            servidores y seguir mejorando.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Columna Izquierda: Selección de Monto y Método */}
        <div className="space-y-8 md:col-span-7">
          {/* Selector de Monto */}
          <div>
            <label className="mb-3 block text-sm font-medium tracking-wider text-gray-400 uppercase">
              1. Elige un monto de apoyo
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[2000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`cursor-pointer rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    selectedAmount === amount
                      ? 'scale-105 transform border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
              <div className="relative">
                <button
                  onClick={() => handleAmountSelect('custom')}
                  className={`h-full w-full cursor-pointer rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    selectedAmount === 'custom'
                      ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  Otro
                </button>
              </div>
            </div>
            {selectedAmount === 'custom' && (
              <div className="animate-fadeIn mt-3">
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Ingresa el valor (COP)"
                    className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pr-4 pl-8 text-white placeholder-gray-500 transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Selector de Método */}
          <div>
            <label className="mb-3 block text-sm font-medium tracking-wider text-gray-400 uppercase">
              2. Elige el medio de donación
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`group relative cursor-pointer rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-white/10 ring-1 ring-purple-500/50'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  } ${method.highlight ? 'sm:col-span-2' : ''}`}
                >
                  {method.highlight && (
                    <div className="absolute -top-3 -right-2 rotate-3 transform rounded-full bg-linear-to-r from-yellow-400 to-orange-500 px-2 py-1 text-[10px] font-bold text-black shadow-lg">
                      RECOMENDADO
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        method.highlight
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      <Icon name={method.icon} className="text-lg" />
                    </div>
                    <div>
                      <h4
                        className={`font-bold ${selectedMethod === method.id ? 'text-white' : 'text-gray-300'}`}
                      >
                        {method.name}
                      </h4>
                      <p className="text-xs text-gray-400">{method.info}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Detalles y Acción */}
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
                {currentMethod?.description ||
                  'Sigue los pasos para completar tu donación.'}
              </p>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-xs text-gray-500 uppercase">
                    Monto a donar
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${Number(currentAmount).toLocaleString()}{' '}
                    <span className="text-sm font-normal text-gray-400">
                      COP
                    </span>
                  </p>
                </div>

                {/* FORMULARIO DE TARJETA */}
                {currentMethod?.type === 'card' && (
                  <form
                    onSubmit={handlePayment}
                    className="animate-fadeIn space-y-4"
                  >
                    {paymentSuccess ? (
                      <div className="rounded-xl border border-green-500/50 bg-green-500/20 p-6 text-center">
                        <Icon
                          name="check"
                          className="mb-3 text-4xl text-green-400"
                        />
                        <h5 className="text-lg font-bold text-white">
                          ¡Gracias por tu Sprite!
                        </h5>
                        <p className="text-sm text-gray-300">
                          Tu apoyo ha sido recibido.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-400">
                            Número de Tarjeta
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              value={cardData.cardNumber}
                              onChange={handleCardNumberChange}
                              className="w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pr-4 pl-10 text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                              required
                            />
                            <Icon
                              name="credit-card"
                              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-400">
                              Vencimiento
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="MM"
                                value={cardData.expiryMonth}
                                onChange={(e) =>
                                  handleExpiryChange('month', e.target.value)
                                }
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-center text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                                required
                              />
                              <input
                                type="text"
                                placeholder="AA"
                                value={cardData.expiryYear}
                                onChange={(e) =>
                                  handleExpiryChange('year', e.target.value)
                                }
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-center text-sm text-white placeholder-gray-600 transition-colors focus:border-purple-500 focus:outline-none"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-400">
                              CVC
                            </label>
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
                          <label className="mb-1 block text-xs font-medium text-gray-400">
                            Nombre en la Tarjeta
                          </label>
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
                    <p className="mb-2 text-xs text-gray-500 uppercase">
                      Número de cuenta / Billetera
                    </p>
                    <div className="mb-2 flex items-center gap-2">
                      <code className="flex-1 rounded-lg bg-black/30 p-3 font-mono text-sm break-all text-purple-300">
                        {currentMethod.detail}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            currentMethod.detail,
                            currentMethod.id
                          )
                        }
                        className="rounded-lg bg-purple-600 p-3 text-white transition-colors hover:bg-purple-700"
                        title="Copiar"
                      >
                        <Icon
                          name={copied === currentMethod.id ? 'check' : 'copy'}
                        />
                      </button>
                    </div>
                    {currentMethod.owner && (
                      <p className="text-xs text-gray-400">
                        Titular:{' '}
                        <span className="text-gray-300">
                          {currentMethod.owner}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {currentMethod?.type === 'url' && (
                  <div className="animate-fadeIn rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="mb-4 text-sm text-gray-300">
                      Serás redirigido a la plataforma segura de{' '}
                      {currentMethod.name} para completar la donación.
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
      </div>

      {/* Footer Links */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6 text-center text-xs text-gray-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <Icon name="envelope" />
          <a
            href="mailto:fravelz@proton.me"
            className="transition-colors hover:text-purple-400"
          >
            fravelz@proton.me
          </a>
        </div>
        <span className="hidden sm:inline">|</span>
        <div className="flex gap-4">
          <a
            href="/privacidad"
            className="transition-colors hover:text-purple-400"
          >
            Privacidad
          </a>
          <a
            href="/terminos"
            className="transition-colors hover:text-purple-400"
          >
            Términos
          </a>
        </div>
      </div>
    </div>
  );
};
