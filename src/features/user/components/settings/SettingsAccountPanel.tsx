import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { SettingsSection, SettingOption } from './SettingsSection';

export function SettingsAccountPanel() {
  const { loading, setShowDeleteModal, handleLogout } = useUserSettingsContext();

  return (
    <SettingsSection title="Gestión de Cuenta" icon="lock">
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
              'cursor-pointer rounded-lg bg-surface-overlay px-4 py-2 text-sm font-medium text-white transition-colors',
              'focus-visible:ring-app-accent hover:bg-on-surface-muted focus-visible:ring-2 focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-surface-via'
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
        onClick={() => setShowDeleteModal(true)}
        action={<Icon name="chevron-right" className="text-on-surface-muted" />}
      />
      <SettingOption
        label="Eliminar Cuenta"
        description="Acción permanente. Elimina todo."
        icon="warning"
        danger
        onClick={() => setShowDeleteModal(true)}
        action={<Icon name="chevron-right" className="text-on-surface-muted" />}
      />
    </SettingsSection>
  );
}
