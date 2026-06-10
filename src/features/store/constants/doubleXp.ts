export const DOUBLE_XP_ITEM_ID = 'powerup_double_xp';
export const DOUBLE_XP_DURATION_MS = 60 * 60 * 1000;

export function isDoubleXpActive(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() > Date.now();
}

export function getDoubleXpRemainingMs(expiresAt: string | null | undefined): number {
  if (!expiresAt) return 0;
  return Math.max(0, new Date(expiresAt).getTime() - Date.now());
}
