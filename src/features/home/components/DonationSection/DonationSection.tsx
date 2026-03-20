import { Header } from './ui/Header';
import { Footer } from './ui/Footer';

import { DonationMethod } from './ui/DonationMethod';
import { DonationForm } from './ui/DonationForm';

import { useDonation } from './useDonation';

export const DonationSection = () => {
  const {
    selectedAmount,
    setSelectedAmount,
    customAmount,
    setCustomAmount,
    selectedMethod,
    setSelectedMethod,
    copied,
    setCopied,
    cardData,
    setCardData,
    isProcessing,
    setIsProcessing,
    paymentSuccess,
    setPaymentSuccess,
    copyToClipboard,
    handleAmountSelect,
    handleCustomAmountChange,
    currentAmount,
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
    handlePayment,
    currentMethod,
  } = useDonation();

  return (
    <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-white/10 bg-linear-to-b from-gray-900 to-gray-800 px-4 py-12 shadow-2xl sm:px-6">
      {/* Header */}
      <Header />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Columna Izquierda: Selección de Monto y Método */}
        <DonationMethod
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          handleAmountSelect={handleAmountSelect}
          handleCustomAmountChange={handleCustomAmountChange}
        />

        {/* Columna Derecha: Detalles y Acción */}
        <DonationForm
          currentAmount={currentAmount}
          selectedAmount={selectedAmount}
          customAmount={customAmount}
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          copied={copied}
          cardData={cardData}
          setCardData={setCardData}
          isProcessing={isProcessing}
          paymentSuccess={paymentSuccess}
          copyToClipboard={copyToClipboard}
          handleCardNumberChange={handleCardNumberChange}
          handleExpiryChange={handleExpiryChange}
          handleCVVChange={handleCVVChange}
          currentMethod={currentMethod}
          handlePayment={handlePayment}
        />
      </div>

      {/* Footer Links */}
      <Footer />
    </div>
  );
};
