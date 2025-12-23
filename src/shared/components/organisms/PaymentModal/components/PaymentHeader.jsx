import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTimes } from '@fortawesome/free-solid-svg-icons';

export const PaymentHeader = ({ plan, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FontAwesomeIcon icon={faCreditCard} className="text-cyan-400" />
          Pago Seguro
        </h2>
        <p className="text-slate-400 text-sm mt-1">{plan?.name}</p>
      </div>
      <button
        onClick={onClose}
        className=" cursor-pointer text-slate-400 hover:text-white transition-colors"
      >
        <FontAwesomeIcon icon={faTimes} className="text-2xl" />
      </button>
    </div>
  );
};
