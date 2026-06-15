/**
 * Persistencia del nivel autodeclarado: localStorage (demo) o Supabase users (cuenta).
 */
import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import { buildLevelAssessmentUrl, getPathForSkillLevel } from '@/features/auth/constants/skillLevelRoutes';
import type { LevelAssessmentContext, LevelAssessmentResult, SkillLevel } from '@/features/auth/types/skillLevel';
import {
  getStoredSkillLevel,
  isLevelAssessmentDone,
  markLevelAssessmentDone,
  resolveAssessmentScope,
} from '@/features/auth/utils/skillLevelStorage';
import { isLevelAssessmentSnoozed, clearLevelAssessmentSnooze } from '@/features/auth/utils/levelAssessmentSnooze';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { isSupabaseConfigured } from './supabaseConfigured';

export type LevelAssessmentScopeOptions = {
  demoMode: boolean;
  userId?: string | null;
};

export function getAssessmentScope(options: LevelAssessmentScopeOptions): string {
  return resolveAssessmentScope(options);
}

/** Scope options from assessment URL context (demo vs account). */
export function getAssessmentOptionsFromContext(
  context: LevelAssessmentContext,
  demoMode: boolean,
  userId?: string | null
): LevelAssessmentScopeOptions {
  const isDemo = context === 'demo' || (demoMode && !userId);
  return { demoMode: isDemo, userId };
}

/** Misma resolución de scope que login y /evaluacion-nivel (cuenta si hay sesión). */
export function getAssessmentScopeForSession(demoMode: boolean, userId?: string | null): LevelAssessmentScopeOptions {
  const context: LevelAssessmentContext = demoMode && !userId ? 'demo' : 'account';
  return getAssessmentOptionsFromContext(context, demoMode, userId);
}

/** Destino tras login/demo si la evaluación está hecha, aplazada o pendiente. */
export async function resolvePostAuthEntryPath(
  options: LevelAssessmentScopeOptions,
  userId?: string | null
): Promise<string> {
  const scope = getAssessmentScope(options);
  const done = await hasCompletedLevelAssessment(scope, userId);
  if (done) {
    const level = await loadPersistedSkillLevel(scope, userId);
    return level ? getPathForSkillLevel(level) : AUTH_DEFAULT_REDIRECT;
  }

  if (isLevelAssessmentSnoozed(scope)) {
    return AUTH_DEFAULT_REDIRECT;
  }

  const context: LevelAssessmentContext = options.demoMode && !userId ? 'demo' : 'account';
  return buildLevelAssessmentUrl(context);
}

/** Redirect target when assessment is already done; null if the user still needs it. */
export async function resolveLevelAssessmentRedirect(
  options: LevelAssessmentScopeOptions,
  userId?: string | null
): Promise<string | null> {
  const scope = getAssessmentScope(options);
  const done = await hasCompletedLevelAssessment(scope, userId);
  if (!done) return null;

  const level = await loadPersistedSkillLevel(scope, userId);
  return level ? getPathForSkillLevel(level) : AUTH_DEFAULT_REDIRECT;
}

export function isDemoScope(scope: string): boolean {
  return scope === 'demo';
}

/** Guarda el nivel elegido: demo → solo local; cuenta → Supabase + caché local. */
export async function persistLevelAssessment(
  scope: string,
  result: LevelAssessmentResult,
  userId?: string | null
): Promise<void> {
  markLevelAssessmentDone(scope, result);
  clearLevelAssessmentSnooze(scope);

  if (isDemoScope(scope) || !userId || !isSupabaseConfigured()) return;

  await UserSupabaseService.updateSkillLevel(userId, result.level);
}

/** ¿Completó la evaluación? Demo: local. Cuenta: local o columna en users. */
export async function hasCompletedLevelAssessment(scope: string, userId?: string | null): Promise<boolean> {
  if (isLevelAssessmentDone(scope)) return true;

  if (isDemoScope(scope) || !userId || !isSupabaseConfigured()) return false;

  try {
    const profile = await UserSupabaseService.getByUserId(userId);
    if (!profile?.skillLevel) return false;

    markLevelAssessmentDone(scope, {
      level: profile.skillLevel,
      completedAt: profile.levelAssessmentCompletedAt ?? new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('No se pudo leer skill_level desde Supabase:', err);
    return false;
  }
}

/** Nivel guardado: local primero; cuenta en Supabase si hace falta. */
export async function loadPersistedSkillLevel(scope: string, userId?: string | null): Promise<SkillLevel | null> {
  const local = getStoredSkillLevel(scope);
  if (local) return local;

  if (isDemoScope(scope) || !userId || !isSupabaseConfigured()) return null;

  try {
    const profile = await UserSupabaseService.getByUserId(userId);
    const level = profile?.skillLevel ?? null;
    if (level) {
      markLevelAssessmentDone(scope, {
        level,
        completedAt: profile?.levelAssessmentCompletedAt ?? new Date().toISOString(),
      });
    }
    return level;
  } catch (err) {
    console.warn('No se pudo cargar skill_level desde Supabase:', err);
    return null;
  }
}
