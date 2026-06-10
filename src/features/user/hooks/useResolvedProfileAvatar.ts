'use client';

import type { ImageSource } from '@/assets';
import { useEquippedLogoId } from '@/features/store/hooks/useEquippedLogoId';
import { resolveProfileAvatarSrc } from '@/features/user/utils/resolveProfileAvatar';
import { usePersonalLogos } from './usePersonalLogos';

/** Avatar mostrado en shell y ajustes: logo equipado > foto de perfil > silueta. */
export function useResolvedProfileAvatar(profileImage?: string | null): ImageSource | null {
  const equippedLogoId = useEquippedLogoId();
  const { logos: personalLogos } = usePersonalLogos();
  return resolveProfileAvatarSrc(profileImage, equippedLogoId, personalLogos);
}
