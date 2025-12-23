import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { AREA_INFO } from '@/shared/constants';

/**
 * Dropdown que muestra todas las áreas disponibles
 * Se renderiza justo debajo del header secundario
 */
export const AreasModal = ({ isOpen, onClose, onSelectArea, currentArea }) => {
  if (!isOpen) return null;

  const areas = Object.entries(AREA_INFO);

  return (
    <>
      {/* Backdrop transparente para cerrar al hacer click fuera */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown Container */}
      <div className="absolute top-full left-0 w-full sm:w-80 bg-slate-900 border-b border-x border-slate-700 rounded-b-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mis Cursos</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {areas.map(([areaKey, areaData]) => (
              <button
                key={areaKey}
                onClick={() => {
                  onSelectArea(areaKey);
                  onClose();
                }}
                className={`w-full px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                  currentArea === areaKey
                    ? `bg-linear-to-r ${areaData.color} text-white shadow-lg`
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentArea === areaKey ? 'bg-white/20' : 'bg-slate-700/50'
                }`}>
                  <FontAwesomeIcon 
                    icon={areaData.icon} 
                    className={currentArea === areaKey ? 'text-white' : 'text-slate-400'} 
                  />
                </div>
                <span className="font-semibold text-sm text-left">{areaData.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
