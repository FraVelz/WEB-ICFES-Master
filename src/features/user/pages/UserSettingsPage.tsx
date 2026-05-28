'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { UserSettingsProvider, useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { SettingsProfilePanel } from '@/features/user/components/settings/SettingsProfilePanel';
import { SettingsAccountPanel } from '@/features/user/components/settings/SettingsAccountPanel';
import { SettingsSupportPanel } from '@/features/user/components/settings/SettingsSupportPanel';
import { SettingsInfoPanel } from '@/features/user/components/settings/SettingsInfoPanel';
import { SettingsDeleteModal } from '@/features/user/components/settings/SettingsDeleteModal';

function UserSettingsContent() {
  const { message, messageType } = useUserSettingsContext();

  return (
    <div className="min-h-dvh bg-slate-950 pb-24 text-white md:pb-0">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="from-hub-sheet-from/10 absolute top-0 left-0 h-96 w-full bg-linear-to-b to-transparent" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
            <Link
              href="/perfil"
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Icon name="arrow-left" className="text-lg" />
            </Link>
            <h1 className="text-xl font-bold text-white">Configuración</h1>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-8">
          {message && (
            <div
              className={cn(
                'animate-fade-in-up fixed top-20 right-4 z-50 max-w-sm rounded-xl border p-4 shadow-xl backdrop-blur-md',
                messageType === 'success'
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon name={messageType === 'success' ? 'check-circle' : 'warning'} />
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <SettingsProfilePanel />
            </div>
            <div className="space-y-6 lg:col-span-8">
              <SettingsAccountPanel />
              <SettingsSupportPanel />
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
