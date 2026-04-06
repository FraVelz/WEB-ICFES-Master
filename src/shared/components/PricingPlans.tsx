import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PaymentModal } from '@/shared/components';
import { useAuth } from '@/context/AuthContext';

interface Plan {
  popular?: boolean;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  cta: string;
  features: string[];
  [key: string]: unknown;
}

export const PricingPlans = ({ plans = [] }: { plans?: Plan[] }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Resume checkout after login when a plan was stored
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    const fromPricing = localStorage.getItem('fromPricing');

    if (fromPricing) {
      // Scroll pricing into view
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
        const plan = JSON.parse(savedPlan) as Plan;
        setSelectedPlan(plan);
        setIsPaymentOpen(true);
        localStorage.removeItem('selectedPlan'); // one-shot
      } catch (err) {
        console.error('Error al recuperar plan guardado:', err);
      }
    }
  }, [isAuthenticated]);

  const handlePlanClick = (plan: Plan) => {
    // Logged in: open payment modal (free or paid)
    if (isAuthenticated) {
      if (plan.price === 'Gratis') {
        // Free tier — still show confirmation flow
        setSelectedPlan(plan);
        setIsPaymentOpen(true);
      } else {
        // Paid plan
        setSelectedPlan(plan);
        setIsPaymentOpen(true);
      }
    } else {
      // Guest: stash plan and send to login
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      router.push('/login');
    }
  };

  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <section id="planes" className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Planes Transparentes</h2>
        <p className="text-lg text-slate-400">Sin sorpresas, cancela cuando quieras (Planes Mensuales y Anuales)</p>

        <p>Nota: La compra de planes no esta disponible en dispositivos moviles.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded-xl border p-8 transition-all duration-300',
              plan.popular
                ? 'scale-105 border-cyan-500/50 bg-linear-to-br from-cyan-600/20 to-blue-600/20 shadow-lg shadow-cyan-500/20'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            )}
          >
            {plan.popular && (
              <div className="mb-4 text-center">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border border-cyan-500/50 bg-cyan-500/30 px-4',
                    'py-1 text-sm font-bold text-cyan-400'
                  )}
                >
                  <Icon name="crown" />
                  Más Popular
                </span>
              </div>
            )}

            <h3 className="mb-2 text-2xl font-bold text-white">{plan.name}</h3>
            <p className="mb-6 text-slate-400">{plan.description}</p>

            <div className="mb-6">
              <p className="text-4xl font-bold text-white">{plan.price}</p>
              {plan.originalPrice && <p className="text-sm text-slate-400 line-through">{plan.originalPrice}</p>}
            </div>

            <button
              onClick={() => handlePlanClick(plan)}
              className={cn(
                'mb-8 w-full cursor-pointer rounded-lg px-4 py-3 font-bold transition-all duration-300',
                plan.popular
                  ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              )}
            >
              {plan.cta}
            </button>

            <ul className="space-y-3">
              {plan.features.map((feature: string, fidx: number) => (
                <li key={fidx} className="flex items-start gap-3 text-slate-300">
                  <Icon name="check-circle" className="mt-1 shrink-0 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} plan={selectedPlan} />
    </section>
  );
};
