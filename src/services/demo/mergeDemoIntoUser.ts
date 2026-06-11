/**
 * Migra progreso del modo demo al usuario autenticado (localStorage + Supabase).
 * Idempotente: tras la primera migración se limpian las claves demo.
 */
import type { LevelAssessmentResult } from '@/features/auth/types/skillLevel';
import {
  getStoredSkillLevel,
  isLevelAssessmentDone,
  markLevelAssessmentDone,
} from '@/features/auth/utils/skillLevelStorage';
import { reconcileAchievementsWithoutRewards } from '@/services/achievements/achievementProgressService';
import { DEMO_COINS_MIN } from '@/services/demo/demoCoins';
import {
  DEMO_MIGRATION_MAX_EXTRA_COINS,
  DEMO_MIGRATION_MAX_XP,
} from '@/shared/constants/demoMigrationLimits';
import { getDemoTotalXP } from '@/services/demo/demoGamification';
import { STARTING_COINS_BALANCE } from '@/shared/constants/gamification';
import { gamificationPersistence } from '@/services/persistence/gamificationPersistence';
import { COINS_CHANGE_EVENT } from '@/services/persistence/coinsPersistence';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import ProgressSupabaseService from '@/services/supabase/ProgressSupabaseService';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { migrateLocalAttemptsToSupabase } from '@/services/demo/migrateLocalAttemptsToSupabase';
import { mergeDemoStreakIntoUser } from '@/services/streak';
import { mergeLecturaReadDemoIntoUser } from '@/features/lectura/services/lecturaReadPersistence';
import { mergeDemoStudyTimeIntoUser } from '@/services/studyTime';
import { getProgress, getStoredExams, getStoredPractices } from '@/storage/progressStorage';

const DEMO_COINS_KEY = 'icfes_demo_coins';
const DEMO_GAMIFICATION_KEY = 'icfes_demo_gamification';

export function hasDemoDataToMigrate(): boolean {
  if (typeof window === 'undefined') return false;

  if (localStorage.getItem('demoMode') === 'true') return true;
  if (localStorage.getItem(DEMO_COINS_KEY) != null) return true;
  if (localStorage.getItem(DEMO_GAMIFICATION_KEY) != null) return true;
  if (localStorage.getItem('icfes_achievement_progress_demo') != null) return true;
  if (localStorage.getItem('icfes_lectura_read_demo') != null) return true;
  if (localStorage.getItem('icfes_streak_dates') != null) return true;
  if (localStorage.getItem('icfes_level_assessment_done_demo') === 'true') return true;
  if (getStoredExams().length > 0 || getStoredPractices().length > 0) {
    return localStorage.getItem('demoMode') === 'true';
  }

  return false;
}

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

async function migrateSkillLevel(userId: string): Promise<void> {
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

async function migrateGamificationBalances(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const coinsRaw = localStorage.getItem(DEMO_COINS_KEY);
  if (coinsRaw != null) {
    const demoCoins = Math.max(0, Number.parseInt(coinsRaw, 10) || 0);
    // Solo migrar monedas ganadas por encima del saldo inicial (la cuenta ya arranca con STARTING_COINS_BALANCE).
    const extraCoins = Math.min(
      DEMO_MIGRATION_MAX_EXTRA_COINS,
      Math.max(0, demoCoins - DEMO_COINS_MIN)
    );
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

async function migrateAggregatedProgress(userId: string): Promise<void> {
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

export function clearDemoLocalStorageAfterMigration(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(DEMO_COINS_KEY);
  localStorage.removeItem(DEMO_GAMIFICATION_KEY);
  localStorage.removeItem('icfes_achievement_progress_demo');
  localStorage.removeItem('icfes_lectura_read_demo');
  localStorage.removeItem('icfes_skill_level_demo');
  localStorage.removeItem('icfes_level_assessment_done_demo');
  localStorage.removeItem('icfes_level_assessment_meta_demo');
  localStorage.removeItem('icfes_study_time_demo');
}

/** Fusiona todo el progreso demo en el usuario autenticado. */
export async function mergeDemoIntoUser(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!hasDemoDataToMigrate()) return;

  try {
    await mergeDemoStreakIntoUser(userId);
  } catch (err) {
    console.warn('No se pudo migrar la racha del demo:', err);
  }

  try {
    mergeLecturaReadDemoIntoUser(userId);
  } catch (err) {
    console.warn('No se pudo migrar lectura del demo:', err);
  }

  try {
    await mergeDemoStudyTimeIntoUser(userId);
  } catch (err) {
    console.warn('No se pudo migrar tiempo de estudio del demo:', err);
  }

  await Promise.all([
    migrateSkillLevel(userId),
    migrateGamificationBalances(userId),
    migrateAggregatedProgress(userId),
  ]);

  try {
    await migrateLocalAttemptsToSupabase(userId);
  } catch (err) {
    console.warn('No se pudo migrar historial de intentos del demo:', err);
  }

  try {
    await reconcileAchievementsWithoutRewards(userId);
  } catch (err) {
    console.warn('No se pudieron migrar logros del demo:', err);
  }

  clearDemoLocalStorageAfterMigration();
}
