'use client';

import { SettingsSection } from './SettingsSection';
import { DonationMethods } from './DonationMethods';
import { DONATION_INTRO } from './donationConstants';

export {
  DONATION_BRE_B_KEY,
  DONATION_BRE_B_HOLDER,
  DONATION_PAYPAL_URL,
  DONATION_PAYPAL_HOLDER,
} from './donationConstants';

export function SettingsDonationPanel() {
  return (
    <SettingsSection title="Apoya el proyecto" icon="heart">
      <p className="text-on-surface-muted text-sm leading-relaxed">{DONATION_INTRO}</p>
      <DonationMethods />
    </SettingsSection>
  );
}
