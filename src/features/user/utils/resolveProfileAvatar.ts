import type { ImageSource } from '@/assets';
import type { PersonalLogo } from '@/features/user/types/personalLogo.types';
import { getEquippedLogoImage } from './equippedLogoImage';

/** Logo equipado > foto de perfil > silueta por defecto. */
export function resolveProfileAvatarSrc(
  profileImage: string | null | undefined,
  equippedLogoId: string | null | undefined,
  personalLogos: PersonalLogo[] = []
): ImageSource | null {
  const equipped = getEquippedLogoImage(equippedLogoId ?? null, personalLogos);
  if (equipped) return equipped;

  const trimmed = profileImage?.trim();
  if (trimmed) return trimmed;

  return null;
}
