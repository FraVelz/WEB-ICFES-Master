'use client';

import { Icon } from '@/shared/components/Icon';
import { AREA_INFO } from '@/shared/constants';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';

export interface AreasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: (area: string) => void;
  currentArea: string;
}

/**
 * Dropdown que muestra todas las áreas disponibles
 * Se renderiza justo debajo del header secundario
 */
export const AreasModal = ({ isOpen, onClose, onSelectArea, currentArea }: AreasModalProps) => {
  const dropdownRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideFromTop',
    duration: 0.2,
  });

  if (!isOpen) return null;

  const areas = Object.entries(AREA_INFO);

  return (
    <>
      {/* Backdrop transparente para cerrar al hacer click fuera */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Container */}
      <div
        ref={dropdownRef}
        className="absolute top-full left-0 z-50 w-full rounded-b-2xl border-x border-b border-slate-700 bg-slate-900 shadow-2xl sm:w-80"
      >
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
              Mis Cursos
            </h3>
            <button
              onClick={onClose}
              className="cursor-pointer text-slate-500 hover:text-white"
            >
              <Icon name="times" />
            </button>
          </div>

          <div className="max-h-[60vh] space-y-2 overflow-y-auto">
            {areas.map(([areaKey, areaData]: [string, { name?: string; color?: string; icon?: string }]) => (
              <button
                key={areaKey}
                onClick={() => {
                  onSelectArea(areaKey);
                  onClose();
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  currentArea === areaKey
                    ? `bg-linear-to-r ${areaData.color} text-white shadow-lg`
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    currentArea === areaKey ? 'bg-white/20' : 'bg-slate-700/50'
                  }`}
                >
                  <Icon
                    name={areaData.icon ?? 'book'}
                    className={
                      currentArea === areaKey ? 'text-white' : 'text-slate-400'
                    }
                  />
                </div>
                <span className="text-left text-sm font-semibold">
                  {areaData.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
