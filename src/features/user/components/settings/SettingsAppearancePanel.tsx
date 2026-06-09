import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { SettingsSection } from './SettingsSection';

export function SettingsAppearancePanel() {
  return (
    <SettingsSection title="Apariencia" icon="sun">
      <p className="text-on-surface-muted text-sm leading-relaxed">
        Elige entre modo claro u oscuro. El cambio se aplica en toda la aplicación, en móvil y en escritorio.
      </p>
      <ThemeToggle />
    </SettingsSection>
  );
}
