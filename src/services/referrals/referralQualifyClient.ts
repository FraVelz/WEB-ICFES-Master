import { supabase } from '@/config/supabase';

async function getAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function requestReferralQualify(): Promise<{ qualified: boolean; rewarded: boolean }> {
  try {
    const token = await getAccessToken();
    if (!token) return { qualified: false, rewarded: false };

    const response = await fetch('/api/referrals/qualify/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const payload = (await response.json()) as { qualified?: boolean; rewarded?: boolean; error?: string };
    if (!response.ok) {
      return { qualified: false, rewarded: false };
    }

    return {
      qualified: Boolean(payload.qualified),
      rewarded: Boolean(payload.rewarded),
    };
  } catch {
    return { qualified: false, rewarded: false };
  }
}
