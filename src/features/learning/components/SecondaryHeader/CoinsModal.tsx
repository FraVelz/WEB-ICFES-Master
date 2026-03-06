import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCoins } from '@fortawesome/free-solid-svg-icons';

/**
 * Dropdown que muestra el dinero virtual
 */
export const CoinsModal = ({ isOpen, onClose, coins = 0 }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute top-full right-0 w-full sm:w-80 bg-slate-900 border-b border-x border-slate-700 rounded-b-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400" />
              Mis Monedas
            </h2>
            <button onClick={onClose} className="cursor-pointer text-slate-500 hover:text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-1">{coins}</div>
            <div className="text-slate-400 text-sm font-medium">Monedas disponibles</div>
          </div>
          
        </div>
      </div>
    </>
  );
};
