import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';

export function SettingsDeleteModal() {
  const {
    showDeleteModal,
    setShowDeleteModal,
    deleteConfirmation,
    setDeleteConfirmation,
    loading,
    handleClearAllData,
    handleDeleteAccount,
  } = useUserSettingsContext();

  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="animate-zoom-in w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div
          className={cn(
            'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
            'bg-red-500/10 text-red-500'
          )}
        >
          <Icon name="warning" className="text-xl" />
        </div>
        <h2 className="mb-2 text-center text-xl font-bold text-white">Zona de Peligro</h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          Estas acciones son irreversibles. Por favor confirma tu intención.
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="mb-2 text-sm font-medium text-slate-300">
              Escribe{' '}
              <span className="font-bold text-white">
                &quot;{deleteConfirmation === 'BORRAR TODO' ? 'BORRAR TODO' : 'BORRAR MI CUENTA'}&quot;
              </span>
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm',
                'text-white outline-none focus:border-red-500'
              )}
              placeholder="Confirmación..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
              }}
              className={cn(
                'flex-1 cursor-pointer rounded-lg bg-slate-800 py-2.5 font-medium text-white transition-colors',
                'focus-visible:ring-app-accent hover:bg-slate-700 focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
              )}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={deleteConfirmation === 'BORRAR TODO' ? handleClearAllData : handleDeleteAccount}
              disabled={loading || (deleteConfirmation !== 'BORRAR TODO' && deleteConfirmation !== 'BORRAR MI CUENTA')}
              className={cn(
                'flex-1 cursor-pointer rounded-lg bg-red-600 py-2.5 font-medium text-white',
                'transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50',
                'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-slate-900'
              )}
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
