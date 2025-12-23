import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { PaymentHeader } from './components/PaymentHeader';
import { BillingPeriodSelector } from './components/BillingPeriodSelector';
import { PlanInfo } from './components/PlanInfo';
import { CardForm } from './components/CardForm';
import { SecurityNotice } from './components/SecurityNotice';
import { PaymentButtons } from './components/PaymentButtons';
import { SuccessMessage } from './components/SuccessMessage';
import { PlanChangeAlert } from './components/PlanChangeAlert';
import { usePriceCalculation } from './hooks/usePriceCalculation';
import { useAuth } from '@/context/AuthContext';
import { SubscriptionPlanService, PlanScheduleService } from '@/services';

export const PaymentModal = ({ isOpen, onClose, plan }) => {
  const { user } = useAuth();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [canSchedulePlan, setCanSchedulePlan] = useState(true);
  const [scheduleError, setScheduleError] = useState(null);

  const validateScheduling = useCallback(async () => {
    try {
      const validation = await PlanScheduleService.validatePlanScheduling(user.uid);
      setCanSchedulePlan(validation.canSchedule);
      if (!validation.canSchedule) {
        setScheduleError(validation.reason);
      }
    } catch (err) {
      console.error('Error al validar programación:', err);
      setScheduleError('Error al validar disponibilidad de planes');
    }
  }, [user?.uid]);

  const loadCurrentPlan = useCallback(async () => {
    try {
      setLoadingPlan(true);
      const userCurrentPlan = await SubscriptionPlanService.getUserPlan(user.uid);
      setCurrentPlan(userCurrentPlan);
    } catch (err) {
      console.error('Error al cargar plan actual:', err);
      setCurrentPlan(null);
    } finally {
      setLoadingPlan(false);
    }
  }, [user?.uid]);

  const priceCalculation = usePriceCalculation(plan?.price, billingPeriod);

  // Cargar el plan actual cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      loadCurrentPlan();
      validateScheduling();
    }
  }, [isOpen, user, loadCurrentPlan, validateScheduling]);

  if (!isOpen) return null;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, cardNumber: value });
  };

  const handleExpiryChange = (type, value) => {
    if (type === 'month') {
      value = value.slice(0, 2);
      if (parseInt(value) > 12) value = '12';
    } else if (type === 'year') {
      value = value.slice(0, 2);
    }
    setCardData({ ...cardData, [`expiry${type.charAt(0).toUpperCase() + type.slice(1)}`]: value });
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardData({ ...cardData, cvv: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Verificar que el usuario esté autenticado
      if (!user) {
        throw new Error('Debes estar autenticado para realizar una compra');
      }

      // Si es plan gratuito, no necesita procesamiento de pago
      if (plan.price === 'Gratis') {
        // Guardar directamente sin simular pago
        const planData = {
          planType: plan.id || 'free',
          planName: plan.name,
          status: 'active',
          price: 0,
          billingPeriod: 'free',
          features: plan.features || [],
          purchaseDate: new Date(),
          nextBillingDate: null
        };

        await SubscriptionPlanService.updateUserPlan(user.uid, planData);
      } else {
        // Simular procesamiento de pago para planes de pago (en producción: Stripe/PayPal)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const planData = {
          planType: plan.id || 'premium',
          planName: plan.name,
          price: priceCalculation.finalPrice,
          billingPeriod: billingPeriod,
          originalPrice: plan.price,
          features: plan.features || [],
          purchaseDate: new Date()
        };

        // Si ya tiene un plan activo y diferente, programar para después
        const hasActivePlan = currentPlan && currentPlan.status === 'active' && currentPlan.planType !== plan.id;
        
        if (hasActivePlan) {
          // Programar el plan para después
          planData.nextBillingDate = currentPlan.nextBillingDate;
          await PlanScheduleService.schedulePlan(user.uid, planData);
        } else {
          // Activar directamente
          planData.status = 'active';
          planData.nextBillingDate = new Date(
            Date.now() + (billingPeriod === 'annual' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)
          );
          await SubscriptionPlanService.updateUserPlan(user.uid, planData);
        }
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
    } catch (err) {
      setIsProcessing(false);
      setError(err.message || 'Error al procesar el pago. Intenta de nuevo.');
      console.error('Payment error:', err);
    }
  };

  // Detectar si el plan es el mismo que ya tiene activo
  const isSamePlanActive = currentPlan && plan?.id && currentPlan.planType === plan.id && currentPlan.status === 'active';

  // Para planes gratuitos, no necesita validar tarjeta
  const isFormValid = !canSchedulePlan || isSamePlanActive
    ? false
    : plan?.price === 'Gratis' 
    ? true 
    : cardData.cardNumber.replace(/\s/g, '').length === 16 &&
      cardData.cardHolder.trim().length > 0 &&
      cardData.expiryMonth &&
      cardData.expiryYear &&
      cardData.cvv.length === 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center lg:items-end bg-black/50 backdrop-blur-sm p-0 lg:p-4 lg:pt-20">
      <div className="flex flex-col w-full sm:w-auto h-[100dvh] max-h-[90vh] bg-slate-900 sm:rounded-xl border-t lg:border border-slate-700 shadow-2xl max-w-md rounded-t-2xl lg:rounded-b-2xl mb-20 lg:mb-0">
        <PaymentHeader plan={plan} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6">
          {!canSchedulePlan && !isSamePlanActive ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-500/20 border-2 border-red-500">
                <FontAwesomeIcon 
                  icon={faExclamationTriangle} 
                  className="text-4xl text-red-400"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No se puede comprar este plan
              </h3>
              <p className="text-slate-300 mb-4">
                {scheduleError}
              </p>
              <p className="text-slate-400 text-sm mb-8">
                Solo puedes tener un plan activo y uno en espera de activación.
              </p>
              <button
                onClick={onClose}
                className="cursor-pointer w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          ) : paymentSuccess ? (
            <SuccessMessage plan={plan} currentPlan={currentPlan} onClose={() => {
              setPaymentSuccess(false);
              setCardData({
                cardNumber: '',
                cardHolder: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: ''
              });
              onClose();
            }} />
          ) : isSamePlanActive ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-blue-500/20 border-2 border-blue-500">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className="text-4xl text-blue-400"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Plan ya Activo
              </h3>
              <p className="text-slate-300 mb-4">
                Ya tienes el plan <span className="font-semibold text-blue-400">{plan?.name}</span> activo en tu cuenta.
              </p>
              <p className="text-slate-400 text-sm mb-8">
                No es necesario volver a comprar este plan. Si deseas cambiar a otro plan, selecciona uno diferente.
              </p>
              <button
                onClick={onClose}
                className="cursor-pointer w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all duration-200"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Alerta de plan actual si existe */}
              {!loadingPlan && currentPlan && !isSamePlanActive && (
                <PlanChangeAlert currentPlan={currentPlan} newPlan={plan} />
              )}

              {plan?.price !== 'Gratis' && (
                <BillingPeriodSelector 
                  billingPeriod={billingPeriod} 
                  setBillingPeriod={setBillingPeriod} 
                />
              )}

              <PlanInfo 
                plan={plan}
                billingPeriod={billingPeriod}
                priceCalculation={priceCalculation}
              />

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {plan?.price !== 'Gratis' && (
                <>
                  <CardForm
                    cardData={cardData}
                    setCardData={setCardData}
                    handleCardNumberChange={handleCardNumberChange}
                    handleExpiryChange={handleExpiryChange}
                    handleCVVChange={handleCVVChange}
                  />

                  <SecurityNotice />
                </>
              )}
            </form>
          )}
        </div>

        {!paymentSuccess && !isSamePlanActive && canSchedulePlan && (
          <PaymentButtons
            isProcessing={isProcessing}
            isFormValid={isFormValid}
            onClose={onClose}
            price={priceCalculation.finalPrice}
            plan={plan}
          />
        )}
      </div>
    </div>
  );
};
