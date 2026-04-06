import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { PlanItem, UserPlanData } from '../types';

export interface SuccessMessageProps {
  plan: PlanItem | null;
  onClose: () => void;
  currentPlan: UserPlanData | null;
}

export const SuccessMessage = ({ plan, onClose, currentPlan }: SuccessMessageProps) => {
  const isFree = plan?.price === 'Gratis';
  const isPro = plan?.id === 'pro';
  // Si ya tiene un plan activo y es diferente, el nuevo plan está en espera
  const isWaitingActivation = currentPlan && currentPlan.status === 'active' && currentPlan.planType !== plan?.id;

  return (
    <div className="py-12 text-center">
      <div
        className={cn(
          'mx-auto mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full',
          isFree
            ? 'border-2 border-green-500 bg-green-500/20'
            : isPro
              ? 'border-2 border-purple-500 bg-purple-500/20'
              : 'border-2 border-cyan-500 bg-cyan-500/20'
        )}
      >
        <Icon
          name={isFree ? 'check-circle' : isPro ? 'trophy' : 'crown'}
          size="2xl"
          className={cn('text-4xl', isFree ? 'text-green-400' : isPro ? 'text-purple-400' : 'text-cyan-400')}
        />
      </div>

      <h3 className="mb-2 text-3xl font-bold text-white">{isFree ? '¡Felicitaciones!' : '¡Pago Exitoso!'}</h3>

      <p className="mb-2 text-slate-300">
        Tu suscripción a <span className="font-semibold text-cyan-400">{plan?.name}</span>
        {isWaitingActivation ? ' está en espera de activación.' : ' ha sido activada.'}
      </p>

      {isFree ? (
        <div className="mb-4 text-slate-400">
          <p>
            ¡Ya tienes acceso al plan <span className="font-bold text-green-400">Básico Gratuito</span>!
          </p>
          <p className="mt-2 text-sm">Acceso completo a todas las funcionalidades principales sin costo.</p>
        </div>
      ) : isWaitingActivation ? (
        <div className="mb-4 text-slate-400">
          <p>Tu nuevo plan se activará cuando finalice tu plan actual.</p>
          <p className="mt-2 text-sm">Puedes seguir usando tu plan actual sin interrupciones.</p>
        </div>
      ) : isPro ? (
        <div className="mb-4 text-slate-400">
          <p>¡Gracias por tu apoyo al proyecto!</p>
          <p className="mt-2 text-sm">Estás contribuyendo al desarrollo de la educación en Colombia 🇨🇴</p>
        </div>
      ) : (
        <p className="mb-4 text-slate-400">Disfruta de todos los beneficios de tu plan Premium.</p>
      )}

      <div className="mt-8 border-t border-slate-700 pt-6">
        <button
          onClick={onClose}
          className={cn(
            'w-full cursor-pointer rounded-lg bg-cyan-600 px-6 py-3 font-bold text-white transition-all',
            'duration-200 hover:bg-cyan-700'
          )}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
