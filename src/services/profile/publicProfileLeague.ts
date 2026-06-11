import type { SupabaseClient } from '@supabase/supabase-js';
import { LEAGUE_GROUP_SIZE } from '@/shared/constants/gamification';
import type { ProfileLeagueDisplay } from '@/features/user/components/profile/profileLeagueTypes';
import { EMPTY_PROFILE_LEAGUE } from '@/features/user/components/profile/profileLeagueTypes';

export type PublicProfileLeaguePayload = ProfileLeagueDisplay;

type GamificationLeagueRow = {
  league_rank?: string | null;
  weekly_xp?: number | null;
  league_group_id?: string | null;
};

type LeagueGroupRow = {
  group_number?: number | null;
  member_count?: number | null;
};

export async function buildPublicLeagueSnapshot(
  sb: SupabaseClient,
  userId: string,
  gamification: GamificationLeagueRow | null | undefined
): Promise<PublicProfileLeaguePayload> {
  const leagueRank = typeof gamification?.league_rank === 'string' ? gamification.league_rank : 'novato';
  const weeklyXp = Number(gamification?.weekly_xp ?? 0);
  const groupId = typeof gamification?.league_group_id === 'string' ? gamification.league_group_id : null;

  if (!groupId) {
    return {
      ...EMPTY_PROFILE_LEAGUE,
      leagueRank,
      weeklyXp,
    };
  }

  const { data: group, error: groupError } = await sb
    .from('league_groups')
    .select('group_number, member_count')
    .eq('id', groupId)
    .maybeSingle();

  if (groupError) {
    console.error('public profile league group:', groupError.message);
  }

  const groupRow = (group ?? null) as LeagueGroupRow | null;
  const memberCount = Number(groupRow?.member_count ?? 0);

  let myPosition: number | null = null;
  if (weeklyXp > 0) {
    const { count, error: positionError } = await sb
      .from('user_gamification')
      .select('user_id', { count: 'exact', head: true })
      .eq('league_group_id', groupId)
      .gt('weekly_xp', weeklyXp);

    if (positionError) {
      console.error('public profile league position:', positionError.message);
    } else {
      myPosition = (count ?? 0) + 1;
    }
  }

  return {
    leagueRank,
    weeklyXp,
    groupNumber: Number(groupRow?.group_number ?? 1),
    memberCount,
    groupSize: LEAGUE_GROUP_SIZE,
    myPosition,
    inGroup: true,
  };
}

export function leagueFromPayload(league: PublicProfileLeaguePayload | undefined): ProfileLeagueDisplay {
  if (!league) return EMPTY_PROFILE_LEAGUE;
  return league;
}
