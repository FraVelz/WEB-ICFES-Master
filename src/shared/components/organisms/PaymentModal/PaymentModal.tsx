import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/shared/components/Icon';
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
import type { PlanItem, UserPlanData } from './types';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanItem | null;
}

export const PaymentModal = ({ isOpen, onClose, plan }: PaymentModalProps) => {
  const { user } = useAuth();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<UserPlanData | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [canSchedulePlan, setCanSchedulePlan] = useState(true);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const validateScheduling = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const validation = await PlanScheduleService.validatePlanScheduling(
        user.uid
      );
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
    if (!user?.uid) return;
    try {
      setLoadingPlan(true);
      const userCurrentPlan = await SubscriptionPlanService.getUserPlan(
        user.uid
      );
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, cardNumber: value });
  };

  const handleExpiryChange = (type: 'month' | 'year', value: string) => {
    if (type === 'month') {
      value = value.slice(0, 2);
      if (parseInt(value) > 12) value = '12';
    } else if (type === 'year') {
      value = value.slice(0, 2);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Verificar que el usuario esté autenticado
      if (!user) {
        throw new Error('Debes estar autenticado para realizar una compra');
      }

      // Si es plan gratuito, no necesita procesamiento de pago
      if (!plan) throw new Error('Plan no seleccionado');
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
          nextBillingDate: null,
        };

        await SubscriptionPlanService.updateUserPlan(user.uid, planData);
      } else {
        // Simular procesamiento de pago para planes de pago (en producción: Stripe/PayPal)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const planData: {
          planType: string;
          planName?: string;
          price: number | string;
          billingPeriod: string;
          originalPrice?: number | string;
          features: string[];
          purchaseDate: Date;
          status?: string;
          nextBillingDate?: Date | null;
        } = {
          planType: plan.id || 'premium',
          planName: plan.name,
          price: priceCalculation.finalPrice,
          billingPeriod: billingPeriod,
          originalPrice: plan.price,
          features: plan.features || [],
          purchaseDate: new Date(),
        };

        // Si ya tiene un plan activo y diferente, programar para después
        const hasActivePlan =
          currentPlan &&
          currentPlan.status === 'active' &&
          currentPlan.planType !== plan.id;

        if (hasActivePlan) {
          // Programar el plan para después
          planData.nextBillingDate = currentPlan.nextBillingDate as Date | null | undefined;
          await PlanScheduleService.schedulePlan(user.uid, planData);
        } else {
          // Activar directamente
          planData.status = 'active';
          planData.nextBillingDate = new Date(
            Date.now() +
              (billingPeriod === 'annual'
                ? 365 * 24 * 60 * 60 * 1000
                : 30 * 24 * 60 * 60 * 1000)
          );
          await SubscriptionPlanService.updateUserPlan(user.uid, planData);
        }
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
    } catch (err) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Error al procesar el pago. Intenta de nuevo.';
      setError(msg);
      console.error('Payment error:', err);
    }
  };

  // Detectar si el plan es el mismo que ya tiene activo
  const isSamePlanActive =
    currentPlan &&
    plan?.id &&
    currentPlan.planType === plan.id &&
    currentPlan.status === 'active';

  // Para planes gratuitos, no necesita validar tarjeta
  const isFormValid: boolean =
    !canSchedulePlan || isSamePlanActive
      ? false
      : plan?.price === 'Gratis'
        ? true
        : Boolean(
            cardData.cardNumber.replace(/\s/g, '').length === 16 &&
            cardData.cardHolder.trim().length > 0 &&
            cardData.expiryMonth &&
            cardData.expiryYear &&
            cardData.cvv.length === 3
          );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm lg:items-end lg:p-4 lg:pt-20">
      <div className="mb-20 flex h-dvh max-h-[90vh] w-full max-w-md flex-col rounded-t-2xl border-t border-slate-700 bg-slate-900 shadow-2xl sm:w-auto sm:rounded-xl lg:mb-0 lg:rounded-b-2xl lg:border">
        <PaymentHeader plan={plan} onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-6">
          {!canSchedulePlan && !isSamePlanActive ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/20">
                <Icon
                  name="exclamation-triangle"
                  size="2xl"
                  className="text-4xl text-red-400"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">
                No se puede comprar este plan
              </h3>
              <p className="mb-4 text-slate-300">{scheduleError}</p>
              <p className="mb-8 text-sm text-slate-400">
                Solo puedes tener un plan activo y uno en espera de activación.
              </p>
              <button
                onClick={onClose}
                className="w-full cursor-pointer rounded-lg bg-slate-700 px-6 py-3 font-bold text-white transition-all duration-200 hover:bg-slate-600"
              >
                Cerrar
              </button>
            </div>
          ) : paymentSuccess ? (
            <SuccessMessage
              plan={plan}
              currentPlan={currentPlan}
              onClose={() => {
                setPaymentSuccess(false);
                setCardData({
                  cardNumber: '',
                  cardHolder: '',
                  expiryMonth: '',
                  expiryYear: '',
                  cvv: '',
                });
                onClose();
              }}
            />
          ) : isSamePlanActive ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500/20">
                <Icon
                  name="check-circle"
                  size="2xl"
                  className="text-4xl text-blue-400"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">
                Plan ya Activo
              </h3>
              <p className="mb-4 text-slate-300">
                Ya tienes el plan{' '}
                <span className="font-semibold text-blue-400">
                  {plan?.name}
                </span>{' '}
                activo en tu cuenta.
              </p>
              <p className="mb-8 text-sm text-slate-400">
                No es necesario volver a comprar este plan. Si deseas cambiar a
                otro plan, selecciona uno diferente.
              </p>
              <button
                onClick={onClose}
                className="w-full cursor-pointer rounded-lg bg-slate-700 px-6 py-3 font-bold text-white transition-all duration-200 hover:bg-slate-600"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form
              id="payment-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
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
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
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
            price={String(priceCalculation.finalPrice)}
            plan={plan}
          />
        )}
      </div>
    </div>
  );
};
