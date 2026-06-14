import { Icon } from '@/shared/components/Icon';
import { SettingsSection } from './SettingsSection';

export function SettingsInfoPanel() {
  return (
    <SettingsSection title="Información" icon="shield-alt">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border-surface-border bg-surface-via/50 rounded-xl border p-4">
          <h3 className="text-on-surface mb-2 flex items-center gap-2 font-bold">
            <Icon name="cloud" className="text-app-accent" />
            Cloud Sync
          </h3>
          <p className="text-on-surface-muted text-xs leading-relaxed">
            Con cuenta, tu progreso se sincroniza en Supabase. El modo demo guarda datos solo en este navegador.
          </p>
        </div>
        <div className="border-surface-border bg-surface-via/50 rounded-xl border p-4">
          <h3 className="text-on-surface mb-2 flex items-center gap-2 font-bold">
            <Icon name="lock" className="text-app-accent" />
            Privacidad
          </h3>
          <p className="text-on-surface-muted text-xs leading-relaxed">
            Tus datos están encriptados y protegidos. Solo tú tienes acceso a tu información personal y progreso.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
