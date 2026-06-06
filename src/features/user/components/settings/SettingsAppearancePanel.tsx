import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { SettingsSection } from './SettingsSection';

export function SettingsAppearancePanel() {
  return (
    <SettingsSection title="Apariencia" icon="sun">
      <ThemeToggle />
    </SettingsSection>
  );
}
