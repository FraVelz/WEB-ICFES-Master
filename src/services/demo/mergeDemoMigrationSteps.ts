import type { LevelAssessmentResult } from '@/features/auth/types/skillLevel';
import {
  getStoredSkillLevel,
  isLevelAssessmentDone,
  markLevelAssessmentDone,
} from '@/features/auth/utils/skillLevelStorage';
import { computeDemoMigrationBalances } from '@/services/demo/computeDemoMigrationBalances';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { migrateDemoGamificationViaApi } from '@/services/gamification/gamificationRewardClient';
import { STARTING_COINS_BALANCE } from '@/shared/constants/gamification';
import { COINS_CHANGE_EVENT } from '@/services/persistence/coinsPersistence';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { getProgress } from '@/storage/progressStorage';
import { DEMO_COINS_KEY, DEMO_GAMIFICATION_KEY } from './mergeDemoDetection';

function readDemoAssessmentResult(): LevelAssessmentResult | null {
  if (!isLevelAssessmentDone('demo')) return null;

  const level = getStoredSkillLevel('demo');
  if (!level) return null;

  const metaRaw = localStorage.getItem('icfes_level_assessment_meta_demo');
  if (metaRaw) {
    try {
      const parsed = JSON.parse(metaRaw) as LevelAssessmentResult;
      return {
        level: parsed.level ?? level,
        completedAt: parsed.completedAt ?? new Date().toISOString(),
      };
    } catch {
      /* usar fallback */
    }
  }

  return { level, completedAt: new Date().toISOString() };
}

export async function migrateSkillLevel(userId: string): Promise<void> {
  const result = readDemoAssessmentResult();
  if (!result) return;

  markLevelAssessmentDone(userId, result);

  if (isSupabaseConfigured()) {
    try {
      await UserSupabaseService.updateSkillLevel(userId, result.level);
    } catch (err) {
      console.warn('No se pudo migrar skill_level del demo:', err);
    }
  }
}

export async function migrateGamificationBalances(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const coinsRaw = localStorage.getItem(DEMO_COINS_KEY);
  const demoCoins = coinsRaw != null ? Math.max(0, Number.parseInt(coinsRaw, 10) || 0) : null;
  const hasDemoGamification = localStorage.getItem(DEMO_GAMIFICATION_KEY) != null;
  const { xp, coins: extraCoins } = computeDemoMigrationBalances({
    demoCoins,
    hasDemoGamification,
    demoTotalXp: hasDemoGamification ? getDemoTotalXP() : 0,
  });

  if (extraCoins <= 0 && xp <= 0) return;

  try {
    await migrateDemoGamificationViaApi(xp, extraCoins);
    if (extraCoins > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(COINS_CHANGE_EVENT, {
          detail: { balance: STARTING_COINS_BALANCE + extraCoins },
        })
      );
    }
  } catch (err) {
    console.warn('No se pudo migrar gamificación del demo:', err);
  }
}

export async function migrateAggregatedProgress(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const local = getProgress();
  if (local.totalAttempts <= 0) return;

  try {
    const remote = await ProgressSupabaseService.getByUserId(userId);
    const remoteAttempts = remote?.totalAttempts ?? 0;

    if (local.totalAttempts > remoteAttempts) {
      await ProgressSupabaseService.upsert(userId, {
        totalAttempts: local.totalAttempts,
        totalCorrect: local.totalCorrect,
        percentage: local.percentage,
        lastActivityDate: local.lastAttemptDate,
        areaStats: local.areaStats,
      });
    }
  } catch (err) {
    console.warn('No se pudo migrar progreso agregado del demo:', err);
  }
}
