import type { IcfesInfographic } from '@/features/tips/data/icfesInfographics';
import { getR2PublicAssetUrl, isR2PublicUrlConfigured } from './r2PublicUrl';

/** URL para ver/descargar una infografía: API del servidor o URL pública de R2. */
export function getInfographicPdfUrl(item: Pick<IcfesInfographic, 'id' | 'filename'>): string {
  if (process.env.NEXT_PUBLIC_R2_USE_API === 'true') {
    return `/api/r2/infographic/${item.id}/`;
  }

  const publicUrl = getR2PublicAssetUrl(item.filename);
  if (publicUrl) return publicUrl;

  return `/api/r2/infographic/${item.id}/`;
}

export function isInfographicStorageConfigured(): boolean {
  return isR2PublicUrlConfigured() || process.env.NEXT_PUBLIC_R2_USE_API === 'true';
}
