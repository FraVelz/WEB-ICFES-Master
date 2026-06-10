import { supabase } from '@/config/supabase';
import { hasVipBadge } from '@/features/store/constants/vipBadge';
import type { LeaderboardPlayer } from '@/hooks/gamification/useLeaderboard';

export interface MyLeagueState {
  leagueRank: string;
  leagueGroupId: string | null;
  groupNumber: number;
  memberCount: number;
  groupSize: number;
  weeklyXp: number;
  weeklyXpWeek: string | null;
  myPosition: number;
}

type LeaderboardRow = {
  userId: string;
  weeklyXp: number;
  displayName: string | null;
  username: string | null;
  profileImage: string | null;
  shopInventory: string[];
};

function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}

function mapLeaderboardRow(row: LeaderboardRow): LeaderboardPlayer {
  const inventory = Array.isArray(row.shopInventory) ? row.shopInventory : [];
  return {
    id: row.userId,
    name: row.displayName ?? undefined,
    username: row.username ?? undefined,
    profileImage: row.profileImage ?? undefined,
    weeklyXP: row.weeklyXp ?? 0,
    hasVipBadge: hasVipBadge(inventory),
  };
}

const LeagueSupabaseService = {
  async assignLeagueGroup(userId: string, leagueRank = 'novato'): Promise<string | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb.rpc('assign_league_group', {
      p_user_id: userId,
      p_league_rank: leagueRank,
    });
    if (error) throw new Error(`Error asignando grupo de liga: ${error.message}`);
    return typeof data === 'string' ? data : null;
  },

  async addWeeklyXp(userId: string, points: number): Promise<void> {
    if (points <= 0) return;
    const sb = ensureSupabase();
    const { error } = await sb.rpc('add_weekly_xp', {
      p_user_id: userId,
      p_points: points,
    });
    if (error) throw new Error(`Error sumando XP semanal: ${error.message}`);
  },

  async getMyLeagueState(): Promise<MyLeagueState | null> {
    const sb = ensureSupabase();
    const { data, error } = await sb.rpc('get_my_league_state');
    if (error) throw new Error(`Error leyendo estado de liga: ${error.message}`);
    if (!data || typeof data !== 'object') return null;

    const row = data as Record<string, unknown>;
    return {
      leagueRank: String(row.leagueRank ?? 'novato'),
      leagueGroupId: typeof row.leagueGroupId === 'string' ? row.leagueGroupId : null,
      groupNumber: Number(row.groupNumber ?? 1),
      memberCount: Number(row.memberCount ?? 0),
      groupSize: Number(row.groupSize ?? 30),
      weeklyXp: Number(row.weeklyXp ?? 0),
      weeklyXpWeek: typeof row.weeklyXpWeek === 'string' ? row.weeklyXpWeek : null,
      myPosition: Number(row.myPosition ?? 1),
    };
  },

  async getMyLeaderboard(): Promise<LeaderboardPlayer[]> {
    const sb = ensureSupabase();
    const { data, error } = await sb.rpc('get_my_leaderboard');
    if (error) throw new Error(`Error cargando clasificación: ${error.message}`);
    if (!Array.isArray(data)) return [];

    return (data as LeaderboardRow[]).map(mapLeaderboardRow);
  },

  async ensureLeagueMembership(userId: string): Promise<void> {
    const state = await this.getMyLeagueState();
    if (!state?.leagueGroupId) {
      await this.assignLeagueGroup(userId, 'novato');
    }
  },
};

export default LeagueSupabaseService;
