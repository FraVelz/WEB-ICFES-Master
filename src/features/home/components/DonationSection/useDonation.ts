import React, { useState } from 'react';

import { paymentMethods } from './paymentMethods';
import type { selectedAmountType } from './types';

export const useDonation = () => {
  const [selectedAmount, setSelectedAmount] = useState<selectedAmountType>('2000');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('sprite');
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAmountSelect = (amount: selectedAmountType) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setSelectedAmount('custom');
  };

  // Card Input Handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, cardNumber: value });
  };

  const handleExpiryChange = (type: string, value: string) => {
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

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardData({ ...cardData, cvv: value });
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod);
  const currentAmount = selectedAmount === 'custom' ? customAmount || '0' : selectedAmount;

  return {
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
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
    currentMethod,
    currentAmount,
    handlePayment,
  };
};
