import { useId, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const confirmId = useId();

  useDialogA11y(
    showDeleteModal,
    () => {
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    },
    dialogRef
  );

  if (!showDeleteModal) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-zoom-in border-surface-border bg-surface-elevated w-full max-w-md rounded-2xl border p-6 shadow-2xl motion-reduce:animate-none"
      >
        <div
          className={cn(
            'mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full',
            'bg-red-500/10 text-red-500'
          )}
        >
          <Icon name="warning" className="text-xl" />
        </div>
        <h2 id={titleId} className="mb-2 text-center text-xl font-bold text-white">
          Zona de Peligro
        </h2>
        <p className="text-on-surface-muted mb-6 text-center text-sm">
          Estas acciones son irreversibles. Por favor confirma tu intención.
        </p>

        <div className="space-y-4">
          <div className="border-surface-border bg-surface-via rounded-xl border p-4">
            <p className="text-on-surface-muted mb-2 text-sm font-medium">
              Escribe{' '}
              <span className="font-bold text-white">
                &quot;{deleteConfirmation === 'BORRAR TODO' ? 'BORRAR TODO' : 'BORRAR MI CUENTA'}&quot;
              </span>
            </p>
            <input
              id={confirmId}
              type="text"
              value={deleteConfirmation}
              aria-label="Confirmación de borrado"
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className={cn(
                'border-surface-border bg-surface-elevated w-full rounded-lg border px-3 py-2 text-sm',
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
                'bg-surface-overlay flex-1 cursor-pointer rounded-lg py-2.5 font-medium text-white transition-colors',
                'focus-visible:ring-app-accent hover:bg-on-surface-muted focus-visible:ring-2 focus-visible:outline-none',
                'focus-visible:ring-offset-surface-elevated focus-visible:ring-offset-2'
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
                'focus-visible:ring-offset-surface-elevated'
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
