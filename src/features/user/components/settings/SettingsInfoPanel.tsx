import { Icon } from '@/shared/components/Icon';
import { SettingsSection } from './SettingsSection';

export function SettingsInfoPanel() {
  return (
    <SettingsSection title="Información" icon="shield-alt">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-surface-border bg-surface-via/50 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-white">
            <Icon name="cloud" className="text-app-accent" />
            Cloud Sync
          </h3>
          <p className="text-xs leading-relaxed text-on-surface-muted">
            Tus datos se guardan localmente en tu dispositivo. En el futuro se sincronizarán con la nube.
          </p>
        </div>
        <div className="rounded-xl border border-surface-border bg-surface-via/50 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-white">
            <Icon name="lock" className="text-app-accent" />
            Privacidad
          </h3>
          <p className="text-xs leading-relaxed text-on-surface-muted">
            Tus datos están encriptados y protegidos. Solo tú tienes acceso a tu información personal y progreso.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
