import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { SettingsSection, SettingOption } from './SettingsSection';

export function SettingsAccountPanel() {
  const { loading, setShowDeleteModal, setDeleteMode, setDeleteConfirmation, handleLogout, handleExportResults } =
    useUserSettingsContext();

  const openDeleteModal = (mode: 'clear-data' | 'delete-account') => {
    setDeleteMode(mode);
    setDeleteConfirmation('');
    setShowDeleteModal(true);
  };

  return (
    <SettingsSection title="Gestión de Cuenta" icon="lock">
      <SettingOption
        label="Exportar mis resultados"
        description="Descarga un JSON con progreso, prácticas y exámenes de este dispositivo"
        icon="clipboard"
        action={
          <button
            type="button"
            onClick={handleExportResults}
            disabled={loading}
            className={cn(
              'bg-surface-overlay cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
              'focus-visible:ring-app-accent hover:bg-on-surface-muted focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
            )}
          >
            Exportar
          </button>
        }
      />
      <SettingOption
        label="Cerrar Sesión"
        description="Finaliza tu sesión actual en este dispositivo"
        icon="sign-out"
        action={
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className={cn(
              'bg-surface-overlay cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
              'focus-visible:ring-app-accent hover:bg-on-surface-muted focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-surface-via focus-visible:ring-offset-2'
            )}
          >
            Cerrar
          </button>
        }
      />
      <SettingOption
        label="Borrar mis Datos"
        description="Elimina progreso y exámenes. Mantiene la cuenta."
        icon="trash"
        danger
        onClick={() => openDeleteModal('clear-data')}
        action={<Icon name="chevron-right" className="text-on-surface-muted" />}
      />
      <SettingOption
        label="Eliminar Cuenta"
        description="Acción permanente. Elimina datos locales y cierra sesión."
        icon="warning"
        danger
        onClick={() => openDeleteModal('delete-account')}
        action={<Icon name="chevron-right" className="text-on-surface-muted" />}
      />
    </SettingsSection>
  );
}
