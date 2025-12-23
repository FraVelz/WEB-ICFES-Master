import { Button } from './atoms/Button';

export const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro - Fixed debajo del header en mobile */}
      <div 
        className="fixed inset-0 top-20 sm:top-0 z-40 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content - Posicionado debajo del header en mobile */}
      <div className="fixed inset-0 z-50 flex flex-col sm:items-center sm:justify-center top-20 sm:top-0 left-0 right-0 bottom-0 sm:inset-0 p-0 sm:p-4">
        <div className="
        flex flex-col
        bg-linear-to-br from-slate-900 to-slate-950
        border-0 sm:border border-white/20 shadow-2xl
        w-full sm:w-full max-w-3xl md:max-w-4xl
        h-full sm:h-auto sm:max-h-[85vh] md:max-h-[80vh]
        rounded-none sm:rounded-3xl
        overflow-hidden
        ">
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 md:p-10 border-b border-white/10 shrink-0 bg-linear-to-r from-slate-900/50 to-slate-950/50">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 p-2 rounded-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="
          p-6 sm:p-8 md:p-10 overflow-y-auto flex-1
          ">
            {children}
          </div>

          {/* Footer */}
          <div className="p-6 sm:p-8 md:p-10 border-t border-white/10 flex justify-end shrink-0 bg-linear-to-r from-slate-950/50 to-slate-900/50">
            <Button 
              onClick={onClose}
              className="cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
