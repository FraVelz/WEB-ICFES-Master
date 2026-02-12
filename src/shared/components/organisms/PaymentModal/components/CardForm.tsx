export const CardForm = ({
  cardData,
  setCardData,
  handleCardNumberChange,
  handleExpiryChange,
  handleCVVChange,
}) => {
  return (
    <>
      {/* Card Number */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Número de Tarjeta
        </label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={cardData.cardNumber}
          onChange={handleCardNumberChange}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          required
        />
      </div>

      {/* Card Holder */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Nombre en la Tarjeta
        </label>
        <input
          type="text"
          placeholder="JUAN PEREZ"
          value={cardData.cardHolder}
          onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          required
        />
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-5 gap-1.5 items-end">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Mes</label>
          <input
            type="text"
            placeholder="MM"
            maxLength="2"
            value={cardData.expiryMonth}
            onChange={(e) => handleExpiryChange('month', e.target.value)}
            className="w-full px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-center text-sm"
            required
          />
        </div>
        <div className="flex justify-center pb-0.5">
          <span className="text-white font-bold text-2xl">/</span>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Año</label>
          <input
            type="text"
            placeholder="YY"
            maxLength="2"
            value={cardData.expiryYear}
            onChange={(e) => handleExpiryChange('year', e.target.value)}
            className="w-full px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-center text-sm"
            required
          />
        </div>
        <div className="flex justify-center pb-0.5">
          <span className="text-white font-bold text-2xl"></span>
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-2">CVV</label>
          <input
            type="password"
            placeholder="***"
            maxLength="3"
            value={cardData.cvv}
            onChange={handleCVVChange}
            className="w-full px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-center text-sm"
            required
          />
        </div>
      </div>
    </>
  );
};
