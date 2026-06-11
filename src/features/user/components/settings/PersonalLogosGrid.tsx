'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { MAX_PERSONAL_LOGOS, type PersonalLogo } from '@/features/user/types/personalLogo.types';
import { LogoTile } from './LogoTile';

type PersonalLogosGridProps = {
  personalLogos: PersonalLogo[];
  emptySlots: number;
  equippedLogoId: string | null;
  processing: boolean;
  userId: string | null;
  profileImage: string;
  profileAlreadySaved: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onEquip: (logoId: string) => void;
  onRemove: (logo: PersonalLogo) => void;
  onUploadClick: () => void;
  onUseProfilePhoto: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function PersonalLogosGrid({
  personalLogos,
  emptySlots,
  equippedLogoId,
  processing,
  userId,
  profileImage,
  profileAlreadySaved,
  fileInputRef,
  onEquip,
  onRemove,
  onUploadClick,
  onUseProfilePhoto,
  onFileChange,
}: PersonalLogosGridProps) {
  return (
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
            onSelect={() => onEquip(logo.id)}
            onDelete={() => onRemove(logo)}
          />
        ))}

        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border border-dashed border-surface-border',
              'bg-surface-elevated/40 p-3'
            )}
          >
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full border border-surface-border',
                'bg-surface-overlay/80 text-on-surface-muted'
              )}
            >
              <Icon name="camera" size="lg" />
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <button
                type="button"
                disabled={!userId}
                onClick={onUploadClick}
                className={cn(
                  'bg-app-ring/15 text-app-accent hover:bg-app-ring/25 cursor-pointer rounded-lg px-2 py-1.5',
                  'text-[11px] font-semibold'
                )}
              >
                Subir imagen
              </button>
              {profileImage && !profileAlreadySaved && index === 0 && (
                <button
                  type="button"
                  disabled={!userId}
                  onClick={onUseProfilePhoto}
                  className={cn(
                    'cursor-pointer rounded-lg bg-surface-overlay px-2 py-1.5 text-[11px] font-semibold',
                    'text-on-surface-muted hover:bg-on-surface-muted'
                  )}
                >
                  Usar foto de perfil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      <p className="sr-only">Máximo {MAX_PERSONAL_LOGOS} logos personales</p>
    </div>
  );
}
