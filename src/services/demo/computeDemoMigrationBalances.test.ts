import { describe, expect, it } from 'vitest';
import { computeDemoMigrationBalances, parseDemoMigrationPayload } from './computeDemoMigrationBalances';
import { DEMO_MIGRATION_MAX_EXTRA_COINS, DEMO_MIGRATION_MAX_XP } from '@/shared/constants/demoMigrationLimits';

describe('computeDemoMigrationBalances', () => {
  it('caps extra coins above demo minimum', () => {
    expect(computeDemoMigrationBalances({ demoCoins: 10_000, hasDemoGamification: false, demoTotalXp: 0 })).toEqual({
      xp: 0,
      coins: DEMO_MIGRATION_MAX_EXTRA_COINS,
    });
  });

  it('caps xp from demo gamification', () => {
    expect(computeDemoMigrationBalances({ demoCoins: null, hasDemoGamification: true, demoTotalXp: 99_999 })).toEqual({
      xp: DEMO_MIGRATION_MAX_XP,
      coins: 0,
    });
  });
});

describe('parseDemoMigrationPayload', () => {
  it('rejects payloads above server caps', () => {
    expect(parseDemoMigrationPayload({ xp: DEMO_MIGRATION_MAX_XP + 1, coins: 0 })).toBeNull();
    expect(parseDemoMigrationPayload({ xp: 0, coins: DEMO_MIGRATION_MAX_EXTRA_COINS + 1 })).toBeNull();
  });

  it('accepts valid capped payload', () => {
    expect(parseDemoMigrationPayload({ xp: 100, coins: 50 })).toEqual({ xp: 100, coins: 50 });
  });

  it('rejects non-integer amounts', () => {
    expect(parseDemoMigrationPayload({ xp: 1.5, coins: 0 })).toBeNull();
  });
});
