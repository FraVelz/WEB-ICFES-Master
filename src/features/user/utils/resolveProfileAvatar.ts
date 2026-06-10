import type { ImageSource } from '@/assets';
import { getLogoItemImage } from '@/features/store/data/shopCatalog';

/** Foto subida > logo equipado > silueta por defecto. */
export function resolveProfileAvatarSrc(
  profileImage: string | null | undefined,
  equippedLogoId: string | null | undefined
): ImageSource | null {
  const trimmed = profileImage?.trim();
  if (trimmed) return trimmed;
  return getLogoItemImage(equippedLogoId ?? null);
}
