import type { PersonalLogo } from '@/features/user/types/personalLogo.types';

export interface GamificationProfile {
  userId: string;
  xp: number;
  totalCoins: number;
  spentCoins: number;
  achievements: unknown[];
  xpHistory: unknown[];
  coinsHistory: unknown[];
  streakDates: string[];
  longestStreak: number;
  shopInventory: string[];
  equippedLogoId: string | null;
  doubleXpExpiresAt: string | null;
  personalLogos: PersonalLogo[];
  streakShieldCount: number;
  leagueRank: string;
  leagueGroupId: string | null;
  weeklyXp: number;
  weeklyXpWeek: string | null;
  referralQualifiedCount: number;
  supportApprovedCount: number;
  profileReportApprovedCount: number;
  updatedAt: unknown;
}

export interface ShopInventoryState {
  inventory: string[];
  equippedLogoId: string | null;
}
