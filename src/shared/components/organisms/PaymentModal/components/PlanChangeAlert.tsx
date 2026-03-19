import { Icon } from '@/shared/components/Icon';

export const PlanChangeAlert = ({ currentPlan, newPlan }) => {
  const isFreeToPaid = currentPlan?.planType === 'free' && newPlan?.id !== 'free';
  const isPaidToFree = currentPlan?.planType !== 'free' && newPlan?.id === 'free';
  const isPaidToPaid = currentPlan?.planType !== 'free' && newPlan?.id !== 'free';

  // Convertir nextBillingDate correctamente
  const getFormattedDate = (date) => {
    if (!date) return null;
    try {
      // Si es un objeto de Firebase Timestamp
      if (date.toDate && typeof date.toDate === 'function') {
        return new Date(date.toDate()).toLocaleDateString('es-CO');
      }
      // Si es un objeto Date
      if (date instanceof Date) {
        return date.toLocaleDateString('es-CO');
      }
      // Si es un string o número
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('es-CO');
      }
      return null;
    } catch (err) {
      console.error('Error al formatear fecha:', err);
      return null;
    }
  };

  const getAlertConfig = () => {
    if (isFreeToPaid) {
      return {
        type: 'upgrade',
        icon: 'info-circle',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500',
        textColor: 'text-blue-300',
        titleColor: 'text-blue-400',
        title: 'Actualización de Plan',
        message: `Estás actualizando de "${currentPlan?.planName}" a "${newPlan?.name}". El nuevo plan se activará inmediatamente.`
      };
    }
    
    if (isPaidToFree) {
      return {
        type: 'downgrade',
        icon: 'exclamation-triangle',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-300',
        titleColor: 'text-yellow-400',
        title: 'Cambio a Plan Gratuito',
        message: `Vas a cambiar de "${currentPlan?.planName}" a "${newPlan?.name}". El cambio se realizará cuando finalice tu plan actual.`
      };
    }
    
    if (isPaidToPaid) {
      return {
        type: 'change',
        icon: 'info-circle',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500',
        textColor: 'text-purple-300',
        titleColor: 'text-purple-400',
        title: 'Cambio de Plan',
        message: `Estás cambiando de "${currentPlan?.planName}" a "${newPlan?.name}". El nuevo plan se activará cuando finalice tu plan actual.`
      };
    }

    return null;
  };

  const alertConfig = getAlertConfig();

  if (!alertConfig) return null;

  return (
    <div className={`p-4 rounded-lg border-l-4 ${alertConfig.bgColor} ${alertConfig.borderColor}`}>
      <div className="flex gap-3">
        <Icon 
          name={alertConfig.icon} 
          className={`text-xl ${alertConfig.titleColor} shrink-0 mt-0.5`}
        />
        <div>
          <h4 className={`font-bold ${alertConfig.titleColor} mb-1`}>
            {alertConfig.title}
          </h4>
          <p className={`text-sm ${alertConfig.textColor}`}>
            {alertConfig.message}
          </p>
          {isPaidToPaid && currentPlan?.nextBillingDate && (
            <div className={`text-xs ${alertConfig.textColor} mt-3 pt-3 border-t border-current/20`}>
              <p className="opacity-75">
                Tu plan actual finaliza el <span className="font-semibold">{getFormattedDate(currentPlan.nextBillingDate)}</span>
              </p>
              <p className="opacity-60 mt-1">
                El nuevo plan se activará automáticamente después de esa fecha.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
