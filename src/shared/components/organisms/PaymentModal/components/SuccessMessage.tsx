import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTrophy, faCrown } from '@fortawesome/free-solid-svg-icons';

export const SuccessMessage = ({ plan, onClose, currentPlan }) => {
  const isFree = plan?.price === 'Gratis';
  const isPro = plan?.id === 'pro';
  // Si ya tiene un plan activo y es diferente, el nuevo plan está en espera
  const isWaitingActivation = currentPlan && currentPlan.status === 'active' && currentPlan.planType !== plan?.id;

  return (
    <div className="text-center py-12">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ${
        isFree 
          ? 'bg-green-500/20 border-2 border-green-500' 
          : isPro
          ? 'bg-purple-500/20 border-2 border-purple-500'
          : 'bg-cyan-500/20 border-2 border-cyan-500'
      }`}>
        <FontAwesomeIcon 
          icon={isFree ? faCheckCircle : isPro ? faTrophy : faCrown} 
          className={`text-4xl ${
            isFree 
              ? 'text-green-400' 
              : isPro
              ? 'text-purple-400'
              : 'text-cyan-400'
          }`} 
        />
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-2">
        {isFree ? '¡Felicitaciones!' : '¡Pago Exitoso!'}
      </h3>
      
      <p className="text-slate-300 mb-2">
        Tu suscripción a <span className="font-semibold text-cyan-400">{plan?.name}</span> 
        {isWaitingActivation ? ' está en espera de activación.' : ' ha sido activada.'}
      </p>
      
      {isFree ? (
        <div className="text-slate-400 mb-4">
          <p>¡Ya tienes acceso al plan <span className="font-bold text-green-400">Básico Gratuito</span>!</p>
          <p className="text-sm mt-2">Acceso completo a todas las funcionalidades principales sin costo.</p>
        </div>
      ) : isWaitingActivation ? (
        <div className="text-slate-400 mb-4">
          <p>Tu nuevo plan se activará cuando finalice tu plan actual.</p>
          <p className="text-sm mt-2">Puedes seguir usando tu plan actual sin interrupciones.</p>
        </div>
      ) : isPro ? (
        <div className="text-slate-400 mb-4">
          <p>¡Gracias por tu apoyo al proyecto!</p>
          <p className="text-sm mt-2">Estás contribuyendo al desarrollo de la educación en Colombia 🇨🇴</p>
        </div>
      ) : (
        <p className="text-slate-400 mb-4">Disfruta de todos los beneficios de tu plan Premium.</p>
      )}
      
      <div className="mt-8 pt-6 border-t border-slate-700">
        <button
          onClick={onClose}
          className="cursor-pointer w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-all duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
