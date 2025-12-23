import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMobileAlt, 
  faBank, 
  faEnvelope, 
  faGlassWater, 
  faCopy, 
  faCheck, 
  faHeart, 
  faCreditCard,
  faSpinner,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faPaypal, faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons';

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
    cvv: ''
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
    setCardData({ ...cardData, [`expiry${type.charAt(0).toUpperCase() + type.slice(1)}`]: value });
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
          cvv: ''
        });
      }, 3000);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: 'sprite',
      name: 'Invítame una Sprite',
      icon: faGlassWater,
      info: 'Tarjeta Débito / Crédito',
      type: 'card',
      highlight: true,
      description: 'Usa tu tarjeta para invitar una Sprite al creador de forma segura.'
    },
    {
      id: 'nequi',
      name: 'Nequi',
      icon: faMobileAlt,
      info: 'Transferencia instantánea',
      detail: '322 596 3277',
      type: 'copy',
      owner: 'Marisol Otavo'
    },
    {
      id: 'transferencia',
      name: 'Bancolombia / A la mano',
      icon: faBank,
      info: 'Cuenta de Ahorros',
      detail: '03225963277',
      type: 'copy',
      owner: 'Marisol Otavo'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: faPaypal,
      info: 'Pago internacional',
      detail: 'paypal.me/fravelz',
      type: 'url',
    },
    {
      id: 'crypto',
      name: 'Criptomonedas',
      icon: faBitcoin,
      info: 'BTC, ETH, etc.',
      detail: 'bc1qh50kpz5x0snvk6sg56jn6lamqy3ltmmu5f7ncn',
      type: 'copy',
    },
  ];

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);
  const currentAmount = selectedAmount === 'custom' ? (customAmount || '0') : selectedAmount;

  return (
    <div className="max-w-4xl mx-auto mt-16 px-4 sm:px-6 py-12 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-2xl">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/20 rounded-full mb-4">
          <FontAwesomeIcon icon={faHeart} className="text-purple-400 text-xl animate-pulse" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">Apoya este Proyecto</h3>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Esta plataforma es completamente gratuita y se mantiene gracias al esfuerzo personal. 
          <span className="block mt-2 text-purple-300 font-medium">
            Incluso una donación pequeña (como 2.000 COP) ayuda a mantener los servidores y seguir mejorando.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Selección de Monto y Método */}
        <div className="md:col-span-7 space-y-8">
          
          {/* Selector de Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              1. Elige un monto de apoyo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[2000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`cursor-pointer py-3 px-2 rounded-xl border transition-all duration-200 font-semibold text-sm ${
                    selectedAmount === amount
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20 transform scale-105'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  ${amount.toLocaleString()}
                </button>
              ))}
              <div className="relative">
                <button
                  onClick={() => handleAmountSelect('custom')}
                  className={`cursor-pointer w-full h-full py-3 px-2 rounded-xl border transition-all duration-200 font-semibold text-sm ${
                    selectedAmount === 'custom'
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  Otro
                </button>
              </div>
            </div>
            {selectedAmount === 'custom' && (
              <div className="mt-3 animate-fadeIn">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Ingresa el valor (COP)"
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Selector de Método */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
              2. Elige el medio de donación
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`cursor-pointer relative p-4 rounded-xl border text-left transition-all duration-200 group ${
                    selectedMethod === method.id
                      ? 'bg-white/10 border-purple-500 ring-1 ring-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  } ${method.highlight ? 'sm:col-span-2' : ''}`}
                >
                  {method.highlight && (
                    <div className="absolute -top-3 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg transform rotate-3">
                      RECOMENDADO
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      method.highlight ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-300'
                    }`}>
                      <FontAwesomeIcon icon={method.icon} className="text-lg" />
                    </div>
                    <div>
                      <h4 className={`font-bold ${selectedMethod === method.id ? 'text-white' : 'text-gray-300'}`}>
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
          <div className="h-full bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col justify-between relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={currentMethod?.icon} className="text-purple-400" />
                {currentMethod?.name}
              </h4>
              <p className="text-sm text-gray-400 mb-6 border-b border-white/10 pb-4">
                {currentMethod?.description || 'Sigue los pasos para completar tu donación.'}
              </p>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase mb-1">Monto a donar</p>
                  <p className="text-2xl font-bold text-white">
                    ${Number(currentAmount).toLocaleString()} <span className="text-sm font-normal text-gray-400">COP</span>
                  </p>
                </div>

                {/* FORMULARIO DE TARJETA */}
                {currentMethod?.type === 'card' && (
                  <form onSubmit={handlePayment} className="space-y-4 animate-fadeIn">
                    {paymentSuccess ? (
                      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
                        <FontAwesomeIcon icon={faCheck} className="text-4xl text-green-400 mb-3" />
                        <h5 className="text-white font-bold text-lg">¡Gracias por tu Sprite!</h5>
                        <p className="text-gray-300 text-sm">Tu apoyo ha sido recibido.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Número de Tarjeta</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              value={cardData.cardNumber}
                              onChange={handleCardNumberChange}
                              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                              required
                            />
                            <FontAwesomeIcon icon={faCreditCard} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Vencimiento</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="MM"
                                value={cardData.expiryMonth}
                                onChange={(e) => handleExpiryChange('month', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-center text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                required
                              />
                              <input
                                type="text"
                                placeholder="AA"
                                value={cardData.expiryYear}
                                onChange={(e) => handleExpiryChange('year', e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-3 text-center text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">CVC</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="123"
                                value={cardData.cvv}
                                onChange={handleCVVChange}
                                className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-3 pr-8 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                required
                              />
                              <FontAwesomeIcon icon={faLock} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">Nombre en la Tarjeta</label>
                          <input
                            type="text"
                            placeholder="COMO APARECE EN LA TARJETA"
                            value={cardData.cardHolder}
                            onChange={(e) => setCardData({...cardData, cardHolder: e.target.value.toUpperCase()})}
                            className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 px-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faHeart} />
                              Donar ${Number(currentAmount).toLocaleString()}
                            </>
                          )}
                        </button>
                        
                        <div className="flex justify-center gap-2 text-gray-500 text-lg mt-2">
                          <FontAwesomeIcon icon={faCcVisa} />
                          <FontAwesomeIcon icon={faCcMastercard} />
                          <FontAwesomeIcon icon={faCcAmex} />
                        </div>
                      </>
                    )}
                  </form>
                )}

                {currentMethod?.type === 'copy' && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 animate-fadeIn">
                    <p className="text-xs text-gray-500 uppercase mb-2">Número de cuenta / Billetera</p>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="flex-1 bg-black/30 p-3 rounded-lg text-purple-300 font-mono text-sm break-all">
                        {currentMethod.detail}
                      </code>
                      <button
                        onClick={() => copyToClipboard(currentMethod.detail, currentMethod.id)}
                        className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        title="Copiar"
                      >
                        <FontAwesomeIcon icon={copied === currentMethod.id ? faCheck : faCopy} />
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
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center animate-fadeIn">
                    <p className="text-sm text-gray-300 mb-4">
                      Serás redirigido a la plataforma segura de {currentMethod.name} para completar la donación.
                    </p>
                    <a
                      href={currentMethod.detail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
                    >
                      Ir a Donar
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500 italic">
                "¡Gracias por ser parte de este proyecto y ayudarnos a crecer!"
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Links */}
      <div className="text-center mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} />
          <a href="mailto:fravelz@proton.me" className="hover:text-purple-400 transition-colors">
            fravelz@proton.me
          </a>
        </div>
        <span className="hidden sm:inline">|</span>
        <div className="flex gap-4">
          <Link to="/privacidad" className="hover:text-purple-400 transition-colors">Privacidad</Link>
          <Link to="/terminos" className="hover:text-purple-400 transition-colors">Términos</Link>
        </div>
      </div>
    </div>
  );
};
