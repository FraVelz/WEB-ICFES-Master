export const REFERRAL_QUALIFY_XP = 300;
export const REFERRAL_QUALIFY_COINS = 150;

export const REFERRAL_STORAGE_KEY = 'icfes_referral_code';

export function referralQualifiedReason(inviteeId: string): string {
  return `referral_qualified_${inviteeId}`;
}
