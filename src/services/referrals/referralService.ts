import { supabase } from '@/config/supabase';

export async function applyReferralCode(userId: string, referralCode: string, source: 'web' | 'app' = 'web'): Promise<boolean> {
  if (!supabase) return false;
  const normalized = referralCode.trim();
  if (!normalized) return false;

  const { data, error } = await supabase.rpc('apply_referral_code', {
    p_invitee_id: userId,
    p_referral_code: normalized,
    p_source: source,
  });

  if (error) {
    console.warn('No se pudo aplicar código de referido:', error.message);
    return false;
  }

  return Boolean(data);
}

export async function getReferralCodeForUser(userId: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('users').select('referral_code').eq('id', userId).maybeSingle();
  if (error) {
    console.warn('No se pudo leer código de referido:', error.message);
    return null;
  }
  return typeof data?.referral_code === 'string' ? data.referral_code : null;
}

export async function getInviteeReferralStatus(
  userId: string
): Promise<{ referralCode: string | null; referredBy: string | null }> {
  if (!supabase) return { referralCode: null, referredBy: null };
  const { data, error } = await supabase
    .from('users')
    .select('referral_code, referred_by')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.warn('No se pudo leer estado de referidos:', error.message);
    return { referralCode: null, referredBy: null };
  }
  return {
    referralCode: typeof data?.referral_code === 'string' ? data.referral_code : null,
    referredBy: typeof data?.referred_by === 'string' ? data.referred_by : null,
  };
}

export async function getQualifiedReferralCount(userId: string): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('user_gamification')
    .select('referral_qualified_count')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return 0;
  return Number(data?.referral_qualified_count ?? 0);
}
