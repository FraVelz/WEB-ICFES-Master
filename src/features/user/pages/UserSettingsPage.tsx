'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { UserSettingsProvider } from '@/features/user/context/UserSettingsContext';
import { SettingsProfilePanel } from '@/features/user/components/settings/SettingsProfilePanel';
import { SettingsAccountPanel } from '@/features/user/components/settings/SettingsAccountPanel';
import { SettingsAppearancePanel } from '@/features/user/components/settings/SettingsAppearancePanel';
import { SettingsSupportPanel } from '@/features/user/components/settings/SettingsSupportPanel';
import { SettingsDonationPanel } from '@/features/user/components/settings/SettingsDonationPanel';
import { SettingsLogosPanel } from '@/features/user/components/settings/SettingsLogosPanel';
import { SettingsInfoPanel } from '@/features/user/components/settings/SettingsInfoPanel';
import { SettingsDeleteModal } from '@/features/user/components/settings/SettingsDeleteModal';
import { PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

function UserSettingsContent() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-hub-sheet-from/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="border-surface-border/80 bg-surface-elevated/90 sticky top-0 z-50 border-b backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
            <Link
              href="/perfil"
              className={cn(
                'text-on-surface-muted hover:bg-surface-elevated hover:text-on-surface',
                'rounded-full p-2 transition-colors'
              )}
            >
              <Icon name="arrow-left" className="text-lg" />
            </Link>
            <h1 className="text-on-surface text-xl font-bold">Configuración</h1>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <SettingsProfilePanel />
            </div>
            <div className="space-y-6 lg:col-span-8">
              <SettingsAppearancePanel />
              <SettingsLogosPanel />
              <SettingsAccountPanel />
              <SettingsSupportPanel />
              <SettingsDonationPanel />
              <SettingsInfoPanel />
            </div>
          </div>
        </div>

        <SettingsDeleteModal />
      </div>
    </div>
  );
}

export const UserSettingsPage = () => (
  <UserSettingsProvider>
    <UserSettingsContent />
  </UserSettingsProvider>
);
