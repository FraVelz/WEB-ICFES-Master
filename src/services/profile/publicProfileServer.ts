import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/config/supabaseClient';
import { readStudyTimeRemoteMeta } from '@/services/studyTime/studyTimeService';

export type PublicProfilePayload = {
  profile: {
    id: string;
    displayName: string | null;
    username: string | null;
    bio: string | null;
    profileImage: string | null;
    createdAt: string | null;
  };
  gamification: {
    xp: number;
    achievements: Record<string, unknown>;
    studyTimeMinutes: number;
    equippedLogoId?: string | null;
  };
};

function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function fetchViaServiceRole(userId: string): Promise<PublicProfilePayload | null> {
  const sb = createServiceClient();
  if (!sb) return null;

  const { data: user, error: userError } = await sb
    .from('users')
    .select('id, display_name, username, bio, profile_image, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (userError) throw new Error(userError.message);
  if (!user) return null;

  const { data: gamification } = await sb
    .from('user_gamification')
    .select('xp, achievements, equipped_logo_id')
    .eq('user_id', userId)
    .maybeSingle();

  return {
    profile: {
      id: user.id,
      displayName: user.display_name ?? null,
      username: user.username ?? null,
      bio: user.bio ?? null,
      profileImage: user.profile_image ?? null,
      createdAt: user.created_at ?? null,
    },
    gamification: {
      xp: gamification?.xp ?? 0,
      achievements: (gamification?.achievements as Record<string, unknown>) ?? {},
      studyTimeMinutes: readStudyTimeRemoteMeta(gamification?.achievements).totalMinutes,
      equippedLogoId: gamification?.equipped_logo_id ?? null,
    },
  };
}

async function fetchViaPublicRpc(userId: string): Promise<PublicProfilePayload | null> {
  const sb = createSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb.rpc('get_public_profile', { p_user_id: userId });

  if (error) {
    const msg = error.message ?? '';
    const code = (error as { code?: string }).code ?? '';
    const missingFunction =
      code === 'PGRST202' ||
      msg.includes('Could not find the function') ||
      msg.includes('function public.get_public_profile') ||
      msg.includes('schema cache');

    if (missingFunction) {
      console.error(
        'public profile RPC missing: ejecuta supabase/migrations/20260609120000_public_profile_rpc.sql y NOTIFY pgrst'
      );
      return null;
    }

    throw new Error(msg);
  }

  if (data == null || typeof data !== 'object') return null;

  const payload = data as PublicProfilePayload;
  if (!payload.profile?.id) return null;

  return {
    profile: payload.profile,
    gamification: {
      xp: payload.gamification?.xp ?? 0,
      achievements: (payload.gamification?.achievements as Record<string, unknown>) ?? {},
      studyTimeMinutes:
        payload.gamification?.studyTimeMinutes ??
        readStudyTimeRemoteMeta(payload.gamification?.achievements).totalMinutes,
      equippedLogoId: payload.gamification?.equippedLogoId ?? null,
    },
  };
}

/** Consulta perfil público sin sesión del visitante (service role o RPC anónima). */
export async function fetchPublicProfile(userId: string): Promise<PublicProfilePayload | null> {
  // 1) RPC anónima (funciona sin service role si está creada en Supabase)
  try {
    const viaRpc = await fetchViaPublicRpc(userId);
    if (viaRpc) return viaRpc;
  } catch (err) {
    console.error('public profile RPC failed, trying service role:', err);
  }

  // 2) Service role (desarrollo local con SUPABASE_SERVICE_ROLE_KEY)
  try {
    return await fetchViaServiceRole(userId);
  } catch (err) {
    console.error('public profile service role:', err);
    throw err;
  }
}
