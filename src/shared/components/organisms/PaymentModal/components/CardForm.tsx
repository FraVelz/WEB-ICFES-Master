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
        <label className="mb-2 block text-sm font-semibold text-white">
          Número de Tarjeta
        </label>
        <input
          type="text"
          placeholder="0000 0000 0000 0000"
          value={cardData.cardNumber}
          onChange={handleCardNumberChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none"
          required
        />
      </div>

      {/* Card Holder */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-white">
          Nombre en la Tarjeta
        </label>
        <input
          type="text"
          placeholder="JUAN PEREZ"
          value={cardData.cardHolder}
          onChange={(e) =>
            setCardData({
              ...cardData,
              cardHolder: e.target.value.toUpperCase(),
            })
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none"
          required
        />
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-5 items-end gap-1.5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Mes
          </label>
          <input
            type="text"
            placeholder="MM"
            maxLength="2"
            value={cardData.expiryMonth}
            onChange={(e) => handleExpiryChange('month', e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-center text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex justify-center pb-0.5">
          <span className="text-2xl font-bold text-white">/</span>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Año
          </label>
          <input
            type="text"
            placeholder="YY"
            maxLength="2"
            value={cardData.expiryYear}
            onChange={(e) => handleExpiryChange('year', e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-center text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>
        <div className="flex justify-center pb-0.5">
          <span className="text-2xl font-bold text-white"></span>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            CVV
          </label>
          <input
            type="password"
            placeholder="***"
            maxLength="3"
            value={cardData.cvv}
            onChange={handleCVVChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-center text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>
      </div>
    </>
  );
};
