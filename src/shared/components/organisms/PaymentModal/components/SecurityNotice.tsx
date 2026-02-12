import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

export const SecurityNotice = () => {
  return (
    <div className="flex items-center gap-2 text-slate-400 text-xs p-3 bg-slate-800/50 rounded-lg">
      <FontAwesomeIcon icon={faLock} className="text-green-400" />
      <span>Tu información de pago está protegida y encriptada</span>
    </div>
  );
};
