'use client';

import Image from 'next/image';
import { cn } from '@/utils/cn';
import { useShop } from '@/features/store/hooks/useShop';
import { listOwnedLogoItems } from '@/features/store/data/shopCatalog';
import { SettingsSection } from './SettingsSection';

export function SettingsLogosPanel() {
  const { inventory, equippedLogoId, processing, equipLogo, unequipLogo } = useShop();
  const ownedLogos = listOwnedLogoItems(inventory);

  if (ownedLogos.length === 0) {
    return (
      <SettingsSection title="Mis logos">
        <p className="text-sm text-slate-400">
          Aún no tienes logos. Compra alguno en la{' '}
          <a href="/tienda" className="text-app-accent underline-offset-2 hover:underline">
            tienda
          </a>{' '}
          y equípalo aquí como avatar.
        </p>
      </SettingsSection>
    );
  }

  return (
    <SettingsSection title="Mis logos">
      <p className="mb-4 text-sm text-slate-400">
        El logo equipado se muestra como avatar cuando no tienes foto de perfil propia.
      </p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {ownedLogos.map((logo) => {
          const equipped = equippedLogoId === logo.id;
          return (
            <div key={logo.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'relative h-16 w-16 rounded-full p-0.5 shadow-md',
                  equipped ? 'ring-app-accent ring-2 ring-offset-2 ring-offset-slate-950' : '',
                  `bg-linear-to-br ${logo.color}`
                )}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                  {logo.image && (
                    <Image src={logo.image} alt={logo.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
              </div>
              <p className="line-clamp-1 text-center text-xs text-slate-300">{logo.name}</p>
              <button
                type="button"
                disabled={processing}
                onClick={() => void (equipped ? unequipLogo() : equipLogo(logo.id))}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
                  equipped
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-app-ring/20 text-app-accent hover:bg-app-ring/30'
                )}
              >
                {equipped ? 'Quitar' : 'Equipar'}
              </button>
            </div>
          );
        })}
      </div>
      {equippedLogoId && (
        <button
          type="button"
          disabled={processing}
          onClick={() => void unequipLogo()}
          className="mt-4 cursor-pointer text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
        >
          Quitar logo equipado
        </button>
      )}
    </SettingsSection>
  );
}
