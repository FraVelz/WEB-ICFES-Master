import type { LevelAssessmentResult } from '@/features/auth/types/skillLevel';
import {
  getStoredSkillLevel,
  isLevelAssessmentDone,
  markLevelAssessmentDone,
} from '@/features/auth/utils/skillLevelStorage';
import { DEMO_COINS_MIN } from '@/services/demo/demoCoins';
import { DEMO_MIGRATION_MAX_EXTRA_COINS, DEMO_MIGRATION_MAX_XP } from '@/shared/constants/demoMigrationLimits';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { STARTING_COINS_BALANCE } from '@/shared/constants/gamification';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
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
  if (coinsRaw != null) {
    const demoCoins = Math.max(0, Number.parseInt(coinsRaw, 10) || 0);
    const extraCoins = Math.min(DEMO_MIGRATION_MAX_EXTRA_COINS, Math.max(0, demoCoins - DEMO_COINS_MIN));
    if (extraCoins > 0) {
      try {
        await gamificationPersistence.addCoins(userId, extraCoins, 'demo_migration');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent(COINS_CHANGE_EVENT, {
              detail: { balance: STARTING_COINS_BALANCE + extraCoins },
            })
          );
        }
      } catch (err) {
        console.warn('No se pudieron migrar monedas del demo:', err);
      }
    }
  }

  if (localStorage.getItem(DEMO_GAMIFICATION_KEY) != null) {
    const xp = Math.min(DEMO_MIGRATION_MAX_XP, getDemoTotalXP());
    if (xp > 0) {
      try {
        await gamificationPersistence.addXP(userId, xp, 'demo_migration');
      } catch (err) {
        console.warn('No se pudo migrar XP del demo:', err);
      }
    }
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
