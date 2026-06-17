import { supabase } from '@/config/supabase';
import { MAX_STREAK_SHIELDS } from '@/features/store/constants/streakShield';
import { MAX_PERSONAL_LOGOS, type PersonalLogo } from '@/features/user/types/personalLogo.types';
import type { GamificationProfile } from './gamificationTypes';

export const GAMIFICATION_TABLE = 'user_gamification';

export function parseShopInventory(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
}

export function parsePersonalLogos(value: unknown): PersonalLogo[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is PersonalLogo => {
      if (!entry || typeof entry !== 'object') return false;
      const row = entry as Record<string, unknown>;
      return (
        typeof row.id === 'string' &&
        row.id.length > 0 &&
        typeof row.image === 'string' &&
        row.image.length > 0 &&
        typeof row.label === 'string' &&
        typeof row.createdAt === 'string'
      );
    })
    .slice(0, MAX_PERSONAL_LOGOS);
}

export function mapFromDb(row: Record<string, unknown> | null): GamificationProfile | null {
  if (!row || typeof row !== 'object') return null;
  const equippedLogoId = typeof row.equipped_logo_id === 'string' ? row.equipped_logo_id : null;
  const doubleXpExpiresAt = typeof row.double_xp_expires_at === 'string' ? row.double_xp_expires_at : null;
  const leagueRank = typeof row.league_rank === 'string' ? row.league_rank : 'novato';
  const leagueGroupId = typeof row.league_group_id === 'string' ? row.league_group_id : null;
  const weeklyXpWeek = typeof row.weekly_xp_week === 'string' ? row.weekly_xp_week : null;
  const shieldRaw = Math.min(MAX_STREAK_SHIELDS, Math.max(0, Number(row.streak_shield_count ?? 0)));

  return {
    userId: String(row.user_id ?? ''),
    xp: Number(row.xp ?? 0),
    totalCoins: Number(row.total_coins ?? 0),
    spentCoins: Number(row.spent_coins ?? 0),
    achievements: (row.achievements as unknown[]) || [],
    xpHistory: (row.xp_history as unknown[]) || [],
    coinsHistory: (row.coins_history as unknown[]) || [],
    streakDates: Array.isArray(row.streak_dates) ? (row.streak_dates as string[]) : [],
    longestStreak: Number(row.longest_streak ?? 0),
    shopInventory: parseShopInventory(row.shop_inventory),
    equippedLogoId,
    doubleXpExpiresAt,
    personalLogos: parsePersonalLogos(row.personal_logos),
    streakShieldCount: shieldRaw,
    leagueRank,
    leagueGroupId,
    weeklyXp: Number(row.weekly_xp ?? 0),
    weeklyXpWeek,
    referralQualifiedCount: Number(row.referral_qualified_count ?? 0),
    supportApprovedCount: Number(row.support_approved_count ?? 0),
    profileReportApprovedCount: Number(row.profile_report_approved_count ?? 0),
    updatedAt: row.updated_at,
  };
}

export function ensureSupabase() {
  if (!supabase) throw new Error('Supabase no configurado');
  return supabase;
}
