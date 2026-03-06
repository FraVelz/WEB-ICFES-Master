import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PaymentModal } from '@/shared/components';
import { useAuth } from '@/context/AuthContext';

export const PricingPlans = ({ plans = [] }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Al cargar, verificar si hay un plan guardado en localStorage
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    const fromPricing = localStorage.getItem('fromPricing');
    
    if (fromPricing) {
      // Scroll a esta sección
      const pricingSection = document.getElementById('planes');
      if (pricingSection) {
        setTimeout(() => {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      localStorage.removeItem('fromPricing');
    }
    
    if (savedPlan && isAuthenticated) {
      try {
        const plan = JSON.parse(savedPlan);
        setSelectedPlan(plan);
        setIsPaymentOpen(true);
        localStorage.removeItem('selectedPlan'); // Limpiar después de usar
      } catch (err) {
        console.error('Error al recuperar plan guardado:', err);
      }
    }
  }, [isAuthenticated]);

  const handlePlanClick = (plan) => {
    // Si está autenticado, mostrar modal o procesar
    if (isAuthenticated) {
      if (plan.price === 'Gratis') {
        // Mostrar modal con mensaje de plan gratuito
        setSelectedPlan(plan);
        setIsPaymentOpen(true);
      } else {
        // Abrir modal de pago para planes de pago
        setSelectedPlan(plan);
        setIsPaymentOpen(true);
      }
    } else {
      // Si no está autenticado, guardar el plan en localStorage y redirigir a login
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      router.push('/login');
    }
  };

  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <section id="planes" className="max-w-7xl mx-auto px-6 md:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Planes Transparentes</h2>
        <p className="text-slate-400 text-lg">Sin sorpresas, cancela cuando quieras (Planes Mensuales y Anuales)</p>

        <p>Nota: La compra de planes no esta disponible en dispositivos moviles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-xl border transition-all duration-300 ${
              plan.popular
                ? 'border-cyan-500/50 bg-linear-to-br from-cyan-600/20 to-blue-600/20 shadow-lg shadow-cyan-500/20 scale-105'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            } p-8`}
          >
            {plan.popular && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1 bg-cyan-500/30 border border-cyan-500/50 px-4 py-1 rounded-full text-sm font-bold text-cyan-400">
                  <FontAwesomeIcon icon={faCrown} />
                  Más Popular
                </span>
              </div>
            )}

            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-slate-400 mb-6">{plan.description}</p>

            <div className="mb-6">
              <p className="text-4xl font-bold text-white">{plan.price}</p>
              {plan.originalPrice && (
                <p className="text-sm text-slate-400 line-through">{plan.originalPrice}</p>
              )}
            </div>

            <button
              onClick={() => handlePlanClick(plan)}
              className={`cursor-pointer w-full py-3 px-4 rounded-lg font-bold mb-8 transition-all duration-300 ${
                plan.popular
                  ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              {plan.cta}
            </button>

            <ul className="space-y-3">
              {plan.features.map((feature, fidx) => (
                <li key={fidx} className="flex items-start gap-3 text-slate-300">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-1 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        plan={selectedPlan}
      />
    </section>
  );
};
