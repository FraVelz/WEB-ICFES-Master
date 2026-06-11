/**
 * Migra progreso del modo demo al usuario autenticado (localStorage + Supabase).
 * Idempotente: tras la primera migración se limpian las claves demo.
 */
import { reconcileAchievementsWithoutRewards } from '@/services/achievements/achievementProgressService';
import { migrateLocalAttemptsToSupabase } from '@/services/demo/migrateLocalAttemptsToSupabase';
import { mergeDemoStreakIntoUser } from '@/services/streak';
import { mergeLecturaReadDemoIntoUser } from '@/features/lectura/services/lecturaReadPersistence';
import { mergeDemoStudyTimeIntoUser } from '@/services/studyTime';
import { clearDemoLocalStorageAfterMigration, hasDemoDataToMigrate } from './mergeDemoDetection';
import { migrateAggregatedProgress, migrateGamificationBalances, migrateSkillLevel } from './mergeDemoMigrationSteps';

export { clearDemoLocalStorageAfterMigration, hasDemoDataToMigrate } from './mergeDemoDetection';

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
