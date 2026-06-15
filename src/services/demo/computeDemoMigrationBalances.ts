import { DEMO_COINS_MIN } from '@/services/demo/demoCoins';
import { DEMO_MIGRATION_MAX_EXTRA_COINS, DEMO_MIGRATION_MAX_XP } from '@/shared/constants/demoMigrationLimits';

export type DemoMigrationBalancesInput = {
  demoCoins: number | null;
  hasDemoGamification: boolean;
  demoTotalXp: number;
};

/** Pure caps applied when migrating demo localStorage balances to a real account. */
export function computeDemoMigrationBalances(input: DemoMigrationBalancesInput): { xp: number; coins: number } {
  let coins = 0;
  if (input.demoCoins != null) {
    const normalized = Math.max(0, Math.floor(input.demoCoins));
    coins = Math.min(DEMO_MIGRATION_MAX_EXTRA_COINS, Math.max(0, normalized - DEMO_COINS_MIN));
  }

  let xp = 0;
  if (input.hasDemoGamification) {
    xp = Math.min(DEMO_MIGRATION_MAX_XP, Math.max(0, Math.floor(input.demoTotalXp)));
  }

  return { xp, coins };
}

export type DemoMigrationPayload = { xp: number; coins: number };

export function parseDemoMigrationPayload(raw: unknown): DemoMigrationPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const body = raw as Record<string, unknown>;
  const { xp, coins } = body;

  if (typeof xp !== 'number' || typeof coins !== 'number') return null;
  if (!Number.isFinite(xp) || !Number.isFinite(coins)) return null;
  if (xp < 0 || coins < 0) return null;
  if (!Number.isInteger(xp) || !Number.isInteger(coins)) return null;
  if (xp > DEMO_MIGRATION_MAX_XP || coins > DEMO_MIGRATION_MAX_EXTRA_COINS) return null;

  if (xp === 0 && coins === 0) return null;
  return { xp, coins };
}
