'use client';

import { cn } from '@/utils/cn';
import { listOwnedLogoItems } from '@/features/store/data/shopCatalog';
import { useUserSettingsContext } from '@/features/user/context/UserSettingsContext';
import { MAX_PERSONAL_LOGOS } from '@/features/user/types/personalLogo.types';
import type { ShopItem } from '@/features/store/data/shopItems';
import { SettingsSection } from './SettingsSection';
import { LogoTile } from './LogoTile';
import { PersonalLogosGrid } from './PersonalLogosGrid';
import { useSettingsLogos } from './useSettingsLogos';

export function SettingsLogosPanel() {
  const { user } = useUserSettingsContext();
  const profileImage = user?.profileImage?.trim() ?? '';

  const {
    inventory,
    personalLogos,
    equippedLogoId,
    processing,
    feedback,
    fileInputRef,
    profileAlreadySaved,
    userId,
    emptySlots,
    handleEquip,
    handleUpload,
    handleUseProfilePhoto,
    handleRemovePersonal,
    handleUnequip,
  } = useSettingsLogos({ profileImage });

  const ownedShopLogos = listOwnedLogoItems(inventory);

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

  return (
    <SettingsSection title="Mis logos" icon="star">
      {feedback ? (
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
      ) : null}

      <p className="text-sm text-slate-400">
        El logo equipado se muestra como avatar en toda la app, incluso si tienes foto de perfil. Puedes guardar
        hasta{' '}
        {MAX_PERSONAL_LOGOS} logos personales (máx. 2MB cada uno).
      </p>

      <PersonalLogosGrid
        personalLogos={personalLogos}
        emptySlots={emptySlots}
        equippedLogoId={equippedLogoId}
        processing={processing}
        userId={userId}
        profileImage={profileImage}
        profileAlreadySaved={profileAlreadySaved}
        fileInputRef={fileInputRef}
        onEquip={(logoId) => void handleEquip(logoId)}
        onRemove={(logo) => void handleRemovePersonal(logo)}
        onUploadClick={() => fileInputRef.current?.click()}
        onUseProfilePhoto={() => void handleUseProfilePhoto()}
        onFileChange={(e) => void handleUpload(e)}
      />

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

      {equippedLogoId ? (
        <button
          type="button"
          disabled={processing}
          onClick={() => void handleUnequip()}
          className="cursor-pointer text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
        >
          Quitar logo equipado
        </button>
      ) : null}
    </SettingsSection>
  );
}
