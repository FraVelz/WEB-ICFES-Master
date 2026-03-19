import { Button } from './atoms/Button';

export const Modal = ({ isOpen, title, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro - Fixed debajo del header en mobile */}
      <div
        className="fixed inset-0 top-20 z-40 bg-black/80 backdrop-blur-sm sm:top-0"
        onClick={onClose}
      ></div>

      {/* Modal content - Posicionado debajo del header en mobile */}
      <div className="fixed inset-0 top-20 right-0 bottom-0 left-0 z-50 flex flex-col p-0 sm:inset-0 sm:top-0 sm:items-center sm:justify-center sm:p-4">
        <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-none border-0 border-white/20 bg-linear-to-br from-slate-900 to-slate-950 shadow-2xl sm:h-auto sm:max-h-[85vh] sm:w-full sm:rounded-3xl sm:border md:max-h-[80vh] md:max-w-4xl">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-linear-to-r from-slate-900/50 to-slate-950/50 p-6 sm:p-8 md:p-10">
            <h2 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer rounded-lg p-2 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10">
            {children}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 justify-end border-t border-white/10 bg-linear-to-r from-slate-950/50 to-slate-900/50 p-6 sm:p-8 md:p-10">
            <Button
              onClick={onClose}
              className="cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
