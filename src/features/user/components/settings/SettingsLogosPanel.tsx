'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { AvatarImage } from '@/features/user/components/AvatarImage';
import { useShop } from '@/features/store/hooks/useShop';
import { listOwnedLogoItems } from '@/features/store/data/shopCatalog';
import { usePersonalLogos } from '@/features/user/hooks/usePersonalLogos';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { addPersonalLogo, removePersonalLogo } from '@/services/persistence';
import { MAX_PERSONAL_LOGOS, type PersonalLogo } from '@/features/user/types/personalLogo.types';
import { readImageFileAsDataUrl, validateLogoImageFile } from '@/features/user/utils/validateLogoImageFile';
import type { ShopItem } from '@/features/store/data/shopItems';
import { SettingsSection } from './SettingsSection';

type LogoTileProps = {
  id: string;
  name: string;
  image: string | import('@/assets').ImageSource;
  color?: string;
  equipped: boolean;
  processing: boolean;
  onSelect: () => void;
  onDelete?: () => void;
};

function LogoTile({ id, name, image, color, equipped, processing, onSelect, onDelete }: LogoTileProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={processing}
        onClick={onSelect}
        aria-pressed={equipped}
        aria-label={equipped ? `Quitar ${name}` : `Equipar ${name}`}
        className={cn(
          'group relative cursor-pointer rounded-2xl p-1 transition-all',
          'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none',
          equipped ? 'ring-app-accent ring-2 ring-offset-2 ring-offset-slate-950' : 'hover:scale-105'
        )}
      >
        <div
          className={cn(
            'relative h-16 w-16 rounded-full p-0.5 shadow-md',
            color ? `bg-linear-to-br ${color}` : 'from-app-ring/40 bg-linear-to-br to-slate-700'
          )}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
            {typeof image === 'string' ? (
              <AvatarImage src={image} alt={name} sizes="64px" />
            ) : (
              <Image src={image} alt={name} fill sizes="64px" className="object-cover" />
            )}
          </div>
        </div>
        {equipped && (
          <span className="bg-app-accent absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-slate-950">
            <Icon name="check" size="sm" />
          </span>
        )}
      </button>
      <p className="line-clamp-1 max-w-[88px] text-center text-xs text-slate-300">{name}</p>
      {onDelete ? (
        <button
          type="button"
          disabled={processing}
          onClick={onDelete}
          className="cursor-pointer text-[10px] text-red-400 underline-offset-2 hover:underline"
        >
          Eliminar
        </button>
      ) : (
        <span className="text-[10px] text-slate-500">{equipped ? 'Equipado' : 'Toca para equipar'}</span>
      )}
    </div>
  );
}

export function SettingsLogosPanel() {
  const { user } = useUserSettingsContext();
  const { inventory, equippedLogoId, processing, equipLogo, unequipLogo } = useShop();
  const { logos: personalLogos, userId } = usePersonalLogos();
  const ownedShopLogos = listOwnedLogoItems(inventory);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const profileImage = user?.profileImage?.trim() ?? '';
  const profileAlreadySaved = profileImage ? personalLogos.some((logo) => logo.image === profileImage) : false;
  const canAddPersonalLogo = personalLogos.length < MAX_PERSONAL_LOGOS;

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    window.setTimeout(() => setFeedback(null), 3500);
  };

  const handleEquip = async (logoId: string) => {
    try {
      if (equippedLogoId === logoId) {
        await unequipLogo();
        notify('Logo quitado');
        return;
      }
      await equipLogo(logoId);
      notify('Logo equipado');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo equipar el logo', 'error');
    }
  };

  const equipPersonalLogo = async (logoId: string) => {
    if (equippedLogoId === logoId) return;
    await equipLogo(logoId);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!userId) {
      notify('Debes iniciar sesión para guardar logos personales', 'error');
      return;
    }

    const validationError = validateLogoImageFile(file);
    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      const image = await readImageFileAsDataUrl(file);
      const saved = await addPersonalLogo(userId, image, 'Logo personal');
      const newLogo = saved[saved.length - 1];
      if (newLogo) {
        await equipPersonalLogo(newLogo.id);
        notify('Logo personal guardado y equipado');
      } else {
        notify('Logo personal guardado');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo guardar el logo', 'error');
    }
  };

  const handleUseProfilePhoto = async () => {
    if (!userId || !profileImage) {
      notify('Primero sube una foto de perfil', 'error');
      return;
    }
    if (profileAlreadySaved) {
      notify('Tu foto de perfil ya está guardada como logo', 'error');
      return;
    }
    if (!canAddPersonalLogo) {
      notify(`Solo puedes guardar hasta ${MAX_PERSONAL_LOGOS} logos personales`, 'error');
      return;
    }

    try {
      const saved = await addPersonalLogo(userId, profileImage, 'Desde perfil');
      const newLogo = saved[saved.length - 1];
      if (newLogo) {
        await equipPersonalLogo(newLogo.id);
        notify('Foto de perfil guardada y equipada como logo');
      } else {
        notify('Foto de perfil guardada como logo');
      }
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo guardar el logo', 'error');
    }
  };

  const handleRemovePersonal = async (logo: PersonalLogo) => {
    if (!userId) return;
    try {
      await removePersonalLogo(userId, logo.id);
      notify('Logo personal eliminado');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'No se pudo eliminar el logo', 'error');
    }
  };

  const renderShopLogo = (logo: ShopItem) => (
    <LogoTile
      key={logo.id}
      id={logo.id}
      name={logo.name}
      image={logo.image!}
      color={logo.color}
      equipped={equippedLogoId === logo.id}
      processing={processing}
      onSelect={() => void handleEquip(logo.id)}
    />
  );

  const emptySlots = Math.max(0, MAX_PERSONAL_LOGOS - personalLogos.length);

  return (
    <SettingsSection title="Mis logos" icon="star">
      {feedback && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm',
            feedback.type === 'success'
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          )}
        >
          {feedback.text}
        </div>
      )}

      <p className="text-sm text-slate-400">
        El logo equipado se muestra como avatar en toda la app, incluso si tienes foto de perfil. Puedes guardar hasta{' '}
        {MAX_PERSONAL_LOGOS} logos personales (máx. 2MB cada uno).
      </p>

      <div className="space-y-3">
        <h3 className="text-on-surface text-sm font-semibold">Logos personales</h3>
        <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
          {personalLogos.map((logo) => (
            <LogoTile
              key={logo.id}
              id={logo.id}
              name={logo.label}
              image={logo.image}
              equipped={equippedLogoId === logo.id}
              processing={processing}
              onSelect={() => void handleEquip(logo.id)}
              onDelete={() => void handleRemovePersonal(logo)}
            />
          ))}

          {Array.from({ length: emptySlots }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-3"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 text-slate-500">
                <Icon name="camera" size="lg" />
              </div>
              <div className="flex w-full flex-col gap-1.5">
                <button
                  type="button"
                  disabled={!userId}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-app-ring/15 text-app-accent hover:bg-app-ring/25 cursor-pointer rounded-lg px-2 py-1.5 text-[11px] font-semibold"
                >
                  Subir imagen
                </button>
                {profileImage && !profileAlreadySaved && index === 0 && (
                  <button
                    type="button"
                    disabled={!userId}
                    onClick={() => void handleUseProfilePhoto()}
                    className="cursor-pointer rounded-lg bg-slate-800 px-2 py-1.5 text-[11px] font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Usar foto de perfil
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleUpload(e)}
        />
      </div>

      {ownedShopLogos.length > 0 && (
        <div className="space-y-3 border-t border-slate-800 pt-4">
          <h3 className="text-on-surface text-sm font-semibold">Logos de la tienda</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">{ownedShopLogos.map(renderShopLogo)}</div>
        </div>
      )}

      {ownedShopLogos.length === 0 && personalLogos.length === 0 && (
        <p className="text-sm text-slate-400">
          Compra logos en la{' '}
          <a href="/tienda" className="text-app-accent underline-offset-2 hover:underline">
            tienda
          </a>{' '}
          o guarda los tuyos arriba.
        </p>
      )}

      {equippedLogoId && (
        <button
          type="button"
          disabled={processing}
          onClick={() => void unequipLogo().then(() => notify('Logo quitado'))}
          className="cursor-pointer text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
        >
          Quitar logo equipado
        </button>
      )}
    </SettingsSection>
  );
}
