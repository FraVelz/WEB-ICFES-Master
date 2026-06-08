import type { LevelAssessmentResult, SkillLevel } from '@/features/auth/types/skillLevel';

const DEMO_SCOPE = 'demo';

function scopeKey(scope: string, suffix: string): string {
  return scope === DEMO_SCOPE ? `icfes_${suffix}_demo` : `icfes_${suffix}_${scope}`;
}

export function resolveAssessmentScope(options: {
  demoMode: boolean;
  userId?: string | null;
}): string {
  if (options.demoMode) return DEMO_SCOPE;
  if (options.userId) return options.userId;
  return DEMO_SCOPE;
}

export function isLevelAssessmentDone(scope: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(scopeKey(scope, 'level_assessment_done')) === 'true';
}

export function markLevelAssessmentDone(scope: string, result: LevelAssessmentResult): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(scopeKey(scope, 'level_assessment_done'), 'true');
  localStorage.setItem(scopeKey(scope, 'skill_level'), result.level);
  localStorage.setItem(scopeKey(scope, 'level_assessment_meta'), JSON.stringify(result));
}

export function getStoredSkillLevel(scope: string): SkillLevel | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(scopeKey(scope, 'skill_level'));
  if (raw === 'basics' || raw === 'intermediate' || raw === 'advanced') return raw;
  return null;
}
