import { applyReferralCode } from './referralService';
import { clearStoredReferralCode, getStoredReferralCode } from './referralStorage';

export async function applyStoredReferralIfNeeded(userId: string, source: 'web' | 'app' = 'web'): Promise<boolean> {
  const code = getStoredReferralCode();
  if (!code) return false;

  const applied = await applyReferralCode(userId, code, source);
  if (applied) {
    clearStoredReferralCode();
  }
  return applied;
}
