import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/config/supabaseClient';
import { readStudyTimeRemoteMeta } from '@/services/studyTime/studyTimeService';
import { buildPublicLeagueSnapshot, type PublicProfileLeaguePayload } from './publicProfileLeague';

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
    shopInventory?: string[];
    league?: PublicProfileLeaguePayload;
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
    .select('xp, achievements, equipped_logo_id, shop_inventory, league_rank, weekly_xp, league_group_id')
    .eq('user_id', userId)
    .maybeSingle();

  const shopInventory = Array.isArray(gamification?.shop_inventory)
    ? gamification.shop_inventory.filter((entry): entry is string => typeof entry === 'string')
    : [];

  const league = await buildPublicLeagueSnapshot(sb, userId, gamification);

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
      shopInventory,
      league,
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

    const overloadConflict = msg.includes('Could not choose the best candidate function');

    if (missingFunction || overloadConflict) {
      console.error(
        overloadConflict
          ? 'get_public_profile overload (uuid/text): ejecuta ' +
              'supabase/migrations/20260610160000_fix_get_public_profile_overload.sql'
          : 'public profile RPC missing: ejecuta supabase/migrations/20260609120000_public_profile_rpc.sql ' +
              'y NOTIFY pgrst'
      );
      return null;
    }

    throw new Error(msg);
  }

  if (data == null || typeof data !== 'object') return null;

  const payload = data as PublicProfilePayload;
  if (!payload.profile?.id) return null;

  const shopInventory = Array.isArray(payload.gamification?.shopInventory)
    ? payload.gamification.shopInventory.filter((entry): entry is string => typeof entry === 'string')
    : [];

  return {
    profile: payload.profile,
    gamification: {
      xp: payload.gamification?.xp ?? 0,
      achievements: (payload.gamification?.achievements as Record<string, unknown>) ?? {},
      studyTimeMinutes:
        payload.gamification?.studyTimeMinutes ??
        readStudyTimeRemoteMeta(payload.gamification?.achievements).totalMinutes,
      equippedLogoId: payload.gamification?.equippedLogoId ?? null,
      shopInventory,
      league: payload.gamification?.league,
    },
  };
}

async function enrichLeagueGamification(userId: string, payload: PublicProfilePayload): Promise<PublicProfilePayload> {
  if (payload.gamification.league) {
    return payload;
  }

  const sb = createServiceClient();
  if (!sb) return payload;

  const { data: gamification } = await sb
    .from('user_gamification')
    .select('league_rank, weekly_xp, league_group_id')
    .eq('user_id', userId)
    .maybeSingle();

  const league = await buildPublicLeagueSnapshot(sb, userId, gamification);
  const hasLeagueData = league.inGroup || league.weeklyXp > 0 || league.leagueRank !== 'novato';

  if (!hasLeagueData) {
    return payload;
  }

  return {
    ...payload,
    gamification: {
      ...payload.gamification,
      league,
    },
  };
}

async function enrichShopGamification(userId: string, payload: PublicProfilePayload): Promise<PublicProfilePayload> {
  if ((payload.gamification.shopInventory?.length ?? 0) > 0) {
    return payload;
  }

  const sb = createServiceClient();
  if (!sb) return payload;

  const { data: gamification } = await sb
    .from('user_gamification')
    .select('shop_inventory, equipped_logo_id')
    .eq('user_id', userId)
    .maybeSingle();

  const shopInventory = Array.isArray(gamification?.shop_inventory)
    ? gamification.shop_inventory.filter((entry): entry is string => typeof entry === 'string')
    : [];

  if (shopInventory.length === 0 && !gamification?.equipped_logo_id) {
    return payload;
  }

  return {
    ...payload,
    gamification: {
      ...payload.gamification,
      equippedLogoId: gamification?.equipped_logo_id ?? payload.gamification.equippedLogoId ?? null,
      shopInventory,
    },
  };
}

async function enrichPublicGamification(userId: string, payload: PublicProfilePayload): Promise<PublicProfilePayload> {
  const withLeague = await enrichLeagueGamification(userId, payload);
  return enrichShopGamification(userId, withLeague);
}

/** Consulta perfil público sin sesión del visitante (service role o RPC anónima). */
export async function fetchPublicProfile(userId: string): Promise<PublicProfilePayload | null> {
  // 1) Service role (local / server con SUPABASE_SERVICE_ROLE_KEY): datos completos
  try {
    const viaService = await fetchViaServiceRole(userId);
    if (viaService) return viaService;
  } catch (err) {
    console.error('public profile service role:', err);
  }

  // 2) RPC anónima (producción); enriquecer shop/liga si la RPC aún no los incluye
  try {
    const viaRpc = await fetchViaPublicRpc(userId);
    if (viaRpc) {
      return enrichPublicGamification(userId, viaRpc);
    }
  } catch (err) {
    console.error('public profile RPC failed:', err);
    throw err;
  }

  return null;
}
