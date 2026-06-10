import type { ImageSource } from '@/assets';
import { getLogoItemImage } from '@/features/store/data/shopCatalog';
import { isPersonalLogoId, type PersonalLogo } from '@/features/user/types/personalLogo.types';

export function getPersonalLogoImage(
  logoId: string | null | undefined,
  personalLogos: PersonalLogo[]
): string | null {
  if (!logoId || !isPersonalLogoId(logoId)) return null;
  return personalLogos.find((logo) => logo.id === logoId)?.image ?? null;
}

export function getEquippedLogoImage(
  logoId: string | null | undefined,
  personalLogos: PersonalLogo[] = []
): ImageSource | null {
  if (!logoId) return null;
  const personal = getPersonalLogoImage(logoId, personalLogos);
  if (personal) return personal;
  return getLogoItemImage(logoId);
}
